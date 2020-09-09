from gevent import monkey
monkey.patch_all()
from bottle import route, run, template, request, abort, response, redirect, static_file
from hashlib import sha1
import os
from uuid import uuid4
from shutil import copytree
import re
import glob
import base64
import tarfile


salt = os.urandom(16)
users = {}
login_users = {}

def get_username():
    token = request.get_cookie("login_token")
    return login_users.get(token, None)


@route('/register', method="POST")
def do_register():
    username=request.forms.get("username")
    password=request.forms.get("password")
    if not username or not password:
        return abort(400)

    if username in users:
        return abort(400, "username already userd")

    users[username] = {
        "password_hash": sha1(salt + password.encode()).hexdigest(),
        "id": uuid4().hex,
    }
    copytree("user_template", "userdir/{}".format(users[username]["id"]))

    redirect("/")


@route('/login', method="POST")
def do_login():
    username=request.forms.get("username")
    password=request.forms.get("password")
    if not username or not password:
        return abort(400)

    if username not in users:
        return abort(400, "login failed")

    if users[username]["password_hash"] != sha1(salt + password.encode()).hexdigest():
        return abort(400, "login failed")

    token = uuid4().hex
    login_users[token] = username

    response.set_cookie("login_token", token, path="/")
    redirect("/")

@route("/logout")
def do_logout():
    token = request.get_cookie("login_token")
    del login_users[token]
    redirect("/")

@route("/update", method="POST")
def do_update_template():
    username = get_username()
    if not username:
        return abort(400)

    content = request.forms.get("content")
    if not content:
        return abort(400)

    if "%" in content:
        return abort(400, "forbidden")

    for brace in re.findall(r"{{.*?}}", content):
        if not re.match(r"{{!?[a-zA-Z0-9_]+}}", brace):
            return abort(400, "forbidden")

    template_path = "userdir/{userid}/template".format(userid=users[username]["id"])
    with open(template_path, "w") as f:
        f.write(content)

    redirect("/")


@route("/upload", method="POST")
def do_upload():
    username = get_username()
    if not username:
        return abort(400)

    attachment = request.files.get("attachment")
    if not attachment:
        return abort(400)

    tarpath = 'tmp/{}'.format(uuid4().hex)
    attachments_dir = "userdir/{userid}/attachments/".format(userid=users[username]["id"])
    attachment.save(tarpath)
    try:
        tarfile.open(tarpath).extractall(path=attachments_dir)
    except (ValueError, RuntimeError):
        pass
    os.remove(tarpath)
    redirect("/")

@route("/post", method="POST")
def do_post():
    username = get_username()
    if not username:
        return abort(400)

    title = request.forms.get("title")
    content = request.forms.get("content")

    postid = uuid4().hex
    title_path = "userdir/{userid}/titles/{postid}".format(userid=users[username]["id"], postid=postid)
    post_path = "userdir/{userid}/posts/{postid}".format(userid=users[username]["id"], postid=postid)

    with open(title_path, "w") as f:
        f.write(title)

    with open(post_path, "w") as f:
        f.write(content)

    redirect("/posts/{userid}/{postid}".format(userid=users[username]["id"], postid=postid))

@route("/posts/<userid>/<postid>")
def view_post(userid, postid):
    if not re.match("[0-9a-f]{32}", userid) or not re.match("[0-9a-f]{32}", postid):
        return abort(400)

    template_path = "userdir/{userid}/template".format(userid=userid)
    with open(template_path, "r") as f:
        t = f.read()

    title_path = "userdir/{userid}/titles/{postid}".format(userid=userid, postid=postid)
    with open(title_path, "r") as f:
        title = f.read()

    post_path = "userdir/{userid}/posts/{postid}".format(userid=userid, postid=postid)
    with open(post_path, "r") as f:
        p = f.read()

    attachments={}
    attachments_dir = "userdir/{userid}/attachments/".format(userid=userid)
    for path in glob.glob(attachments_dir+"*"):
        if os.path.isfile(path):
            with open(path, "rb") as f:
                attachments["attachment_" + os.path.splitext(os.path.basename(path))[0]] = base64.b64encode(f.read())

    stat = os.stat(post_path)
    return template(t, title=title, content=p, last_update=stat.st_mtime, **attachments)


@route("/")
def index():
    username = get_username()
    if username:
        userid = users[username]["id"]
        template_path = "userdir/{userid}/template".format(userid=userid)
        with open(template_path, "r") as f:
            t = f.read()

        posts={}
        posts_dir = "userdir/{userid}/titles/".format(userid=userid)
        for path in glob.glob(posts_dir+"*"):
            if os.path.isfile(path):
                with open(path, "r") as f:
                    posts[f.read().strip()] = os.path.basename(path)

        attachments=[]
        attachments_dir = "userdir/{userid}/attachments/".format(userid=userid)
        for path in glob.glob(attachments_dir+"*"):
            if os.path.isfile(path):
                attachments.append("attachment_" + os.path.splitext(os.path.basename(path))[0])

        return template(open("views/user.html").read(), username=username, userid=userid, template=t, posts=posts, attachments=attachments)
    else:
        return static_file("index.html", root="views/")


if __name__ == "__main__":
    run(host='', port=14000, debug=False, server='gevent')
