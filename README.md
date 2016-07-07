[![Botato Logo](https://i.imgur.com/KLD48pY.png)](https://github.com/EnKrypt/Botato)

  A cross platform botnet client that makes remote management easy.

## Getting Started

Default network is IRC.  
You can either supply the server and channel as arguments while running the program, or you will be prompted for it.

```
$ python botato.py workfra.me #bots
```

```
$ python botato.py
Server: workfra.me
Channel: #bots
```

## Usage

Join the IRC channel yourself and type your command there. Every bot subscribed to the channel will perform the action provided by the command.  
Sending a private message to a bot will also work, but if your goal is to make only one bot in particular execute a command, then there are cleaner ways provided within the command syntax itself. (see below)

## Features

  * Auto connect:
	  * The bot will connect directly to the host network on start-up. In case the network is down on either side, the bot continuously attempts to re-establish connection after set intervals.
  * Auto update:
	  * Light wrapper around the bot that verifies it's running the latest version of the bot. If not, downloads the latest version, re-spawns as child process and kills itself.
  * Command-line access:
	  * Direct shell access provided by the bot from the client terminal for advanced probing.
  * Task processing: 
	  * In-built commands can be used to make bots perfom certain tasks.
	  * All bots who see the command will attempt to execute it unless the `nick` is specified in the command, in which case it will only have an effect on that particular bot, if it exists. Note that specifying the `nick` needs to be supported by that command's syntax as well.
	  * The bot spawns a child thread to handle any tasks provided by a command to ensure that the main event loop is non-blocking. This means that the bot can still receive commands even if a current task is not complete, and can efficiently work on multiple commands concurrently.
	  * <h4>Planned commands:</h4> [required parameter], \<optional parameter\>
		  * !ping \<param\> - Simple ping-pong to measure lag and response of the bot. The bot will pong back with `param` if given, else it simply responds with 'pong'.
		  * !ip \<global | local\>- Grabs the global or local IP address of the client and returns it to the host network. If no parameter is given, it defaults to `global`.
		  * !update \<version no.\> - Forces an update, such as if for some reason the auto-updater fails to work. If no parameter is given, the latest version is fetched.
		  * !download [url] - Fetches resource locally from the path specified in the `param`.
		  * !execute \[path\]/ !exec \[path\] - Executes locally the file resided at the `path` if it exists.
		  * !shell [nick] <command> - If `command` is provided, executes it in a shell instance, otherwise enters direct shell mode on the bot identified by the `nick` provided.
			  * Type `~command` to run a shell command in direct shell mode. Eg: `~echo test` or `~shutdown -h now` 
			  * Can be daisy-chained to have the same command run by all bots put to direct shell mode.
			  * The direct shell mode instance is blocking i.e. you cannot run more than one shell command at the same time using it. You can however open more than one direct shell mode in the same bot with the `!shell` command on a bot already occupied with a task on its curent shell mode. Better yet, just specify the shell command each time using the second parameter of the `!shell` command.
			  * Type `!exit <nick>` to leave the direct shell mode. Bots that are working on a task in their shell mode will not quit. If no `nick` is provided, all bots in direct shell mode leave it.
		  * !screenshot \<nick\> / !ss \<nick\>- The bot identified by the `nick` given takes a screencap of the client's screen(if GUI enabled) and uploads the image to an image host(such as imgur) and returns the url to the host network.
  * Offline database:
	  * Information like command history, connection events or other data specified by tasks are stored locally.
	  * On the event that the bot has finished a task but cannot establish a connection to the host network, the appropriate information is stored to be sent on the next successful attempt at connecting.

## Contributing

  * Since the nature of this project is such that peoples' intentions for using it lie in a very gray area, no part of any contribution will be allowed without proper review and testing. Try to make your code very clear for the convience of those reviewing it.
  * Please push to the `testing` branch of your fork to make everyone's life easier. You may also create your own branch for the purpose of your contribution. Just make sure you don't push to `master`, because even if you do, your pull requests will be merged to a different branch.

## License

[AGPL](LICENSE.txt)

&nbsp;

&nbsp;

###### Note that the terms `client` and `bot` are nuanced and for general purposes here, can be interchanged.
