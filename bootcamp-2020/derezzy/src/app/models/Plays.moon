import Model from require("lapis.db.model")

class Plays extends Model
    @relations: {
        {"user", belongs_to: "Users"}
    }
