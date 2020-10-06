import os, re, requests, flask
from urllib.parse import urlparse

app = flask.Flask(__name__)
app.flag = '***CENSORED***'
app.re_ip = re.compile('\A(\d+)\.(\d+)\.(\d+)\.(\d+)\Z')

def valid_ip(ip):
    matches = app.re_ip.match(ip)
    if matches == None:
        return False

    ip = list(map(int, matches.groups()))
    if any(i > 255 for i in ip) == True:
        return False
    # Stay out of my private!
    if ip[0] in [0, 10, 127] \
        or (ip[0] == 172 and (ip[1] > 15 or ip[1] < 32)) \
        or (ip[0] == 169 and ip[1] == 254) \
        or (ip[0] == 192 and ip[1] == 168):
        return False
    return True

def get(url, recursive_count=0):
    r = requests.get(url, allow_redirects=False)
    if 'location' in r.headers:
        if recursive_count > 2:
            return '&#x1f914;'
        url = r.headers.get('location')
        if valid_ip(urlparse(url).netloc) == False:
            return '&#x1f914;'
        return get(url, recursive_count + 1) 
    return r.text

@app.route('/admin-status')
def admin_status():
    if flask.request.remote_addr != '127.0.0.1':
        return '&#x1f97a;'
    return app.flag

@app.route('/check-status')
def check_status():
    url = flask.request.args.get('url', '')
    if valid_ip(urlparse(url).netloc) == False:
        return '&#x1f97a;'
    return get(url)

@app.route('/')
def index():
    return '''
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
</head>
<body>
    <div id="app" class="container">
      <h1>urlcheck v1</h1>
      <div class="input-group input-group-lg mb-3">
        <input v-model="url" placeholder="e.g.) http://11.45.148.93/" class="form-control">
        <div class="input-group-append">
          <button v-on:click="checkStatus" class="btn btn-primary">check</button>
        </div>
      </div>
      <div v-if="status" class="alert alert-info">{{ d(status) }}</div>
    </div>
    <script>
      new Vue({
        el: '#app',
        data: {url: '', status: ''},
        methods: {
          d: function (s) {
            let t = document.createElement('textarea')
            t.innerHTML = s
            return t.value
          },
          checkStatus: function () {
            fetch('/check-status?url=' + this.url)
              .then((r) => r.text())
              .then((r) => {
                this.status = r
              })
          }
        }
      })
    </script>
</body>
</html>
'''
