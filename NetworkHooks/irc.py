import pydle
import time
from tornado.ioloop import IOLoop
import uuid

from NetworkHooks import hook


class Hook(hook.HookTemplate):
    'Wrapper for communication over the IRC protocol'

    def __init__(self, args):
        self.listening = False
        self.hash = uuid.uuid4().hex
        self.botindex = 1
        self.reattemptinterval = 10
        self.ssl = False  # Default value

        self.argumentscheck(args)
        self.host = args[2]
        self.port = int(args[3])
        self.nick = self.nickprefix = 'EnKrypt'
        self.channel = args[4]

    def argumentscheck(self, args):
        if len(args) < 5:
            raise RuntimeError('Incorrect number of parameters given')
        elif not args[3].isdigit():
            raise RuntimeError('Parameter for port number can be an integer only')
        elif not args[4].startswith('#'):
            raise RuntimeError('All channels must start with #')
        else:
            try:
                if args[5].lower() == 'true':
                    self.ssl = True
            except:
                pass

    def connect(self):
        while True:
            try:
                print('Connecting to ' + self.host + ' on channel ' + str(self.channel) + ' via port ' + str(self.port))
                self.connection = IRCClient(self, self.nick, 'Botato')
                self.connection.connect(self.host, self.port, tls=self.ssl)
                self.connection.handle_forever()
            except Exception as e:
                print('DEBUG: ' + str(e))
                self.connection.disconnect()
                print('Could not connect. Bad parameters or network. Will reconnect in ' + str(self.reattemptinterval) + ' seconds.')
                time.sleep(self.reattemptinterval)


class IRCClient(pydle.Client):
    'Subclass of IRC library to override event callbacks'

    def __init__(self, hooked, nick, username):
        self.hooked = hooked
        super().__init__(nick, username=username)

    def rejoinloop(self):
        time.sleep(self.hook.reattemptinterval)
        self.join(self.hook.channel)

    def on_connect(self):
        super().on_connect()
        self.join(self.hooked.channel)

    def on_join(self, channel, user):
        super().on_join(channel, user)
        if channel == self.hooked.channel and user == self.hooked.nick:
            self.hooked.listening = True
            self.set_nickname(self.hooked.nickprefix + str(self.hooked.botindex))

    def on_message(self, target, by, message):
        super().on_message(target, by, message)
        print('MESSAGE: ' + by + ': ' + str(message))

    def on_nick_change(self, old, new):
        super().on_nick_change(old, new)
        if self.hooked.nick == old:
            self.hooked.nick == new

    def on_raw(self, message):
        super().on_raw(message)
        mes = str(message).split()
        if mes[1] == '1':
            self.hooked.nick = mes[-1].split('!')[0]
        if mes[1] == '433' and self.hooked.listening:
            self.hooked.botindex += 1
            self.set_nickname(self.hooked.nickprefix + str(self.hooked.botindex))

        print('RAW: ' + str(message))
