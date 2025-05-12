// Elementos do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');

// Configurações do jogo
const config = {
    paddleWidth: 100,
    paddleHeight: 10,
    ballRadius: 8,
    ballSpeed: 5,
    paddleSpeed: 8
};

// Estado do jogo
let gameState = {
    paddle: {
        x: 0,
        y: 0,
        width: config.paddleWidth,
        height: config.paddleHeight
    },
    ball: {
        x: 0,
        y: 0,
        dx: config.ballSpeed,
        dy: -config.ballSpeed,
        radius: config.ballRadius
    },
    keys: {
        left: false,
        right: false
    },
    isPlaying: false
};

// Iniciar jogo
function startGame() {
    // Configurar canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Posicionar elementos
    gameState.paddle.x = (canvas.width - gameState.paddle.width) / 2;
    gameState.paddle.y = canvas.height - 50;
    gameState.ball.x = canvas.width / 2;
    gameState.ball.y = canvas.height - 100;
    
    // Mostrar tela do jogo
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Iniciar jogo
    gameState.isPlaying = true;
    gameLoop();
}

// Controles
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying) return;
    
    if (e.key === 'ArrowLeft') gameState.keys.left = true;
    if (e.key === 'ArrowRight') gameState.keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') gameState.keys.left = false;
    if (e.key === 'ArrowRight') gameState.keys.right = false;
});

// Loop do jogo
function gameLoop() {
    if (!gameState.isPlaying) return;
    
    // Limpar tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar paddle
    if (gameState.keys.left) {
        gameState.paddle.x -= config.paddleSpeed;
    }
    if (gameState.keys.right) {
        gameState.paddle.x += config.paddleSpeed;
    }
    
    // Limitar paddle na tela
    if (gameState.paddle.x < 0) gameState.paddle.x = 0;
    if (gameState.paddle.x + gameState.paddle.width > canvas.width) {
        gameState.paddle.x = canvas.width - gameState.paddle.width;
    }
    
    // Atualizar bola
    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;
    
    // Colisão com as paredes
    if (gameState.ball.x + gameState.ball.radius > canvas.width || 
        gameState.ball.x - gameState.ball.radius < 0) {
        gameState.ball.dx = -gameState.ball.dx;
    }
    if (gameState.ball.y - gameState.ball.radius < 0) {
        gameState.ball.dy = -gameState.ball.dy;
    }
    
    // Colisão com o paddle
    if (gameState.ball.y + gameState.ball.radius > gameState.paddle.y &&
        gameState.ball.x > gameState.paddle.x &&
        gameState.ball.x < gameState.paddle.x + gameState.paddle.width) {
        gameState.ball.dy = -gameState.ball.dy;
    }
    
    // Game over
    if (gameState.ball.y + gameState.ball.radius > canvas.height) {
        gameState.isPlaying = false;
        startScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        return;
    }
    
    // Desenhar elementos
    // Paddle
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(
        gameState.paddle.x,
        gameState.paddle.y,
        gameState.paddle.width,
        gameState.paddle.height
    );
    
    // Bola
    ctx.beginPath();
    ctx.arc(
        gameState.ball.x,
        gameState.ball.y,
        gameState.ball.radius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    
    // Continuar loop
    requestAnimationFrame(gameLoop);
}

// Iniciar quando clicar no botão
startButton.addEventListener('click', startGame); 