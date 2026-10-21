/**
 * debug-session: monta ArenaSession real (clase del backend) para el nivel 1
 * y traza directo el stream del shell — sin gateway ni WS, para separar capas.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

process.env.ARENA_LEVELS_DIR = path.join(repoRoot, 'levels');
process.env.ARENA_DATA_DIR = fs.mkdtempSync('/tmp/arena-dbg-s-');
process.env.ARENA_FLAG_SECRET = `s-${crypto.randomBytes(8).toString('hex')}`;

// con node --import tsx/esm los .ts del backend se importan directo
const { ArenaSession } = await import(path.join(repoRoot, 'app/server/src/docker/session.ts'));
const { loadAllLevels } = await import(path.join(repoRoot, 'app/server/src/levels/loader.ts'));

const levels = loadAllLevels(process.env.ARENA_LEVELS_DIR);
const level = levels.get('fundamentos-l1');
console.log('nivel:', level?.id, level?.title);

const playerId = `plain-${crypto.randomBytes(5).toString('hex')}`;
const flag = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
let chunks = 0;
const session = new ArenaSession(playerId, level, flag, {
  onData: (c) => {
    chunks++;
    if (chunks <= 3) console.log(`[chunk ${chunks}]`, JSON.stringify(c.slice(0, 200)));
  },
  onExit: () => console.log('onExit: shell stream terminado'),
  onSetupLog: (l) => console.log('[setup]:', l.slice(0, 100)),
});
try {
  await session.start();
  console.log('sesión iniciada, vivo =', session.isAlive());
  await new Promise((r) => setTimeout(r, 2500));
  console.log('→ enviar "cat ~/.secreto\\r"');
  session.write('cat ~/.secreto\r');
  await new Promise((r) => setTimeout(r, 2000));
  console.log('chunks totales:', chunks, '| vivo =', session.isAlive());
  await session.kill();
} catch (e) {
  console.error('SESSION-FAIL:', e.message);
  await session.kill().catch(() => {});
  process.exit(1);
}
setTimeout(() => process.exit(0), 500);
