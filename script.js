/* ---------------- CANVAS ---------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ---------------- MENU ---------------- */
const menu = document.getElementById("menu");
const settingsDiv = document.getElementById("settings");
const creditsDiv = document.getElementById("credits");
const pauseDiv = document.getElementById("pauseMenu");

const menuStarsCanvas = document.getElementById("menuStars");
const menuCtx = menuStarsCanvas.getContext("2d");

menuStarsCanvas.width = window.innerWidth;
menuStarsCanvas.height = window.innerHeight;

/* ---------------- AUDIO ---------------- */
const bgMusic = document.getElementById("bgMusic");
const laserSound = document.getElementById("laserSound");

/* ---------------- GAME STATE ---------------- */
let gameRunning = false;
let paused = false;

let score = 0;
let lives = 3;
let level = 1;

let lastShot = 0;
let shootCooldown = 300;

/* ---------------- PLAYER ---------------- */
let player = {
    x: 450,
    y: 520,
    width: 40,
    height: 40,
    speed: 10
};

let bullets = [];
let enemies = [];
let enemyBullets = [];
let explosions = [];
let powerups = [];

let boss = null;

/* ---------------- POWER UPS ---------------- */
let rapidFire = false;
let tripleShot = false;
let shield = false;

/* ---------------- DIFFICULTY ---------------- */
let enemyBaseSpeed = 1.2;
let enemySpawnRate = 2000;
let enemyCountMultiplier = 1;

/* ---------------- STARS ---------------- */
let starsSmall = [];
let starsBig = [];
let nebulaes = [];

for(let i=0;i<150;i++){
    starsSmall.push({
        x:Math.random()*900,
        y:Math.random()*600,
        size:1,
        speed:1
    });
}

for(let i=0;i<80;i++){
    starsBig.push({
        x:Math.random()*900,
        y:Math.random()*600,
        size:2,
        speed:2
    });
}

for(let i=0;i<10;i++){
    nebulaes.push({
        x:Math.random()*900,
        y:Math.random()*600,
        radius:Math.random()*100+50,
        color:`rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.05)`
    });
}

/* ---------------- CONTROLS ---------------- */
let keys = {};

document.addEventListener("keydown", e=>{
    keys[e.key] = true;

    if(e.key==="Escape"){
        togglePause();
    }
});

document.addEventListener("keyup", e=>{
    keys[e.key] = false;
});

/* ---------------- MOBILE CONTROLS ---------------- */
let mobileLeft = false;
let mobileRight = false;

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

leftBtn.addEventListener("touchstart",()=>mobileLeft=true);
leftBtn.addEventListener("touchend",()=>mobileLeft=false);

rightBtn.addEventListener("touchstart",()=>mobileRight=true);
rightBtn.addEventListener("touchend",()=>mobileRight=false);

shootBtn.addEventListener("touchstart",shoot);

/* ---------------- SETTINGS ---------------- */

document.getElementById("playerSpeed").addEventListener("input", e=>{
    player.speed = Number(e.target.value);
});

document.getElementById("enemySpeed").addEventListener("input", e=>{
    enemyBaseSpeed = Number(e.target.value);
});

/* ---------------- MENU ---------------- */

function startGame(){

    menu.style.display="none";

    gameRunning=true;
    paused=false;

    bgMusic.currentTime=0;
    bgMusic.play();
}

function showSettings(){
    menu.style.display="none";
    settingsDiv.style.display="block";
}

function showCredits(){
    menu.style.display="none";
    creditsDiv.style.display="block";
}

function backToMenu(){

    gameRunning=false;
    paused=false;

    settingsDiv.style.display="none";
    creditsDiv.style.display="none";
    pauseDiv.style.display="none";

    menu.style.display="flex";

    bgMusic.pause();
}

function togglePause(){

    if(!gameRunning) return;

    paused=!paused;

    pauseDiv.style.display=paused?"flex":"none";

    if(paused) bgMusic.pause();
    else bgMusic.play();
}

function resumeGame(){

    paused=false;
    pauseDiv.style.display="none";

    bgMusic.play();
}

/* ---------------- SHOOT ---------------- */

