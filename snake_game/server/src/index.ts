import { Elysia } from 'elysia';
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('..', import.meta.url));
const SRC_PATH = `${__dirname}\src`;
const SCRIPT = Bun.file(SRC_PATH + "\\test.wasm");
//console.log(await SCRIPT.text())

const app = new Elysia();

app.get('/sum', async ({ set }) => {
  const file = await SCRIPT.arrayBuffer();
  set.headers['Access-Control-Allow-Origin'] = '*';
  set.headers['Access-Control-Allow-Origin'] = '*';
  set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  set.headers['Access-Control-Allow-Headers'] = 'Content-Type';
  set.headers['Content-Type'] = 'application/wasm';
  return new Uint8Array(file);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});