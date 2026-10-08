const canvas = document.querySelector("canvas")
const restratBtn = document.getElementById("restratBtn")
const startScreen = document.getElementById("startScreen")
const easyBtn = document.getElementById("easyBtn")
const hardBtn = document.getElementById("hardBtn")
const ctx = canvas.getContext("2d")

// 공의 기본 정보
let ballX;
let ballY;
let ballR = 10;
let ballSpeedX;
let ballSpeedY;

// 바
let barX;
let barY = canvas.height - 40 ;
let barW = 100;
let barH = 15;

// 벽돌
let bricks = [];
let bricksRow;
let bricksCol;
let bricksW;
let bricksH;
let bricksGap = 15;

// 키보드 입력 상태
let rightPressed = false;
let leftPressed = false;
let barSpeed = 10;

// 게임 상태
let gameOver;
let aniId;

// 모드에 따른 색상 디자인
let ballColor;
let barColor;
let brickColor;

// 사운드용 변수
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 선택한 난이도
let currentMode = "easy";

// 난이도별 버튼 클릭 이벤트
easyBtn.addEventListener("click", function() {
    startGame("easy");
});

hardBtn.addEventListener("click", function() {
    startGame("hard");
});

// 다시 시작 버튼 이벤트 연결
restratBtn.addEventListener("click", function() {
    startGame(currentMode);
});

// 게임 시작
function startGame(mode){
    startScreen.style.display = "none";
    restratBtn.style.display = "none";

    currentMode = mode;
    
    // 새 게임 시작 시 올클리어 무지개 테두리 클래스 제거 및 리셋
    canvas.classList.remove("clear-rainbow");

    // 모드에 따른 난이도 조절
    if(mode === "easy") {
        ballSpeedX = 4;
        ballSpeedY = -4;
        barW = 120;

        bricksRow = 3; 
        bricksCol = 6;
        bricksW = 125;
        bricksH = 30;

        ballColor = "#e9f8ef"
        barColor = "#17eea6"
        brickColor = "#b0d4af"
        canvas.style.background = "linear-gradient(to bottom, #1a0b2e, #0b1528)"
        canvas.style.borderColor = "#00f0ff";
        canvas.style.boxShadow = "0 0 20px #00f0ff, inset 0 0 15px rgba(0, 240, 255, 0.5)";

    } else if (mode === "hard") {
        ballSpeedX = 7;
        ballSpeedY = -7;
        barW = 80;

        bricksRow = 5;
        bricksCol = 7;
        bricksW = 105;
        bricksH = 25;

        ballColor = "#ffffff"
        barColor = "#ffcc00" 
        brickColor = "#8a0327" 
        canvas.style.background = "linear-gradient(to bottom, #2b0303, #000000)"
        canvas.style.borderColor = "#f5483c";
        canvas.style.boxShadow = "0 0 25px #f8392b, inset 0 0 20px rgba(209, 43, 14, 0.6)";
    }

    // 공과 바의 초기 위치 설정
    ballX = canvas.width / 2
    ballY = canvas.height - 80
    barX = canvas.width/2 - barW/2

    bricks = []

    for(let row = 0; row < bricksRow; row++){
        for(let col = 0; col < bricksCol; col++){
            bricks.push({
                x : 45 + col * (bricksW + bricksGap),
                y : 50 + row * (bricksH + bricksGap),
                show : true
            })
        }
    }

    // 상태정보
    gameOver = false
    restratBtn.style.display = "none";
    
    // 초기화 후 애니메이션 루프 시작
    cancelAnimationFrame(aniId);
    animate(); 
}

// 그리기
function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.shadowBlur = 5;

    // 공
    ctx.beginPath()
    ctx.shadowColor = ballColor;
    ctx.fillStyle = ballColor
    ctx.arc(ballX, ballY, ballR, 0, Math.PI *2);
    ctx.fill()

    // 바
    ctx.beginPath()
    ctx.shadowColor = barColor;
    ctx.fillStyle = barColor
    ctx.fillRect(barX, barY, barW, barH)

    // 벽돌 그리기 및 살아있는 벽돌 개수 체크
    let activeBricks = 0;

    for(let i=0; i<bricks.length; i++){
        if(bricks[i].show){
            activeBricks++;
            ctx.shadowColor = brickColor;
            ctx.fillStyle = brickColor
            ctx.fillRect(bricks[i].x, bricks[i].y, bricksW, bricksH)
        }
    }

    // 모든 벽돌을 다 깼다면 올클리어 함수 호출
    if(activeBricks === 0 && !gameOver) {
        winGame();
    }

    ctx.shadowBlur = 0;
}

function endGame(){
    gameOver = true;
    cancelAnimationFrame(aniId)

    playSound("gameover");

    ctx.fillStyle = "rgba(0,0,0,0.75)"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#e2180a";
    ctx.fillStyle = "#dad2d0"
    ctx.font = "bold 60px 'Orbit', sans-serif";
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("GAME OVER", canvas.width / 2, (canvas.height / 2) - 40);
    ctx.shadowBlur = 0;
    restratBtn.style.display = "block";
}

