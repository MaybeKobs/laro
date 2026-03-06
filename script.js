const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

function resize(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}
resize()
window.addEventListener("resize",resize)

const menu = document.getElementById("menu")
const instructions = document.getElementById("instructions")
const gameOverUI = document.getElementById("gameOver")
const hud = document.getElementById("hud")

const scoreText = document.getElementById("score")
const levelText = document.getElementById("level")
const bossText = document.getElementById("bossHealth")

let gameRunning = false
let score = 0
let level = 1

let player = {
x:window.innerWidth/2,
y:window.innerHeight-120,
w:40,
h:60,
speed:8
}

let bullets = []
let enemies = []
let powerups = []
let particles = []
let boss = null
let rapidFire = false

/* STAR BACKGROUND */
let stars=[]
for(let i=0;i<200;i++){
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

/* UI FUNCTIONS */
function showInstructions(){
menu.style.display="none"
instructions.style.display="block"
}

function backMenu(){
instructions.style.display="none"
menu.style.display="block"
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

/* SHOOT */
function shoot(){
if(!gameRunning) return

bullets.push({
x:player.x+player.w/2,
y:player.y,
speed:12
})

if(rapidFire){
setTimeout(()=>{
bullets.push({
x:player.x+player.w/2,
y:player.y,
speed:12
})
},80)
}
}

/* ENEMY SPAWN */
setInterval(()=>{
if(!gameRunning) return

enemies.push({
x:Math.random()*canvas.width,
y:-40,
size:40,
speed:1.5+level*0.5
})

},1200)

/* POWERUPS */
setInterval(()=>{
if(!gameRunning) return

if(Math.random()<0.4){
powerups.push({
x:Math.random()*canvas.width,
y:-30
})
}

},4000)

/* BOSS */
function spawnBoss(){
boss={
x:canvas.width/2-100,
y:80,
w:200,
h:80,
health:40
}
}

/* DRAW FUNCTIONS */

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

function drawPlayer(){
ctx.fillStyle="cyan"
ctx.beginPath()
ctx.moveTo(player.x,player.y+player.h)
ctx.lineTo(player.x+player.w/2,player.y)
ctx.lineTo(player.x+player.w,player.y+player.h)
ctx.closePath()
ctx.fill()
}

function drawBullets(){
ctx.fillStyle="red"
bullets.forEach((b,i)=>{
ctx.fillRect(b.x,b.y,4,15)
b.y-=b.speed
if(b.y<0) bullets.splice(i,1)
})
}

function drawEnemies(){
ctx.fillStyle="lime"

enemies.forEach((e,ei)=>{

ctx.fillRect(e.x,e.y,e.size,e.size)
e.y+=e.speed

bullets.forEach((b,bi)=>{
if(
b.x<e.x+e.size &&
b.x>e.x &&
b.y<e.y+e.size &&
b.y>e.y
){
enemies.splice(ei,1)
bullets.splice(bi,1)
createExplosion(e.x,e.y)

score++
scoreText.innerText=score

if(score%10===0){
level++
levelText.innerText=level
}
}
})

if(
player.x<e.x+e.size &&
player.x+player.w>e.x &&
player.y<e.y+e.size &&
player.y+player.h>e.y
){
endGame()
}

})
}

function drawPowerups(){
ctx.fillStyle="yellow"

powerups.forEach((p,i)=>{

ctx.beginPath()
ctx.arc(p.x,p.y,12,0,Math.PI*2)
ctx.fill()

p.y+=2

if(
player.x<p.x &&
player.x+player.w>p.x &&
player.y<p.y &&
player.y+player.h>p.y
){
rapidFire=true
setTimeout(()=>{rapidFire=false},5000)
powerups.splice(i,1)
}

})
}

function drawBoss(){
if(!boss) return

ctx.fillStyle="purple"
ctx.fillRect(boss.x,boss.y,boss.w,boss.h)

bossText.innerText=" Boss HP: "+boss.health

bullets.forEach((b,i)=>{
if(
b.x<boss.x+boss.w &&
b.x>boss.x &&
b.y<boss.y+boss.h &&
b.y>boss.y
){
boss.health--
bullets.splice(i,1)

if(boss.health<=0){
boss=null
level++
levelText.innerText=level
}
}
})
}

function createExplosion(x,y){
for(let i=0;i<15;i++){
particles.push({
x,
y,
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

function movePlayer(){
if(keys["ArrowLeft"] && player.x>0)
player.x-=player.speed

if(keys["ArrowRight"] && player.x<canvas.width-player.w)
player.x+=player.speed
}

function endGame(){
gameRunning=false
canvas.style.display="none"
hud.style.display="none"
gameOverUI.style.display="block"
}

function gameLoop(){
ctx.clearRect(0,0,canvas.width,canvas.height)

if(gameRunning){

drawStars()
movePlayer()
drawPlayer()
drawBullets()
drawEnemies()
drawPowerups()
drawBoss()
drawParticles()

if(level%5===0 && !boss){
spawnBoss()
}

}

requestAnimationFrame(gameLoop)
}

gameLoop()
