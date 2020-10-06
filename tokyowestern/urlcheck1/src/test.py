import requests

url='http://0x7f.0.0.1'
r = requests.get(url, allow_redirects=False)
print(r.text)