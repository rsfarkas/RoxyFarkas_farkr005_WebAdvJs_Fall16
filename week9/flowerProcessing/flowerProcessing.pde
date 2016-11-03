int getRandomColor(){
  return color(random(120,255),random(255), random(255));
}

void drawFlower(float x, float y, float flowerSize){
  strokeWeight(flowerSize);
  stroke(getRandomColor());

  translate(x,y);
  for (int i = 0; i<10; i++){
    rotate(TWO_PI/10);
    line(0,0,3 * flowerSize,0);
  }

  strokeWeight(0);
  fill(getRandomColor());
  ellipse(0,0,1.5 * flowerSize,1.5 * flowerSize);
}

void setup(){
  size(800,600);
  background(0);
}

void draw(){
  if(keyPressed == true){
    drawFlower(random(width), random(height),random(5,25));
  }
}