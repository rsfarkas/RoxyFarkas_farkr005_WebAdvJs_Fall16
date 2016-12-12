var app = app || {};

app.main = (function() {
  var socket;

  var socketSetup = function(callback){
    socket = io.connect();

    socket.on('poll-list', function(res) {
      render('index', '#main-container', 'replace', res.polls);
    });

    socket.on('joined-poll', function(res) {
      render('poll', '#main-container', 'replace', {poll: res.poll});
    });

    socket.on('loading-data', function(res) {
      render('loader', '#vote-container', 'replace', {});
    });

    socket.on('msg-to-clients', function(res) {
      render('vote-item', '#vote-container', 'replace', {});
      var localArray = [];

      createArr(res.blob.choiceOne, res.blob.votesOne, 0, localArray);
      createArr(res.blob.choiceTwo, res.blob.votesTwo, 1, localArray);
      createArr(res.blob.choiceThree, res.blob.votesThree, 2, localArray);

      var dThreeCaller = function() {
        redraw(settings, localArray);
      };

      loadScript("../js/charting.js", dThreeCaller);
    });
  }

  var hashRouter = function(){
    $(window).off('hashchange').on('hashchange', function() {
      var currentPage = location.hash.substring(2, location.hash.length);

      if(currentPage === 'index'){
        loadData(currentPage);

      }else if(currentPage.indexOf('/') > -1){
        pollId = currentPage.substring(currentPage.indexOf('/') + 1);
        currentPage = currentPage.substring(0, currentPage.indexOf('/'));
        loadData(currentPage, pollId);
      }
    });
  }

  var loadData = function(template, data){
    console.log('Loading data for: ' + template);
    if(data !== undefined){
      console.log('Data: ' + data);
    }

    socket.emit(template, data);
  };

  var render = function(template, containerElement, method, data){
    console.log(method + ' ' + template + ' in ' + containerElement);
    if(data !== undefined){
      console.log(data);
    }

    var templateToCompile = $('#tpl-' + template).html();

    var compiled =  _.template(templateToCompile);

    if(method === 'replace'){
      $(containerElement).html(compiled({data: data}));
    }else if(method === 'append'){
      $(containerElement).append(compiled({data: data}));
    }

    var objDiv = document.getElementById("main-container");
    objDiv.scrollTop = objDiv.scrollHeight;

    attachEvents();
  };

  var attachEvents = function(){
    console.log('Called attachEvents.');

    $('#js-btn-create-poll').off('click').on('click', function() {
      createPoll();
    });

    $('#js-btn-vote-radio').off('click').on('click', function() {
      sendVote();
    });
  };

  var createPoll = function(){
    var pollName = $('#js-ipt-poll-name').val();
    var choiceOne = $('#js-ipt-poll-choiceOne').val();
    var choiceTwo = $('#js-ipt-poll-choiceTwo').val();
    var choiceThree = $('#js-ipt-poll-choiceThree').val();
    if(pollName.length > 0){
      socket.emit('create-poll', {pollName: pollName, choiceOne: choiceOne, choiceTwo: choiceTwo, choiceThree: choiceThree});
    }
  }

  var sendVote = function(){
    var ballot = $('#ballot input:radio:checked').val();
    socket.emit('msg-to-server', ballot);
    $('#ballot').remove();
  };

  //http://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
  function loadScript(url, callback)
  {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
  }

  function createArr(key, value, index, array) {
    array[index] = {
      key: key,
      value: value
    };
  };

  var init = function(){

    console.log('Initializing app.');

    hashRouter();
    socketSetup();
    attachEvents();
    location.hash = '/index';
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);
