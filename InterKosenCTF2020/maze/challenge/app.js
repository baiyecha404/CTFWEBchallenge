const express = require('express');
const { execFile } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/solve', (req, res) => {
    // Check request
    if (req.body.map === undefined
        || req.body.start === undefined
        || req.body.goal == undefined) {
        res.status(400).json({
            error: 'invalid parameter'
        });
        return;
    }
    // Validation
    if (req.body.heap
        && !['BinaryHeap', 'PairingHeap', 'SkewHeap'].includes(req.body.heap)) {
        req.body.heap = 'BinaryHeap'; // default
    }
    // Use separated solver (just for timeout)
    const solver = execFile(
        'node',
        [
            'solve.js',
            JSON.stringify(req.body.map),
            JSON.stringify(req.body.start),
            JSON.stringify(req.body.goal),
            JSON.stringify(req.body.heap)
        ],
        {
            timeout: 500 // 0.5 sec
        },
        (err, stdout, stderr) => {
            res.send(stdout);
        }
    );
});

app.listen(14002);
