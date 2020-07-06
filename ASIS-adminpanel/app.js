const express = require('express');
const app = express();
const session = require('express-session');
const db = require('better-sqlite3')('./db.db', {readonly: true});
const cookieParser = require("cookie-parser");
const FileStore = require('session-file-store')(session);
const fs = require('fs');

app.locals.flag = "ASIS{t1me_t0_study_pr0t0type_p0llu7ion_4nd_ejs!}"
app.use(express.static('static'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, function(){
    console.log("Server started on port 3000")
});

app.use((req, res, next) => {
	if (req.method === "HEAD" && req.url === '/') {
		return next();
	}

	session({
		secret: 'sup3r_powerof2_wit5_ASIS_CTF_s3CrE7',
		resave: false,
		saveUninitialized: false,
		store: new FileStore({path: __dirname+'/sessions/'})
	})(req, res, next);
});

const router = require('./router/main')(app, db, fs);