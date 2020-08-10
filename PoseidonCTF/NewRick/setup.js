#!/usr/bin/node

const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser')
const FileStore = require('session-file-store')(session);
const path = require("path");
const fs = require("fs");
const main = require(path.join(__dirname, "main"));

// Poseidon{Wh4t_@_w0nd3rfu1_wORlD_R1ck}
const app = express();
app.set("views", path.join(__dirname, "letters"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	resave: false,
	store: new FileStore({path: path.join(__dirname, "ricksess")}),
	saveUninitialized: true,
	secret: '5uckMyM0us3M0r7y'
}));
main(app, fs, path);

app.listen(6565, () => {
	console.log("Challenge Started On Port: 6565.");
});
