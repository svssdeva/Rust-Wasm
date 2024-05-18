import initSync, { Direction, InitOutput, World } from "snake-game";

async function start() {
    const CELL_SIZE = 25;
    const FRAME_RATE = 12; // Adjust the frame rate here
    const WORLD_WIDTH = 8;
    const snakeSpawnIdx = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
    try {
        const wasm = await initSync();
        const world = new World(WORLD_WIDTH, snakeSpawnIdx);
        const worldWidth = world.get_width();
        const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
        const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

        let lastRenderTime = 0;
        let isMoving = false;

        function gameLoop(currentTime: number) {
            const deltaTime = (currentTime - lastRenderTime) / 1000;
            if (deltaTime >= 1 / FRAME_RATE) {
                lastRenderTime = currentTime;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawWorld(canvas, ctx, worldWidth, CELL_SIZE);

                if (isMoving) {
                    world.update();
                }

                const snakeIndex = world.snake_head();
                drawSnake(ctx, worldWidth, CELL_SIZE, snakeIndex, wasm, world);
            }

            requestAnimationFrame(gameLoop);
        }

        document.addEventListener("keydown", (event) => {
            switch (event.code) {
                case "ArrowUp":
                    world.set_snake_direction(Direction.Up);
                    isMoving = true;
                    break;
                case "ArrowDown":
                    world.set_snake_direction(Direction.Down);
                    isMoving = true;
                    break;
                case "ArrowLeft":
                    world.set_snake_direction(Direction.Left);
                    isMoving = true;
                    break;
                case "ArrowRight":
                    world.set_snake_direction(Direction.Right);
                    isMoving = true;
                    break;
            }
        });

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error(error);
    }
}

start();


async function drawWorld(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, worldWidth: number, CELL_SIZE: number) {
    try {
        const calculated = (worldWidth * CELL_SIZE);
        canvas.width = calculated;
        canvas.height = calculated;
        ctx?.beginPath();
        for (let x = 0; x < worldWidth; x++) {
            ctx?.moveTo(x * CELL_SIZE, 0);
            ctx?.lineTo(x * CELL_SIZE, worldWidth * CELL_SIZE);
        }
        for (let y = 0; y < worldWidth; y++) {
            ctx?.moveTo(0, y * CELL_SIZE);
            ctx?.lineTo(worldWidth * CELL_SIZE, y * CELL_SIZE);
        }
        ctx?.stroke();
    } catch (error) {
        console.error(error);
    } finally {
        //  console.log("World drawn");
    }
}


async function drawSnake(ctx: CanvasRenderingContext2D, worldWidth: number, CELL_SIZE: number, snakeIndex: number, wasm: InitOutput, world: World) {
    try {
        const snakeCellPtr = world.snake_cells();
        const snakeLength = world.snake_length();
        const snakeCells = new Uint32Array(wasm.memory.buffer, snakeCellPtr, snakeLength);
        snakeCells.forEach((cell, i) => {
            const col = cell % worldWidth;
            const row = Math.floor(cell / worldWidth);
            ctx.fillStyle = i === 0 ? "#7878db" : "black";
            ctx.beginPath();
            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        })

        ctx.stroke();
    } catch (error) {
        console.error(error);
    } finally {
        //  console.log("Snake drawn");
    }
}