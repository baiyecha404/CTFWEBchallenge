const express = require("express");
const crypto = require("crypto");
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

const app = express();
const mainOrigin = process.env.MAIN_URL || "http://127.0.0.1:4000"
const authToken = process.env.AUTH_TOKEN || "1337";
const captcha_secret_key = process.env.CAPTCHA_SECRET_KEY || "No";
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

app.use(bodyParser.urlencoded({
	extended : true
}));

const isUrlValid = function(url){
	try{
		url = new URL(url);
	} catch(e){
		return false;
	}

	if(url.protocol != "http:" && url.protocol != "https:") return false;
	return true;
}

const crawl = async function(url){
	const browser = await puppeteer.launch({pipe:true,args: ['--js-flags=--noexpose_wasm']}); // THIS IS A WEB CHALLENGEEEEEEE 

 	try{
 		const page = await browser.newPage();
	 	await page.goto(mainOrigin,{
      		timeout: 1000
    	});
		await page.setCookie({"name":"auth","value":authToken,"sameSite":"Strict","httpOnly":true,"secure":false});
		await page.goto("about:blank",{
      		timeout: 1000
    	});
		await page.goto(url,{
      		timeout: 1000
    	});
    	await wait(3000);
	} catch(e){
	}
 	
	await browser.close();
}

app.get("/",(req,res)=>{
	var nonce = crypto.randomBytes(32).toString('base64');
	res.setHeader("Cache-Control","no-store, max-age=0");
	res.setHeader("Content-Security-Policy",`default-src ${mainOrigin}/; worker-src 'none'; frame-ancestors ${mainOrigin}/; script-src 'nonce-${nonce}' ${mainOrigin}/ `);
	return res.send(`
		<html>
			<head>
				<title>Note viewer</title>
				<script nonce="${nonce}">
					window.onmessage = (e)=>{
						if(e.data.type == "note" && e.origin == "${mainOrigin}"){
							document.body.innerHTML = e.data.note;
						}
					}
				</script>
			</head>
			<body>
			</body>
		</html>
	`);
});

app.get("/report",(req,res)=>{
	return res.sendFile(__dirname + "/templates/report.html");
});

app.post("/report",(req,res)=>{
	var token = req.body["g-recaptcha-response"];
	var url = req.body["url"];

	if(!token || !url || !String(token).match(/^[0-9a-zA-Z_-]+$/) ){
		return res.send("No captcha");
	}
    token = String(token);

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${captcha_secret_key}&response=${token}`, {
        method: 'post'
    })
    .then(response => response.json())
    .then(r => {
    	if(r.success == true){
    		url = String(url);
    		if(isUrlValid(url)){
    			crawl(url);
	    		res.send("OK");
    		} else {
	    		res.send("Url is not valid!");
    		}
    	} else {
			res.send("No");
    	}
    })
    .catch(error => res.send("No"));
});

app.listen(4001,()=>{
	console.log("Listening...");
});