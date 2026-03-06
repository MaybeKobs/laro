const canvas=document.getElementById("gameCanvas")
const ctx=canvas.getContext("2d")

function resize(){
canvas.width=window.innerWidth
canvas.height=window.innerHeight
}
resize()
window.addEventListener("resize",resize)

const menu=document.getElementById("menu")
const gameOverUI=document.getElementById("gameOver")
const hud=document.getElementById("hud")

const scoreText=document.getElementById("score")
const levelText=document.getElementById("level")

let gameRunning=false

let score=0
let level=1

let player={
x:window.innerWidth/2,
y:window.innerHeight-120,
w:40,
h:60,
speed:8
}

let bullets=[]
let enemies=[]
let particles=[]

/* STAR BACKGROUND */

let stars=[]

for(let i=0;i<250;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*1.5
})
}

/* CONTROLS */

let keys={}

document.addEventListener("keydown",e=>{
keys[e.key]=true
if(e.key===" ") shoot()
})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

canvas.addEventListener("touchmove",e=>{
let t=e.touches[0]
player.x=t.clientX-player.w/2
})

canvas.addEventListener("touchstart",shoot)

/* GAME CONTROL */

function startGame(){
menu.style.display="none"
canvas.style.display="block"
hud.style.display="block"
gameRunning=true
}

function restartGame(){
location.reload()
}

/* SHOOT */

function shoot(){

if(!gameRunning) return

bullets.push({
x:player.x+player.w/2,
y:player.y,
speed:12
})

}

/* ENEMY SPAWN */

setInterval(()=>{

if(!gameRunning) return

enemies.push({
x:Math.random()*canvas.width,
y:-40,
size:40,
speed:1.5+level*0.6
})

},1200)

/* DRAW STARS */

function drawStars(){

ctx.fillStyle="white"

stars.forEach(s=>{

ctx.fillRect(s.x,s.y,s.size,s.size)

s.y+=s.speed

if(s.y>canvas.height){
s.y=0
s.x=Math.random()*canvas.width
}

})

}

/* PLAYER SHIP */

function drawPlayer(){

ctx.fillStyle="cyan"

ctx.beginPath()

ctx.moveTo(player.x,player.y+player.h)
ctx.lineTo(player.x+player.w/2,player.y)
ctx.lineTo(player.x+player.w,player.y+player.h)
ctx.lineTo(player.x+player.w/2,player.y+player.h-10)

ctx.closePath()
ctx.fill()

}

/* BULLETS */

function drawBullets(){

ctx.fillStyle="red"

bullets.forEach((b,i)=>{

ctx.shadowColor="red"
ctx.shadowBlur=10

ctx.fillRect(b.x,b.y,4,15)

ctx.shadowBlur=0

b.y-=b.speed

if(b.y<0) bullets.splice(i,1)

})

}

/* EXPLOSION PARTICLES */

function createExplosion(x,y){

for(let i=0;i<15;i++){
particles.push({
x:x,
y:y,
vx:(Math.random()-0.5)*6,
vy:(Math.random()-0.5)*6,
life:30
})
}

}

function drawParticles(){

ctx.fillStyle="orange"

particles.forEach((p,i)=>{

ctx.fillRect(p.x,p.y,3,3)

p.x+=p.vx
p.y+=p.vy

p.life--

if(p.life<=0) particles.splice(i,1)

})

}

/* ENEMIES */

function drawEnemies(){

ctx.fillStyle="lime"

enemies.forEach((e,ei)=>{

ctx.fillRect(e.x,e.y,e.size,e.size)

e.y+=e.speed

/* bullet collision */

bullets.forEach((b,bi)=>{

if(
b.x<e.x+e.size &&
b.x>e.x &&
b.y<e.y+e.size &&
b.y>e.y
){

createExplosion(e.x,e.y)

enemies.splice(ei,1)
bullets.splice(bi,1)

score++
scoreText.innerText=score

if(score%12===0){
level++
levelText.innerText=level
}

}

})

/* player collision */

if(
player.x<e.x+e.size &&
player.x+player.w>e.x &&
player.y<e.y+e.size &&
player.y+player.h>e.y
){

gameRunning=false
canvas.style.display="none"
hud.style.display="none"
gameOverUI.style.display="block"

}

})

}

/* MOVE PLAYER */

function movePlayer(){

if(keys["ArrowLeft"] && player.x>0){
player.x-=player.speed
}

if(keys["ArrowRight"] && player.x<canvas.width-player.w){
player.x+=player.speed
}

}

/* GAME LOOP */

function game(){

ctx.clearRect(0,0,canvas.width,canvas.height)

if(gameRunning){

drawStars()
movePlayer()
drawPlayer()
drawBullets()
drawEnemies()
drawParticles()

}

requestAnimationFrame(game)

}

game()

