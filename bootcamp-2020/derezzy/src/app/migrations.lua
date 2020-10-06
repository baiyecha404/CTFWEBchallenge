local create_table, add_column, create_index, types
do
  local _obj_0 = require("lapis.db.schema")
  create_table, add_column, create_index, types = _obj_0.create_table, _obj_0.add_column, _obj_0.create_index, _obj_0.types
end
return {
  [1] = function(self)
    return create_table("listens", {
      {
        "id",
        types.text({
          primary_key = true
        })
      },
      {
        "created_at",
        types.time
      },
      {
        "updated_at",
        types.time
      },
      {
        "count",
        types.integer
      }
    })
  end
}
