const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { spawn } = require('child_process');
const data = require('./data.json');

const BIND_ADDR = process.env.BIND_ADDR || '127.0.0.1';
const PORT = process.env.PORT || '1337';

const app = express();

app.use(morgan('dev'));
app.use(express.static('./static'));
app.use(bodyParser.json());

function find(path) {
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    path = path.substring(1);

    let current = data;
    if (path.length > 0) {
        for (let segment of path.split('/')) {
            current = current[segment];
        }
    }

    return current;
}

app.get('/api/directory*', (req, res) => {
    let path = decodeURIComponent(req.path.substring('/api/directory'.length));
    if (!path.startsWith('/')) {
        return res.status(404).send('no.');
    }

    let dataItem = find(path);
    if (!dataItem) {
        return res.status(404).send('dunno');
    }

    let children = Object.keys(dataItem);
    res.json(children);
});
app.put('/api/directory*', (req, res) => {
    let path = decodeURIComponent(req.path.substring('/api/directory'.length));
    if (!path.startsWith('/')) {
        return res.status(404).send('no.');
    }

    let parentPath = path.split('/').reverse().slice(1).reverse().join('/');
    let id = path.replace(parentPath + '/', '');
    let { value } = req.body;
    find(parentPath)[id] = value;

    res.send('ok');
});

// TODO: remove before release
app.get('/_debug/stats', (req, res) => {
    let child = spawn('ps');
    let output = '';
    const writer = data => { output += data };
    child.stdout.on('data', writer);
    child.stderr.on('data', writer);
    child.on('close', () => res.type('text/plain').send(output));
});

app.listen(PORT, BIND_ADDR, () => {
    console.log(`OnlyFreights listening on ${BIND_ADDR}:${PORT}`);
});
