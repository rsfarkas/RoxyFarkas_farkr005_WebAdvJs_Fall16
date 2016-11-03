function setup() {
  createCanvas (500,500);
  pos = createVector (width/2,0);
  vel = createVector (0,1.0);
  acc = createVector (0, 0.3);
  
}

function draw() {
  
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