local value = 1
local function randomString(length)
    local random = ""
    local characters = {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"}
    for i=1, length do
        random = random..characters[math.random(1, #characters)]
    end
    return random
end
local function obfuscateScript(string)
    value = value + 1
    math.randomseed(os.time() + value)
    --//* Lua 5.1 Functions
    local printRandom = randomString(10)
    local gRandom = randomString(10)
    local versionRandom = randomString(10)
    local assertRandom = randomString(10)
    local collectgarbageRandom = randomString(10)
    local dofileRandom = randomString(10)
    local errorRandom = randomString(10)
    local getfenvRandom = randomString(10)
    local getmtRandom = randomString(10)
    local ipairsRandom = randomString(10)
    local loadRandom = randomString(10)
    local loadfRandom = randomString(10)
    local loadstringRandom = randomString(10)
    local moduleRandom = randomString(10)
    local nextRandom = randomString(10)
    local pairsRandom = randomString(10)
    local pcallRandom = randomString(10)
    local setmtRandom = randomString(10)
    --//* Functions End
    --//* New Variables
    local newPrint = "local "..printRandom.." = print\n"
    local newGRandom = "local "..gRandom.." = _G\n"
    local newVersionRandom = "local "..versionRandom.." = _VERSION\n"
    local newAssert = "local "..assertRandom.." = assert\n"
    local newCollectGarbage = "local "..collectgarbageRandom.." = collectgarbage\n"
    local newDoFile = "local "..dofileRandom.." = dofile\n"
    local newError = "local "..errorRandom.." = error\n"
    local newGetFenv = "local "..getfenvRandom.." = getfenv\n"
    local newGetMt = "local "..getmtRandom.." = getmetatable\n"
    local newIPairs = "local "..ipairsRandom.." = ipairs\n"
    local newLoad = "local "..loadRandom.." = load\n"
    local newLoadF = "local "..loadfRandom.." = loadfile\n"
    local newLoadS = "local "..loadstringRandom.." = loadstring\n"
    local newModule = "local "..moduleRandom.." = module\n"
    local newNext = "local "..nextRandom.." = next\n"
    local newPairs = "local "..pairsRandom.." = pairs\n"
    local newPcall = "local "..pcallRandom.." = pcall\n"
    local newSetMt = "local "..setmtRandom.." = setmetatable\n"
    --//* New Variables End
    --//* Pattern Search
    string = string.gsub(string, "print", printRandom)
    string = string.gsub(string, "_G", gRandom)
    string = string.gsub(string, "_VERSION", versionRandom)
    string = string.gsub(string, "assert", assertRandom)
    string = string.gsub(string, "collectgarbage", collectgarbageRandom)
    string = string.gsub(string, "dofile", dofileRandom)
    string = string.gsub(string, "error", errorRandom)
    string = string.gsub(string, "getfenv", getfenvRandom)
    string = string.gsub(string, "getmetatable", getmtRandom)
    string = string.gsub(string, "ipairs", ipairsRandom)
    string = string.gsub(string, "load", loadRandom)
    string = string.gsub(string, "loadfile", loadfRandom)
    string = string.gsub(string, "loadstring", loadstringRandom)
    string = string.gsub(string, "module", moduleRandom)
    string = string.gsub(string, "next", nextRandom)
    string = string.gsub(string, "pairs", pairsRandom)
    string = string.gsub(string, "pcall", pcallRandom)
    string = string.gsub(string, "setmetatable", setmtRandom)
    --//* Pattern Search End
    --//* Print Obfuscated Script
    print(newSetMt..newGetMt..newIPairs..newLoad..newLoadF..newLoadS..newModule..newNext..newPairs..newPcall..newPrint..newGRandom..newVersionRandom..newAssert..newCollectGarbage..newDoFile..newError..newGetFenv..string)
    --//* Print Obfuscated Script End
end

obfuscateScript([[
local lapis = require("lapis")
local math = require("math")
local config = require("lapis.config").get()
local csrf = require("lapis.csrf")
local websocket = require("http.websocket")
local cjson = require("cjson")
local respond_to, json_params
do
  local _obj_0 = require("lapis.application")
  respond_to, json_params = _obj_0.respond_to, _obj_0.json_params
end
local Listens = require("models.Listens")
local App
do
  local _class_0
  local _parent_0 = lapis.Application
  local _base_0 = {
    layout = "layout",
    ["/"] = function(self)
      return self:html(function()
        return body(function()
          div({
            class = "player"
          }, function()
            div({
              class = "details"
            }, function()
              div({
                class = "now-playing"
              }, "PLAYING x OF y")
              div({
                class = "track-art"
              })
              div({
                class = "track-name"
              })
              return div({
                class = "track-artist"
              })
            end)
            div({
              class = "buttons"
            }, function()
              div({
                class = "prev-track",
                onclick = "prevTrack();"
              }, function()
                return i({
                  class = "fa fa-step-backward fa-2x"
                })
              end)
              div({
                class = "playpause-track",
                onclick = "playpauseTrack();"
              }, function()
                return i({
                  class = "fa fa-play-circle fa-5x"
                })
              end)
              return div({
                class = "next-track",
                onclick = "nextTrack();"
              }, function()
                return i({
                  class = "fa fa-step-forward fa-2x"
                })
              end)
            end)
            div({
              class = "slider_container"
            }, function()
              div({
                class = "current-time"
              }, "00:00")
              input({
                type = "range",
                min = "1",
                max = "100",
                value = "0",
                class = "seek_slider",
                onchange = "seekTo();"
              })
              return div({
                class = "total-duration"
              }, "00:00")
            end)
            return div({
              class = "slider_container"
            }, function()
              i({
                class = "fa fa-volume-down"
              })
              input({
                type = "range",
                min = "1",
                max = "100",
                value = "99",
                class = "volume_slider",
                onchange = "setVolume();"
              })
              return i({
                class = "fa fa-volume-up"
              })
            end)
          end)
          return script({
            src = self:build_url("static/js/main.js")
          })
        end)
      end)
    end,
    [{
      update = "/update"
    }] = respond_to({
      GET = function(self)
        return {
          render = true
        }
      end,
      POST = function(self)
        if self.POST.request == 'listen' then
          if not (self.session.id) then
            do
              local listener = Listens:find(csrf.generate_token(self))
              if listener then
                self.session.id = listener.id
              else
                listener = Listens:create({
                  id = csrf.generate_token(self),
                  count = 0
                })
                self.session.id = listener.id
              end
            end
          end
          if self.session.id and not Listens:find(self.session.id) then
            local listener = Listens:create({
              id = csrf.generate_token(self),
              count = 0
            })
            self.session.id = listener.id
          end
          local listener = Listens:find(self.session.id)
          local data = "flag{........}"
          if listener.count >= 3470 then
            local ws = websocket.new_from_uri("ws://localhost:8181")
            assert(ws:connect())
            data = {
              user = self.session.id,
              listens = listener.count
            }
            assert(ws:send(cjson.encode(data)))
            data = cjson.decode(assert(ws:receive()))
            assert(ws:close())
          end
          local utctime
          do
            local _accum_0 = { }
            local _len_0 = 1
            for item in string.gmatch(listener.updated_at, "%d+") do
              _accum_0[_len_0] = item
              _len_0 = _len_0 + 1
            end
            utctime = _accum_0
          end
          local updatetime = os.time({
            year = utctime[1],
            month = utctime[2],
            day = utctime[3],
            hour = utctime[4],
            min = utctime[5],
            sec = utctime[6]
          })
          if listener ~= nil and os.time() - updatetime >= 104 then
            listener.count = listener.count + 1
            listener:update("count")
          end
          return {
            json = {
              status = "success",
              id = self.session.id,
              timestamp = listener.updated_at,
              count = listener.count,
              updatetime = updatetime,
              currenttime = os.time(),
              flag = data
            }
          }
        end
        return {
          redirect_to = "/"
        }
      end
    })
  }
  _base_0.__index = _base_0
  setmetatable(_base_0, _parent_0.__base)
  _class_0 = setmetatable({
    __init = function(self, ...)
      return _class_0.__parent.__init(self, ...)
    end,
    __base = _base_0,
    __name = "App",
    __parent = _parent_0
  }, {
    __index = function(cls, name)
      local val = rawget(_base_0, name)
      if val == nil then
        local parent = rawget(cls, "__parent")
        if parent then
          return parent[name]
        end
      else
        return val
      end
    end,
    __call = function(cls, ...)
      local _self_0 = setmetatable({}, _base_0)
      cls.__init(_self_0, ...)
      return _self_0
    end
  })
  _base_0.__class = _class_0
  if _parent_0.__inherited then
    _parent_0.__inherited(_parent_0, _class_0)
  end
  App = _class_0
  return _class_0
end
]])
