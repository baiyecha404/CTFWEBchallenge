const express = require('express');
const mustacheExpress = require('mustache-express');
const morgan = require('morgan');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {readdir, stat, readFile} = require('fs/promises');

const babyheap = require('./babyheap');

const app = express();

app.use(morgan('short'));
app.use(express.text({type: '*/*'}));

app.set('views', __dirname + '/views');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

app.use((req, res, next) => {
        res.set('Content-Security-Policy', "default-src 'self'; form-action 'self'; base-uri 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' https://code.jquery.com/jquery-3.6.0.min.js https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js;");
        res.set('X-Frame-Options', 'DENY');
        next();
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/', async (req, res) => {
        res.render('index');
});

app.get('/cmd/dmesg', async (req, res) => {
        res.sendFile('/var/log/dmesg');
});

app.get('/cmd/id', async (req, res) => {
        const { stdout, stderr } = await exec('id');
        res.send(stdout);
});


app.post('/cmd/ls', async (req, res) => {
        let dir = __dirname + '/files/';
        if (typeof req.body === 'string' && req.body !== 'undefined')
                dir += req.body;

        try {
                const files = await readdir(dir);

                for (let i = 0; i < files.length; i++)
                {
                        if (files[i] == 'babyheap')
                                files[i] = '[[;green;]babyheap]';
                }

                res.send(files.join('\n'));
        } catch (e) {
                res.send('ls failed');
        }
});

app.post('/cmd/cat', async (req, res) => {
        if (typeof req.body != 'string')
                throw 'Invalid request';

        const filename = req.body;

        if (filename == 'flag.txt' || filename.search(/\.\/+flag\.txt/) != -1) {
                res.send('cat: ' + filename + ': Permission denied')
        } else {
                const f = __dirname + '/files/' + filename;

                try {
                        const st = await stat(f);

                        if (st.size < 1 || st.size > 100*1024) {
                                res.send('cat: ' + filename + ': Invalid file size');
                        } else {
                                const content = await readFile(f);
                                res.send(content);
                        }
                } catch (err) {
                        res.send('cat: ' + filename + ': No such file or directory');
                }
        }
});

app.use('/cmd/babyheap', babyheap)

app.listen(8080, "0.0.0.0");
