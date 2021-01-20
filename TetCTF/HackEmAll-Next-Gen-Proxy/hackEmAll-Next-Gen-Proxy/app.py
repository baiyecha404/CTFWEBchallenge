# from ducnt import <3. GLHF everyone

from flask import Flask, render_template, json, request, redirect, session, jsonify, url_for
import os
import uuid
import json
import time
import logging
import hashlib
import string
import pylibmc
import cgi
import random
import sys
import subprocess
import uuid

from urlparse import urlparse
from pymemcache.client import base
from io import BytesIO
from contextlib import closing
from flask_session import Session

reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)
app.secret_key = '#CENSORED#'
app.config["SECRET_KEY"] = "#CENSORED#"
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024
app.config["WAFWTF"] = ["@",";","&",">","<",",","'",'"']
app.config["WHILELIST"] = ["https","http"]


@app.route('/')
def home():
    return render_template('index.html')


def _set_cache(_key, _value):
    if str(_key) != "" and str(_value) != "":
        _cache_handle = pylibmc.Client(["127.0.0.1:11211"], binary=False)
        _cache_handle.set(_key, _value, time=60)
        return True

    else:
        return False

def _get_cache(_key):
    _cache_handle= pylibmc.Client(["127.0.0.1:11211"], binary=False)
    return _cache_handle.get(_key)


def parse(_url):
    _cmd = ["curl", "-L", "-k", str(_url)]
    _content = subprocess.check_output(_cmd)
    return _content.encode('hex')


@app.route('/curl', methods=['POST'])
def _curl():
    try:
        _url = request.form['url']
        for _check in app.config["WAFWTF"]:
            if _check in _url:
                return render_template('error.html',error = "The champion need nothing!!!")
        if len(_url) > int(73.311337):
            return render_template('error.html',error = "The champion need nothing!!!")

        _parse_scheme = urlparse(_url)
        if _parse_scheme.scheme in app.config["WHILELIST"]:
            _content = parse(_url)
            _cache_key = "HackEmALL2021-"+str(uuid.uuid4().hex)
            _cache_value = str(_url)
            _set_cache(_cache_key, _cache_value)

        return render_template('render.html', cache_key=_cache_key, description=_content.decode('hex'))
    except:
        return render_template('error.html', error="Something gowrong homie!!!")

@app.route('/history', methods=['POST'])
def _check_history():
    try:
        _cache_key = request.form['cache_key']

        for _check in app.config["WAFWTF"]:
            if _check in _cache_key:
                return render_template('error.html',error = "The champion need nothing!!!")
        if len(_cache_key) > int(73.311337):
            return render_template('error.html',error = "The champion need nothing!!!")

        _cache_value = _get_cache(_cache_key)

        return render_template('history.html', cache_value=_cache_value)
    except:
        return render_template('error.html', error="Something gowrong homie!!!")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='31337')