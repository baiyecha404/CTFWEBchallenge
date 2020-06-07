const express = require('express');
const cookieParser = require('cookie-parser');
const { MongoClient, ObjectID } = require('mongodb');
const { FLAG, MONGO_URL } = require('./config');

const app = express();

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser('🐈' + '🐇'));
app.use(express.urlencoded());


app.get('/', (req, res) => {
    res.render('index', { session: req.signedCookies.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    let { username } = req.body;

    res.cookie('user', username, { signed: true });
    res.redirect('/');
});

app.use((req, res, next) => {
    if (!req.signedCookies.user) {
        res.redirect('/login');
    } else {
        next();
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', (req, res) => {

    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
    const author = req.signedCookies.user;

    const { content } = req.body;

    client.connect(function (err) {

        if (err) throw err;

        const db = client.db('fortuneCookie');
        const collection = db.collection('posts');

        collection
            .insertOne({
                author,
                content
            })
            .then((result) => {
                res.redirect(`/view?id=${result.ops[0]._id}`)
            }
            );

        client.close();

    });

});

app.get('/view', (req, res) => {

    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
    const author = req.signedCookies.user;
    const { id } = req.query;

    client.connect(function (err) {

        if (err) throw err;

        const db = client.db('fortuneCookie');
        const collection = db.collection('posts');

        try {
            collection
                .findOne({
                    _id: ObjectID(id)
                })
                .then((result) => {

                    if (result && typeof result.content === 'string' && author === result.author) res.render('view', { content: result.content })
                    else res.end('Invalid or not allowed');

                }
                );
        } catch (e) { res.end('Invalid request') } finally {
            client.close();
        }


    });
});

app.get('/posts', (req, res) => {

    let client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
    let author = req.signedCookies.user;

    if (typeof author === 'string') {
        author = { author };
    }

    client.connect(function (err) {

        if (err) throw err;

        const db = client.db('fortuneCookie');
        const collection = db.collection('posts');

        collection
            .find(author)
            .toArray()
            .then((posts) => {
                res.render('posts', { posts })
            }
            );

        client.close();

    });

});

app.get('/flag', (req, res) => {

    let { favoriteNumber } = req.query;
    favoriteNumber = ~~favoriteNumber;

    if (!favoriteNumber) {
        res.send('Please Input your <a href="?favoriteNumber=1337">favorite number</a> 😊');
    } else {

        const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });

        client.connect(function (err) {

            if (err) throw err;

            const db = client.db('fortuneCookie');
            const collection = db.collection('posts');

            collection.findOne({ $where: `Math.floor(Math.random() * 0xdeaaaadbeef) === ${favoriteNumber}` })
                .then(result => {
                    if (favoriteNumber > 0x1337 && result) res.end(FLAG);
                    else res.end('Number not matches. Next chance, please!')
                });

            client.close();

        });
    }
})

app.listen(8080, '0.0.0.0');
