const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const JWTHelper = require('../helpers/JWTHelper');
const DBHelper = require('../helpers/DBHelper');

router.get('/', AuthMiddleware, async (req, res, next) => {
    try{
        let user = await DBHelper.getUser(req.data.username);
        if (user === undefined) {
            return res.send(`user ${req.data.username} doesn't exist in our database.`);
        }
        return res.render('index.html', { user });
    }catch (err){
        return next(err);
    }
});

router.get('/auth', (req, res) => 
    res.render('auth.html', { query: req.query }));

router.get('/d424054dbc38c73ca9f81ad711b5588c', (req, res) => 
    res.render('admin.html', { query: req.query }));

router.post('/d424054dbc38c73ca9f81ad711b5588c', (req, res)=>{
        const passcode = req.body.passcode;
        const secret = fs.readFileSync('passcode.txt','utf8').trim();
		if (typeof passcode  == "string" && !secret.search(passcode) && secret === passcode){
			 return res.end("Hello ADMIN!");
		} else {
			 return res.end("No enter the correct passcode Plz");
        }
});


router.get('/logout', (req, res) => {
    res.clearCookie('session');
    return res.redirect('/auth');
});

router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    if((username !== undefined && username.trim().length === 0) 
        || (password !== undefined && password.trim().length === 0)){
        return res.redirect('/auth');
    }
    if(req.body.register !== undefined){
        let canRegister = await DBHelper.checkUser(username);
        if(!canRegister){
            return res.redirect('/auth?error=Username already exists');
        }
        DBHelper.createUser(username, password);
        return res.redirect('/auth?error=Registered successfully&type=success');
    }

    // login user
    let canLogin = await DBHelper.attemptLogin(username, password);
    if(!canLogin){
        return res.redirect('/auth?error=Invalid username or password');
    }
    let token = await JWTHelper.sign({
        username: username.replace(/'/g, "\'\'").replace(/"/g, "\"\"")
    })
    res.cookie('session', token, { maxAge: 900000 });
    return res.redirect('/');
});

module.exports = router;