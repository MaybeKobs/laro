const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// HUD & Menus
const startMenu = document.getElementById('startMenu');
const playBtn = document.getElementById('playBtn');
const hud = document.getElementById('hud');
const controls = document.getElementById('controls');
const gameOverMenu = document.getElementById('gameOverMenu');
const finalScore = document.getElementById('finalScore');
const replayBtn = document.getElementById('replayBtn');
const leaderboardEl = document.getElementById('leaderboard');
const comboEl = document.getElementById('combo');

// Game Variables
const carWidth = 50;
const carHeight = 90;
const lanes = [60,160,260];
let currentLane = 1;
let carY = canvas.height - carHeight - 10;
let speed = 5;
let score = 0;
let level = 1;
let combo = 1;
let comboCounter = 0;
let obstacles = [];
let powerUps = [];
let obstacleSpeed = 4;
let gameRunning = false;

// Road lines for parallax
const roadLines = [];
const lineHeight = 30;
const lineSpacing = 60;
for (let y = -lineSpacing; y < canvas.height; y += lineHeight + lineSpacing) {
    roadLines.push({ x: canvas.width / 2 - 5, y: y, width: 10, height: lineHeight });
}

// Power-up effects
let shieldActive = false;
let shieldTimer = 0;
let magnetActive = false;
let magnetTimer = 0;

// Start Game
playBtn.addEventListener('click', () => {
    startMenu.style.display = 'none';
    hud.style.display = 'block';
    controls.style.display = 'block';
    gameRunning = true;
});

// Replay
replayBtn.addEventListener('click', () => {
    gameOverMenu.style.display = 'none';
    hud.style.display = 'block';
    controls.style.display = 'block';
    resetGame();
    gameRunning = true;
});

// Keyboard
document.addEventListener('keydown', e => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
    if (e.key === 'ArrowUp') speed += 2;
});
document.addEventListener('keyup', e => { if (e.key === 'ArrowUp') speed = 5; });

// Mobile buttons
document.getElementById('leftBtn').addEventListener('touchstart', moveLeft);
document.getElementById('rightBtn').addEventListener('touchstart', moveRight);
document.getElementById('boostBtn').addEventListener('touchstart', () => { speed += 2; });
document.getElementById('boostBtn').addEventListener('touchend', () => { speed = 5; });

// Lane movement
function moveLeft() { currentLane = Math.max(0, currentLane - 1); }
function moveRight() { currentLane = Math.min(lanes.length - 1, currentLane + 1); }

// Spawn Obstacles
function spawnObstacle() {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    obstacles.push({ x: lane, y: -100, width: carWidth, height: carHeight });
}

// Spawn Power-ups
function spawnPowerUp() {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const r = Math.random();
    const type = r < 0.6 ? 'coin' : r < 0.85 ? 'shield' : 'magnet';
    powerUps.push({ x: lane, y: -50, width: 40, height: 40, type });
}

// Update
function update() {
    if (!gameRunning) return;
    const carX = lanes[currentLane];

    // Obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (carX < obstacles[i].x + obstacles[i].width &&
            carX + carWidth > obstacles[i].x &&
            carY < obstacles[i].y + obstacles[i].height &&
            carY + carHeight > obstacles[i].y) {
            if (!shieldActive) { gameOver(); }
            else { obstacles.splice(i,1); i--; }
        }
        if (obstacles[i].y > canvas.height) { obstacles.splice(i,1); i--; score++; comboCounter++; updateScore(); updateCombo(); }
    }

    // Power-ups
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y += obstacleSpeed;
        let collision = carX < powerUps[i].x + powerUps[i].width &&
                        carX + carWidth > powerUps[i].x &&
                        carY < powerUps[i].y + powerUps[i].height &&
                        carY + carHeight > powerUps[i].y;

        if (magnetActive && powerUps[i].type === 'coin' && Math.abs(carX - powerUps[i].x) <= carWidth + 20) collision = true;

        if (collision) {
            if (powerUps[i].type === 'coin') { score += combo; comboCounter++; updateScore(); updateCombo(); }
            else if (powerUps[i].type === 'shield') { shieldActive = true; shieldTimer = 300; }
            else if (powerUps[i].type === 'magnet') { magnetActive = true; magnetTimer = 300; }
            powerUps.splice(i,1); i--;
        }
        else if (powerUps[i].y > canvas.height) { powerUps.splice(i,1); i--; comboCounter=0; updateCombo(); }
    }

    // Power-up timers
    if (shieldActive) { shieldTimer--; if (shieldTimer <= 0) shieldActive=false; }
    if (magnetActive) { magnetTimer--; if (magnetTimer <= 0) magnetActive=false; }

    if (Math.random() < 0.02) spawnObstacle();
    if (Math.random() < 0.01) spawnPowerUp();

    // Road lines animation
    for (let line of roadLines) {
        line.y += obstacleSpeed;
        if (line.y > canvas.height) line.y = -lineHeight;
    }
}

// Draw
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Player car (rectangle)
    ctx.fillStyle = 'red';
    ctx.fillRect(lanes[currentLane], carY, carWidth, carHeight);

    // Shield visual
    if (shieldActive) {
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(lanes[currentLane]+carWidth/2, carY+carHeight/2, carWidth,0,Math.PI*2);
        ctx.stroke();
    }

    // Obstacles (gray rectangles)
    ctx.fillStyle='gray';
    obstacles.forEach(o => ctx.fillRect(o.x,o.y,o.width,o.height));

    // Power-ups (colored rectangles)
    powerUps.forEach(p=>{
        ctx.fillStyle = p.type==='coin'?'yellow':p.type==='shield'?'cyan':'magenta';
        ctx.fillRect(p.x,p.y,p.width,p.height);
    });

    // Road lines
    ctx.fillStyle='white';
    roadLines.forEach(line => ctx.fillRect(line.x,line.y,line.width,line.height));
}

// Game Loop
function gameLoop(){ if(gameRunning){ update(); draw(); } requestAnimationFrame(gameLoop);}
gameLoop();

// Score & Level
function updateScore(){
    document.getElementById('score').textContent='Score: '+score;
    if(score%10===0){ level++; obstacleSpeed+=1; document.getElementById('level').textContent='Level: '+level; }
}

// Combo
function updateCombo(){ combo=Math.min(1+Math.floor(comboCounter/5),5); comboEl.textContent='Combo: x'+combo; }

// Game Over
function gameOver(){
    gameRunning=false;
    hud.style.display='none';
    controls.style.display='none';
    finalScore.textContent='Score: '+score;
    updateLeaderboard(score);
    gameOverMenu.style.display='block';
}

// Reset
function resetGame(){
    score=0; level=1; combo=1; comboCounter=0; obstacleSpeed=4; obstacles=[]; powerUps=[]; currentLane=1;
    shieldActive=false; shieldTimer=0; magnetActive=false; magnetTimer=0;
    document.getElementById('score').textContent='Score: 0';
    document.getElementById('level').textContent='Level: 1';
    comboEl.textContent='Combo: x1';
}

// Leaderboard
function updateLeaderboard(s){
    let highscores=JSON.parse(localStorage.getItem('highscores')||'[]');
    highscores.push(s); highscores.sort((a,b)=>b-a); highscores=highscores.slice(0,5);
    localStorage.setItem('highscores',JSON.stringify(highscores));
    leaderboardEl.innerHTML='';
    highscores.forEach(h=>{ const li=document.createElement('li'); li.textContent=h; leaderboardEl.appendChild(li); });
}