function shoot(){

    if(Date.now()-lastShot < shootCooldown) return;

    lastShot = Date.now();

    laserSound.currentTime=0;
    laserSound.play();

    if(rapidFire) shootCooldown = 120;
    else shootCooldown = 300;

    if(tripleShot){

        bullets.push({x:player.x+5,y:player.y});
        bullets.push({x:player.x+20,y:player.y});
        bullets.push({x:player.x+35,y:player.y});

    }else{

        bullets.push({x:player.x+20,y:player.y});

    }

}

/* ---------------- SPAWN ENEMIES ---------------- */

let nextBossLevel = 3;
let finalBossLevel = 7;

function spawnEnemies(){

    if(!gameRunning || paused) return;

    if(level===finalBossLevel && !boss){

        boss={
            x:375,
            y:50,
            maxHealth:250,
            health:250,
            shootTimer:0,
            speed:2
        };

        return;
    }

    if(level%nextBossLevel===0 && !boss){

        boss={
            x:375,
            y:50,
            maxHealth:100+level*20,
            health:100+level*20,
            shootTimer:0,
            speed:1+level*0.2
        };

        return;
    }

    let waveCount = Math.min(1+Math.floor(level/2),5);

    for(let i=0;i<waveCount;i++){

        enemies.push({

            x:Math.random()*820,
            y:-50,

            size:50,

            speed:enemyBaseSpeed + level*0.15,

            type:Math.floor(Math.random()*2),

            pattern:Math.floor(Math.random()*2),

            offset:0

        });

    }

}

setInterval(spawnEnemies,enemySpawnRate);

/* ---------------- UPDATE ---------------- */

function update(){

if(paused) return;

/* difficulty scaling */

enemyBaseSpeed = 1.2 + level*0.2;

/* player movement */

if(keys["ArrowLeft"] || mobileLeft){
    player.x -= player.speed;
}

if(keys["ArrowRight"] || mobileRight){
    player.x += player.speed;
}

if(keys[" "]){
    shoot();
}

/* keep player inside screen */

if(player.x < 20) player.x = 20;
if(player.x > 880) player.x = 880;

/* bullets */

bullets.forEach((b,i)=>{
    b.y -= 10;

    if(b.y<0){
        bullets.splice(i,1);
    }
});

/* enemies */

enemies.forEach((e,i)=>{

    e.y += e.speed;

    if(e.pattern===1){
        e.x += Math.sin(e.offset/20)*3;
    }

    e.offset++;

    if(e.y>600){

        enemies.splice(i,1);

        if(!shield) lives--;

    }

    bullets.forEach((b,bi)=>{

        if(
            b.x < e.x+e.size &&
            b.x > e.x &&
            b.y < e.y+e.size &&
            b.y > e.y
        ){

            explosions.push({
                x:e.x,
                y:e.y,
                size:e.size,
                time:15
            });

            enemies.splice(i,1);
            bullets.splice(bi,1);

            score+=10;

            if(Math.random()<0.05){

                let types=["rapid","shield","triple"];

                powerups.push({
                    x:e.x,
                    y:e.y,
                    type:types[Math.floor(Math.random()*types.length)]
                });

            }

        }

    });

});

/* boss */

if(boss){

    boss.shootTimer++;

    if(boss.shootTimer % 50 ===0){

        for(let i=-1;i<=1;i++){

            enemyBullets.push({

                x:boss.x+75+i*20,
                y:boss.y+80,
                speed:4,
                dx:i*1.5

            });

        }

    }

    boss.x += Math.sin(boss.shootTimer/50)*2;

    bullets.forEach((b,bi)=>{

        if(
            b.x<boss.x+150 &&
            b.x>boss.x &&
            b.y<boss.y+80 &&
            b.y>boss.y
        ){

            boss.health--;

            bullets.splice(bi,1);

            if(boss.health<=0){

                score+=300;

                boss=null;

                level++;

            }

        }

    });

}

/* enemy bullets */

enemyBullets.forEach((b,i)=>{

    b.y += b.speed;
    b.x += b.dx;

    if(b.y>600) enemyBullets.splice(i,1);

    if(
        b.x>player.x &&
        b.x<player.x+50 &&
        b.y>player.y &&
        b.y<player.y+40
    ){

        if(!shield) lives--;

        enemyBullets.splice(i,1);

    }

});

/* powerups */

powerups.forEach((p,i)=>{

    p.y+=2;

    if(
        player.x<p.x+40 &&
        player.x+50>p.x &&
        player.y<p.y+40 &&
        player.y+50>p.y
    ){

        if(p.type==="rapid"){
            rapidFire=true;
            setTimeout(()=>rapidFire=false,5000);
        }

        if(p.type==="shield"){
            shield=true;
            setTimeout(()=>shield=false,5000);
        }

        if(p.type==="triple"){
            tripleShot=true;
            setTimeout(()=>tripleShot=false,5000);
        }

        powerups.splice(i,1);

    }

});

/* HUD */

document.getElementById("score").innerText = score;
document.getElementById("level").innerText = level;

const livesDiv = document.getElementById("livesDisplay");

livesDiv.innerHTML="Lives: ";

for(let i=0;i<lives;i++){

    const life = document.createElement("span");

    life.className="life";
    life.innerHTML="▲";

    livesDiv.appendChild(life);

}

/* game over */

if(lives<=0){

    gameRunning=false;

    setTimeout(()=>{
        alert("GAME OVER! Score: "+score);
        location.reload();
    },200);

}

}

