/**
 * probe-history-ws — verifica el editor del gateway: teclear un commando,
 * recuperar el historial con ↑ (\x1b[A) y mover el cursor con ←/→.
 * Uso: node scripts/probe-history-ws.mjs [puerto=18080]
 */
import WebSocket from 'ws';

const port = process.argv[2] || '18080';
const playerId = 'probe' + Math.random().toString(36).slice(2, 10);
const chunks = [];
const evs = [];   // (fase, eco visible)
let phase = 'arranque';

const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
const done = (code, msg) => {
  console.log(`=== ${msg ?? 'resultado'} ===`);
  console.log(JSON.stringify(chunks.join('')).replace(/\\n/g, '<NL>').replace(/\\u001b/g, '<ESC>').replace(/\\u007f/g, '<DEL>'));
  process.exit(code);
};
const killer = setTimeout(() => done(1, 'TIMEOUT'), 40_000);

const pasos = [
  { label: 'teclear', send: ['ec', 'ho A1\r'], wait: 1800 },
  { label: 'arriba', send: ['\x1b[A'], wait: 900 },
  { label: 'limpiar', send: ['\x15'], wait: 600 },
  { label: 'teclear2', send: ['x', 'y', 'z'], wait: 800 },
  { label: 'izquierda', send: ['\x1b[D'], wait: 400 },
  { label: 'izquierda', send: ['\x1b[D'], wait: 400 },
  { label: 'insertar A', send: ['A'], wait: 500 },
  { label: 'derecha', send: ['\x1b[C\x1b[C'], wait: 500 },
  { label: 'enterFinal', send: ['\r'], wait: 1500 },
];
let i = 0;

ws.on('error', (e) => { console.log('WS error:', e.message); done(1); });
ws.on('open', () => { ws.send(JSON.stringify({ type: 'hello', payload: { playerId } })); });
ws.on('message', (raw) => {
  let m; try { m = JSON.parse(String(raw)); } catch { return; }
  if (m.type === 'welcome') { ws.send(JSON.stringify({ type: 'start', payload: {} })); return; }
  if (m.type === 'levelState') { next(0); return; }
  if (m.type === 'data') { chunks.push(String(m.payload.data)); return; }
});

function next(k) {
  if (k >= pasos.length) {
    clearTimeout(killer);
    const out = chunks.join('');
    const historial = /[$>] ?echo A1/.test(out.slice(out.indexOf('A1\r') + 5));
    const editado = out.includes('bash: xAyz');
    console.log('historial recuperado con ↑:', historial ? 'SÍ' : 'NO');
    console.log('edición interior ← + inserción (xAyz):', editado ? 'SÍ' : 'NO');
    done(historial && editado ? 0 : 1, 'RESULTADO');
    return;
  }
  const p = pasos[k];
  phase = p.label;
  for (const t of p.send) ws.send(JSON.stringify({ type: 'input', payload: { data: t } }));
  setTimeout(() => next(k + 1), p.wait);
}
