const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const { v4 } = require('uuid');
const fs = require("fs");

const app = express();
const flag = process.env.FLAG || "flag{fake-flag}";
const authToken = process.env.AUTH_TOKEN || "1337";
const noteOrigin = process.env.NOTE_URL || "http://127.0.0.1:4001"
const notePage = fs.readFileSync("./templates/view-note.html").toString().replace("$NOTEURL$",noteOrigin);
const indexPage = fs.readFileSync("./templates/index.html").toString().replace("$NOTEURL$",noteOrigin);

const v4reg = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
const writeNote = (noteid,content)=>{
	if(noteid.match(v4reg)) fs.writeFileSync(`./notes/${noteid}`,content);
}
const deleteNote = (noteid)=>{
	if(noteid.match(v4reg)) fs.unlinkSync(`./notes/${noteid}`);
}
const readNote = (noteid)=>{
	if(noteid.match(v4reg)) return fs.readFileSync(`./notes/${noteid}`);
	return "??";
}

app.use((req, res, next)=>{
	res.setHeader("Cache-Control","no-store, max-age=0");
  	res.setHeader("X-Frame-Options","Deny");
	res.setHeader("Content-Security-Policy",`default-src 'self'; worker-src 'none'; frame-src ${noteOrigin}/; script-src 'none';`);
	next();
});

app.use(session({
    secret: crypto.randomBytes(48).toString('hex'),
	resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: "lax",
        httpOnly: true
    }
}));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());

app.post("/flag",(req,res)=>{
	if(req.cookies["auth"] == authToken && req.headers["x-i-want"] == "flag"){
		return res.send(flag);
	}
	return res.send("No flag for you");
});

app.get("/note",(req,res)=>{
	if(req.session.noteid == undefined) return res.send("You don't have any note");

	var note = readNote(req.session.noteid);
	// hmmm, idk if this is really needed.
	res.setHeader("Content-Security-Policy",`default-src 'none'; frame-src 'none'; script-src 'none'; style-src 'none'; connect-src 'none';`);
	res.send(note);
});

app.post("/note",(req,res)=>{
	if(typeof req.body.note != "string" || req.body.note.length > 1000) return res.send("NO");
	if(req.session.noteid != undefined) return res.send("Only one note is allowed");

	const noteid = v4();
	writeNote(noteid,req.body.note);
	req.session.noteid = noteid;
	res.redirect("/");
});

app.delete("/note",(req,res)=>{
	if(req.session.noteid == undefined) return res.redirect("/");

	deleteNote(req.session.noteid);
	req.session.noteid = undefined;
	res.send("OK");
});

app.get("/",(req,res)=>{
	var feature = `window.name=${Date.now()};`;
	var nonce = crypto.randomBytes(32).toString('base64');


	if(req.session.noteid == undefined) {
		res.setHeader("Content-Security-Policy",`default-src 'self'; frame-src 'none'; worker-src 'none'; script-src 'nonce-${nonce}';`);
		if(typeof req.query.feature != "undefined"){
			var t = String(req.query.feature)
			if(t.length < 50 && t.match(/^[A-Za-z0-9=\.]*$/) && !t.includes("on") && !t.includes("ref") && !t.includes("proto") ){
				feature = t;
			}
		}
		return res.send(indexPage.replace("$NONCE$",nonce).replace("$FEATURE$",feature));
	}
	res.setHeader("Content-Security-Policy",`default-src 'self'; frame-src ${noteOrigin}/; script-src 'nonce-${nonce}';`);

	res.send(notePage.replace("$NONCE$",nonce));
});

app.listen(4000,()=>{
	console.log("Listening...");
});