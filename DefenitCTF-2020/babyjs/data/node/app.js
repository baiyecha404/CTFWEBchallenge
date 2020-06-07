const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const app = express();

const SALT = crypto.randomBytes(64).toString('hex');
const FLAG = require('./config').FLAG;

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

if (!fs.existsSync(path.join('views', 'temp'))) {
    fs.mkdirSync(path.join('views', 'temp'));
}

app.use(express.urlencoded());
app.use((req, res, next) => {
    const { content } = req.body;

    req.userDir = crypto.createHash('md5').update(`${req.connection.remoteAddress}_${SALT}`).digest('hex');
    req.saveDir = path.join('views', 'temp', req.userDir);

    if (!fs.existsSync(req.saveDir)) {
        fs.mkdirSync(req.saveDir);
    }

    if (typeof content === 'string' && content.indexOf('FLAG') != -1 || typeof content === 'string' && content.length > 200) {
        res.end('Request blocked');
        return;
    }

    next();
});

app.get('/', (req, res) => {
    const { p } = req.query;
    if (!p) res.redirect('/?p=index');
    else res.render(p, { FLAG, 'apple': 'mint' });
});

app.post('/', (req, res) => {
    const { body: { content }, userDir, saveDir } = req;
    const filename = crypto.randomBytes(8).toString('hex');

    let p = path.join('temp', userDir, filename)
    
    fs.writeFile(`${path.join(saveDir, filename)}.html`, content, () => {
        res.redirect(`/?p=${p}`);
    })
});

app.listen(8080, '0.0.0.0');
