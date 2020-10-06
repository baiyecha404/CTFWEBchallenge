import asyncio
import websockets
import json

winners = {}

FLAG = "flag{BEHOLD_THE_SON_OF_OUR_MAKER!}"

def encode(uname):
    encoded = []
    for i, ch in enumerate(uname):
        encoded += chr(ord(ch) ^ ord(FLAG[i % len(FLAG)]))

    return ''.join(encoded)


async def hello(websocket, path):
    data = await websocket.recv()
    data = json.loads(data)
    if data["user"] not in winners and data["count"] >= 3470:
        winners["user"] = True
        await websocket.send(encode(data["user"]))

start_server = websockets.serve(hello, "0.0.0.0", 8181)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
