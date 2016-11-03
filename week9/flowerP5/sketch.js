

function setup() {
  createCanvas(800,600);
  background(0);
}

function getRandomColor(){
  return color(random(120,255),random(255), random(255));
}

function drawFlower(x, y, flowerSize){
  strokeWeight(flowerSize);
  stroke(getRandomColor());

  translate(x,y);
   for (var i = 0; i<10; i++){
    rotate(TWO_PI/10);
    line(0,0,3 * flowerSize,0);
  }

  strokeWeight(0);
  fill(getRandomColor());
  ellipse(0,0,1.5 * flowerSize,1.5 * flowerSize);
}

function draw() {
   if(keyIsPressed === true){
    drawFlower(random(width), random(height),random(5,25));
  }
}