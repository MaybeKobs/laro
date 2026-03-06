const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let score = 0
let scoreDisplay = document.getElementById("score")

let player = {
x:400,
y:520,
width:40,
height:40,
speed:6
}

let bullets = []
let enemies = []
let stars = []

// create stars
for(let i=0;i<120;i++){
stars.push({
x:Math.random()*800,
y:Math.random()*600,
size:Math.random()*2
})
}

// keyboard
let keys = {}

document.addEventListener("keydown",e=>{
keys[e.key]=true

if(e.key===" "){
bullets.push({
x:player.x+18,
y:player.y,
speed:8
})
}
})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

// spawn enemies
setInterval(()=>{
enemies.push({
x:Math.random()*760,
y:-40,
size:40,
speed:2+Math.random()*2
})
},1000)

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

star.y+=1

if(star.y>600){
star.y=0
star.x=Math.random()*800
}
})

}

function drawBullets(){

ctx.fillStyle="red"

bullets.forEach((b,i)=>{

ctx.fillRect(b.x,b.y,4,10)

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

// collision
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

if(e.y>600){
enemies.splice(ei,1)
}

})

}

function movePlayer(){

if(keys["ArrowLeft"] && player.x>0){
player.x-=player.speed
}

if(keys["ArrowRight"] && player.x<760){
player.x+=player.speed
}

}

function game(){

ctx.clearRect(0,0,800,600)

drawStars()
movePlayer()
drawPlayer()
drawBullets()
drawEnemies()

requestAnimationFrame(game)

}

game()
