import json
import os

from flask import Flask, render_template, request, jsonify
from pymysqlpool.pool import Pool
from recaptcha import verify_recaptcha, PUB
import string
import random


app = Flask(__name__)
BASE_DB = "cloudtable"
USERNAME = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = "35.193.26.163"

pool = Pool(host=HOST, user=USERNAME, password=PASSWORD, db="mysql", autocommit=True)
pool.init()

SCHEMA_TYPES = {
    1: "INT",
    2: "CHAR(255)",
    3: "BOOL"
}


def random_string():
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(14))


def random_password():
    letters = string.ascii_lowercase + string.ascii_uppercase + string.digits
    return ''.join(random.choice(letters) for _ in range(31))


def create_instance(schema):
    username, password, table_name = random_string(), random_password(), random_string()
    attr_count = len(schema)
    if attr_count == 0: return None, None, None
    # convert schema ({ATTR_NAME: ATTR_TYPE}) to an array
    info_arr = schema.keys()
    # create sql template for creating table
    try:
        create_sql_tmpl = f"CREATE TABLE `{BASE_DB}`.`{table_name}`("
        for i in info_arr:
            create_sql_tmpl += f"`%s` {SCHEMA_TYPES[int(schema[i])]},"
        create_sql_tmpl = create_sql_tmpl[:-1] + ");"
    except Exception as e:
        print(e)
        return None, None, None

    with pool.get_conn() as conn:
        with conn.cursor() as cursor:
            # create table
            cursor.execute(create_sql_tmpl, tuple(info_arr))
            # create temp user
            cursor.execute(f"CREATE USER '{username}'@'%' IDENTIFIED BY '{password}';")
            cursor.execute(f"GRANT ALL PRIVILEGES ON `{BASE_DB}`.`{table_name}` TO '{username}'@'%';")
            cursor.execute(f"FLUSH PRIVILEGES;")

    return username, password, table_name


@app.route('/')
def index():
    return render_template("index.html", pubkey=PUB)


@app.route('/create', methods=["POST"])
def create():
    if not verify_recaptcha():
        return "Wrong captcha"
    username, password, table_name = create_instance(json.loads(request.form.get("payload")))
    return jsonify({
        "username": username,
        "password": password,
        "table_name": table_name,
        "host": HOST,
        "db": BASE_DB,
    })


if __name__ == '__main__':
    app.run()
