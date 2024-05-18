import initSync, { Direction, InitOutput, World } from "snake-game";
import confetti from 'canvas-confetti';
const scoreElement = document.getElementById("score")!;
async function start() {
    const CELL_SIZE = 25;
    const FRAME_RATE = 12;
    const WORLD_WIDTH = 8;
    const snakeSpawnIdx = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
    const wasm = await initSync();
    const world = new World(WORLD_WIDTH, snakeSpawnIdx);
    const worldWidth = world.width();
    const canvas = document.getElementById("snake-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    const resetButton = document.getElementById("reset-btn")!;
    let worldColor = getRandomColor();
    let foodColor = getRandomColor();
    let snakeGradient = getRandomGradient();
    let lastRenderTime = 0;
    let gameLoopId: number;

    function gameLoop(currentTime: number) {
        const deltaTime = (currentTime - lastRenderTime) / 1000;
        if (deltaTime >= 1 / FRAME_RATE) {
            lastRenderTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWorld(canvas, ctx, worldWidth, CELL_SIZE, worldColor);
            drawFood(ctx, worldWidth, CELL_SIZE, world.food_position(), foodColor);

            if (!world.game_over()) {
                world.update();
                drawSnake(ctx, worldWidth, CELL_SIZE, world, wasm, snakeGradient);
                scoreElement.textContent = world.score().toString();

                if (Math.random() < 0.02) {
                    world.spawn_food();
                    foodColor = getRandomColor();
                    worldColor = getRandomColor();
                    snakeGradient = getRandomGradient();
                }
            } else {
                gameOver();
                if (world.score() > WORLD_WIDTH) {
                    const confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
                    confetti.create(confettiCanvas, { resize: true })({
                        particleCount: 200,
                        spread: 200
                    });
                }
                return;
            }
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }
    function startGameLoop() {
        lastRenderTime = 0;
        cancelAnimationFrame(gameLoopId);
        gameLoopId = requestAnimationFrame(gameLoop);
    }
    resetButton.addEventListener("click", () => {
        world.reset();
        scoreElement.textContent = "0";
        startGameLoop();
    });

    startGameLoop();


    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowUp":
                world.set_snake_direction(Direction.Up);
                break;
            case "ArrowDown":
                world.set_snake_direction(Direction.Down);
                break;
            case "ArrowLeft":
                world.set_snake_direction(Direction.Left);
                break;
            case "ArrowRight":
                world.set_snake_direction(Direction.Right);
                break;
        }
    });

    resetButton.addEventListener("click", () => {
        world.reset();
        scoreElement.textContent = "0";
        startGameLoop();
    });
    requestAnimationFrame(gameLoop);

    function gameOver() {
        const gameOverElement = document.getElementById("game-over");
        if (gameOverElement) {
            gameOverElement.style.display = "block";
            cancelAnimationFrame(gameLoopId);
            setTimeout(() => {
                gameOverElement.style.display = "none";
                world.reset();
                scoreElement.textContent = "0";
                startGameLoop();
            }, 5000);
        }
    }
}

start();

function drawWorld(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, worldWidth: number, CELL_SIZE: number, worldColor) {
    canvas.width = worldWidth * CELL_SIZE;
    canvas.height = worldWidth * CELL_SIZE;
    ctx.fillStyle = worldColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (let x = 0; x < worldWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, worldWidth * CELL_SIZE);
        ctx.stroke();
    }

    for (let y = 0; y < worldWidth; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(worldWidth * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
    }
}

function drawFood(ctx: CanvasRenderingContext2D, worldWidth: number, CELL_SIZE: number, foodPosition: number | undefined, foodColor) {
    if (foodPosition !== undefined) {
        const col = foodPosition % worldWidth;
        const row = Math.floor(foodPosition / worldWidth);
        ctx.fillStyle = foodColor;
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

function drawSnake(ctx: CanvasRenderingContext2D, worldWidth: number, CELL_SIZE: number, world: World, wasm: InitOutput, snakeGradient) {
    const snakeCellPtr = world.snake_cells();
    const snakeLength = world.snake_length();
    const snakeCells = new Uint32Array(wasm.memory.buffer, snakeCellPtr, snakeLength);

    const gradient = ctx.createLinearGradient(0, 0, worldWidth * CELL_SIZE, worldWidth * CELL_SIZE);
    gradient.addColorStop(0, snakeGradient[0]);
    gradient.addColorStop(1, snakeGradient[1]);

    snakeCells.forEach((cellIdx, i) => {
        const col = cellIdx % worldWidth;
        const row = Math.floor(cellIdx / worldWidth);
        ctx.fillStyle = i === 0 ? "black" : gradient;
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    scoreElement.textContent = world.score().toString();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomGradient() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return [color1, color2];
}