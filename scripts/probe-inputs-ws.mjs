/**
 * probe-inputs-ws — reproducciones del cliente: teclear un comando con
 * backspace ('\x7f') y recorrer el historial con ↑/↓ y mover el cursor con
 * ←/→. Captura TODA la salida del bash para inspeccionar cómo quedó el prompt.
 * Uso: node scripts/probe-inputs-ws.mjs [puerto=18080]
 */
import WebSocket from 'ws';

const port = process.argv[2] || '18080';
const playerId = 'probe' + Math.random().toString(36).slice(2, 10);
const chunks = [];
let phase = 'nada';

const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
const done = (code) => {
  console.log('=== SALIDA CRUDA (\\n -> <NL>, \\x1b -> <ESC>, \\x7f -> <DEL>, \\b -> <BS>) ===');
  console.log('fase activa al cortar:', phase);
  console.log(JSON.stringify(chunks.join('')).replace(/\\n/g, '<NL>').replace(/\\u001b/g, '<ESC>').replace(/\\u007f/g, '<DEL>').replace(/\\b/g, '<BS>'));
  process.exit(code);
};
const killer = setTimeout(() => done(1), 30_000);

// tecleado "de persona": cada token se manda de golpe (como xterm fast typing)
// y Enter con \r
const script = [
  { label: 'cmd .profile', tok: ['cat', ' ', '.profile', '\r'] },
  { label: 'backspace', tok: ['cat .profil', '\x7f', 'e', '\r'] },
  { label: 'arriba', tok: ['\x1b[A'] },
  { label: 'abajo', tok: ['\x1b[B'] },
  { label: 'izquierda', tok: ['\x1b[D'] },
  { label: 'derecha', tok: ['\x1b[C'] },
];
let i = 0, j = 0;

ws.on('error', (e) => { console.log('WS error:', e.message); done(1); });
ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'welcome-check' })); // el gateway respondera welcome
  ws.send(JSON.stringify({ type: 'hello', payload: { playerId } }));
});
ws.on('message', (raw) => {
  let m; try { m = JSON.parse(String(raw)); } catch { return; }
  if (m.type === 'welcome') {
    ws.send(JSON.stringify({ type: 'start', payload: {} }));
    return;
  }
  if (m.type === 'levelState') { pump(); return; }
  if (m.type === 'data') { chunks.push(String(m.payload.data)); return; }
  if (m.type === 'error') { console.log('ERROR servidor:', m.payload?.message); }
});

function pump() {
  if (i >= script.length) setTimeout(() => done(0), 1500);
  else if (j >= script[i].tok.length) { phase = script[i].label; i++; j = 0; setTimeout(pump, 500); }
  else {
    phase = script[i].label;
    ws.send(JSON.stringify({ type: 'input', payload: { data: script[i].tok[j++] } }));
    setTimeout(pump, 90);
  }
}
