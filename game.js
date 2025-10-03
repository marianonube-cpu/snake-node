
// Game constants
const WIDTH = 40;
const HEIGHT = 20;
const SPEED = 200; // ms

// Game state
let snake = [{ x: 10, y: 10 }];
let food = { x: 0, y: 0 };
let direction = 'right';
let score = 0;
let gameOver = false;

// Setup terminal for input
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// Handle user input
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit(); // Exit on Ctrl+C
    } else {
        switch (key.name) {
            case 'up':
                if (direction !== 'down') direction = 'up';
                break;
            case 'down':
                if (direction !== 'up') direction = 'down';
                break;
            case 'left':
                if (direction !== 'right') direction = 'left';
                break;
            case 'right':
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
});

function spawnFood() {
    food.x = Math.floor(Math.random() * (WIDTH - 2)) + 1;
    food.y = Math.floor(Math.random() * (HEIGHT - 2)) + 1;
    // Ensure food doesn't spawn on the snake
    for (const segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            spawnFood(); // Recursively try again
            return;
        }
    }
}

function draw() {
    console.clear();
    let board = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(' '));

    // Walls
    for (let i = 0; i < HEIGHT; i++) {
        board[i][0] = '║';
        board[i][WIDTH - 1] = '║';
    }
    for (let i = 0; i < WIDTH; i++) {
        board[0][i] = '═';
        board[HEIGHT - 1][i] = '═';
    }
    board[0][0] = '╔';
    board[0][WIDTH - 1] = '╗';
    board[HEIGHT - 1][0] = '╚';
    board[HEIGHT - 1][WIDTH - 1] = '╝';

    // Snake
    snake.forEach((segment, index) => {
        board[segment.y][segment.x] = index === 0 ? 'O' : 'o';
    });

    // Food
    board[food.y][food.x] = '♥';
    
    // Score
    const scoreText = `Puntuación: ${score}`;
    for(let i = 0; i < scoreText.length; i++) {
        board[0][i+2] = scoreText[i];
    }

    console.log(board.map(row => row.join('')).join('\n'));
}

function update() {
    const head = { ...snake[0] }; // New head

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Wall collision
    if (head.x <= 0 || head.x >= WIDTH - 1 || head.y <= 0 || head.y >= HEIGHT - 1) {
        gameOver = true;
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head); // Add new head

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        spawnFood(); // Respawn food
    } else {
        snake.pop(); // Remove tail
    }
}

function gameLoop() {
    if (gameOver) {
        console.clear();
        console.log('╔══════════════════════════════╗');
        console.log('║          GAME OVER!          ║');
        console.log(`║     Tu puntuación: ${String(score).padEnd(10)}║`);
        console.log('╚══════════════════════════════╝');
        console.log('\nPresiona Ctrl+C para salir.');
        process.exit();
    }

    update();
    draw();
}

console.log('Iniciando Snake... Presiona las flechas para moverte.');
console.log('Presiona Ctrl+C para salir.');
spawnFood();
setInterval(gameLoop, SPEED);

