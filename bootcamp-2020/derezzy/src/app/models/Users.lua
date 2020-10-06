local config = require("lapis.config").get()
local Model
Model = require("lapis.db.model").Model
local trim
trim = require("lapis.util").trim
local Users
do
  local _class_0
  local _parent_0 = Model
  local _base_0 = { }
  _base_0.__index = _base_0
  setmetatable(_base_0, _parent_0.__base)
  _class_0 = setmetatable({
    __init = function(self, ...)
      return _class_0.__parent.__init(self, ...)
    end,
    __base = _base_0,
    __name = "Users",
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
  local self = _class_0
  self.constraints = {
    name = function(self, value)
      if not value then
        return "Error: must have a username."
      end
      value = trim(value)
      if value:find("%W") then
        return "Error: usernames must only contain alphanumeric characters."
      end
      if Users:find({
        name = value
      }) then
        return "Error: that username is already taken."
      end
      local lower = value:lower()
    end
  }
  self.relations = {
    {
      ["plays"] = {
        has_one = "Plays"
      }
    }
  }
  if _parent_0.__inherited then
    _parent_0.__inherited(_parent_0, _class_0)
  end
  Users = _class_0
  return _class_0
end
