## Botato
======

##### A botnet client for native execution across supported networks for remote functionality.


##### Once completed, this bot will synchronize across a network of similar bots, mirroring them by executing actions stated by host commands provided.


Default protocol of communication is IRC.

Test network is as follows :

* Server - irc.jamezq.com

* Channel - #Botato

Note that the terms `client` and `bot` are nuanced and for general purposes here, can be interchanged.

#### Planned features:

1. Auto connect:
	* The bot will connect directly to host network on start-up. In case the network is down on the client side, the bot shall continuously attempt to re-establish connection.
2. Auto update:
	* Light wrapper around the bot that verifies it's running the latest version of the bot. If not, downloads the latest version, re-spawns as child process and kills itself.
3. Shell access:
	* Direct shell access provided by the bot from the client terminal controlled by the host for advanced probing.
4. Task processing: 
	* Bot should be able to connect to a job/task provider and accept tasks that are then executed and the result(if any) is returned to the host network. Work on task-cache(secondary feature to be implemented later) is necessary to avoid unnecessary waste of time/resources in sending and receiving single tasks when a group of them can be sent/received together.
	* <h4>Planned commands:</h4> [required parameter], \<optional parameter\>
		1. !init - To perform initial configurations on the host network, containing everything needed to get a new bot up and running.
		2. !ping \<param\> - Simple ping-pong to measure lag and response of the bot. The bot will pong back with `param` if given, else it responds with the delay time between reading and responding.
		3. !ip \<global | local\>- Grabs the global or local IP address of the client and returns it to the host network. If no `param` is given, it defaults to `global`.
		4. !update \<version no.\> - Force auto-update, such as if for some reason the auto-updater fails to work. If no `param` is given, the latest version is fetched.
		5. !download [url] - Fetched resource locally from the path specified in the `param`.
		6. !execute \<path\>/ !exec \<path\> - Executes locally the file resided at the `path` if it exists.
		7. !shell [nick] - Enters direct shell mode on the bot identified by the `nick` provided.
		8. !screenshot \<nick\> / !ss \<nick\>- The bot identified by the `nick` given takes a screencap of the client's screen(if GUI enabled) and uploads the image to an image host(such as imgur) and returns the url to the host network. If no `param` is provided, this command is executed by all bots across the network.
5. Offline database:
	* Data stored locally over no network for future access by host (or on re-connection if the client side network was originally down)
