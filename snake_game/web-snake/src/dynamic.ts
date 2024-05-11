import initSync, { greet } from "snake-game";

async function start() {
    const wasm = await initSync();
    greet("World");
    console.log(window);
}

start();