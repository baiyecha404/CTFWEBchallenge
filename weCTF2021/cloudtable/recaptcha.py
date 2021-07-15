import os

from flask import request
import requests


PRIV = os.getenv("RECAPTCHA_PRIV_KEY")
PUB = '6LetCjYbAAAAADFwWG6XbZsMg74jTvRzI_gAKkIl'


def verify_recaptcha():
    request.verify_response = {}
    request.recaptcha_passed = False
    token = request.form.get('g-recaptcha-response')
    api = 'https://www.recaptcha.net/recaptcha/api/siteverify'
    data = {
        'response': token,
        'secret': PRIV,
        'remoteip': request.remote_addr
    }
    response = requests.post(api, data=data)
    result = response.json()
    if result.get('success'):
        request.verify_response = result
        request.recaptcha_passed = True
        return True
    else:
        return False
