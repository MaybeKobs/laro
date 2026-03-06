const gameArea = document.getElementById("gameArea")
const player = document.getElementById("player")

const scoreText = document.getElementById("score")
const healthText = document.getElementById("health")
const gameOverText = document.getElementById("gameOver")

let score = 0
let health = 100

let playerX = 380
let playerY = 230

let keys = {}

document.addEventListener("keydown", e => keys[e.key] = true)
document.addEventListener("keyup", e => keys[e.key] = false)

function movePlayer(){

if(keys["w"]) playerY -= 4
if(keys["s"]) playerY += 4
if(keys["a"]) playerX -= 4
if(keys["d"]) playerX += 4

playerX = Math.max(0, Math.min(760, playerX))
playerY = Math.max(0, Math.min(460, playerY))

player.style.left = playerX + "px"
player.style.top = playerY + "px"

}

setInterval(movePlayer,20)

gameArea.addEventListener("click", e => {

const bullet = document.createElement("div")
bullet.classList.add("bullet")

let bulletX = playerX + 15
let bulletY = playerY + 15

bullet.style.left = bulletX + "px"
bullet.style.top = bulletY + "px"

gameArea.appendChild(bullet)

const rect = gameArea.getBoundingClientRect()

const targetX = e.clientX - rect.left
const targetY = e.clientY - rect.top

const angle = Math.atan2(targetY - bulletY, targetX - bulletX)

const speed = 8

const moveBullet = setInterval(()=>{

bulletX += Math.cos(angle) * speed
bulletY += Math.sin(angle) * speed

bullet.style.left = bulletX + "px"
bullet.style.top = bulletY + "px"

if(bulletX < 0 || bulletX > 800 || bulletY < 0 || bulletY > 500){
bullet.remove()
clearInterval(moveBullet)
}

document.querySelectorAll(".zombie").forEach(zombie => {

const zx = zombie.offsetLeft
const zy = zombie.offsetTop

if(Math.abs(bulletX - zx) < 30 && Math.abs(bulletY - zy) < 30){

score++
scoreText.textContent = score

zombie.remove()
bullet.remove()
clearInterval(moveBullet)

}

})

},20)

})

function spawnZombie(){

const zombie = document.createElement("div")
zombie.classList.add("zombie")

let zx = Math.random()*760
let zy = -40

zombie.style.left = zx + "px"
zombie.style.top = zy + "px"

gameArea.appendChild(zombie)

const move = setInterval(()=>{

const px = player.offsetLeft
const py = player.offsetTop

const angle = Math.atan2(py - zy, px - zx)

zx += Math.cos(angle) * 1.5
zy += Math.sin(angle) * 1.5

zombie.style.left = zx + "px"
zombie.style.top = zy + "px"

if(Math.abs(px - zx) < 30 && Math.abs(py - zy) < 30){

health -= 10
healthText.textContent = health

zombie.remove()
clearInterval(move)

if(health <= 0){
endGame()
}

}

},30)

}

setInterval(spawnZombie,1500)

function endGame(){

document.querySelectorAll(".zombie").forEach(z => z.remove())
document.querySelectorAll(".bullet").forEach(b => b.remove())

gameOverText.style.display = "block"

}
