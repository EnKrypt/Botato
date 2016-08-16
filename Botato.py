import importlib
import sys

if __name__ == '__main__':
    import Botato
    raise SystemExit(Botato.main())


class Botato(object):
    'Outermost structure class for the Botato Program'
    version = {"Number": "0.1", "Type": "Alpha"}

    def __init__(self, args):
        self.startedwith = args

    def begin(self):
        try:
            hook = importlib.import_module('NetworkHooks.' + self.startedwith[1])
            connection = hook.Hook(self.startedwith)
            connection.connect()
        except RuntimeError as err:
            print(err)
            sys.exit(2)
        except:
            try:
                print('No such network hook: ' + self.startedwith[1] + '\nExiting.')
            except:
                print('Usage : python botato.py [network type] [args...]')
            sys.exit(2)


def main():
    bot = Botato(sys.argv)
    bot.begin()
