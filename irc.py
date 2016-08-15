import socket

import parse


class IRC(object):
    'Wrapper for communication over the IRC protocol'
    PONG = "PONG"

    prefix = "P"

    def __init__(self, host, port=6667, channel="botato"):
        self.host = host
        self.port = port
        self.channel = "#" + channel
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.nowlistening = False

    def send(self, data):
        self.sock.send(data.encode())

    def read(self):
        return self.sock.recv(2040).decode()

    def connect(self):
        print("Connecting to " + self.host + " on channel " + self.channel + " via port " + str(self.port))
        self.sock.connect((self.host, self.port))
        self.send("USER " + IRC.prefix + " \"\" \"\" :Botato\r\n")
        self.send("NICK " + IRC.prefix + "\r\n")
        self.send("JOIN " + self.channel + "\r\n")
        self.nick = self.getNick()

    def startListening(self):
        self.nowlistening = True
        while 1:
            text = self.read()
            print(text)
            if parse.Parse.parsetext(text, self) is not None:
                self.send(parse.Parse.parsetext(text, self) + "\r\n")
                print("Sent: " + parse.Parse.parsetext(text, self))

    def provideConsole(self, inp):
        for line in inp:
            if line.startswith("/"):
                self.send(line[1])
            else:
                self.send("PRIVMSG " + self.channel + " :" + line)

    def getNick(self):  # TODO - Get valid serialized nick for unique role in botnet
        return IRC.prefix
