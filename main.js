$(document).ready(function() {
  console.log('JS linked');

  // object with variables for game frame
  var gameVar = {
    // canvas size
    canvasWidth : 700,
    canvasHeight : 600,
    pi: Math.PI,
    // need a canvas and ctx variable to draw rectangles
    canvas : null,
    ctx: null,
    // define an object for the keystates
    keystate: {},
    player1Score: 0,
    player2Score: 0,
    playerService: 0
  };

  // object with variables for player with optional up and down arrows
  var player1 = {
    // variables for player 1 paddle size
    x: null,
    y: null,
    width: 20,
    height: 100,
    // define player 1 keystates for w & s & q
    upKey : 87,
    downKey : 83,
    serveKey : 81,
    // optional name
    // optional keystrokes
    draw: function(){
      // function to draw the player's paddle
      //  console.log("draw player1");
        gameVar.ctx.fillRect(this.x,this.y,this.width,this.height);
      },
    update: function(){
      // function to move player paddle
    //  console.log("update player1");
    if(gameVar.keystate[this.upKey]) {this.y -= 7;}
    if(gameVar.keystate[this.downKey]) {this.y += 7;}
    // limit movement to the edges of the screen
    this.y = Math.max(Math.min(this.y, gameVar.canvasHeight - this.height),0);
    }
  };

  // same for player 2
  var player2 = {
    x: null,
    y: null,
    width: 20,
    height: 100,
    // define player 2 keystates for o & l & p
    upKey : 79,
    downKey : 76,
    serveKey : 80,

    draw: function(){
      //  console.log("draw player2");
        gameVar.ctx.fillRect(this.x,this.y,this.width,this.height);
      },
    update: function(){
    //  console.log("update player2");
    if(gameVar.keystate[this.upKey]) {this.y -= 7;}
    if(gameVar.keystate[this.downKey]) {this.y += 7;}
    // limit movement to the edges of the screen
    this.y = Math.max(Math.min(this.y, gameVar.canvasHeight - this.height),0);
    }
  };


  // ball
  var ball = {
    x: null,
    y: null,
    width: 20,
    height: 20,
    speed: 0,
    velocity: 0,
    alpha: gameVar.pi * 0.2,
    paddle: 0,
    serveSpeed: 10,

    // function to draw the player's paddle
    draw: function(){
      gameVar.ctx.fillRect(this.x,this.y,this.width,this.height);
    },

    // function to move ball
    update: function(){
    //  console.log("update ball");

    // ball moves according to velocity vectors
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.wallBounce();
    this.paddleIntersectionCheck();
    this.checkPlayer();
    this.paddleIntersection();
    this.checkOut();
    this.hitServe();

  },

    // ball bounces off walls
    wallBounce: function(){
      if( this.y < 0 || this.y+this.height > gameVar.canvasHeight){
        // compensate for distance travelled past borders
        var offset;
        if(this.velocity.y<0){
          offset = 0 - this.y;
        }
        else{
          offset = gameVar.canvasHeight - this.y - this.height;
        }
        this.y += 2 * offset;

        // perfect elastic collision
        this.velocity.y *= -1;
      }
    },

    // ball bouncing off paddles
    paddleIntersectionCheck: function(paddlex, paddley, paddleWidth, paddleHeight, ballx, bally, ballWidth, ballHeight){
      if(paddlex < ballx+ballWidth && paddlex + paddleWidth > ballx && paddley < bally+ballHeight  && paddley + paddleHeight > bally){
        return true;
      }
      else{
          return false;
      }
    },

    // check which paddle
    checkPlayer: function(){
      if(this.velocity.x > 0){
        this.paddle = player2;
      }
      else{
        this.paddle = player1;
      }
    },

    // paddle bounce
    paddleIntersection: function(){
      if (this.paddleIntersectionCheck(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, this.x, this.y, this.width, this.height)){
        // perpendicular bounce
        //  this.velocity.x *= -1;

        // calculates relative position of ball on paddle's height (value ranges from 0 to 1)
        var ballvsPaddleHeight = (this.y+this.height-this.paddle.y)/(this.paddle.height+this.height);

        /// gives 45 degree if ball hits the edges of the paddle and 90 degree if it hits the middle
        this.alpha = ( (2*ballvsPaddleHeight)-1 ) * gameVar.pi /4;

        // calc speed from velocity vectors
        this.speed = Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y);

        // increase the speed of the ball if it strikes the edges of the bar
        if(ballvsPaddleHeight < 0.3 || ballvsPaddleHeight > 0.7){
          this.speed *= 1.3;
        }

        // re-assign velocity vectors based on where the ball lands on the paddle
        this.velocity.y = this.speed*Math.sin(this.alpha);
        // ball departs from paddle (no offset)
        if(this.velocity.x > 0){
        this.velocity.x = this.speed*Math.cos(this.alpha)*(-1);
        this.x = player2.x - this.width;
      }
        else{
        this.velocity.x = this.speed*Math.cos(this.alpha)*(1);
        this.x += player1.x + player1.width;
        }
      }
    },
    checkOut: function(){
      // ball restarts if it goes out of play
      if (this.x + this.width < 0) {
        gameVar.playerService = 1;
        gameVar.player2Score++;
        // keep ball out of screen and out of count score condition
        this.x = -this.width;
        this.velocity.x = 0;

      }
      else if (this.x > gameVar.canvasWidth) {
        gameVar.playerService = 2;
        gameVar.player1Score++;
        this.x = gameVar.canvasWidth;
        this.velocity.x = 0;

      }
    },

    hitServe: function(){
      if (gameVar.playerService == 1){

        if(gameVar.keystate[player1.serveKey]) {
        this.serveBall1();
        gameVar.playerService = 0;
        }
      }
      else if (gameVar.playerService == 2) {
        if(gameVar.keystate[player2.serveKey]) {
        this.serveBall2();
        gameVar.playerService = 0;
        }
      }
    },

    drawInstructions: function(){
      if (gameVar.playerService == 1){
        gameVar.ctx.fillText("Player 1: Press Q to serve", gameVar.canvasWidth/2, gameVar.canvasHeight/2);
      }
      else if (gameVar.playerService == 2) {
        gameVar.ctx.fillText("Player 2: Press P to serve", gameVar.canvasWidth/2, gameVar.canvasHeight/2);
      }
    },

    serveBall1: function(){
      // if(gameVar.keystate[player1.serveKey]) {
        this.serveSpeed = $("#serveSpeed").val();
        this.x = player1.x+player1.width;
        this.y = player1.y+player1.height/2;
        // keep angle between 45-135 degrees
        this.beta = gameVar.pi/2*(2-Math.random())/2;
        this.speed = this.serveSpeed;
        // sin is +'ve from 0 to pi, cos is -'ve 1 to +'ve 1
        this.velocity = {
          x : this.speed*Math.sin(this.beta),
          y : this.speed*Math.cos(this.beta)
        };
    },

    serveBall2: function(){
        this.serveSpeed = $("#serveSpeed").val();
        this.x = player2.x - this.width;
        this.y = player2.y+player2.height/2;
        this.beta = gameVar.pi/2*(2-Math.random())/2;
        this.speed = this.serveSpeed;
        this.velocity = {
          x : this.speed*Math.sin(this.beta)*(-1),
          y : this.speed*Math.cos(this.beta)
        };
    }

  };

  // variables for static net & draw fn
  var net = {
    w : 4,
    y : 0,
    x : (gameVar.canvasWidth - 4)/2,
    step: gameVar.canvasHeight/20,

    // function to draw the net
    draw: function(){
      while(this.y<gameVar.canvasHeight){
      gameVar.ctx.fillRect(this.x, this.y, this.w, this.step/2);
      this.y += this.step;
      }
    this.y =0;
    }

  };


  function main() {
    // create a canvas element in HTML
    gameVar.canvas = document.createElement("canvas");
    gameVar.canvas.width = gameVar.canvasWidth;
    gameVar.canvas.height = gameVar.canvasHeight;
    gameVar.ctx = gameVar.canvas.getContext("2d");
    document.getElementById('game').appendChild(gameVar.canvas);

    // activate keystate listeners
    document.addEventListener("keydown", function(evt){
      gameVar.keystate[evt.keyCode] = "true";
      }
    );
    document.addEventListener("keyup", function(evt){
      delete gameVar.keystate[evt.keyCode];
      }
    );


    // define pause and unpause functions;
    var pause = function(){
      this.id = "unpauseButton";
      this.innerHTML = "Unpause";
      this.addEventListener("click", unPause);
      this.removeEventListener("click", pause);
      console.log('pause');
      window.cancelAnimationFrame(pauseId);
    };
    var unPause = function(){
      this.id = "pauseButton";
      this.innerHTML = "Pause";
      this.addEventListener("click", pause);
      this.removeEventListener("click", unPause);
      console.log('unpause');
      pauseId = window.requestAnimationFrame(loop);
    };

    // activate pause buttons
    document.getElementById("pauseButton").addEventListener("click", pause);

    //initialize game
    gameInit();
    var pauseId;
    // run the game & continuously update the visuals
    var loop = function (){
      update();
      draw();
      pauseId = window.requestAnimationFrame(loop);
    };
    pauseId = window.requestAnimationFrame(loop);



  }

  function gameInit(){
    console.log('game initailized');
    // initial values for moving elements
    player1.x = player1.width;
    player1.y = (gameVar.canvasHeight-player1.height)/2;

    player2.x = gameVar.canvasWidth-player1.width-player2.width;
    player2.y = (gameVar.canvasHeight-player2.height)/2;

    // random serve
    gameVar.playerService= 1;
  }

  function scoreUpdate(){
    $("#player1Score").html(gameVar.player1Score);
    $("#player2Score").html(gameVar.player2Score);
  }

  // update functions
  function update(){
    ball.update();
    player1.update();
    player2.update();
    scoreUpdate();
    // console.log($("#serveSpeed").val());
  }

  function draw(){
  //  console.log('draw box');
  // screen
    gameVar.ctx.fillStyle = "#000000";
    gameVar.ctx.fillRect(0,0,gameVar.canvasWidth,gameVar.canvasHeight);

  // draw new positions of ball and players
    gameVar.ctx.fillStyle = "#ffffff";
    ball.draw();
    player1.draw();
    player2.draw();
    net.draw();

    gameVar.ctx.font = "30px Helvetica";
    gameVar.ctx.textAlign = "center";
    gameVar.ctx.textBaseline = "center";
    ball.drawInstructions();
    }

  // launch game
  main();


});
