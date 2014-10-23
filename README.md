## Botato
======

##### A botnet client for native execution across supported networks for remote functionality.


##### Once completed, this bot will synchronize across a network of similar bots, mirroring them by executing actions stated by host commands provided.


Default protocol of communication is IRC.

Test network is as follows :

* Server - irc.jamezq.com

* Channel - #Botato

#####Potential features:

1. Task processing: 
* Bot should be able to connect to a job/task sanctioner and accept tasks that are then processed and returned to the sanctioner. Work on task-cache is neccasary to avoid unneccasry waste of time/resources in sending and recieving single tasks when a group of them can be sent/recieved together. Initial tasks include bruteforcing, page-scraping etc.
2. Download and execute payload:
* Payloads are scripts/executables downloaded and executed by the bot.
3. Shell access:
* Shell access incase you want to run any platform specifc probing.
4. Offline database - keylogs, user-logon, started_at
* Data collected when the network is down.
5. Auto updation
* Thin wrapper around the bot that verifies its running the latest version of the bot, if not, downloads the latest version, spwans child process and kills itself.


#####Potential methods:
!intro - To perfom introductions in a IRC channel, single line containing everything needed to get a new client to get started.
!ping(pong) - Simple ping-pong to measure lag via on the network
!ip - Grabs the ip address of the network and returns it to the IRC channel
!update - Force auto-update, if for some reason the auto-updater fails to work
!download <url> - Payload getter
!ls - list executables in self directory
!execute <command> - Execute payload on self
!shell - Relay that works between the IRC channel and the shell console on the bot.
!stash <key>, <value> - temporary variable map, killed on close, useful for hashes in case we upgrade to using tor
!dump_database <url:port> - dump local database to said server:port
!screenshot - screeshots the computer and uploads the image to some photosharing site and returns url to IRC channel

