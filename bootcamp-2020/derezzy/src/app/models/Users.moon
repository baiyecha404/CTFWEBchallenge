config = require("lapis.config").get!

import Model from require("lapis.db.model")
import trim from require("lapis.util")

class Users extends Model
    @constraints: {
        name: (value) =>
            if not value
                return "Error: must have a username."

            value = trim(value)

            if value\find("%W")
                return "Error: usernames must only contain alphanumeric characters."
            
            if Users\find(name: value)
                return "Error: that username is already taken."

            lower = value\lower!
    }

    @relations: {
        {"plays": has_one: "Plays"}
    }
