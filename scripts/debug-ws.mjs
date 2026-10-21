/**
 * debug-ws: servidor real con logs info + cliente WS con trazas completas.
 * Muestra WELCOME, LEVELSTATE, DATA (longitudes) y los primeros chunks en crudo.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WsMod = require(path.join(repoRoot, 'node_modules/ws'));
const WebSocketClass = WsMod.WebSocket ?? WsMod;

const PORT = 18099 + Math.floor(Math.random() * 500);
const playerId = `dbg-${crypto.randomBytes(6).toString('hex')}`;

const server = spawn('npx', ['tsx', 'src/index.ts'], {
  cwd: path.join(repoRoot, 'app/server'),
  env: {
    ...process.env,
    PORT: String(PORT),
    ARENA_LEVELS_DIR: path.join(repoRoot, 'levels'),
    ARENA_DATA_DIR: fs.mkdtempSync('/tmp/arena-dbg-ws-'),
    ARENA_FLAG_SECRET: `dbg-${crypto.randomBytes(8).toString('hex')}`,
    ARENA_DOJO_IMAGE: 'bash-arena/dojo-base:latest',
    LOG_LEVEL: 'info',
    NODE_ENV: 'test',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const slogs = [];
server.stdout.on('data', (d) => slogs.push(d.toString()));
server.stderr.on('data', (d) => slogs.push(d.toString()));

const waitOk = async (fn, ms) => {
  const t0 = Date.now();
  for (;;) {
    if (Date.now() - t0 > ms) throw new Error('timeout backend');
    try { if (await fn()) return; } catch { /* aún no */ }
    await new Promise((r) => setTimeout(r, 400));
  }
};

await waitOk(async () => (await fetch(`http://127.0.0.1:${PORT}/api/health`)).ok, 30_000);
console.log(`backend ok :${PORT}`);

const ws = new WebSocketClass(`ws://127.0.0.1:${PORT}/ws`);
let dataCount = 0;
let dataChars = 0;
const samples = [];
ws.on('message', (raw) => {
  const m = JSON.parse(String(raw));
  if (m.type === 'welcome') {
    console.log('> welcome bien', m.payload.rank, '· xp', m.payload.xp);
    ws.send(JSON.stringify({ type: 'start', payload: {} }));
  } else    if (m.type === 'data') {
      dataCount++;
      dataChars += m.payload.data.length;
      if (dataCount <= 3) console.log(`[data #${dataCount} RAW]`, JSON.stringify(m.payload.data.slice(0, 400)));
      if (samples.length < 6) samples.push(m.payload.data.replace(/\x1b\[[0-9;?]*[a-zA-Z]|\x1b\][^\x07]*\x07/g, '').slice(0, 120));
    if (/\$\s*$/.test(m.payload.data)) {
      console.log('PROMPT detectado en data — mando cat tras 400ms');
      ws.send(JSON.stringify({ type: 'input', payload: { data: 'cat ~/.secreto\r' } }));
      setTimeout(() => {
        console.log(`resumen: dataChunks=${dataCount} chars=${dataChars}`);
        console.log('muestras early:', samples.slice(0, 4));
        server?.kill('SIGTERM');
        process.exit(0);
      }, 2000);
    }
  } else {
    console.log(`> ${m.type}:`, JSON.stringify(m.payload).slice(0, 200));
    if (m.type === 'levelState') {
      setTimeout(() => {
        if (dataCount < 2) {
          console.log('(!) sin segundo chunk: mando input de todas formas');
          ws.send(JSON.stringify({ type: 'input', payload: { data: 'cat ~/.secreto\r' } }));
        }
      }, 4000);
    }
  }
});
ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'hello', payload: { playerId } }));
});
ws.on('close', () => console.log('ws cerrado'));
ws.on('error', (e) => console.log('ws error:', e.message));

setTimeout(() => {
  console.log(`SPAWN-TIMEOUT — dataChunks=${dataCount} chars=${dataChars}`);
  console.log('--- log servidor tail ---');
  console.log(slogs.join('').slice(-1800));
  server?.kill('SIGTERM');
  process.exit(1);
}, 45_000);
