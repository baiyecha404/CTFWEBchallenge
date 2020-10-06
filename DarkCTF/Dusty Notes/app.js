var cluster = require('cluster');
if (cluster.isMaster) {
   var i = 0;
   for (i; i< 4; i++){
     cluster.fork();
   }
   cluster.on('exit', function(worker){
      console.log('Worker ' + worker.id + ' died..');
      cluster.fork();
   });
}
else{
  const express = require('express')
  const bodyParser = require('body-parser');
  const app = express();
  var router = express.Router();
  var cookieParser = require('cookie-parser')
  const cons = require('consolidate')

  app.engine('dust', cons.dust);
  app.set('view engine', 'dust')
   
  let note = []
  app.use(cookieParser())
  app.use(express.static(__dirname + '/public'));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(express.static(__dirname + '/public'));

  app.use(bodyParser.urlencoded({ extended: false }));


app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


  app.get('/', function(req, res,next) {

  if(!req.cookies.note){
    note=[]
    note.push({ id: 1, body: 'Hack this' })
    res.cookie('note',note,{maxAge: 900000,httpOnly:true})
  }else{
    note = req.cookies.note
  }     
   res.render('index',{'note':note},function(err,out){
          if(err){
            console.log(err.message);
            console.log("error");
         res.header("Content-Type",'application/json');
            res.json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))));
            next(err)
            process.exit(1);
          }else{
            res.send(out)
          }
        });
  });

  app.get("/addNotes", function (req, res,next) {

      if(!req.cookies.note){
        res.redirect('/')
      }else{
        note = req.cookies.note
        const userNote = {};
        userNote.id = note.length+1;
        userNote.body = req.query.message
        note.push(userNote)
        res.render('index',{'note':note},function(err,out){
          if(err){
            console.log(err);
        res.header("Content-Type",'application/json');
        res.json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))));
            next(err)
          }else{
            res.cookie('note',note,{maxAge: 900000,httpOnly:true})
            res.send(out)
          }
        });
      }      
  });

  app.post('/deleteNote/:id', function (req, res) { 
    if(!req.cookies.note){
        res.redirect('/')
      }else{
        note = req.cookies.note
        const deleteNotes = note.filter(item => item.id != req.params.id);
        note = deleteNotes
        res.cookie('note',note,{maxAge: 900000,httpOnly:true})
        res.redirect('/');
      }
  });
  app.listen(9999);
}