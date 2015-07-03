__author__ = 'frank'

from flask import Flask
from flask import request
from flask import render_template
import argparse
import utils
import simplejson
import threading
from api_messages import api_names
import signal
import sys
import os
import logging
import kombu

template_dir = os.path.join(os.path.dirname(__file__), 'static/templates')
app = Flask(__name__, template_folder=template_dir)

utils.configure_log("/var/log/zstack/zstack-ui.log")
log = utils.get_logger(__name__)

class CloudBusError(Exception):
    pass


import code, traceback, signal

def debug(sig, frame):
    """Interrupt running process, and provide a python prompt for
    interactive debugging."""
    d={'_frame':frame}         # Allow access to frame object.
    d.update(frame.f_globals)  # Unless shadowed by global
    d.update(frame.f_locals)

    i = code.InteractiveConsole(d)
    message  = "Signal recieved : entering python shell.\nTraceback:\n"
    message += ''.join(traceback.format_stack(frame))
    i.interact(message)

def listen():
    signal.signal(signal.SIGILL, debug)  # Register handler

listen()


class CloudBus(object):
    P2P_EXCHANGE = "P2P"
    BROADCAST_EXCHANGE = "BROADCAST"
    QUEUE_PREFIX = "zstack.ui.message.%s"
    API_EVENT_QUEUE_PREFIX = "zstck.ui.api.event.%s"
    API_EVENT_QUEUE_BINDING_KEY = "key.event.API.API_EVENT"
    CANONICAL_EVENT_QUEUE_PREFIX = "zstck.ui.canonical.event.%s"
    CANONICAL_EVENT_BINDING_KEY = "key.event.LOCAL.canonicalEvent"
    API_SERVICE_ID = "zstack.message.api.portal"

    CORRELATION_ID = "correlationId"
    REPLY_TO = "replyTo"
    IS_MESSAGE_REPLY = "isReply"
    NO_NEED_REPLY_MSG = 'noReply'

    class Request(object):
        def __init__(self):
            self.request = None
            self.callback = None

    def _message_handler(self, body, message):
        try:
            msg = simplejson.loads(body)
            log.debug('received reply: %s' % body)
            if len(msg.keys()) != 1:
                raise CloudBusError('message must be dictionary which has single entry where key is message name, invalid message:%s' % body)

            msg_body = msg.values()[0]
            headers = msg_body.get("headers")
            if not headers:
                raise CloudBusError('cannot find headers, invalid message: %s' % body)

            if not headers.has_key(self.IS_MESSAGE_REPLY):
                raise CloudBusError('received none message reply: %s' % body)

            correlation_id = headers.get(self.CORRELATION_ID)
            if not correlation_id:
                raise CloudBusError('cannot find correlationId in headers, invalid reply: %s' % body)

            req = self.requests.get(correlation_id)
            if not req:
                raise CloudBusError('cannot find request[id:%s], drop reply: %s' % (correlation_id, req))

            req.callback(msg)
            del self.requests[correlation_id]
        except:
            log.debug(utils.get_exception_stacktrace())
        finally:
            message.ack()

    def _api_event_handler(self, body, message):
        try:
            evt = simplejson.loads(body)
            log.debug('received event: %s' % body)
            if len(evt.keys()) != 1:
                raise CloudBusError('api event must be dictionary which has single entry where key is event name. invalid event:%s' % body)

            evt_body = evt.values()[0]
            api_id = evt_body.get('apiId')
            if not api_id:
                raise CloudBusError('cannot find apiId, invalid event:%s' % body)

            req = self.requests.get(api_id)
            if not req:
                log.debug('drop event[apiId:%s], its not mine. %s' % (api_id, body))
                return

            req.callback(evt)
            del self.requests[api_id]
        except:
            log.debug(utils.get_exception_stacktrace())
        finally:
            message.ack()

    def stop(self):
        self.should_stop = True
        log.debug('stopping CloudBus ...')
        if self.reply_consumer:
            self.reply_consumer.close()
        if self.reply_connection:
            self.reply_connection.release()
        if self.api_event_consumer:
            self.api_event_consumer.close()
        if self.api_event_connection:
            self.api_event_connection.release()
        if self.canonical_event_consumer:
            self.canonical_event_consumer.close()
        if self.canonical_event_connection:
            self.canonical_event_connection.release()

        self.reply_consumer_thread.join()
        self.api_event_consumer_thread.join()
        self.canonical_event_consumer_thread.join()
        self.producer_connection.close()

    def register_canonical_event_handler(self, path, handler):
        self.canonical_event_handlers[path] = handler

    def __init__(self, options):
        self.options = options
        self.uuid = utils.uuid4()

        self.canonical_event_handlers = {}

        rabbitmq_list = self.options.rabbitmq.split(',')
        rabbitmq_list = ["amqp://%s" % r for r in rabbitmq_list]
        self.amqp_url = ';'.join(rabbitmq_list)

        self.requests = {}
        self.p2p_exchange = kombu.Exchange(self.P2P_EXCHANGE, type='topic', passive=True)
        self.broadcast_exchange = kombu.Exchange(self.BROADCAST_EXCHANGE, type='topic', passive=True)

        self.reply_queue_name = self.QUEUE_PREFIX % self.uuid
        self.reply_queue = kombu.Queue(self.reply_queue_name, exchange=self.p2p_exchange, routing_key=self.reply_queue_name, auto_delete=True)

        self.api_event_queue_name = self.API_EVENT_QUEUE_PREFIX % self.uuid
        self.api_event_queue = kombu.Queue(self.api_event_queue_name, exchange=self.broadcast_exchange, routing_key=self.API_EVENT_QUEUE_BINDING_KEY, auto_delete=True)

        self.canonical_event_queue_name = self.CANONICAL_EVENT_QUEUE_PREFIX % self.uuid
        self.canonical_event_queue = kombu.Queue(self.canonical_event_queue_name, exchange=self.broadcast_exchange, routing_key=self.CANONICAL_EVENT_BINDING_KEY, auto_delete=True)

        self.should_stop = False
        self.reply_connection = None
        self.reply_consumer = None
        def start_reply_consuming():
            try:
                log.debug('reply consumer thread starts')
                with kombu.Connection(self.amqp_url) as conn:
                    self.reply_connection = conn
                    with conn.Consumer([self.reply_queue], callbacks=[self._message_handler]) as consumer:
                        self.reply_consumer = consumer
                        while not self.should_stop:
                            conn.drain_events()
            except Exception as ce:
                if 'exchange.declare' in str(ce):
                    log.info('cannot declare RabbitMQ exchange(P2P), you need to start ZStack management server before starting dashboard')
                    os._exit(1)
                else:
                    raise ce

        self.api_tasks = {}

        self.reply_consumer_thread = threading.Thread(target=start_reply_consuming)
        self.reply_consumer_thread.start()

        self.api_event_connection = None
        self.api_event_consumer = None
        def start_api_event_consuming():
            try:
                log.debug('api event consumer thread starts')
                with kombu.Connection(self.amqp_url) as conn:
                    self.api_event_connection = conn
                    with conn.Consumer([self.api_event_queue], callbacks=[self._api_event_handler]) as consumer:
                        self.api_event_consumer = consumer
                        while not self.should_stop:
                            conn.drain_events()
            except Exception as ce:
                if 'exchange.declare' in str(ce):
                    log.info('cannot declare RabbitMQ exchange(BROADCAST), you need to start ZStack management server before starting dashboard')
                    os._exit(1)
                else:
                    raise ce

        self.api_event_consumer_thread = threading.Thread(target=start_api_event_consuming)
        self.api_event_consumer_thread.start()

        self.canonical_event_connection = None
        self.canonical_event_consumer = None
        def start_canonical_event_consumer():
            try:
                log.debug('canonical event consumer thread starts')
                with kombu.Connection(self.amqp_url) as conn:
                    self.canonical_event_connection = conn
                    with conn.Consumer([self.canonical_event_queue], callbacks=[self._canonical_event_handler]) as consumer:
                        self.canonical_event_consumer = consumer
                        while not self.should_stop:
                            conn.drain_events()
            except Exception as ce:
                if 'exchange.declare' in str(ce):
                    log.info('cannot declare RabbitMQ exchange(BROADCAST), you need to start ZStack management server before starting dashboard')
                    os._exit(1)
                else:
                    raise ce

        self.canonical_event_consumer_thread = threading.Thread(target=start_canonical_event_consumer)
        self.canonical_event_consumer_thread.start()

        self.producer_connection = kombu.Connection(self.amqp_url)

    def _canonical_event_handler(self, body, message):
        try:
            evt = simplejson.loads(body)
            if len(evt.keys()) != 1:
                return

            evt_name = evt.keys()[0]
            if evt_name != "org.zstack.core.cloudbus.CanonicalEvent":
                return

            log.debug('received a canonical event: %s' % body)
            evt_body = evt.values()[0]

            path = evt_body.get('path')
            handler = self.canonical_event_handlers.get(path, None)
            if not handler:
                return

            handler(evt_body.get('content'))
        except:
            log.debug(utils.get_exception_stacktrace())
        finally:
            message.ack()

    def send(self, msg_str, callback):
        try:
            msg = simplejson.loads(msg_str)
            if len(msg.keys()) != 1:
                raise CloudBusError('message must be dictionary which has single entry where key is message name')

            msg_name = msg.keys()[0]
            if msg_name not in api_names:
                raise CloudBusError('unknown api message[%s]' % msg_name)

            msg_body = msg.values()[0]

            mid = msg_body['id'] = utils.uuid4()
            msg_body['serviceId'] = "api.portal"

            headers = {
                self.CORRELATION_ID: mid,
                self.REPLY_TO: self.reply_queue_name,
                self.NO_NEED_REPLY_MSG: 'false'
            }
            msg_body['headers'] = headers

            req = self.Request()
            req.callback = callback
            req.request = msg
            log.debug('add request[id:%s]' % mid)
            self.requests[mid] = req

            with kombu.producers[self.producer_connection].acquire(block=True) as producer:
                producer.publish(msg, exchange=self.P2P_EXCHANGE, routing_key=self.API_SERVICE_ID)

            log.debug('sent message: %s' % simplejson.dumps(msg))
        except simplejson.JSONDecodeError:
            raise CloudBusError("invalid JSON format: %s" % msg_str)

    def call(self, msg_str):
        cond = threading.Condition()

        ret = {
            'done' : False,
            'reply': None
        }

        def cb(reply):
            cond.acquire()
            try:
                ret['done'] = True
                ret['reply'] = reply
                cond.notifyAll()
            finally:
                cond.release()

        cond.acquire()
        try:
            self.send(msg_str, cb)
            while not ret['done']:
                cond.wait()
        finally:
            cond.release()

        return ret['reply']


