var targets=[];
var distance=0;
var shotTargets=[];
var score=0;
var GAME_WIDTH=640
var GAME_HEIGHT=480
var TARGET_W=20
var TARGET_H=20

function startGame() {
    gamearea.start();
}

function targetGone(){
    for(let i=0;i<targets.length;i++)
        if(targets[i].y>GAME_HEIGHT-TARGET_H) return true;
}

function clickHandler(event) {
    x=event.clientX-gamearea.canvas.offsetLeft;
    y=event.clientY-gamearea.canvas.offsetTop;
    checkTarget(x,y);
}

function checkTarget() {
    for(let i=0;i<targets.length;i++){
        if(x>=targets[i].x && x<=targets[i].x+TARGET_W && y>=targets[i].y && y<=targets[i].y+TARGET_H){
            targets[i].shot=true;
            shotTargets.push(targets[i]);
            targets.splice(i,1);
            score++;
        }
        // else score-=1
        // else vidas-=1
    }
}

var gamearea={
    canvas:document.createElement("canvas"),
    start:function () {
        this.canvas.width=GAME_WIDTH;
        this.canvas.height=GAME_HEIGHT;
        this.canvas.style.backgroundColor="#d3d3d3";
        this.canvas.style.border="3px solid gray";
        this.canvas.style.margin="auto";
        this.canvas.style.display="block";
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        this.context=this.canvas.getContext("2d");
        this.canvas.addEventListener("click",clickHandler,event);
        requestAnimationFrame(gamearea.update);
        gamearea.update();
      },
    update:function () {
        gamearea.context.clearRect(0,0,GAME_WIDTH, GAME_HEIGHT);
        document.getElementById("score").innerText="Puntaje: "+score;
        if(score==10){      gamearea.stop(true);    return; }
        if(targetGone()){   gamearea.stop(false);   return; }
        if(targets.length<1 || targets[targets.length-1].y>=distance){
            var t=new target();
            targets.push(t);
            distance=Math.floor(Math.random()*120);
        }
        for(let i=0;i<targets.length;i++) targets[i].draw();
        // Kill Animation
        if(shotTargets.length>0){
            for(let i=0;i<shotTargets.length;i++) 
                shotTargets[i].draw();
            for(let j=0;j<shotTargets.length;j++)
                if(shotTargets[j].shotCount==15) shotTargets.splice(j,1);
        }
        requestAnimationFrame(gamearea.update);
    },
    stop:function (win) {
        gamearea.canvas.removeEventListener("click",clickHandler,event);
        gamearea.context.fillStyle="black";
        gamearea.context.globalAlpha=0.5;
        gamearea.context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        gamearea.context.globalAlpha=1.0;
        gamearea.context.fillRect(0,100,GAME_WIDTH,100);
        gamearea.context.font="20px Consolas";
        if(win){
            gamearea.context.fillStyle="LawnGreen";
            gamearea.context.fillText("You win!!", (GAME_WIDTH/2)-50 , 150); //+score
        }else{
            gamearea.context.fillStyle="red";
            gamearea.context.fillText("Game over!! Score: "+score, (GAME_WIDTH/2)-110 , 150);
        }
    }
}

class target {
    constructor() {
        this.x = Math.floor(Math.random() * (GAME_WIDTH - TARGET_W));
        this.y = 0;
        this.shot = false;
        this.shotCount = 0;
        this.draw = function () {
            gamearea.context.fillStyle = "black";
            if (this.shot) {
                this.shotCount++;
                gamearea.context.fillRect(this.x, this.y, 4, 4);
                gamearea.context.fillRect(this.x + 4, this.y + 4, 4, 4);
                gamearea.context.fillRect(this.x + 12, this.y + 4, 4, 4);
                gamearea.context.fillRect(this.x + 16, this.y, 4, 4);
                gamearea.context.fillRect(this.x + 4, this.y + 12, 4, 4);
                gamearea.context.fillRect(this.x, this.y + 16, 4, 4);
                gamearea.context.fillRect(this.x + 12, this.y + 12, 4, 4);
                gamearea.context.fillRect(this.x + 16, this.y + 16, 4, 4);
            }
            else {
                gamearea.context.fillRect(this.x, this.y, TARGET_W, TARGET_H);
                this.y += .4;
            }
        };
    }
}
