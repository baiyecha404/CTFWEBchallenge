# coding: utf-8
# -**- author: byc_404 -**-
from main import Requests_On_Steroids
from urllib.parse import  urlparse, unquote_plus


parsed = urlparse(unquote_plus('inctf://120.27.246.202:9001/_?*3%0D%0A$3%0D%0Aset%0D%0A$3%0D%0Abyc%0D%0A$3%0D%0A123'))
msg = parsed.path.replace('/_','')
if hasattr(parsed, "query"):
    msg += "\t" + parsed.query
msg += "\r\n"
print(bytes(msg, 'utf-8'))