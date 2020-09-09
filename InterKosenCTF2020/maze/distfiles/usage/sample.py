import requests
import json

HOST = 'web.kosenctf.com'
PORT = 14002

maze = {
    "map": [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    "start": (1, 1),
    "goal": (8, 9),
    "heap": "BinaryHeap"
}

r = requests.post(f"http://{HOST}:{PORT}/solve",
                  headers = {"Content-Type": "application/json"},
                  data = json.dumps(maze))
print(r.text)
