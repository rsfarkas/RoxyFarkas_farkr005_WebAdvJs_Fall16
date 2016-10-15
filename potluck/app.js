/*---------- BASIC SETUP ----------*/
var express = require('express'),
  bodyParser = require('body-parser'),
  MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID;
  // var $ = require('jQuery');

var app = express();
var db;

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Express server
app.use(function(req, res, next) {
  // Setup a Cross Origin Resource sharing
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('incoming request from ---> ' + ip);
  var url = req.originalUrl;
  console.log('### requesting ---> ' + url); // Show the URL user just hit by user
  next();
});

app.set('view engine', 'ejs')
app.use('/', express.static(__dirname + '/public'));
/*---------------------------------*/

/*-------------- APP --------------*/

// MONGO SETUP
var uri = 'mongodb://admin:admin@ds053146.mlab.com:53146/potlucky';

MongoClient.connect(uri, function(err, database){
  if (err) return console.log(err);
  db = database;
  console.log("Database connection ready");

  var guests = db.collection('guests');

  // ROUTERS
  app.get('/', function(req, res){
    guests.find().toArray(function(err, result){
      if (err) return console.log(err);
      res.render('index.ejs', {guests: result})
    });
  });

  app.post('/guests', function(req, res){
    console.log(req.body);
    guests.save(req.body, function(err, result){
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/')
    });
    // $("#signup").click(function(){
    //   $(".signup").css("display","block");
    //   $(".menuPage").css("display","none");
    //   $("#hero").css("display","none");
    // });
  });


  app.delete("/guests/:id", function(req, res) {
    guests.deleteOne({_id: ObjectID(req.params.id)}, function(err, result) {
      if (err) return console.log(err);
      res.status(204).end();
    });
  });

  var PORT = 3000;
  app.listen(PORT, function(){
    console.log('Express server is running at ' + PORT);
  });

});
