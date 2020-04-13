from flask import Flask, render_template, request, flash, redirect, send_file
from urllib.parse import urlparse
import re
import os
from hashlib import md5
import asyncio
import requests

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.curdir, "uploads")
# app.config['UPLOAD_FOLDER'] = "/uploads"
app.config['MAX_CONTENT_LENGTH'] = 1*1024*1024
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 's'}

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.mkdir(app.config['UPLOAD_FOLDER'])

def secure_filename(filename):
    return re.sub(r"(\.\.|/)", "", filename)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    return render_template("home.html")

@app.route("/upload", methods=["POST"])
def upload():
    caption = request.form["caption"]
    file = request.files["image"]

    if file.filename == '':
        flash('No selected file')
        return redirect("/")
    elif not allowed_file(file.filename):
        flash('Please upload images only.')
        return redirect("/")
    else:
        if not request.headers.get("X-Real-IP"):
           ip = request.remote_addr
        else:
           ip = request.headers.get("X-Real-IP")
        dirname = md5(ip.encode()).hexdigest()
        filename = secure_filename(file.filename)
        upload_directory = os.path.join(app.config['UPLOAD_FOLDER'], dirname)
        if not os.path.exists(upload_directory):
            os.mkdir(upload_directory)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], dirname, filename)
        file.save(upload_path)
        return render_template("uploaded.html", path = os.path.join(dirname, filename))

@app.route("/view/<path:path>")
def view(path):
    return render_template("view.html", path = path)

@app.route("/uploads/<path:path>")
def uploads(path):
    # TODO(noob):
    # zevtnax told me use apache for static files. I've
    # already configured it to serve /uploads_apache but it
    # still needs testing. I'm a security noob anyways.
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], path))

if __name__ == "__main__":
    app.run(port=5000)
