from PIL import ImageGrab
import pycurl
import cStringIO
import untangle


class Parse(object):  # A class for just a couple of static methods is not needed. Workarounds should be considered.
    'Interprets incoming commands and directs bot to respond accordingly'

    def parsetext(text, con):
        com = text.split(" ", 3)
        try:
            if com[0] == "PING":
                return "PONG " + text.split()[1]
            elif (com[3].strip() + " ").startswith(":!ping "):
                if com[3].strip().endswith("!ping"):
                    return "PRIVMSG " + con.channel + " :Pong"
                else:
                    return "PRIVMSG " + con.channel + " :Pong" + com[3].strip()[6:]
            elif (com[3].strip() + " ").startswith(":!screenshot ") or (com[3].strip() + " ").startswith(":!ss "):
                if com[3].strip().endswith("!screenshot") or com[3].strip().endswith("!ss"):
                    return "PRIVMSG " + con.channel + " :" + Parse.screengrab()
                elif com[3].strip()[6:].lower() == con.nick.lower():
                    return "PRIVMSG " + con.channel + " :" + Parse.screengrab()
        except Exception as e:
            e.printargs()
        return None

    def screengrab():
        im = ImageGrab.grab()
        img = 'screenshot.png'
        im.save(img)
        xml = Parse.upload(img)
        return Parse.process(xml)

    def upload(image):
        response = cStringIO.StringIO()
        c = pycurl.Curl()
        values = [
            ("key", '0e74360592046d7'),  # Key is publicly visible until it expires. No security concerns.
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
