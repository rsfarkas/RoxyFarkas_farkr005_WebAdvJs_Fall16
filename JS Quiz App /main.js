var totalScore = 0;

//determine what value is checked 
var checkAnswer = function(){
  if(document.getElementById("1B").checked){
    totalScore += 1;
  } 

  if (document.getElementById("2B").checked){
    totalScore += 1;
  }

   if (document.getElementById("3C").checked){
    totalScore += 1;
  }

   if (document.getElementById("4A").checked){
    totalScore += 1;
  }

  if (document.getElementById("5D").checked){
    totalScore += 1;
  }

  return totalScore;
};

var returnScore = function () {
  var score = checkAnswer();
  document.getElementById('results').innerHTML = score + "/ 5!";
};


