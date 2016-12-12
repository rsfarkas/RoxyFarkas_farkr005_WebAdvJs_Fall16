// Credit: Gabriel Gianordoli
//Credit: Umi Syam
/*---------- BASIC SETUP ----------*/
var express =  require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var PORT = 4000;
var db;

/*-------------- APP SETUP --------------*/

// Express server
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var url = req.originalUrl;
  next();
});

app.use('/', express.static(__dirname + '/public'));

/*-------------- MONGODB --------------*/
var uri = 'mongodb://admin:admin@ds127428.mlab.com:27428/sockpoll';

MongoClient.connect(uri, function(err, database){
  if (err) return console.log(err);
  db = database;
  console.log("Database connection ready");

  var Surveys = db.collection('surveys');

  /*-------------- SOCKET.IO + SERVER SETUP --------------*/
  var server = require('http').Server(app);
  var io = require('socket.io')(server);

  server.listen(PORT, function(){
    console.log('Express server is running at ' + PORT);
  });

  var polls = {};

  /*-------------- INITIATE SOCKET CONNECTION --------------*/
  io.on('connection', function(socket) {

    console.log('A new user has connected: ' + socket.id);

    // Listeners
    socket.on('index', function() {

      leaveAllPolls(socket);

      socket.emit('poll-list', {
        polls: polls
      });
    });

    // Creating a new poll
    socket.on('create-poll', function(data) {

      var id = createId(7);

      polls[id] = {
        _id: id,
        name: data.pollName,
        choiceOne: data.choiceOne,
        choiceTwo: data.choiceTwo,
        choiceThree: data.choiceThree,
        votesOne:0,
        votesTwo:0,
        votesThree:0,
        members: 0
      };

      Surveys.save(polls[id], function(err, result){
        if (err) return console.log(err);
        console.log('saved to database');
      });

      console.log('New poll id: ' + id + ', name: ' + polls[id].name);

      socket.emit('poll-list', {
        polls: polls
      });
    });

    // Joining a poll
    socket.on('poll', function(pollId){
      console.log('User ' + socket.id + ' is joining poll ' + pollId);
      socket.join(pollId);
      polls[pollId].members ++;
      socket.emit('joined-poll', { poll: polls[pollId] });
    });

    // Sending msgs over socket connection
    socket.on('msg-to-server', function(msg) {

      var array_keys = [];
      var array_values = [];

      for (var key in socket.rooms){
        array_keys.push(key);
        array_values.push(socket.rooms[key]);
      }

      var pollId = array_values[1];
      io.to(pollId).emit('loading-data', {});
      var voteDict = {0:"votesOne", 1:"votesTwo", 2:"votesThree"}
      function voteLookup(msg) {
        var tmp = msg - 1;
        return voteDict[tmp]
      };

      var key = voteLookup(msg);
      obj = {};
      obj[key] = 1;

      //update
      Surveys.update({ _id: pollId},  {$inc: obj}, function(err, result){
        if (err) return console.log(err);
      });

      function readMongo(id){
        Surveys.find({ _id: id }).toArray(function(err, result){
          if (err) return console.log(err);
          io.to(pollId).emit('msg-to-clients', {
            msg: msg,
            pollId: pollId,
            blob: result[0]
          });
        });
      };

      setTimeout(function(){
        readMongo(pollId) },100);
    });

    // Disconnecting
    socket.on('disconnect', function() {
      leaveAllPolls(socket);
    });
  });

  function leaveAllPolls(socket){;

    var array_keys = new Array();
    var array_values = new Array();

    for (var key in socket.rooms){
      array_keys.push(key);
      array_values.push(socket.rooms[key]);
    }

    for(var i = 1; i < array_values.length; i++){
      var pollId = array_values[i];
      socket.leave(pollId);
      polls[pollId].members --;
    }
  };

  // https://gist.github.com/gordonbrander/2230317
  function createId(n) {
    return Math.random().toString(36).substr(2, n);
  }
});
