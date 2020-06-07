const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const path = require('path');
const crypto = require('crypto');
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const encodeExt = file => {
    const stream = require('fs').readFileSync(path.resolve(file));
    return Buffer.from(stream).toString('base64');
};

const options = new chrome.Options();

options.addExtensions(encodeExt('./SuperHighlighter.crx'));

var capabilities = webdriver.Capabilities.chrome();

let driver;

async function reloadDriver() {

    if (driver) {
        driver.quit();
    }

    driver = new webdriver.Builder()
        .usingServer('http://selenium:4444/wd/hub/')
        .withCapabilities(capabilities)
        .setChromeOptions(options)
        .build();

    await driver.get(`http://highlighter.ctf.defenit.kr/`);
    await driver.manage().addCookie({name:'session', value: jwt.sign(JSON.stringify({ id: -1, username: 'this-is-the-super-admin-name' }), config.SECRET)});

}

reloadDriver();

setInterval(() => {
    reloadDriver();
}, 10000);

const config = require('./config');

const app = express();
const conn = mysql.createConnection(config.DB_CONFIG);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {

    let token = req.cookies['session'];
    req.session = null;

    if (typeof token === 'string' && token.length > 0) {

        try {

            let session = jwt.verify(token, config.SECRET);
            req.session = session;

            next();

        } catch {
            res.clearCookie('session');
            res.redirect('/login');
        }

    } else {

        req.session = null;
        next();

    }

});

app.get('/', (req, res) => {
    res.render('index', { session: req.session });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {

    let { username, password } = req.body;

    if (typeof username === 'string' && username && typeof password === 'string' && password && username.length <= 16 && username.length >= 5 && password.length < 20 && password.length >= 5) {
        conn.query(
            'select * from users where username = ? and password = ?',
            [username, crypto.createHash('sha256').update(password).digest('hex')],
            (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    res.end('Login failed');
                } else {
                    let token = jwt.sign(JSON.stringify({ id: result[0].id, username: result[0].username }), config.SECRET);
                    res.cookie('session', token);
                    res.redirect('/');
                }
            }
        );
    } else {
        res.end('Invalid Input')
    }
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {

    let { username, password } = req.body;

    if (typeof username === 'string' && username && typeof password === 'string' && password && username.length <= 16 && username.length >= 5 && password.length < 20 && password.length >= 5) {

        conn.query(
            'select * from users where username = ?',
            [username],
            (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                    conn.query(
                        'insert into users values (NULL, ?, ?)',
                        [username, crypto.createHash('sha256').update(password).digest('hex')],
                        (err, result) => {
                            if (err) throw err;
                            res.redirect('/login');
                        }
                    );
                } else {
                    res.end('Username already exist.');
                }
            }
        );

    } else {
        res.end('Invalid Input');
    }

});

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
})

app.use((req, res, next) => {
    if (res.session === null) res.redirect('/login');
    else next();
});

app.get('/list', (req, res) => {
    conn.query(
        'select * from board where user_id = ?',
        [req.session.id],
        (err, result) => {
            if (err) throw err;
            res.render('list', { posts: result })
        }
    )
});

app.get('/read', (req, res) => {

    let { id } = req.query;

    conn.query(
        'select * from board where id = ?',
        [id],
        (err, result) => {
            if (err) throw err;


            if (result.length === 0) {
                res.end('Not exist')
            } else if (req.session && result[0].user_id ===  req.session.id || req.session && req.session.username === 'this-is-the-super-admin-name') {
                res.render('read', { content: result[0].content });
            } else {
                res.end('No permission');
            }
        }
    )
});

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', (req, res) => {

    let { content } = req.body;

    conn.query(
        'insert into board values (NULL, ?, ?)',
        [req.session.id, content],
        (err, result) => {
            if (err) throw err;
            res.redirect(`/read?id=${result.insertId}`);
        }
    )
});

app.get('/report', (req, res) => {
    res.render('report');
});

let hist = {};

app.post('/report', (req, res) => {
    let { url } = req.body;
    if (typeof url === 'string' && /^http:\/\/highlighter\.ctf\.defenit\.kr\//.test(url)) {
        (async () => {
            if (hist[req.connection.remoteAddress] && Date.now() - hist[req.connection.remoteAddress] < 30000) {
                res.end('Try after 30 seconds');
            } else {
                console.log(url);
                await driver.get(url);
                await res.end('Your request has been processed');
            }
            hist[req.connection.remoteAddress] = Date.now();
        })();
    } else {
        res.end('Invalid URL');
    }
});

app.listen(8080);