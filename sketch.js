var trex, trexRunning, ground, groundImage, invisibleGround, cloudImage, obs1, obs2, obs3, obs4, obs5, obs6, CloudGroup, ObstaclesGroup, gameOver, restart, GOImage, RImage, TCImage, Jsound, Csound, Dsound;
var score = 0;
var Highscore = 0;
var PLAY = 1;
var END= 0;
var gameState = PLAY; 
function preload(){
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  GOImage = loadImage("gameOver.png");
  RImage = loadImage("restart.png");
  TCImage = loadAnimation("trex_collided.png");
  Csound = loadSound ("checkPoint.mp3");
  Dsound = loadSound ("die.mp3");
  Jsound = loadSound ("jump.mp3");
}
function setup() {
  createCanvas(600, 200);
  trex = createSprite(100, 170);
  trex.addAnimation("trexRunning",trexRunning);
  trex.addAnimation("collided", TCImage);
  trex.scale = 0.5;
  trex.x = 50;
  ground = createSprite(100, 170, 400, 10);
  ground.addAnimation("ground",groundImage);
  ground.x = ground.width/2;
  invisibleGround = createSprite(100, 175, 400, 5);
  invisibleGround.visible = false;
  CloudGroup = new Group();
  ObstaclesGroup = new Group();
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver", GOImage);
  gameOver.scale = 0.5;
  restart = createSprite(300,140);
  restart.addImage("restart", RImage);
  restart.scale = 0.4;
  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background(255);
  text("Score:" + score, 450, 25);
  text("HighScore:" + Highscore, 515, 25);
  
  if (gameState === PLAY){
    ground.velocityX = -(6 + 3 * score/100);
    score = score + Math.round(getFrameRate() / 60);
    if(keyDown("space") && trex.y >=149){
      trex.velocityY = -10;
      Jsound.play();
    }
    trex.velocityY = trex.velocityY + 0.5;
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnCloud();
    spawnObstacles();
    if (ObstaclesGroup.isTouching(trex)){
      gameState = END;
      Dsound.play();
    }
    if (score> 0 && score % 100 == 0){
      Csound.play();
    }
  } else if (gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);
    ObstaclesGroup.setLifetimeEach(-1);
    CloudGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    trex.changeAnimation("collided", TCImage);
  }
  
  if (mousePressedOver(restart)){
    reset();
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}
function spawnCloud(){
 if (World.frameCount %60 == 0){
    var cloud = createSprite(600, 120, 40, 10);
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.8;
    cloud.y = random(50, 100); 
    cloud.velocityX = -3;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    CloudGroup.add(cloud);
  }
}
function spawnObstacles(){
  if (World.frameCount % 60 == 0){
    var obstacle = createSprite(600, 155, 10, 40);
    obstacle.velocityX = -(6 + 3 * score/100);
    var rand = Math.round(random(1, 6));
    switch(rand){
      case 1:obstacle.addImage(obs1);
            break;
      case 2:obstacle.addImage(obs2);
            break;
      case 3:obstacle.addImage(obs3);
            break;
      case 4:obstacle.addImage(obs4);
            break;
      case 5:obstacle.addImage(obs5);
            break;
      case 6:obstacle.addImage(obs6);
            break;
      default: break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    ObstaclesGroup.add(obstacle);
  }
}
function reset(){
 gameState = PLAY;
 ObstaclesGroup.destroyEach();
 CloudGroup.destroyEach();
 gameOver.visible = false;
 restart.visible = false;
 trex.changeAnimation("trexRunning", trexRunning);
 if ( Highscore < score ){
   Highscore = score;
 }
  score = 0;
}