from flask import (
    Flask,
    request,
    render_template,
    make_response,
    abort,
    redirect,
    url_for,
)
from pymongo import MongoClient
import hmac
import hashlib
import json
import base64
import pickle

app = Flask(__name__)

mongo = MongoClient(
    port=27017, username="user1", password="7Lp7rkJnw0xikG9V", authSource="blog"
)
db = mongo.blog


class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        # Get username from formdata
        username = request.form["username"]
        password = request.form["password"]
        if not username:
            return render_template("login.html", error="A username must be provided")

        user = db.users.find_one({"username": username, "password": password})
        if not user:
            return render_template(
                "login.html", error="The username or password are incorrect"
            )
        user = User(user["username"], user["role"])
        token = create_token(pickle.dumps(user))
        # Redirect to index and set JWT in cookies
        resp = make_response(redirect(url_for("index")))
        resp.set_cookie("token", token)
        return resp

    elif request.method == "GET":
        return render_template("login.html")


@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        # Get username from formdata
        username = request.form["username"]
        password = request.form["password"]
        password2 = request.form["password2"]
        if not username or not password or not password2:
            return render_template(
                "signup.html", error="All the fields must be provided"
            )

        if password != password2:
            return render_template("signup.html", error="The passwords do not match")

        try:
            result = db.users.insert_one(
                {"username": username, "password": password, "role": "user"}
            )
        except Exception as e:
            return render_template("signup.html", error=e)

        # Redirect to login
        resp = make_response(redirect(url_for("login")))
        return resp

    elif request.method == "GET":
        return render_template("signup.html")


@app.route("/logout", methods=["GET"])
def logout():
    # Redirect to logout and delete JWT in cookies
    resp = make_response(redirect(url_for("login")))
    resp.delete_cookie("token")
    return resp


@app.route("/")
def index():
    user = None
    # Get jwt from cookie redirect to login if no jwt
    token = request.cookies.get("token", None)
    search = request.args.get("search", "")
    category = request.args.get("category", ".*")

    if token:
        try:
            user = verify_token(token)
        except Exception as e:
            abort(400, e)

    posts = db.posts.find(
        {
            "public": True,
            "title": {"$regex": search + ".*", "$options": "i"},
            "category": {"$regex": "^" + category + "$", "$options": "i"},
        }
    ).sort("order")

    return render_template("index.html", user=user, posts=posts)


@app.route("/post/<title>")
def post(title):
    user = None
    # Get jwt from cookie redirect to login if no jwt
    token = request.cookies.get("token", None)

    if token:
        try:
            user = verify_token(token)
        except Exception as e:
            abort(400, e)

    post = db.posts.find_one({"title": title})

    if not post:
        abort(404)

    return render_template("post.html", user=user, post=post)


def create_token(payload):
    with open("secret.txt", "rb") as file:
        key = file.read()
        header = {"typ": "JWT", "alg": "HS256", "kid": "secret.txt"}
        header_64 = (
            base64.urlsafe_b64encode(json.dumps(header).encode())
            .decode("UTF-8")
            .rstrip("=")
        )

        payload_64 = base64.urlsafe_b64encode(payload).decode("UTF-8").rstrip("=")

        sig_64 = (
            base64.urlsafe_b64encode(
                hmac.new(
                    key, (header_64 + "." + payload_64).encode(), hashlib.sha256
                ).digest()
            )
            .decode("UTF-8")
            .rstrip("=")
        )

        return header_64 + "." + payload_64 + "." + sig_64


def fix_padding(b64):
    b64 += "=" * (4 - (len(b64) % 4))
    return b64


def verify_token(token):
    header_64, payload_64, signature_64 = token.split(".")
    header = json.loads(base64.urlsafe_b64decode(fix_padding(header_64)))
    payload = base64.urlsafe_b64decode(fix_padding(payload_64))
    if header["alg"] != "HS256":
        raise Exception("The only JWT algorithm supported is HS256")
    with open(header["kid"], "rb") as file:
        key = file.read()
        check = (
            base64.urlsafe_b64encode(
                hmac.new(
                    key, (header_64 + "." + payload_64).encode(), hashlib.sha256
                ).digest()
            )
            .decode("UTF-8")
            .rstrip("=")
        )
        if signature_64 != check:
            raise Exception("The JWT signature is not valid")
        else:
            return pickle.loads(payload)
    raise Exception("Error verifying JWT")