function initializeGame() {
    document.getElementById("begin")?.setAttribute("style","display:none");
    ball = {
        x:width/2,
        y:height/2,
        ySpeed:0,
        xSpeed:0,
        radius:25
    }
    ball.xSpeed = (Math.random() * 1000) * (Math.random() < 0.5 ? -1 : 1);
    ball.ySpeed = (Math.random() * 1000) * (Math.random() < 0.5 ? -1 : 1);
    window.requestAnimationFrame(gameLoop);
    isResetting=false;
}

var lastTime = performance.now();
var isResetting = false;
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var ctx : CanvasRenderingContext2D = canvas.getContext("2d")!;
var width = ctx.canvas.clientWidth;
var height = ctx.canvas.clientHeight;
ctx.canvas.width = width;
ctx.canvas.height = height;

const speed = height/100;

ctx.fillStyle = "#191970"
ctx.fillRect(0,0,width,height)
ctx.fillStyle = "#000000"
var player = {
    startY:height/3.25,
    y:height/2.5,
    endY:height/1.75,
}
var computer= {
    startY:height/3.25,
    y:height/2.5,
    endY:height/1.75
}
var ball = {
    x:width/2,
    y:height/2,
    ySpeed:0,
    xSpeed:0,
    radius:25
}
var playerHeight = player.endY-player.startY;
draw();
function draw() {
    //clears canvas
    ctx.clearRect(0,0,width,height)

    //playerLine
    ctx.beginPath();
    ctx.moveTo(10,player.startY)
    ctx.lineTo(10,player.endY)
    ctx.lineWidth=15;
    ctx.stroke()
    ctx.closePath();
    //computer
    ctx.beginPath();
    ctx.moveTo(width-10,computer.startY)
    ctx.lineTo(width-10,computer.endY)
    ctx.lineWidth=15;
    ctx.stroke()
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI)
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (event.key) {
        case "ArrowDown": {
        if(player.endY<=height) {
            player.startY+=speed
            player.endY+=speed
        }
      }
        // code for "down arrow" key press.
        break;
        case "ArrowUp": {
        if(player.startY>=0) {
            player.startY-=speed
            player.endY-=speed
        }
      }
        // code for "up arrow" key press.
        break;
        case "w":
        case "W": {
        if(player.startY>=0) {
            player.startY-=speed
            player.endY-=speed
        }
    }
        break;
        case "s":
        case "S": {
        if(player.endY<=height) {
            player.startY+=speed
            player.endY+=speed
        }
        }
      default:
        return; // Quit when this doesn't handle the key event.
    }
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);
var frameCheck = 10
function moveComputer() {
    

    if(ball.y+ball.radius>=height) {
        ball.y = height-ball.radius
        ball.ySpeed = -ball.ySpeed
    }
    if(ball.y-ball.radius<=0) {
        ball.y = ball.radius
        ball.ySpeed = - ball.ySpeed
    }
    let now=performance.now();
    let deltaTime=(now-lastTime)/1000;
    lastTime=now;
    //ball.y+=ball.ySpeed * deltaTime;
    //ball.x+=ball.xSpeed * deltaTime;
    
    for (let i=0;i<frameCheck;i++) {
        ball.y+=(ball.ySpeed * deltaTime)/frameCheck;
        ball.x+=(ball.xSpeed * deltaTime)/frameCheck;
        if (ball.y>computer.startY+20 && computer.startY>=0) {
            computer.startY+=speed/2
            computer.endY+=speed/2
        }
        if (ball.y<computer.endY-20 && computer.endY<=height) {
            computer.startY-=speed/2
            computer.endY-=speed/2
        }
        if((ball.y >= player.startY && ball.y <= player.endY) && ball.x - ball.radius <= 10) {
        ball.xSpeed *= -1.1
        //ball.xSpeed*=1.001
        }
        if((ball.y >= computer.startY && ball.y <= computer.endY) && ball.x + ball.radius >= width-10) {
            ball.xSpeed *= -1.1
        }
        
        
    }
    if(computer.startY < 0) {
        computer.startY = 0
        computer.endY = playerHeight
    }
    if (computer.endY > height) {
        computer.endY = height
        computer.startY = height-playerHeight
    }
    if(!isResetting) {
        if(ball.x-ball.radius<0) {
            ball.xSpeed = 0;
            ball.ySpeed = 0;
            isResetting=true;
            initializeGame();
        }
        if(ball.x+ball.radius>width) {
            ball.xSpeed=0;
            ball.ySpeed=0;
            isResetting=true;
            initializeGame();
        }
    }
    //console.log("Computer Top: ", computer.startY)
    //console.log("Computer Bottom " + computer.endY)
}
canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    player.startY = mousePos.y - (playerHeight)/2;  // Center the paddle to the mouse's y-position
    player.endY = mousePos.y + (playerHeight)/2;

    if(player.startY < 0) {
        player.startY = 0
        player.endY = playerHeight
    }
    if (player.endY > height) {
        player.endY = height
        player.startY = height-playerHeight
    }
}, false);

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function gameLoop() {
    draw();
    moveComputer();
    window.requestAnimationFrame(gameLoop)
}
