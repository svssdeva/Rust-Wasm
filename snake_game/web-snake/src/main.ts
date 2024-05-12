import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import bunLogo from '/bun.svg';
import rustLogo from '/rust.svg';
import wasmLogo from '/wasm.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://bun.sh" target="_blank">
      <img src="${bunLogo}" class="logo" alt="Bun logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <a href="https://www.rust-lang.org/" target="_blank">
      <img src="${rustLogo}" class="logo" alt="Rust logo" />
    </a>
    <a href="https://webassembly.org/" target="_blank">
      <img src="${wasmLogo}" class="logo" alt="WASM logo" />
    </a>  
    <h1>Vite + Bun + TypeScript</h1>
    <h1>Rust + WebAssembly</h1>
    <div class="card content-wrapper">
      <canvas id="snake-canvas"></canvas>
    </div>
  </div>
`
