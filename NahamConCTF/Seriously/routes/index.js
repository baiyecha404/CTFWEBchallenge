var express = require('express');
var serialize = require('node-serialize');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var jwt = require('jsonwebtoken');

var router = express.Router();
var privateKey = fs.readFileSync('private.pem');
var publicKey = fs.readFileSync('public.pem');
var url = "mongodb://localhost:27017/";
var dbo;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("shop");
});


/* GET home page. */
router.get('/', function (req, res, next) {
  var token = req.cookies['auth'];
  var user;
  if (token) {
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch (err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }

  var category = req.query.category;
  var filter = {}
  if (category) {
    filter = { category: category };
  }
  dbo.collection("items").find(filter).toArray(function (err, result) {
    if (err) throw err;
    res.render('index', { items: result, user: user });
  });
});


/* GET item page. */
router.get('/item/:name', function(req, res, next) {
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


/* GET add2cart page. */
router.get('/add2cart', function (req, res, next) {
  var _item = req.query.item;
  if (!_item) {
    res.status(400);
    return res.send('Missing item');
  }
  filter = { name: _item }
  dbo.collection("items").findOne(filter, function (err, result) {
    var cart = req.cookies['cart'];
    try {
      if (err) throw err;
    } catch (error) {  
      res.status(404);
      return res.send('Item not found');
    }

    if (!cart) {
      var cart = {
        items: {
          '0': {
            name: result.name,
            price: result.price,
            count: 1
          }
        }
      }
    } else {
      try {
        cart = serialize.unserialize(Buffer.from(cart, 'base64').toString('ascii'));
      } catch (error) {
        res.status(400);
        return res.send(error);
      }
      var found = false;
      Object.keys(cart.items).forEach(key => {
        var item = cart.items[key];
        if (item.name == result.name) {
          item.count++;
          found = true;
        }
      });
      if (!found) {
        cart.items[Object.keys(cart.items).length] = { name: result.name, price: result.price, count: 1 };
      }
    }
    var obj = serialize.serialize(cart);
    res.cookie('cart', Buffer.from(obj).toString('base64'), { httpOnly: true });
    res.redirect('/cart');
  });
});


/* GET removeFromCart page. */
router.get('/removeFromCart', function (req, res, next) {
  var _item = req.query.item;
  if (!_item) {
    res.status(400);
    return res.send('Missing item');
  }
  var cart = req.cookies['cart'];
  if (!cart) {
    res.status(400);
    return res.send('The cart is empty');
  } else {
    try {
      cart = serialize.unserialize(Buffer.from(cart, 'base64').toString('ascii'));
    } catch (error) {
      res.status(400);
      return res.send(error);
    }
    var found = false;
    Object.keys(cart.items).forEach(key => {
      var item = cart.items[key];
      if (item.name == _item) {
        delete cart.items[key];
        found = true;
      }
    });
    if (!found) {
      cart.items[Object.keys(cart.items).length] = { name: result.name, price: result.price, count: 1 };
    }
  }
  var obj = serialize.serialize(cart);
  res.cookie('cart', Buffer.from(obj).toString('base64'), { httpOnly: true });
  res.redirect('/cart');
});


/* GET cart page. */
router.get('/cart', function (req, res, next) {
  var token = req.cookies['auth'];
  var cart = req.cookies['cart'];
  var user;
  if (token) {
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch (err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }
  if (cart) {
    try {
      cart = serialize.unserialize(Buffer.from(cart, 'base64').toString('ascii'));
      return res.render('cart', { cart: cart, user: user });
    } catch (error) {
      res.status(400);
      return res.send(error);
    }
  }
  res.render('cart', { cart: cart, user: user });
});


/* GET checkout page. */
router.get('/checkout', function (req, res, next) {
  var token = req.cookies['auth'];
  var user;
  if (token) {
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch (err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }
  res.clearCookie("cart");
  res.render('checkout', { user: user });
});


/* GET signin page. */
router.get('/signin', function (req, res, next) {
  var token = req.cookies['auth'];
  var user;
  if (token) {
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch (err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }
  res.render('signin', { user: user });
});

/* POST signin page. */
router.post('/signin', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username || !password) {
    return res.render('signin', { error: "Missing parameter" });
  }
  var user = { username: username, password: password };
  dbo.collection("users").findOne(user, function (err, result) {
    if (err) {
      try {
        throw err;
      } catch (error) {
        return res.render('signin', { error: error });
      }
    } else {
      if (result) {
        var token = jwt.sign({ username: result.username }, privateKey, { algorithm: 'RS256' });
        res.cookie('auth', token, { httpOnly: true })
        return res.redirect('/');
      } else {
        return res.render('signin', { error: "Invalid credentials" });
      }
    }
  });
});

/* GET logout page. */
router.get('/logout', function (req, res, next) {
  res.clearCookie("auth");
  res.redirect('/signin');
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  var token = req.cookies['auth'];
  var user;
  if (token) {
    try {
      var decoded = jwt.verify(token, publicKey);
      user = decoded.username
    } catch (err) {
      res.status(400);
      res.send(err);
      return res;
    }
  }
  res.render('signup', { user: user });
});

/* POST signup page. */
router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  if (!username || !password || !password2) {
    return res.render('signup', { error: "Missing parameter" });
  }
  if (password != password2) {
    return res.render('signup', { error: "Passwords do not match" });
  }
  var user = { username: username, password: password };
  dbo.collection("users").insertOne(user, function (err, result) {
    if (err) {
      try {
        throw err;
      } catch (error) {
        return res.render('signup', { error: error });
      }
    } else {
      return res.redirect('/signin');
    }
  });
});

module.exports = router;
