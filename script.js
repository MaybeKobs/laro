const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;

let player = {
    x:400,
    y:520,
    width:40,
    height:40,
    speed:7
};

let bullets = [];
let enemies = [];
let stars = [];

for(let i=0;i<100;i++){
    stars.push({
        x:Math.random()*800,
        y:Math.random()*600,
        size:Math.random()*2
    });
}

document.addEventListener("keydown",controls);

function controls(e){
    if(e.key==="ArrowLeft") player.x -= player.speed;
    if(e.key==="ArrowRight") player.x += player.speed;

    if(e.key===" "){
        bullets.push({
            x:player.x,
            y:player.y
        });
    }
}

function spawnEnemy(){
    enemies.push({
        x:Math.random()*760,
        y:-40,
        size:40,
        speed:2+Math.random()*2
    });
}

setInterval(spawnEnemy,1000);

function update(){

    bullets.forEach((b,i)=>{
        b.y -=10;
        if(b.y<0) bullets.splice(i,1);
    });

    enemies.forEach((e,i)=>{
        e.y += e.speed;

        if(e.y>600) enemies.splice(i,1);

        if(
            player.x < e.x+e.size &&
            player.x+player.width > e.x &&
            player.y < e.y+e.size &&
            player.y+player.height > e.y
        ){
            gameOver = true;
        }

        bullets.forEach((b,bi)=>{
            if(
                b.x < e.x+e.size &&
                b.x+5 > e.x &&
                b.y < e.y+e.size &&
                b.y+10 > e.y
            ){
                enemies.splice(i,1);
                bullets.splice(bi,1);
                score+=10;
                document.getElementById("score").innerText="Score: "+score;
            }
        });

    });

    stars.forEach(s=>{
        s.y+=1;
        if(s.y>600) s.y=0;
    });
}

function draw(){

    ctx.clearRect(0,0,800,600);

    ctx.fillStyle="white";
    stars.forEach(s=>{
        ctx.fillRect(s.x,s.y,s.size,s.size);
    });

    ctx.fillStyle="cyan";
    ctx.beginPath();
    ctx.moveTo(player.x,player.y);
    ctx.lineTo(player.x-20,player.y+40);
    ctx.lineTo(player.x+20,player.y+40);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle="lime";
    bullets.forEach(b=>{
        ctx.fillRect(b.x,b.y,4,12);
    });

    ctx.fillStyle="red";
    enemies.forEach(e=>{
        ctx.fillRect(e.x,e.y,e.size,e.size);
    });

    if(gameOver){
        ctx.fillStyle="white";
        ctx.font="50px Arial";
        ctx.fillText("GAME OVER",260,300);
    }
}

function gameLoop(){

    if(!gameOver){
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }else{
        draw();
    }

}

gameLoop();
