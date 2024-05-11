import initSync, { greet } from "snake-game";

initSync().then(() => {
    greet("World");
    console.log("OK!");
});