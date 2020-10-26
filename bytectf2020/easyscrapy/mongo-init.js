var data={"test":"123"}
db.result.drop();
db.result.insert(data);
db.createUser({
    user: "N0rth3",
    pwd:  "E7B70D0456DAD39E22735E0AC64A69AD",
    roles: [ { role: "readWrite", db: "result", collection:"result" }]
});

