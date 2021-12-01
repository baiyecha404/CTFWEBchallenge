const express = require('express')
const {randomBytes} = require('crypto');
const cookieParser = require('cookie-parser')

const router = express.Router();

router.use(cookieParser())

router.use(async function (req, res, next) {
        if (!req.cookies['session']) {
                req.cookies['session'] = randomBytes(16).toString('hex');
                res.cookie('session', req.cookies['session']);
        }

        if (typeof(req.cookies['session']) != 'string' || req.cookies['session'].search(/^[a-f0-9]{32}$/) == -1) {
                res.status(500).send('Invalid session');
        } else {
                next();
        }
});

const dblib = require('./db');
const db = dblib.connect();

const key_pattern = /^[\x41-\x5a\x61-\x7a][\x20-\x39\x41-\x5a\x61-\x7a]+$/;

router.get(`/read/:key`, async (req, res) => {
        const { key } = req.params;

        if (typeof(key) != 'string' || key.search(key_pattern) == -1) {
                res.status(500).send('Invalid key');
                return;
        }

        const query = dblib.prepare('SELECT * FROM notes WHERE session_id = :sid AND key = :key', {
                'sid': req.cookies['session'],
                'key': key
        });

        let r;
        try {
                r = await db.query(query);
        } catch (error) {
                console.log(error);
                res.status(500).send('Internal error');
                return;
        }

        if (r.rows[0])
                res.send(r.rows[0]['data']);
        else
                res.status(404).send('Key not found!');
});

router.get(`/delete/:key`, async (req, res) => {
        const { key } = req.params;

        if (typeof(key) != 'string' || key.search(key_pattern) == -1) {
                res.status(500).send('Invalid key');
                return;
        }

        const query = dblib.prepare('DELETE FROM notes WHERE session_id = :sid AND key = :key', {
                'sid': req.cookies['session'],
                'key': key
        });
    
        let r;
        try {
                r = await db.query(query);
        } catch (error) {
                console.log(error);
                res.status(500).send('Internal error');
                return;
        }

        if (r.rowCount)
                res.send('Deleted');
        else
                res.status(404).send('Key not found!');
});

router.get('/list', async (req, res) => {
        const { id } = req.params;

        const query = dblib.prepare('SELECT key FROM notes WHERE session_id = :sid', {
                'sid': req.cookies['session']
        });
 
        let r;
        try {
                r = await db.query(query);
        } catch (error) {
                console.log(error);
                res.status(500).send('Internal error');
                return;
        }

        res.json(r.rows);
});

router.post('/add/', async (req, res) => {
        if (typeof req.body != 'string') {
                res.status(500).send('Invalid request');
                return;
        }

        try {
                const params = JSON.parse(req.body);

                if (typeof(params['key']) != 'string' || params['key'].search(key_pattern) == -1) {
                        res.status(500).send('Invalid key');
                        return;
                }

                if (typeof(params['data']) != 'string') {
                        res.status(500).send('Invalid data');
                        return;
                }

                const query = dblib.prepare('INSERT INTO notes (key, session_id, data) VALUES (:key, :sid, :data)', {
                        'key': params['key'],
                        'sid': req.cookies['session'],
                        'data': params['data'],
                });

                const r = await db.query(query);
        } catch (error) {
                console.log(error);
                res.status(500).send('Internal error');
                return;
        }


        res.send('ok');
});


module.exports = router;