/* ---------------- DRAW ---------------- */

function draw(){

ctx.clearRect(0,0,900,600);

/* background */

let grad = ctx.createLinearGradient(0,0,0,600);
grad.addColorStop(0,"#000010");
grad.addColorStop(1,"#000030");

ctx.fillStyle=grad;
ctx.fillRect(0,0,900,600);

/* nebula */

nebulaes.forEach(n=>{
    ctx.fillStyle=n.color;
    ctx.beginPath();
    ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);
    ctx.fill();
});

/* stars */

starsSmall.forEach(s=>{
    ctx.fillStyle="white";
    ctx.fillRect(s.x,s.y,s.size,s.size);

    s.y+=s.speed;

    if(s.y>600) s.y=0;
});

starsBig.forEach(s=>{
    ctx.fillStyle="lightblue";
    ctx.fillRect(s.x,s.y,s.size,s.size);

    s.y+=s.speed;

    if(s.y>600) s.y=0;
});

/* player */

ctx.fillStyle = shield ? "blue":"cyan";

ctx.beginPath();
ctx.moveTo(player.x,player.y);
ctx.lineTo(player.x-20,player.y+40);
ctx.lineTo(player.x+20,player.y+40);
ctx.closePath();
ctx.fill();

/* bullets */

ctx.fillStyle="lime";
bullets.forEach(b=>ctx.fillRect(b.x,b.y,6,14));

ctx.fillStyle="red";
enemyBullets.forEach(b=>ctx.fillRect(b.x,b.y,6,14));

/* enemies */

enemies.forEach(e=>{
    ctx.fillStyle=e.type===0?"red":"orange";
    ctx.fillRect(e.x,e.y,e.size,e.size);
});

/* boss */

if(boss){

    ctx.fillStyle="purple";
    ctx.fillRect(boss.x,boss.y,150,80);

    ctx.fillStyle="red";
    ctx.fillRect(boss.x,boss.y-10,150*(boss.health/boss.maxHealth),8);

}

/* powerups */

powerups.forEach(p=>{
    ctx.fillStyle="yellow";
    ctx.fillRect(p.x,p.y,40,40);
});

/* explosions */

explosions.forEach((ex,i)=>{

    ctx.fillStyle="orange";

    ctx.globalAlpha = ex.time/15;

    ctx.fillRect(ex.x,ex.y,ex.size,ex.size);

    ctx.globalAlpha = 1;

    ex.time--;

    if(ex.time<=0) explosions.splice(i,1);

});

}

/* ---------------- MENU STARS ---------------- */

function animateMenuStars(){

menuCtx.clearRect(0,0,menuStarsCanvas.width,menuStarsCanvas.height);

starsSmall.forEach(s=>{

    menuCtx.fillStyle="white";
    menuCtx.fillRect(s.x,s.y,s.size,s.size);

    s.y+=s.speed;

    if(s.y>menuStarsCanvas.height){

        s.y=0;
        s.x=Math.random()*menuStarsCanvas.width;

    }

});

requestAnimationFrame(animateMenuStars);

}

animateMenuStars();

/* ---------------- GAME LOOP ---------------- */

function gameLoop(){

if(gameRunning && !paused){
    update();
}

draw();

requestAnimationFrame(gameLoop);

}

gameLoop();
