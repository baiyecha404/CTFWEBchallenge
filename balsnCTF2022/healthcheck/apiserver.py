import io, random, re, zipfile
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from background import data_path, backup_path, HEALTH_CHECK_INTERVAL


app = FastAPI()
flag2 = open('flag2', 'r').read()


create_problem_description = f'''
**This endpoint is only for admin. Do NOT share this link with players!**

Upload the health check script to create a new problem. The uploaded file should be a zip file.
The zip file should NOT have a top-level folder. In the folder, you must place an executable (or a script) named `run`. You may put other files as you want.
Below is an example output of `zipinfo myzip.zip` of a valid `myzip.zip`:

```
Archive:  myzip.zip
Zip file size: 383 bytes, number of entries: 2
-rwxrwxr-x  3.0 unx       84 tx defN 22-Aug-20 19:53 run
-rw-rw-r--  3.0 unx        8 tx stor 22-Aug-20 19:53 my-env
2 files, 92 bytes uncompressed, 89 bytes compressed:  3.3%
```

Below is an example output of an invalid zip (because it has a top-level folder):

```
Archive:  badzip.zip
Zip file size: 553 bytes, number of entries: 3
drwxrwxr-x  3.0 unx        0 bx stor 22-Aug-20 19:55 badzip/
-rw-rw-r--  3.0 unx        8 tx stor 22-Aug-20 19:55 badzip/myenv
-rwxrwxr-x  3.0 unx       84 tx defN 22-Aug-20 19:55 badzip/run
3 files, 92 bytes uncompressed, 89 bytes compressed:  3.3%
```

Every {HEALTH_CHECK_INTERVAL} seconds, the server will spawn a new process, cd into your folder, and run `./run`. Your `./run` should create `./status.json` to store the health check result, which will be returned when the players request for the status of this problem.
If you have any question, please contact @chiffoncake.
'''

@app.post('/new', description=create_problem_description)
async def create_problem(request: Request, file: UploadFile = File()):
    if not re.match(r'^[a-zA-Z0-9-_]+\.zip$', file.filename):
        raise HTTPException(400, detail='file should be a zip file')
    content = await file.read()
    if len(content) > 100 * 1024: # 100k
        raise HTTPException(400, detail='your file is too large')
    problem_name = file.filename[:-4]
    dir_name = problem_name + '-' + random.randbytes(8).hex()
    try:
        zipfile.ZipFile(io.BytesIO(content)).extractall(data_path / dir_name)
        zipfile.ZipFile(io.BytesIO(content)).extractall(backup_path / (request.client.host + '-' + dir_name))
    except:
        raise HTTPException(400, detail='bad zip file')
    return dir_name


@app.get('/{dir_name}')
async def get_status(dir_name: str):
    file = data_path / dir_name / 'status.json'
    if not file.resolve().is_relative_to((data_path / dir_name).resolve()):
        return HTTPException(404, detail='no status')
    try:
        with open(file, 'r') as fp:
            return fp.read()
    except:
        return HTTPException(404, detail='no status')


@app.get('/')
async def root():
    return {'message': 'Hello World'}