class Server(object):

    VM_STATE_CHANGE_PATH = "/vmTracer/vmStateChanged"

    class Receipt(object):
        PROCESSING = 1
        DONE = 2

        def __init__(self):
            self.id = utils.uuid4()
            self.rsp = None
            self.status = self.PROCESSING

        def to_json(self):
            return simplejson.dumps(self.__dict__)

    def _handle_vm_state_event(self, evt):
        vm_uuid = evt.get('vmUuid')
        old_state = evt.get('from')
        new_state = evt.get('to')
        log.debug('VM[uuid: %s] changed from %s to %s' % (vm_uuid, old_state, new_state))

    def __init__(self):
        self.options = None
        self.parse_arguments()
        self.bus = CloudBus(self.options)
        self.api_tasks = {}

        self.bus.register_canonical_event_handler(self.VM_STATE_CHANGE_PATH, self._handle_vm_state_event)

        def exit(signal, frame):
            #self.stop()
            os._exit(0)

        signal.signal(signal.SIGINT, exit)

    def parse_arguments(self):
        parser = argparse.ArgumentParser()
        parser.add_argument("--config", help="configure file path")
        parser.add_argument("--rabbitmq", help="a list of RabbitMQ url. A single url is in format of "
                            "account:password@ip:port/virtual_host_name. Multiple urls are split by ','. [DEFAULT] localhost", default='localhost')
        self.options = parser.parse_args()

    def stop(self):
        self.bus.stop()

    def api_sync_call(self, msg_str):
        try:
            reply = self.bus.call(msg_str)
            return simplejson.dumps(reply)
        except Exception as e:
            log.debug(utils.get_exception_stacktrace())
            return str(e), 400

    def api_async_call(self, msg_str):
        receipt = self.Receipt()
        def cb(evt):
            receipt.status = receipt.DONE
            receipt.rsp = evt

        self.api_tasks[receipt.id] = receipt
        try:
            self.bus.send(msg_str, cb)
            return receipt.to_json()
        except Exception as e:
            del self.api_tasks[receipt.id]
            log.debug(utils.get_exception_stacktrace())
            return str(e), 400

    def api_query(self, task_id):
        task = self.api_tasks.get(task_id)
        if not task:
            return "unknown task[id:%s]" % task_id

        if task.status == self.Receipt.DONE:
            del self.api_tasks[task_id]

        return task.to_json()

server = Server()

@app.route("/api/sync", methods=['POST', 'GET'])
def api_sync_call():
    print request.data
    return server.api_sync_call(request.data)

@app.route("/api/async", methods=['POST', 'GET'])
def api_async_call():
    return server.api_async_call(request.data)

@app.route("/api/query", methods=['POST', 'GET'])
def api_query():
    return server.api_query(request.data)

@app.route("/")
def index():
    return render_template("index.html")

def main():
    logging.getLogger('pika').setLevel(logging.DEBUG)
    app.run(host="0.0.0.0", threaded=True)

if __name__ == "__main__":
    main()
