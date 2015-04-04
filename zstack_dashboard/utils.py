__author__ = 'frank'

import os
import uuid
import traceback
import logging
import logging.handlers
import sys
import weakref
import threading
import functools
import os
import fcntl

class LogConfig(object):
    instance = None

    LOG_FOLER = '/var/log/zstack'

    def __init__(self):
        if not os.path.exists(self.LOG_FOLER):
            os.makedirs(self.LOG_FOLER, 0755)
        self.log_path = os.path.join(self.LOG_FOLER, 'zstack-dashboard.log')
        self.log_level = logging.DEBUG
        self.log_to_console = True

    def set_log_to_console(self, to_console):
        self.log_to_console = to_console

    def get_log_path(self):
        return self.log_path

    def set_log_path(self, path):
        self.log_path = path

    def set_log_level(self, level):
        self.log_level = level

    def configure(self):
        dirname = os.path.dirname(self.log_path)
        if not os.path.exists(dirname):
            os.makedirs(dirname, 0755)
        logging.basicConfig(filename=self.log_path, level=self.log_level)

    def get_logger(self, name, logfd=None):
        logger = logging.getLogger(name)
        logger.setLevel(logging.DEBUG)
        max_rotate_handler = logging.handlers.RotatingFileHandler(self.log_path, maxBytes=10*1024*1024, backupCount=3)
        logger.addHandler(max_rotate_handler)
        if self.log_to_console:
            formatter = logging.Formatter('%(asctime)s %(levelname)s [%(name)s] %(message)s')
            if not logfd:
                logfd = sys.stdout
            ch = logging.StreamHandler(logfd)
            ch.setLevel(logging.DEBUG)
            ch.setFormatter(formatter)
            logger.addHandler(ch)
        return logger

    @staticmethod
    def get_log_config():
        if not LogConfig.instance:
            LogConfig.instance = LogConfig()
        return LogConfig.instance

def configure_log(log_path, level=logging.DEBUG, log_to_console=True):
    cfg = LogConfig.get_log_config()
    log_dir = os.path.dirname(log_path)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    cfg.set_log_path(log_path)
    cfg.set_log_level(level)
    cfg.set_log_to_console(log_to_console)
    cfg.configure()

def get_logger(name, logfd=None):
    return LogConfig.get_log_config().get_logger(name, logfd)

def get_exception_stacktrace():
    return traceback.format_exc()

def abs_path(path):
    if path.startswith('~'):
        return os.path.expanduser(path)
    else:
        return os.path.abspath(path)

def strip(s):
    return s.strip(" \n\t\r")

def uuid4():
    return str(uuid.uuid4()).replace('-', '')

class PropertyFile(object):
    def __init__(self, path):
        self.path = abs_path(path)
        self.properties = {}

        if not os.path.isfile(self.path):
            raise Exception("can not find %s or it's not file" % self.path)

        with open(self.path, 'r') as fd:
            content = fd.read()
            lines = content.split("\n")
            for line in lines:
                line = strip(line)
                if not line: continue
                if line.startswith("#"): continue

                try:
                    key, value = line.split("=", 1)
                    self.properties[key] = value
                except Exception:
                    raise Exception("invalid line %s: %s" % (lines.index(line), line))

    def get(self, key, default=None):
        return self.properties.get(key, default)

    def get_raise_error_on_none(self, key):
        val = self.get(key)
        if not val:
            raise Exception("can not find property[%s] in file[%s]" % (key, self.path))

_internal_lock = threading.RLock()
_locks = weakref.WeakValueDictionary()

def _get_lock(name):
    with _internal_lock:
        lock = _locks.get(name, threading.RLock())
        if not name in _locks:
            _locks[name] = lock
        return lock

class NamedLock(object):
    def __init__(self, name):
        self.name = name
        self.lock = None

    def __enter__(self):
        self.lock = _get_lock(self.name)
        self.lock.acquire()
        #logger.debug('%s got lock %s' % (threading.current_thread().name, self.name))

    def __exit__(self, type, value, traceback):
        self.lock.release()
        #logger.debug('%s released lock %s' % (threading.current_thread().name, self.name))


def lock(name='defaultLock'):
    def wrap(f):
        @functools.wraps(f)
        def inner(*args, **kwargs):
            with NamedLock(name):
                retval = f(*args, **kwargs)
            return retval
        return inner
    return wrap