// 올클리어 전용 무지개 테두리 회전 이펙트 함수
function winGame(){
    gameOver = true;
    cancelAnimationFrame(aniId);

    canvas.classList.add("clear-rainbow");
    playSound("win");

    ctx.fillStyle = "rgba(20, 0, 40, 0.75)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#39ff14"; 
    ctx.fillStyle = "#ffffff" 
    
    ctx.font = "bold 90px 'Orbit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ALL CLEAR!", canvas.width / 2, (canvas.height / 2) - 90);

    // 서브 축하 문구
    ctx.font = "bold 25px 'Orbit', sans-serif";
    ctx.fillStyle = "#39ff14";
    ctx.fillText("당신을 완벽한 플레이어로 인정합니다", canvas.width / 2, (canvas.height / 2) + 5);
    
    ctx.shadowBlur = 0;
    restratBtn.style.display = "block";
}

function move(){
    // 공 좌표 변경 (스피드)
    ballX += ballSpeedX
    ballY += ballSpeedY

    // 공이 왼쪽, 오른쪽 벽에 닿았을 때
    if(ballX +  ballR > canvas.width || ballX - ballR < 0) {
        ballSpeedX = ballSpeedX * -1;
    }

    // 공이 위쪽에 닿았을 때
    if(ballY - ballR < 0){
        ballSpeedY = ballSpeedY * -1
    }

    // 공이 바에 닿았을 때
    if(ballY + ballR > barY &&
        ballX > barX &&
        ballX < barW + barX
    ){
        ballSpeedY = ballSpeedY * -1
        playSound("paddle");
    }

    // 벽돌에 닿았을 때
    for(let i=0; i<bricks.length; i++){
        let b = bricks[i]

        if(b.show && 
            ballX > b.x && 
            ballX < b.x + bricksW &&
            ballY + ballR > b.y &&
            ballY - ballR < b.y + bricksH
        ){
            b.show = false
            ballSpeedY = ballSpeedY * -1
            playSound("brick");
        }
    }

    // 오른쪽 키가 눌렸고, 바가 캔버스 오른쪽 끝을 넘지 않았다면
    if (rightPressed && barX < canvas.width - barW) {
        barX += barSpeed;
    }
    // 왼쪽 키가 눌렸고, 바가 캔버스 왼쪽 끝(0)을 넘지 않았다면
    else if (leftPressed && barX > 0) {
        barX -= barSpeed;
    }

    // 공이 바닥으로 떨어지면 게임 종료
    if(ballY - ballR > canvas.height){
        endGame()
    }
}

function animate(){
    if(gameOver) return; 

    draw()
    move()

    aniId = requestAnimationFrame(animate);
}

// 마우스 이동 이벤트 처리 구조 완성
canvas.addEventListener("mousemove", function(e){
    let rect = canvas.getBoundingClientRect()
    let mouseX = e.clientX - rect.left
    
    barX = mouseX - barW / 2

    if(barX < 0) {
        barX = 0
    }
    if(barX + barW > canvas.width) {
        barX = canvas.width - barW
    }
})

// 키보드를 누를 때 실행되는 함수
function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        leftPressed = true;
    }
    //  [개발자 치트키] 백틱(`) 키 누르면 바로 클리어
    else if(e.key === "`") {
        winGame();
    }

    else if(e.key === "Enter" && gameOver) {
        startGame(currentMode);
    }
}

// 키보드에서 손을 뗄 때 실행되는 함수
function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = false;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        leftPressed = false;
    }
}

// 8비트 효과음을 실시간으로 주파수를 쏴서 만드는 함수
function playSound(type) {
    // 브라우저 보안 정책상 오디오 장치가 잠겨있으면 깨우기
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    //  오락실 특유의 8비트 사운드 칩셋 형태(Square) 지정
    osc.type = "square"; 

    const now = audioCtx.currentTime;

    if (type === "paddle") {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    } 
    else if (type === "brick") {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } 
    else if (type === "gameover") {
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } 
    else if (type === "win") {
        
        osc.frequency.setValueAtTime(523.25, now); 
        
        osc.frequency.setValueAtTime(659.25, now + 0.12); 
        
        osc.frequency.setValueAtTime(783.99, now + 0.24); 
        
        osc.frequency.setValueAtTime(1046.50, now + 0.42); 
        
        osc.frequency.setValueAtTime(783.99, now + 0.60); 
        
        osc.frequency.setValueAtTime(783.99, now + 0.72); 
        
        osc.frequency.setValueAtTime(1046.50, now + 0.84); 
        
        osc.frequency.setValueAtTime(1046.50, now + 1.02); 
        
        osc.frequency.setValueAtTime(783.99, now + 1.26); 
        
        osc.frequency.setValueAtTime(1046.50, now + 1.44); 
        
        // 볼륨 및 지속 시간 제어 (멜로디가 끝날 때까지 부드럽게 유지)
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 1.5);
        gain.gain.linearRampToValueAtTime(0, now + 1.8);
        
        osc.start(now);
        osc.stop(now + 1.8); // 오디오 노드 정지
    }

}

// 이벤트 브라우저에 연결하기
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);