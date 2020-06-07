from tarfile import TarFile
from tarfile import TarInfo
from tarfile import is_tarfile
from flask import render_template
from flask import make_response
from flask import send_file
from flask import request
from flask import Flask
from hashlib import md5
from shutil import rmtree
from yaml import *
import os

app = Flask(__name__)

def initializing():
	try:
		with open('config.yaml', 'w') as fp:
			data = {'allow_host':'127.0.0.1', 'message':'Hello Admin!'}
			fp.write(dump(data))

	except:
		return False


def hostcheck(host):
	try:
		with open('config.yaml', 'rb') as fp:
			config = load(fp.read(), Loader=Loader)

		if config['allow_host'] == host:
			return config['message']

		else:
			raise()

	except:
		return False


def response(content, status):
	resp = make_response(content, status)
	return resp


@app.route('/', methods=['GET'])
def main():
	try:
		return render_template('index')

	except:
		return response("Not Found.", 404)

	finally:
		try:
			fn = 'temp/' + md5(request.remote_addr.encode()).hexdigest()

			if os.path.isdir(fn):
				rmtree(fn)

		except:
			response('Not Found.', 404)


@app.route('/<path:host>', methods=['GET'])
def download(host):
	base = 'temp/'
	apath = os.path.join(base, host).replace('..', '')

	if os.path.isfile(apath):
		return send_file(apath)

	return response("Not Found.", 404)


@app.route('/analyze', methods=['POST'])
def analyze():
	try:
		fn = 'temp/{}.tar'.format(md5(request.remote_addr.encode()).hexdigest())

		if request.method == 'POST':
			fp = request.files['file']
			fp.save(fn)

			if not is_tarfile(fn):
				return '<script>alert("Uploaded file is not \'tar\' file.");history.back(-1);</script>'

			tf = TarFile(fn)
			tf.extractall(fn.split('.')[0])
			bd1 = fn.split('/')[1].split('.')[0]
			bd2 = fn.split('/')[1]
	
			return render_template('analyze', path=bd1, fn=bd1, files=tf.getnames())

	except Exception as e:
		return response('Error', 500)

	finally:
		try:
			os.remove(fn)

		except:
			return response('Error', 500)


@app.route('/admin', methods=['GET'])
def admin():
	initializing()
	data = hostcheck(request.remote_addr)

	if data:
		return response(str(data), 200)

	else:
		return response('{} is not allowed to access.'.format(request.remote_addr), 403)


if __name__ == '__main__':
	initializing()
	app.run(host='0.0.0.0', port=8080)
