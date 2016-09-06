var totalScore = 0;

//determine what value is checked 
var checkAnswer = function(){
  if(document.getElementById("1B").checked){
    totalScore += 1;
  } 

  if (document.getElementById("2B").checked){
    totalScore += 1;
  }

   if (document.getElementById("3B").checked){
    totalScore += 1;
  }

   if (document.getElementById("4C").checked){
    totalScore += 1;
  }

  if (document.getElementById("5C").checked){
    totalScore += 1;
  }

  return totalScore;
};

var returnScore = function () {
  var score = checkAnswer();
  document.getElementById('results').innerHTML = "Congratulations! You have answered " + score + "/ 5 correctly!";
};

