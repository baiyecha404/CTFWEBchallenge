import create_table, add_column, create_index, types from require("lapis.db.schema")

{
    [1]: =>
        create_table "listens", {
            {"id", types.text primary_key: true}
            {"created_at", types.time}
            {"updated_at", types.time}
            {"count", types.integer}
        }
}
