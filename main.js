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
  };

  // object with variables for player with optional up and down arrows
  var player1 = {
    // variables for player 1 paddle size
    x: null,
    y: null,
    width: 20,
    height: 100,
    // define player 1 keystates
    upKey : 87,
    downKey : 83,
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
    if(gameVar.keystate[this.upKey]) this.y -= 7;
    if(gameVar.keystate[this.downKey]) this.y += 7;
    }
  };

  // same for player 2
  var player2 = {
    x: null,
    y: null,
    width: 20,
    height: 100,
    // define player 2 keystates
    upKey : 38,
    downKey : 40,

    draw: function(){
      //  console.log("draw player2");
        gameVar.ctx.fillRect(this.x,this.y,this.width,this.height);
      },
    update: function(){
    //  console.log("update player2");
    if(gameVar.keystate[this.upKey]) this.y -= 7;
    if(gameVar.keystate[this.downKey]) this.y += 7;
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

        // calculates relative position of ball on paddle's height
        var ballvsPaddleHeight = (this.y+this.height-this.paddle.y)/(this.paddle.height+this.height);

        /// gives 45 degree if ball hits the edges of the paddle and 90 degree if it hits the middle
        this.alpha = ( (2*ballvsPaddleHeight)-1 ) * gameVar.pi /4;
        this.speed = Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y);
        this.velocity.y = this.speed*Math.sin(this.alpha);
      //
        if(this.velocity.x > 0){
        this.velocity.x = this.speed*Math.cos(this.alpha)*(-1);
        this.x = player2.x - this.width;
      }
        else{
        this.velocity.x = this.speed*Math.cos(this.alpha)*(1);
        this.x += player1.x + player1.width;
        }
      }

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
    document.body.appendChild(gameVar.canvas);

    // activate keystate listeners
    document.addEventListener("keydown", function(evt){
      gameVar.keystate[evt.keyCode] = "true";
      }
    );
    document.addEventListener("keyup", function(evt){
      delete gameVar.keystate[evt.keyCode];
      }
    );

    //initialize game
    gameInit();

    // run the game & continuously update the visuals
    var loop = function (){
      update();
      draw();
      window.requestAnimationFrame(loop);
    };
    loop();
    console.log(ball.velocity);
    // draw();

  }


  function gameInit(){
    console.log('game initailized');
    // initial values for moving elements
    player1.x = player1.width;
    player1.y = (gameVar.canvasHeight-player1.height)/2;

    player2.x = gameVar.canvasWidth-player1.width-player2.width;
    player2.y = (gameVar.canvasHeight-player2.height)/2;

    ball.x = (gameVar.canvasWidth-ball.width)/2;
    ball.y = (gameVar.canvasHeight-ball.height)/2;

    ball.velocity = {
      x : 10,
      y : 0
    };
  }

  // update functions
  function update(){
    ball.update();
    player1.update();
    player2.update();
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
    }

  // launch game
  main();


});
