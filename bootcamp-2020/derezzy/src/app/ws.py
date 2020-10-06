import asyncio
import websockets

async def hello():
    uri = "ws://localhost:1001/s"
    async with websockets.connect(uri) as ws:
        await ws.send("Hello")

asyncio.get_event_loop().run_until_complete(hello())
