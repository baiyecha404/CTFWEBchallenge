# coding=utf-8

from flask import Flask, request, jsonify, Response
from os import getenv

from app import app

DATASET = {
    'ZMB2RCpQ3FpJetRbnavEceS9X7727U3amqGjXSH': 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f480000brb2q3t2v324gt56fosg&ratio=720p&line=0',
    'BCm5GPpTYYpTwKuhey9ganegvjwmJZ3yCnG5aAd': 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f330000bsqg15tf1hl85dajekg0&ratio=720p&line=0',
    'pYS3E8W6wNUenttNjJHEABvp4gXJJ5cQb95FsFV': 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fcb0000bsle1k60je9vdvi2t4u0&ratio=720p&line=0',
    'NR9QhBdWjtCZHer4NA5njUnMr97gp2QUbG4jWtY': 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fe10000bsk1g4an6tf6oe3gdcj0&ratio=720p&line=0',
    getenv('BYTE_FLAG'): 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f0a0000br14lol7gl1ko3a1cp40&ratio=720p&line=0'
}

@app.before_request
def check_host():
    if request.remote_addr != getenv('BOT_IP'):
        return Response(status=403)

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/send")
def send():
    return app.send_static_file('send.html')


@app.route("/search", methods=['POST'])
def search_handler():
    keyword = request.form['keyword']
    if keyword == '':
        return jsonify()
    elif {k for k in DATASET.keys() if keyword == k }:
        return jsonify({DATASET[keyword]:''})
    else:
        ret = {k: '' for k in DATASET.keys() if keyword in k}
        return jsonify(ret), 200 if len(ret) else 200

@app.after_request
def add_security_headers(resp):
    resp.headers['X-Frame-Options'] = 'sameorigin'
    resp.headers['Content-Security-Policy'] = "default-src http://*.bytectf.live:*/ 'unsafe-inline'; frame-src *; frame-ancestors http://*.bytectf.live:*/"
    resp.headers['X-Content-Type-Options'] = 'nosniff'
    resp.headers['Referrer-Policy'] = 'same-origin'
    return resp
