local config = require "lapis.config"
-- Use rewrite rules to create 'boards.' and 'static.' subdomains
-- Currently doesn't work, leave this as false!
local subdomains = false

-- Maximum file size (update this in scripts.js too!)
local body_size  = "15m"

-- Maximum comment size (update this in scripts.js too!)
local text_size  = 10000

-- Path to your lua libraries (LuaRocks and OpenResty)
local lua_path  = "./src/?.lua;./src/?/init.lua"
local lua_cpath = ""

config("development", {
	site_name  = "Derezzy",
	port       = 80,
	secret     = "xy9^yExv3N#Ebt5xLFnyGCU@",
	subdomains = subdomains,
	body_size  = body_size,
	text_size  = text_size,
	lua_path   = lua_path,
	lua_cpath  = lua_cpath,
	postgres   = {
		host     = "psql",
		user     = "postgres",
		password = "xy9^yExv3N#Ebt5xLFnyGCU@",
		database = "derezzy"
	},
})

config("production", {
	code_cache = "on",
	site_name  = "Derezzy",
	port       = 80,
	secret     = "xy9^yExv3N#Ebt5xLFnyGCU@",
	subdomains = subdomains,
	body_size  = body_size,
	text_size  = text_size,
	lua_path   = lua_path,
	lua_cpath  = lua_cpath,
	postgres   = {
		host     = "psql",
		user     = "postgres",
		password = "xy9^yExv3N#Ebt5xLFnyGCU@",
		database = "lapischan"
	},
})

config("test", {
	site_name  = "Derezzy",
	port       = 80,
	secret     = "xy9^yExv3N#Ebt5xLFnyGCU@",
	subdomains = subdomains,
	body_size  = body_size,
	text_size  = text_size,
	lua_path   = lua_path,
	lua_cpath  = lua_cpath,
	postgres   = {
		host     = "psql",
		user     = "postgres",
		password = "xy9^yExv3N#Ebt5xLFnyGCU@",
		database = "derezzy"
	},
})
