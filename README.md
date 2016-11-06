[![Botato Logo](https://i.imgur.com/KLD48pY.png)](https://github.com/EnKrypt/Botato)

[![NPM-Version](https://img.shields.io/npm/v/botato.svg)](npmjs.com/package/botato)

[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://raw.githubusercontent.com/EnKrypt/Botato/master/LICENSE)

[![Branch-master](https://img.shields.io/badge/branch-master-8855aa.svg?style=flat-square)](https://github.com/EnKrypt/Botato)
[![Build-master](https://img.shields.io/travis/EnKrypt/Botato/master.svg)](https://travis-ci.org/EnKrypt/Botato)

[![Branch-testing](https://img.shields.io/badge/branch-testing-885555.svg?style=flat-square)](https://github.com/EnKrypt/Botato/tree/testing)
[![Build-testing](https://img.shields.io/travis/EnKrypt/Botato/testing.svg)](https://travis-ci.org/EnKrypt/Botato/branches)

 A cross platform botnet client that makes remote management easy.

# Getting Started

Install using npm with the global flag

```
$ npm install -g botato
```

Then run the executable on the command line

```
$ botato network-type [args...]
```

If you don't want to use npm, you can also download [a release](https://github.com/EnKrypt/Botato/releases) (simplest way to just get it running), or clone the repository (recommended if you plan to contribute to Botato).  
Go to the working directory and install dependencies by running:

```
$ npm install
```

Then run `botato.js` on the command line

```
$ node botato.js network-type [args...]
```

The first argument is the type of network you want to use. The only available network hook at the moment is `irc`, but you can also make your own by looking at the hook template in `NetworkHooks/hook.js`.

### Using Botato via IRC
You need to supply the server, port, ssl/tls support and channel(s) as arguments while running the program.  
Example :

```
$ node botato.js irc workfra.me 6697 true #bots
```

### Creating a .botatorc file
Although not mandatory, it is recommended to create a .botatorc file in your working directory or your home directory (the working directory takes precedence).

A .botatorc file is used to password protect your bot and directly provide runtime arguments. If you don't set up a password, anyone in the same network as your bot will have shell access on your device.

The .botatorc file needs to be written in JSON. Here's an example with all the options that it can be used to set with their default values :

```
{
    "autoUpdate": true,
    "updateInterval": 18000000,
    "promptForArgs": true,
    "args": [],
    "shortName": "Bot",
    "commandPrefix": "!",
    "shellPrefix": "~",
    "nickSeperator": "@",
    "usePassword": false,
    "password": "",
}
```

*`autoUpdate`* : If this is set to `false`, the bot will not perform any checks for updates. By default, this option is set to `true`, which makes it perform an update if it finds one.

*`updateInterval`* : After how long the bot should keep checking for updates if `autoUpdate` is set to true. Note that the bot checks for updates during start up, and the interval begins after that check. This option is specified in milliseconds.

*`promptForArgs`* : Boolean value representing whether or not to prompt for the right arguments in case there is a mismatch found by the network-type. Setting this as `false` is useful when the bot is being run as a daemon, in a headless environment without console access or just for enforcing strictness.

*`args`* : Array of words that would be otherwise passed to botato via the command line. Eg: `["irc", "workfa.me", "6667", false, "#bots"]`  
Note that in case you pass any command line arguments along with specifying this option in your .botatorc file, botato will only read your command line arguments and pretend this option was never specified.

*`shortName`* : Used as primary identification for your bot on the network. In case of IRC, this would be the base nickname. Multiple bots on the same network will use this option to stack up incrementally. For example if the first bot is named `Bot`, the second bot would be `Bot1`, the third `Bot2` and so on.

*`commandPrefix`* : Delimiter used for signifying the beginning of a command. Any directive to the bot that is not a direct shell command must start with the character(s) specified in this option.

*`shellPrefix`* : Delimiter used for signifying the beginning of a shell command. Directives starting with the character(s) in this option is acknowledged only if there is an interactive shell mode active on the bot.

*`nickSeperator`* : Delimiter used to separate nicks in [the command syntax](#commands) to target only specific bots. Note that doing so is optional, and when no separated nicks are mentioned, all bots in the network will perform the given command.

*`usePassword`* : Set this to `true` to use password protection. Any person on the network who wishes to control the bot needs to use the `!auth` command with the right password (see below). The hostmask of the user is registered in case of IRC to prevent identity theft. The person will then be able to issue shell commands to the bot for as long as that session persists.

*`password`* : Used along with the `usePassword` option if it is set to `true` to specify the value of the password. The password is intentionally used directly as cleartext to emphasize that it should be used more like an authorization code than a layer of security. Remember that anyone having physical access to your device has already crossed the potential to deal harm that botato offers.

# Usage

First, get your bot(s) running. Refer to the [Getting Started](#getting-started) section.

Join the network yourself and type your command there. Every bot subscribed to the network will perform the action provided by the command. Take a look at [the command syntax](#commands) to learn how to select only certain bots or use custom delimiters.  
Sending a private message to a bot (if the network supports it) might also work, but if your goal is to make only one bot in particular execute a command, then there are cleaner ways provided within the command syntax itself. (see below)

# Features

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

# Commands

Commands in general follow the syntax given below:

```
<commandPrefix><command name><nickSeperator><nick1><nickSeperator><nick2..> <arg1> <arg2..>
```

For example, here is how you would make all bots in the network respond to a ping command:

```
$ !ping
```

And here is how you would make only `Bot13`, `Bot14` and `Bot15` spit out their public IP addresses:

```
$ !address@Bot13@Bot14@Bot15 global
```

To learn more about how to set custom delimiters like `commandPrefix` or `nickSeperator` along with their default values, take a look at the [creating a .botatorc file](#creating-a-botatorc-file) section.  
Commands below use the default delimiters without selecting any nicks. Parameters in square brackets `[]` are optional.

* `!auth password` - If a password is set up for the bot, this command needs to be issued with the right pasword before a user can send other commands to it. A good way to use this command is by sending it as a private message to the bot so that others cannot look at the password as you send it.
* `!ping [param]` - Simple ping-pong to measure lag and response of the bot. The bot will pong back with `param` if given, else it simply responds with 'pong'.
* `!exit` - Make the bot force exit. Any shell instances attached to the bot with commands still running in them will continue to run. Note that if you do not have some other form of access to that host, you may not be able to get botato running on it again.
* `!info [version | updates]` - Displays basic information about the bot instance. Using the `version` flag only displays botato's version number. Using the `updates` flag only shows if you have pending updates waiting to be applied. Not supplying any arguments will show verbose information on all data relevant to the bot.
* `!address [global | local]`- Grabs the IP and MAC addresses from the client's network interfaces and displays it in the host network. `global` displays only the WAN facing IP address (if available). If no parameter is given, it displays details in verbose for both.
* `!update [version no.]` - Forces a manual update. If no parameter is given, the latest version is fetched.
* `!screenshot` / `!ss` - The bot takes a screen capture of the client's screen and uploads the image to an image host (such as imgur) and returns the url to the host network. This command will give an error for bots that are running headless without a display server.
* `!execute command` / `!exec command` - Creates a random shell instance and runs the `command` inside it. This is similar to running an unnamed shell command, but without displaying any shell events in its output.
* `!shell [name] [command]` - If `command` is provided, executes it in a shell instance, otherwise enters interactive shell mode on the bot. If `name` is defined, assigns that name (must be unique for that bot) to the shell instance, otherwise a random name is assigned. You can use the name to do things like write to stdin, suppress stdout, exit that shell instance, etc. (see below)
    * `<shellPrefix>command` - To run a shell command in interactive shell mode. Eg: `~echo test` or `~shutdown -h now`. This can be daisy-chained to have the same command run by all bots put to interactive shell mode. These commands do not strictly follow the vanilla command syntax.
    * The interactive shell mode is blocking i.e. you cannot run more than one shell command at the same time using it or have more than one interactive shell mode active in a bot at once. You can however run more than one shell command in the same bot by using the `!shell` command with the `command` parameter. Each shell instance (including the interactive shell mode) will run independent of each other.
    * `!suppress name` - Suppresses output of the shell instance to which that name is assigned so that the stdout from any commands running in it won't be printed. All bots having a shell instance with that name will be affected by it.
    * `!visible name` - Same as above except it has the opposite effect i.e. it removes output suppression if applicable.
    * `!stdin name characters` - Writes `characters` to the stdin of any command running in the identified shell instance. Useful for commands that require prompting such as `apt-get` or `sudo`.
    * `!list [name]` - Lists information on all the shell instances running on a bot that have `name` as its name. If `name` is skipped, all shell instances in that bot are displayed. If no specific bot(s) are selected in the commend syntax, all the shell instances across all bots in the network will be displayed.
    * `!close [soft | hard] [name]` - To make a shell instance quit. Shell instances that are busy working on a task will not exit on a `soft` exit, whereas a `hard` exit forces the instance to close regardless. `soft` exit is useful only for closing interactive shell modes since a normal shell instance quits after its command is complete. If neither `soft` or `hard` is specified, `soft` is assumed. You can either specify a shell instance to quit with `name` or have all the shell instances in a bot quit if it is not provided. If no specific bot(s) are selected in the command syntax, all the shell instances across all bots in the network will exit.

# Contributing

  * Since the nature of this project is such that peoples' intentions for using it lie in a very gray area, no part of any contribution will be allowed without proper review and testing. Try to make your code very clear for the convenience of those reviewing it.
  * Please make your pull requests point to the `testing` branch of this repo from your fork to make everyone's life easier. You may also request creating your own branch for the purpose of your contribution. Just make sure your pull request doesn't intend to merge with `master`.

# License

[AGPL](LICENSE.txt)

&nbsp;

&nbsp;

###### Note that the terms `client` and `bot` are nuanced and for general purposes here, can be interchanged.
