import threading

import irc

if __name__ == '__main__':
    import Botato
    raise SystemExit(Botato.main())


class Botato(object):
    'Outermost structure class for the Botato Program'
    version = {"Number": "0.1", "Type": "Alpha"}

    def __init__(self):
        self.start = True

    def begin(self):
        connection = irc.IRC("workfra.me", 6667)
        connection.connect()

        tolisten = threading.Thread(target=connection.startListening()).start()
        toconsole = threading.Thread(target=connection.provideConsole()).start()   # to be fixed


def main():
    bot = Botato()
    bot.begin()
