import initSync, { World } from "snake-game";

async function start() {
    const wasm = await initSync();
    const world = new World();
    console.log(world.get_width());
}

start();