/**
 * e2e-deployed — prueba el stack YA DESPLEGADO vía nginx (:8091):
 * hello → start → prompt → cat → submit → progreso, exactamente como el navegador.
 * Uso: node scripts/e2e-deployed.mjs [puerto]
 */
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wsMod = require(path.join(repoRoot, 'node_modules/ws'));
const WebSocketClass = wsMod.WebSocket ?? wsMod;

const PORT = Number(process.argv[2] || 8091);
const playerId = `e2e-${crypto.randomBytes(6).toString('hex')}`;

const ws = new WebSocketClass(`ws://127.0.0.1:${PORT}/ws`);
let buffer = '';
let levelId = null;
const done = (c, msg) => {
  console.log(msg);
  console.log(`dataChunks=${dataCount}`);
  process.exit(c);
};
let dataCount = 0;

const timeout = setTimeout(() => done(1, `E2E-DEPLOY-FAIL: timeout. tail: ${JSON.stringify(buffer.slice(-300))}`), 90_000);

ws.on('open', () => ws.send(JSON.stringify({ type: 'hello', payload: { playerId } })));
ws.on('message', (raw) => {
  const m = JSON.parse(String(raw));
  if (m.type === 'welcome') {
    console.log(`welcome ✓ (rango ${m.payload.rank})`);
    ws.send(JSON.stringify({ type: 'start', payload: {} }));
  } else if (m.type === 'levelState') {
    levelId = m.payload.level?.id;
    console.log(`levelState ✓ (${levelId})`);
    setTimeout(() => ws.send(JSON.stringify({ type: 'input', payload: { data: 'cat ~/.secreto\r' } })), 1500);
  } else if (m.type === 'data') {
    dataCount++;
    buffer += m.payload.data;
    const f = /FLAG\{[0-9a-f]{24}\}/.exec(buffer);
    if (f && dataCount > 2) {
      console.log(`flag capturada del stream ✓ — submiteando por la vía UI`);
      ws.send(JSON.stringify({ type: 'submitFlag', payload: { flag: f[0] } }));
    }
  } else if (m.type === 'submitResult') {
    clearTimeout(timeout);
    if (!m.payload.passed) done(1, `submit falló: ${JSON.stringify(m.payload).slice(0, 200)}`);
    // persistencia vía la API expuesta por nginx
    fetch(`http://127.0.0.1:${PORT}/api/player/${playerId}`)
      .then((r) => r.json())
      .then((p) => {
        const solved = (p.progress || []).some((x) => x.level_id === levelId && x.solved === 1);
        done(solved ? 0 : 1, solved ? `submit ✓ (+${m.payload.xpGained} XP) y progreso persistido vía nginx ✓\nE2E-DEPLOY-OK` : 'progreso NO visible vía API');
      })
      .catch((e) => done(1, `api fail: ${e.message}`));
  } else if (m.type === 'error') {
    console.log(`server error: ${m.payload.message}`);
  }
});
ws.on('error', (e) => done(1, `E2E-DEPLOY-FAIL: ${e.message}`));
