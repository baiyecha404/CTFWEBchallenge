var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var router = express.Router();

var url = "mongodb://localhost:27017/";
var dbo;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("shop");
});

/* GET item page. */
router.get('/:name', function(req, res, next) {
  var token = req.cookies['auth'];
  var user;
  if (token){
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch(err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }
  var name = req.params.name;
  filter = {name: name}
  dbo.collection("items").findOne(filter, function(err, result) {
    if (err) throw err;
    res.render('item', {item: result, user: user});
  });
});

module.exports = router;
