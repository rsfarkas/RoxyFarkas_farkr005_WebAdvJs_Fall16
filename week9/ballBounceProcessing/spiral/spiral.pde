float theta;
float r;
PVector pos;

void setup(){
  size(800,800);
  background(0);
  smooth();
  pos = new PVector(0,0);
}

void draw(){
   pos.x = r*cos(frameCount);
  pos.y = -r*sin(frameCount);
  //framecount will do the same thing as theta
  
  //-r changes the direction
  //pos.x = r*cos(theta);
  //pos.y = r*sin(theta);
  
  fill(0,255,255);
  noStroke();
  ellipse(pos.x+width/2, pos.y + height/2,5,5);
  
  theta+=.1;
  r+=.5;
  
}