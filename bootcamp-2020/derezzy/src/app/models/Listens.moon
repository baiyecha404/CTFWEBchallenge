import Model from require("lapis.db.model")
import trim from require("lapis.util")

class Listens extends Model
        @timestamp: true
        @relations: {
            {"listens", has_one: "Listens"}
        }
