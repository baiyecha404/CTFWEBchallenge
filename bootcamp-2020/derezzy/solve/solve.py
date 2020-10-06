import asyncio
import websockets
import json

async def solve():
    uri = "ws://127.0.0.1:8181"
    async with websockets.connect(uri) as websocket:
        name = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        data = {"user": name, "count": 3500}
        await websocket.send(json.dumps(data))
        resp = await websocket.recv()
        for r in resp:
            print(hex(ord(r)), chr(ord(r) ^ 0x41))

asyncio.get_event_loop().run_until_complete(solve())
