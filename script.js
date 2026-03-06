const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const menu = document.getElementById("menu")
const gameOverUI = document.getElementById("gameOver")
const hud = document.getElementById("hud")

const scoreDisplay = document.getElementById("score")
const levelDisplay = document.getElementById("level")

function resizeCanvas(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

let gameRunning=false

let score=0
let level=1

let player={
x:window.innerWidth/2,
y:window.innerHeight-120,
width:40,
height:60,
speed:8
}

let bullets=[]
let enemies=[]
let stars=[]

for(let i=0;i<200;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
})
}

let keys={}

document.addEventListener("keydown",e=>{
keys[e.key]=true

if(e.key===" "){
shoot()
}
})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

/* MOBILE CONTROL */
canvas.addEventListener("touchmove",e=>{
let touch=e.touches[0]
player.x=touch.clientX-player.width/2
})

canvas.addEventListener("touchstart",shoot)

function shoot(){
if(!gameRunning) return

bullets.push({
x:player.x+player.width/2,
y:player.y,
speed:10
})
}

function startGame(){

menu.style.display="none"
canvas.style.display="block"
hud.style.display="block"

gameRunning=true
}

function restartGame(){
location.reload()
}

/* enemy spawn */

setInterval(()=>{

if(!gameRunning) return

enemies.push({
x:Math.random()*canvas.width,
y:-40,
size:40,
speed:1 + level*0.5
})

},1200)

/* stars */

function drawStars(){

ctx.fillStyle="white"

stars.forEach(star=>{

ctx.fillRect(star.x,star.y,star.size,star.size)

star.y+=1

if(star.y>canvas.height){
star.y=0
star.x=Math.random()*canvas.width
}

})

}

/* spaceship */

function drawPlayer(){

ctx.fillStyle="cyan"

ctx.beginPath()

ctx.moveTo(player.x,player.y+player.height)
ctx.lineTo(player.x+player.width/2,player.y)
ctx.lineTo(player.x+player.width,player.y+player.height)
ctx.lineTo(player.x+player.width/2,player.y+player.height-10)

ctx.closePath()
ctx.fill()

}

/* bullets */

function drawBullets(){

ctx.fillStyle="red"

bullets.forEach((b,i)=>{

ctx.fillRect(b.x,b.y,4,15)

b.y-=b.speed

if(b.y<0){
bullets.splice(i,1)
}

})

}

/* enemies */

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

enemies.splice(ei,1)
bullets.splice(bi,1)

score++
scoreDisplay.innerText=score

if(score%10===0){
level++
levelDisplay.innerText=level
}

}

})

/* player collision */

if(
player.x < e.x+e.size &&
player.x+player.width > e.x &&
player.y < e.y+e.size &&
player.y+player.height > e.y
){

gameRunning=false

canvas.style.display="none"
hud.style.display="none"
gameOverUI.style.display="block"

}

})

}

/* movement */

function movePlayer(){

if(keys["ArrowLeft"] && player.x>0){
player.x-=player.speed
}

if(keys["ArrowRight"] && player.x<canvas.width-player.width){
player.x+=player.speed
}

}

/* game loop */

function game(){

ctx.clearRect(0,0,canvas.width,canvas.height)

if(gameRunning){

drawStars()
movePlayer()
drawPlayer()
drawBullets()
drawEnemies()

}

requestAnimationFrame(game)

}

game()
