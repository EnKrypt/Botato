[![Botato Logo](https://i.imgur.com/KLD48pY.png)](https://github.com/EnKrypt/Botato)

[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://raw.githubusercontent.com/EnKrypt/Botato/master/LICENSE.txt)  

 A cross platform botnet client that makes remote management easy.

## Getting Started

Run the program on the command line.

```
$ node botato.js network-type [args...]
```

You will have to pick the type of network to use first.  The only available network hook at the moment is `irc`, but you can also make your own by looking at the hook template in the `NetworkHooks` directory.  

#### Using Botato via IRC
You need supply the server, port and channel as arguments while running the program.  
Example :

```
$ node botato.js workfra.me 6667 #bots
```

## Usage

Join the network yourself and type your command there. Every bot subscribed to the network will perform the action provided by the command.  
Sending a private message to a bot (if the network supports it) might also work, but if your goal is to make only one bot in particular execute a command, then there are cleaner ways provided within the command syntax itself. (see below)

## Features

* Auto connect:
    * The bot will connect to the network as directed on start-up. In case the network is down on either side, the bot continuously attempts to re-establish connection after set intervals.
* Auto update:
    * Light wrapper around the bot that verifies it's running the latest version of the bot. If not, downloads the latest version, re-spawns as child process and kills itself.
* Command-line access:
    * Direct shell access provided by the bot from the client terminal for advanced probing.
* Task processing:
    * In-built commands can be used to make bots perform certain tasks.
    * All bots who see the command will attempt to execute it unless the `nick` is specified in the command, in which case it will only have an effect on that particular bot, if it exists. Note that specifying the `nick` needs to be supported by that command's syntax as well.
    * The bot spawns a child thread to handle any tasks provided by a command to ensure that the main event loop is non-blocking. This means that the bot can still receive commands even if a current task is not complete, and can efficiently work on multiple commands concurrently.
* Offline database:
    * Information like command history, connection events or other data specified by tasks are stored locally.
    * On the event that the bot has finished a task but cannot establish a connection to the host network, the appropriate information is stored to be sent later on request.

## Commands [optional parameter]

* `!ping [param]` - Simple ping-pong to measure lag and response of the bot. The bot will pong back with `param` if given, else it simply responds with 'pong'.
* `!ip [global | local]`- Grabs the global or local IP address of the client and returns it to the host network. If no parameter is given, it defaults to `global`.
* `!update [version no.]` - Forces an update, such as if for some reason the auto-updater fails to work. If no parameter is given, the latest version is fetched.
* `!screenshot [nick]` / `!ss [nick]` - The bot identified by the `nick` given takes a screen capture of the client's screen(if GUI enabled) and uploads the image to an image host(such as imgur) and returns the url to the host network.
* `!download url` - Fetches resource locally from the path specified in `url`.
* `!execute path` / `!exec path` - Executes locally the file resided at the `path` if it exists. This is similar to running an unnamed shell command with the output suppressed.
* `!shell nick [name] [command]` - If `command` is provided, executes it in a shell instance, otherwise enters interactive shell mode on the bot identified by the `nick` provided. If `name` is defined, assigns that name (must be unique for that bot) to the shell instance, otherwise a random name is assigned. You can use the name to do things like write to stdin, suppress stdout, exit that shell instance, etc. (see below)
    * `~command` - To run a shell command in interactive shell mode. Eg: `~echo test` or `~shutdown -h now`. This can be daisy-chained to have the same command run by all bots put to interactive shell mode.
    * The interactive shell mode is blocking i.e. you cannot run more than one shell command at the same time using it or have more than one interactive shell mode active in a bot at once. You can however run more than one shell command in the same bot by using the `!shell` command with the `command` parameter. Each shell instance (including the interactive shell mode) will run independent of each other.
    * `!suppress name` - Suppresses output of the shell instance to which that name is assigned so that the stdout from any commands running in it won't be printed. All bots having a shell instance with that name will be affected by it.
    * `!visible name` - Same as above except it has the opposite effect i.e. it removes output suppression if applicable.
    * `!stdin name characters` - Writes `characters` to the stdin of any command running in the identified shell instance. Useful for commands that require prompting such as `apt-get` or `sudo`.
    * `!list nick` - Lists all the names of the shell instances running on the bot identified by `nick`. If any of those instances is also an interactive shell mode instance, it will be mentioned.
    * `!exit [soft | hard] [nick | name]` - To make a shell instance quit. Shell instances that are busy working on a task will not exit on a `soft` exit, whereas a `hard` exit forces the instance to close regardless. `soft` exit is useful only for closing interactive shell modes since a normal shell instance quits after its command is complete. If neither `soft` or `hard` is specified, `soft` is assumed. You can either specify a shell instance to quit with `name` or have all the shell instances in a bot quit with `nick`. If neither `nick` or `name` is provided, all the shell instances across all bots in the network will exit.

## Contributing

  * Since the nature of this project is such that peoples' intentions for using it lie in a very gray area, no part of any contribution will be allowed without proper review and testing. Try to make your code very clear for the convenience of those reviewing it.
  * Please make your pull requests point to the `testing` branch of this repo from your fork to make everyone's life easier. You may also request creating your own branch for the purpose of your contribution. Just make sure your pull request doesn't intend to merge with `master`.

## License

[AGPL](LICENSE.txt)

&nbsp;

&nbsp;

###### Note that the terms `client` and `bot` are nuanced and for general purposes here, can be interchanged.
