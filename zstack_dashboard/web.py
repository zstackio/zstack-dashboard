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
import traceback
import functools
import time

template_dir = os.path.join(os.getcwd(), os.path.join(os.path.dirname(__file__), 'static/templates'))
print template_dir
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

def exception_safe(func):
    @functools.wraps(func)
    def wrap(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:
            log.warn(traceback.format_exc())

    return wrap

class Connection(object):
    P2P_EXCHANGE = "P2P"
    API_SERVICE_ID = "zstack.message.api.portal"
    BROADCAST_EXCHANGE = "BROADCAST"
    QUEUE_PREFIX = "zstack.ui.message.%s"
    API_EVENT_QUEUE_PREFIX = "zstck.ui.api.event.%s"
    API_EVENT_QUEUE_BINDING_KEY = "key.event.API.API_EVENT"
    CANONICAL_EVENT_QUEUE_PREFIX = "zstck.ui.canonical.event.%s"
    CANONICAL_EVENT_BINDING_KEY = "key.event.LOCAL.canonicalEvent"

    STATUS_INIT = "init"
    STATUS_READY = "ready"

    def __init__(self):
        self.urls = None
        self.reply_callback = None
        self.api_event_callback = None
        self.canonical_event_callback = None
        self.should_stop = False
        self.reply_queue = None
        self.api_event_queue = None
        self.canonical_event_queue = None
        self.reply_queue_name = None
        self.api_event_queue_name = None
        self.canonical_event_queue_name = None
        self.conn = None

        self._current_url = None

        self._reply_consumer = None
        self._api_event_consumer = None
        self._canonical_event_consumer = None

        self._consumer_thread = None

        self._status = None

    def stop(self):
        if self._current_url:
            self._cleanup_current_connection()

    def start(self):
        self._initalize()

    def _cleanup_current_connection(self):
        _rt = self._consumer_thread
        @exception_safe
        def join_consumer_thread():
            if _rt:
                _rt.join()

        threading.Thread(target=join_consumer_thread).start()

        @exception_safe
        def release_connection(conn):
            if conn:
                conn.release()

        release_connection(self.conn)

        @exception_safe
        def close_consumer(c):
            if c:
                c.close()

        close_consumer(self._api_event_consumer)
        close_consumer(self._reply_consumer)
        close_consumer(self._canonical_event_consumer)

        self._current_url = None

    def _is_connection_error(self, ex):
        return ex.__class__.__name__ == 'ConnectionError'

    def _do_initalize_in_thread(self):
        threading.Thread(target=self._initalize).start()

    def _initalize(self):
        if self._status == self.STATUS_INIT:
            log.debug('connection is in initializing, ignore this call')
            return

        self._status = self.STATUS_INIT

        if self._current_url:
            self._cleanup_current_connection()

        def find_usable_url():
            while True:
                for url in self.urls:
                    conn = kombu.Connection(url)

                    try:
                        conn.connect()
                        log.debug("find a live connection[%s]" % url)
                        return url, conn
                    except Exception as e:
                        log.warn('cannot connect to %s, %s; try next one ...' % (url, str(e)))

                log.warn('failed to connect all urls, sleep 5s and re-try')
                time.sleep(5)

        self._current_url, self.conn = find_usable_url()
        self.should_stop = False

        self.uuid = utils.uuid4()
        self.p2p_exchange = kombu.Exchange(self.P2P_EXCHANGE, type='topic', passive=True)
        self.broadcast_exchange = kombu.Exchange(self.BROADCAST_EXCHANGE, type='topic', passive=True)
        
        self.reply_queue_name = self.QUEUE_PREFIX % self.uuid
        self.reply_queue = kombu.Queue(self.reply_queue_name, exchange=self.p2p_exchange, routing_key=self.reply_queue_name, auto_delete=True)
        
        self.api_event_queue_name = self.API_EVENT_QUEUE_PREFIX % self.uuid
        self.api_event_queue = kombu.Queue(self.api_event_queue_name, exchange=self.broadcast_exchange, routing_key=self.API_EVENT_QUEUE_BINDING_KEY, auto_delete=True)

        self.canonical_event_queue_name = self.CANONICAL_EVENT_QUEUE_PREFIX % self.uuid
        self.canonical_event_queue = kombu.Queue(self.canonical_event_queue_name, exchange=self.broadcast_exchange, routing_key=self.CANONICAL_EVENT_BINDING_KEY, auto_delete=True)

        def consumer_thread():
            try:
                log.debug('consumer thread starts')
                self._reply_consumer = self.conn.Consumer([self.reply_queue], callbacks=[self.reply_callback])
                self._api_event_consumer = self.conn.Consumer([self.api_event_queue], callbacks=[self.api_event_callback])
                self._canonical_event_consumer = self.conn.Consumer([self.canonical_event_queue], callbacks=[self.canonical_event_callback])
                with kombu.utils.nested(self._reply_consumer, self._api_event_consumer, self._canonical_event_consumer):
                    while not self.should_stop:
                        self.conn.drain_events()

            except Exception as ce:
                if 'exchange.declare' in str(ce):
                    log.info('cannot declare RabbitMQ exchange(P2P), you need to start ZStack management server before starting dashboard')
                    os._exit(1)
                else:
                    self.should_stop = True
                    if self._is_connection_error(ce):
                        log.warn('lost connection to %s, %s' % (self._current_url, str(ce)))
                        self._do_initalize_in_thread()
                        return

                    raise

        self._consumer_thread = threading.Thread(target=consumer_thread)
        self._consumer_thread.start()

        self._status = self.STATUS_READY
        log.debug("connection to %s is ready" % self._current_url)

    def send(self, msg):
        if self.STATUS_READY != self._status:
            raise Exception('the rabbitmq connection is not ready yet')

        try:
            with kombu.producers[self.conn].acquire(block=True) as producer:
                producer.publish(msg, exchange=self.P2P_EXCHANGE, routing_key=self.API_SERVICE_ID)
        except Exception as ce:
            if self._is_connection_error(ce):
                log.warn('lost connection to %s, %s' % (self._current_url, str(ce)))
                self._do_initalize_in_thread()
                raise

class CloudBus(object):
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
        log.debug('stopping CloudBus ...')
        self.conn.stop()

    def register_canonical_event_handler(self, path, handler):
        self.canonical_event_handlers[path] = handler

    def __init__(self, options):
        self.options = options

        rabbitmq_list = self.options.rabbitmq.split(',')
        rabbitmq_list = ["amqp://%s" % r for r in rabbitmq_list]

        conn = Connection()
        conn.urls = rabbitmq_list
        conn.reply_callback = self._message_handler
        conn.api_event_callback = self._api_event_handler
        conn.canonical_event_callback = self._canonical_event_handler
        self.conn = conn

        self.canonical_event_handlers = {}
        self.requests = {}
        self.api_tasks = {}
        self.conn.start()


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
                self.REPLY_TO: self.conn.reply_queue_name,
                self.NO_NEED_REPLY_MSG: 'false'
            }
            msg_body['headers'] = headers

            req = self.Request()
            req.callback = callback
            req.request = msg
            log.debug('add request[id:%s]' % mid)
            self.requests[mid] = req

            self.conn.send(msg)

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
    port = os.getenv('ZSTACK_DASHBOARD_PORT')
    if not port:
        port = 5000
    else:
        port = int(port)
    app.run(host="0.0.0.0", port=port, threaded=True)

if __name__ == "__main__":
    main()
