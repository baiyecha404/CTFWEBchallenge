# analytics

## Deployment
- `cd server;docker-compose up`

## Intended solution:
- extract apk and find libapp.so
- find domain by running strings on it
- replace "https://myapp.web.byteband.it" with your own url of same length
- monitor request and get the first flag
- for second flag, exploit SQLi on the server


