/**
 * Smoke E2E del flujo completo: backend real (dockerode+SQLite+WS) + cliente WS.
 * Arranca el servidor en un puerto efímero, supera fundamentos-l1 como un jugador
 * real (comandos por terminal) y valida el submit server-side + persistencia.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { spawn, exec } from 'node:child_process';
import path from 'node:path';
import util from 'node:util';
const wsMod = (await import('ws')).default;
const WebSocketClass = wsMod.WebSocket ?? wsMod;

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const execP = util.promisify(exec);
const PORT = 18099 + Math.floor(Math.random() * 500);
const playerId = `smoke-${crypto.randomBytes(6).toString('hex')}`;

let server;
let code = 1;
const logTail = [];
try {
  // 1) levantar backend real con levanta de datos temporal
  const dataDir = fs.mkdtempSync('/tmp/arena-smoke-db-');
  server = spawn('npx', ['tsx', 'src/index.ts'], {
    cwd: path.join(repoRoot, 'app/server'),
    env: {
      ...process.env,
      PORT: String(PORT),
      ARENA_LEVELS_DIR: path.join(repoRoot, 'levels'),
      ARENA_DATA_DIR: dataDir,
      ARENA_FLAG_SECRET: `smoke-${crypto.randomBytes(8).toString('hex')}`,
      ARENA_DOJO_IMAGE: 'bash-arena/dojo-base:latest',
      LOG_LEVEL: 'warn',
      NODE_ENV: 'test',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (d) => logTail.push(d.toString()));
  server.stderr.on('data', (d) => logTail.push(d.toString()));

  const waitFor = async (fn, ms, label) => {
    const t0 = Date.now();
    for (;;) {
      if (Date.now() - t0 > ms) throw new Error(`timeout esperando ${label}`);
      try {
        if (await fn()) return;
      } catch {
        /* aún no */
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  };
  await waitFor(async () => {
    const r = await fetch(`http://127.0.0.1:${PORT}/api/health`);
    return r.ok;
  }, 30_000, 'health');
  console.log('1) backend healthy en puerto', PORT);

  // 2) cliente WS real
  const ws = new WebSocketClass(`ws://127.0.0.1:${PORT}/ws`);
  let buffer = '';
  let levelState = null;
  let welcome = null;
  const submitResult = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout E2E (buffer final: ${buffer.slice(-400)})`)), 120_000);
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'hello', payload: { playerId } }));
    });
    ws.on('message', async (raw) => {
      const m = JSON.parse(String(raw));
      if (m.type === 'welcome') {
        welcome = m.payload;
        ws.send(JSON.stringify({ type: 'start', payload: {} }));
      } else if (m.type === 'levelState') {
        levelState = m.payload.level;
        // 3) interacción real por terminal: help (intercepción), y solución del nivel
        setTimeout(() => ws.send(JSON.stringify({ type: 'input', payload: { data: 'help\r' } })), 800);
        setTimeout(() => ws.send(JSON.stringify({ type: 'input', payload: { data: 'goal\r' } })), 1400);
        setTimeout(() => ws.send(JSON.stringify({ type: 'input', payload: { data: 'cat ~/.secreto\r' } })), 2600);
        setTimeout(() => {
          // 4) submit de lo capturado en el stream (como el metal del juego)
          const found = buffer.match(/FLAG\{[0-9a-f]{24}\}/);
          if (!found) {
            clearTimeout(timer);
            reject(new Error(`no apareció ninguna flag en el stream; buffer tail: ${buffer.slice(-300)}`));
            return;
          }
          console.log('3) capturamos flag del stream ✓ y la sometemos con submitFlag (vía UI):');
          ws.send(JSON.stringify({ type: 'submitFlag', payload: { flag: found[0] } }));
        }, 4200);
      } else if (m.type === 'data') {
        buffer += m.payload.data;
      } else if (m.type === 'submitResult') {
        clearTimeout(timer);
        resolve({ result: m.payload, levelState, welcome, buffer });
      }
    });
    ws.on('error', (e) => reject(e));
  });

  console.log(`4) nivel servido: ${submitResult.levelState.id} (${submitResult.levelState.title})`);
  console.log(`   rango inicial: ${submitResult.welcome.rank}, xp: ${submitResult.welcome.xp}`);
  console.log(`   submit passed=${submitResult.result.passed}, xpGained=${submitResult.result.xpGained}, total=${submitResult.result.totalXp}`);

  if (!submitResult.result.passed) throw new Error('el submit no pasó: ' + JSON.stringify(submitResult.result).slice(0, 300));
  if (buffer.includes('comandos') === false && !/help/i.test(buffer)) {
    console.warn('  ⚠ el output de help no apareció (intercepción a revisar)');
  }

  // 5) persistencia real via API
  const { stdout: apiOut } = await execP(
    `curl -s http://127.0.0.1:${PORT}/api/player/${playerId}`,
  );
  const api = JSON.parse(apiOut);
  if (!api.progress?.length || api.progress[0].level_id !== 'fundamentos-l1') {
    throw new Error('el progreso no se guardó: ' + apiOut.slice(0, 200));
  }
  console.log('5) progreso persistido: fundamentos-l1 resuelto en SQLite ✓');

  code = 0;
} catch (e) {
  console.error('E2E-FAIL:', e.message);
  if (server) {
    console.error('--- tail log servidor ---\n' + logTail.join('').slice(-900));
  }
} finally {
  server?.kill('SIGTERM');
}
process.exit(code);
