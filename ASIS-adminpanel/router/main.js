module.exports = function(app, db, fs){
    app.get('/', function(req, res){
        res.render('index.html')
    });

    app.post('/login', function(req, res){
        var user = {};
        var tmp = req.body;
        var row;

        if(typeof tmp.pw !== "undefined"){
            tmp.pw = tmp.pw.replace(/\\/gi,'').replace(/\'/gi,'').replace(/-/gi,'').replace(/#/gi,'');
        }

        for(var key in tmp){
            user[key] = tmp[key];
        }

        if(req.connection.remoteAddress !== '::ffff:127.0.0.1' && tmp.id === 'admin' || typeof user.id === "undefined"){
            user.id = 'guest';
        }
        req.session.user = user.id;

        if(typeof user.pw !== "undefined"){
            row = db.prepare(`select pw from users where id='admin' and pw='${user.pw}'`).get();
            if(typeof row !== "undefined"){
                req.session.isAdmin = (row.pw === user.pw);
            }else{
                req.session.isAdmin = false;
            }
            if(req.session.isAdmin && req.session.user === 'admin'){
                res.statusCode = 302;
                res.setHeader('Location','admin');
                res.end();
            }else{
                res.end("Access Denied!");
            }
        }else{
            res.end("No password given.");
        }
    });

    app.get('/admin', function(req, res){
        if(typeof req.session.isAdmin !== "undefined" && req.session.isAdmin && req.session.user === 'admin'){
            if(typeof req.query.test !== "undefined"){
                res.render(req.query.test);
            }else{
                res.render("admin.html");
            }
        }else{
            res.end("Access Denied!");
        }
    });

    app.post('/upload', function(req, res){
        if(typeof req.session.isAdmin !== "undefined" && req.session.isAdmin && req.session.user === 'admin'){
            if(typeof req.body.name !== "undefined" && typeof req.body.file !== "undefined"){
                var fname = req.body.name;
                var dir = './views/upload/'+req.session.id;
                var contents = req.body.file;

                !fs.existsSync(dir) && fs.mkdirSync(dir);
                fs.writeFileSync(dir+'/'+fname, contents);
                res.end("Done.");
            }else{
                res.end("Something's wrong");
            }
        }else{
            res.end("Permission Denied!");
        }
    });
}
