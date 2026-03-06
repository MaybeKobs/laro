let score = 0
let time = 20
let gameInterval
let timerInterval

const scoreDisplay = document.getElementById("score")
const timeDisplay = document.getElementById("time")
const gameArea = document.getElementById("gameArea")
const startBtn = document.getElementById("startBtn")

startBtn.addEventListener("click", startGame)

function startGame(){

    score = 0
    time = 20

    scoreDisplay.textContent = score
    timeDisplay.textContent = time

    clearInterval(gameInterval)
    clearInterval(timerInterval)

    spawnTarget()

    gameInterval = setInterval(spawnTarget, 800)

    timerInterval = setInterval(() => {

        time--
        timeDisplay.textContent = time

        if(time <= 0){
            clearInterval(gameInterval)
            clearInterval(timerInterval)
            alert("Game Over! Your score: " + score)
        }

    },1000)
}

function spawnTarget(){

    const target = document.createElement("div")
    target.classList.add("target")

    const x = Math.random() * 450
    const y = Math.random() * 350

    target.style.left = x + "px"
    target.style.top = y + "px"

    target.onclick = function(){
        score++
        scoreDisplay.textContent = score
        target.remove()
    }

    gameArea.appendChild(target)

    setTimeout(()=>{
        target.remove()
    },700)
}
