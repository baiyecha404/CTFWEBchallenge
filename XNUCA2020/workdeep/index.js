const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const urlencode = require('urlencode');
const stringRandom = require('string-random');
const amqp = require('amqplib/callback_api');
const URL = require("url").URL;
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const { v1: uuid } = require('uuid');
const amqpUser = process.env.amqpUser || "guest";
const amqpPass = process.env.amqpPass || "guest";
const queueName = process.env.queueName || "test";
const enc = process.env.enc || "decc1b15a508a977eeca7a7b37dd6d116ab85d4f8f12a5147bef370a9bac3b797381997f96a4fc9f19e9ef651bd12d281747c24c247dc3113d63858c5cd7cbf62aa73ed55a0eb235e1891837a390ea9ce98f79e00ecaeaa262525aa7ec";

const app = express();
const port = 8888;
const maxnum = 30;
const secret = uuid().split("-")[0];

const validUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const stripStartBackslash = (s) => {
    return s.replace(/^[\/]+/g, '');
}

const cleanPath = (s) => {
    s = stripStartBackslash(s);
    let pathArray = s.split('/');
    let pathElement = [];
    let pos = 0;
    let arrlen = pathArray.length;
    for (let i=arrlen-1;i>=0;i--) {
        let ele = pathArray[i];
        if (ele == '.') {

        } else if (ele == '..') {
            pos++;
        } else {
            if (pos > 0) {
                pos--;
            } else {
                pathElement.unshift(ele);
            }
        }
    }
    for (let i=0;i<pos;i++) {
        pathElement.unshift('..');
    }
    return pathElement.join('/');
}

const sendTask = () => {
    amqp.connect(`amqp://${amqpUser}:${amqpPass}@localhost:5672/`, function(error0, connection) {
        if (error0) {
            return;            
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                return;
            }
            let queue = queueName;
            let rfile = stringRandom(16);
            let msg = `{"Enc":"${enc}","RFile":"${rfile}.tar"}`;

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            console.log("Sent '%s'", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 1000);
    });
}  // send task to /client

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => res.send('get a screenshot with your homepage in /screen?url=https://rebirthwyw.com'))

app.get('/iframe', (req, res) => {
    if (typeof req.query.token != "string" || typeof req.query.ifrsrc != "string") {
        res.send('Invalid Token or Src');
        return;
    }
    let token = req.query.token;
    let rethtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta name="referrer" content="never">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${req.query.ifrsrc}
    </body>
    </html>`;
    if (token == secret) {
        res.send(rethtml);
    } else {
        res.send("Invalid Token");
    }
})

app.get('/screen', async (req, res) => {
    if (typeof req.query.url != "string") {
        res.send('not valid url');
        return;
    }
    if (!validUrl(req.query.url)) {
        res.send('not valid url');
        return;
    }
    let framehtml = `<iframe src="${req.query.url}"></iframe>`;
    let url = urlencode(DOMPurify.sanitize(framehtml, { ALLOWED_TAGS: ['iframe'], ALLOWED_ATTR: ['src'] }));
    let image = uuid().split("-")[0];
    res.send(`view screenshot in /view?filename=${image}.png`);
    try {
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--no-zygote',
                '--single-process'
            ]
        }); // copy from https://github.com/zsxsoft/my-ctf-challenges/blob/master/0ctf2020/amp2020/web/routes/index.js
        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${port}/iframe?token=${secret}&ifrsrc=${url}`, {
            timeout: 3000
        });
        await page.screenshot({path:`files/${image}.png`});
        await browser.close();
        fs.readdir("files", (err, files) => { 
            if (err) {
            } else {
                if (files.length >= maxnum) {
                    sendTask();
                }
            } 
        })
    } catch (e) {
        console.log(e);
    }
})

app.get('/view', (req, res) => {
    if (typeof req.query.filename != "string") {
        res.send('not valid filename');
        return;
    }
    if (cleanPath(req.query.filename).indexOf('..')>=0) {
        res.send("No path traversal");
        return;
    }
    filename = `files/${req.query.filename}`;
    try {
        fs.readFile(filename, (err, data) => {
            if (err) {
                res.send('no image find');
            } else {
                res.attachment(filename);
                res.send(data);
            }
        });
    } catch (e) {
        res.send('no image find');
    }
})

app.listen(port, () => console.log(`listening on port ${port}!`))


/**
 * 
 * 
 * 
 * 
 */