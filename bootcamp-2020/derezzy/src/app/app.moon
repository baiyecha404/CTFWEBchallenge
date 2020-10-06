lapis = require("lapis")
math = require("math")
config = require("lapis.config").get!
csrf = require("lapis.csrf")
w = require("http.websocket")
cjson = require("cjson")

import respond_to, json_params from require("lapis.application")

Listens = require("models.Listens")

class App extends lapis.Application
    layout: "layout"

    ["/"]: =>
        --GET: =>
        @html ->
            body ->
                div class: "player", ->
                    div class: "details", ->
                        div class: "now-playing", "PLAYING x OF y"
                        div class: "track-art"
                        div class: "track-name"
                        div class: "track-artist"
                    div class: "buttons", ->
                        div class: "prev-track", onclick: "prevTrack();", ->
                            i class: "fa fa-step-backward fa-2x"
                        div class: "playpause-track", onclick: "playpauseTrack();", ->
                            i class: "fa fa-play-circle fa-5x"
                        div class: "next-track", onclick: "nextTrack();", ->
                            i class: "fa fa-step-forward fa-2x"
                    div class: "slider_container", ->
                        div class: "current-time", "00:00"
                        input type: "range", min: "1", max: "100", value: "0", class: "seek_slider", onchange: "seekTo();"
                        div class: "total-duration", "00:00"
                    div class: "slider_container", ->
                        i class: "fa fa-volume-down"
                        input type: "range", min: "1", max: "100", value: "99", class: "volume_slider", onchange: "setVolume();"
                        i class: "fa fa-volume-up"

                script src: @build_url "static/js/main.js"

    [update: "/update"]: respond_to {
        GET: =>
            render: true

        POST: =>
            if @POST.request == 'listen'
                unless @session.id 
                    if listener = Listens\find csrf.generate_token @
                        @session.id = listener.id
                    else
                        listener = Listens\create {
                            id: csrf.generate_token @
                            count: 0
                        }
                        @session.id = listener.id

                if @session.id and not Listens\find @session.id
                    listener = Listens\create {
                        id: csrf.generate_token @
                        count: 0
                    }
                    @session.id = listener.id

                listener = Listens\find @session.id

                data = "flag{........}"

                if listener.count >= 3470
                    ws = w.new_from_uri("ws://localhost:8181")
                    assert(ws\connect!)
                    data = {user: @session.id, count: listener.count}
                    assert(ws\send(cjson.encode(data)))
                    data = cjson.decode(assert(ws\receive!))
                    assert(ws\close!)

                utct = [item for item in string.gmatch(listener.updated_at, "%d+")]
                updatetime = os.time({year: utct[1], month: utct[2], day: utct[3], hour: utct[4], min: utct[5], sec: utct[6]})
                if listener != nil and os.time() - updatetime >= 104
                    listener.count += 1
                    listener\update "count"

                return json: {status: "success", id: @session.id, timestamp: listener.updated_at, count: listener.count, updatetime: updatetime, currenttime: os.time(), flag: data}


            redirect_to: "/"
    }
