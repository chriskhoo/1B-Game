$(document).ready(function() {
  console.log('JS linked');

  // object with variables for game frame
  var gameVar = {
    // canvas size
    WIDTH : 700,
    HEIGHT : 600,
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
    alpha: gameVar.pi * 0.2,

    // vel : {
    //  x: this.speed*Math.cos(this.alpha),
    //  y: this.speed*Math.sin(this.alpha)
    // },

    // function to draw the player's paddle
    draw: function(){
      gameVar.ctx.fillRect(this.x,this.y,this.width,this.height);
    },

    // function to move ball
    update: function(){
    //  console.log("update ball");

    this.x += this.vel.x;
    this.y += this.vel.y;

    }

  };

  // variables for static net & draw fn
  var net = {
    w : 4,
    y : 0,
    x : (gameVar.WIDTH - 4)/2,
    step: gameVar.HEIGHT/20,

    // function to draw the net
    draw: function(){
      while(this.y<gameVar.HEIGHT){
      gameVar.ctx.fillRect(this.x, this.y, this.w, this.step/2);
      this.y += this.step;
    }
    this.y =0;
    }
  };


  function main() {
    // create a canvas element in HTML
    gameVar.canvas = document.createElement("canvas");
    gameVar.canvas.width = gameVar.WIDTH;
    gameVar.canvas.height = gameVar.HEIGHT;
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
    console.log(ball.vel);
    // draw();

  }


  function gameInit(){
    console.log('game initailized');
    // initial values for moving elements
    player1.x = player1.width;
    player1.y = (gameVar.HEIGHT-player1.height)/2;

    player2.x = gameVar.WIDTH-player1.width-player2.width;
    player2.y = (gameVar.HEIGHT-player2.height)/2;

    ball.x = (gameVar.WIDTH-ball.width)/2;
    ball.y = (gameVar.HEIGHT-ball.height)/2;

    ball.vel = {
      x : 0,
      y : -10
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
    gameVar.ctx.fillRect(0,0,gameVar.WIDTH,gameVar.HEIGHT);

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
