const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const menu = document.getElementById("menu")
const gameOverUI = document.getElementById("gameOver")
const hud = document.getElementById("hud")

function resizeCanvas(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

let score = 0
let scoreDisplay = document.getElementById("score")

let gameRunning = false

let player = {
x:window.innerWidth/2,
y:window.innerHeight-100,
speed:8
}

let bullets=[]
let enemies=[]
let stars=[]

// stars
for(let i=0;i<200;i++){
stars.push({
x:Math.random()*window.innerWidth,
y:Math.random()*window.innerHeight,
size:Math.random()*2
})
}

let keys={}

document.addEventListener("keydown",e=>{
keys[e.key]=true

if(e.key===" " && gameRunning){
bullets.push({
x:player.x+20,
y:player.y,
speed:10
})
}
})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

function startGame(){

menu.style.display="none"
canvas.style.display="block"
hud.style.display="block"

gameRunning=true
}

function restartGame(){
location.reload()
}

// slower enemies
setInterval(()=>{

if(gameRunning){

enemies.push({
x:Math.random()*canvas.width,
y:-40,
size:40,
speed:1
})

}

},1500)

function drawPlayer(){

ctx.fillStyle="cyan"

ctx.beginPath()

ctx.moveTo(player.x,player.y)
ctx.lineTo(player.x+20,player.y-40)
ctx.lineTo(player.x+40,player.y)

ctx.closePath()
ctx.fill()

}

function drawStars(){

ctx.fillStyle="white"

stars.forEach(star=>{

ctx.fillRect(star.x,star.y,star.size,star.size)

star.y+=0.7

if(star.y>canvas.height){
star.y=0
star.x=Math.random()*canvas.width
}

})

}

function drawBullets(){

ctx.fillStyle="red"

bullets.forEach((b,i)=>{

ctx.fillRect(b.x,b.y,4,12)

b.y-=b.speed

if(b.y<0){
bullets.splice(i,1)
}

})

}

function drawEnemies(){

ctx.fillStyle="lime"

enemies.forEach((e,ei)=>{

ctx.fillRect(e.x,e.y,e.size,e.size)

e.y+=e.speed

// bullet collision
bullets.forEach((b,bi)=>{

if(
b.x<e.x+e.size &&
b.x+4>e.x &&
b.y<e.y+e.size &&
b.y+10>e.y
){

enemies.splice(ei,1)
bullets.splice(bi,1)

score++
scoreDisplay.innerText=score

}

})

// player collision
if(
player.x < e.x + e.size &&
player.x + 40 > e.x &&
player.y < e.y + e.size &&
player.y + 40 > e.y
){

gameRunning=false
canvas.style.display="none"
hud.style.display="none"
gameOverUI.style.display="block"

}

})

}

function movePlayer(){

if(keys["ArrowLeft"] && player.x>0){
player.x-=player.speed
}

if(keys["ArrowRight"] && player.x<canvas.width-40){
player.x+=player.speed
}

}

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
