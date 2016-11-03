PVector pos;
PVector vel;
PVector acc;

void setup(){
  size (500,500);
  pos = new PVector (width/2,0);
  vel = new PVector (0,1.0);
  acc = new PVector (0, 0.3);
}

void draw(){
   background(255);
  
  fill(0);
  
  ellipse(pos.x,pos.y,50,50);
  
  if(pos.y >= height){
    vel.y *= -1;
  }
  
  vel.add(acc);
  //pos.add(vel);
   pos.y = pos.y + vel.y;
   
}