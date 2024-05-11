async function init(): Promise<void> {
    let result = 0;
    try {
        const response = await fetch("http://localhost:3000/sum");
        const buffer = await response.arrayBuffer();
        console.log(buffer);
        result = await add(buffer);
    } catch (error) {
        console.error(error);
        // ... (handle error case)
    } finally {
        console.log(result);
    }
}
init();
async function add(buffer: ArrayBuffer): Promise<number> {
    const memory = new WebAssembly.Memory({ initial: 1 });
    const importObject = {
        js: {
            mem: memory
        },
        console: {
            log: () => {
                console.log("Just logging something!");
            },
            error: () => {
                console.error("I am just error");
            }
        }
    };
    const { instance } = await WebAssembly.instantiate(buffer, importObject);
    const sumFunction = instance.exports.sum as (a: number, b: number) => number;
    // const wasmMemory = instance.exports.mem as WebAssembly.Memory;
    const unit8Array = new Uint8Array(memory.buffer, 0, 2);
    const hiText = new TextDecoder().decode(unit8Array);
    console.log(hiText);
    return sumFunction(100, 1000);
}

// async function anotherAdd() {
//     try {
//         const response = await fetch("http://localhost:3000/sum");
//         console.log(response.headers.get('Content-Type')); // Add this line
//         const module = await WebAssembly.compileStreaming(response);
//         const instance = await WebAssembly.instantiate(module);
//         const sumFunction = instance.exports.sum;
//         //@ts-ignore
//         const result = sumFunction(100, 1000);
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// }