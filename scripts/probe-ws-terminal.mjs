/**
 * probe-ws-terminal — reproduce el flujo del cliente contra el server real:
 * hello → start("fundamentos/l1") → teclar "ls\\r" → registrar todo lo que llega.
 * Uso: node scripts/probe-ws-terminal.mjs [puerto=18080] [input="ls"]
 */
import WebSocket from 'ws';

const port = process.argv[2] || '18080';
const typed = process.argv[3] || 'ls';
const playerId = 'probe' + Math.random().toString(36).slice(2, 10);
const log = [];
let sawLevel, sawData = 0;

const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
const done = (code) => {
  console.log('=== RESULTADO ===');
  console.log('levelState:', sawLevel ? 'RECIBIDO' : 'NO RECIBIDO');
  console.log('chunks data:', sawData);
  console.log('mensajes:', log.length);
  for (const l of log.slice(0, 14)) console.log(' ', l);
  process.exit(code);
};
const killer = setTimeout(() => { console.log('TIMEOUT global'); try { ws.close(); } catch { /* ya cerrado */ } done(1); }, 40_000);

ws.on('error', (e) => { console.log('WS error:', e.message); done(1); });
ws.on('open', () => {
  log.push('open');
  ws.send(JSON.stringify({ type: 'hello', payload: { playerId } }));
});
ws.on('message', (raw) => {
  let m; try { m = JSON.parse(String(raw)); } catch { /* mensaje corrupto: se ignora */ return; }
  if (m.type === 'welcome') {
    log.push('welcome ok');
    ws.send(JSON.stringify({ type: 'start', payload: {} }));
    return;
  }
  if (m.type === 'levelState') {
    sawLevel = true;
    log.push(`levelState: ${m.payload?.level?.id ?? 'null'} startedAt=${m.payload?.startedAt}`);
    // teclear como el cliente: carácter a carácter + Enter
    step();
    return;
  }
  if (m.type === 'data') { sawData++; if (log.length < 40) log.push(`data: ${JSON.stringify(m.payload.data).slice(0, 80)}`); return; }
  if (m.type === 'error') { log.push(`ERROR: ${m.payload.message}`); return; }
  if (m.type === 'exit') { log.push(`exit: ${m.payload.reason}`); return; }
});

// tecleado natural: 60 caracteres/s + Enter al final (como xterm onData)
function step() {
  const full = typed + '\r';
  let i = 0;
  const t = setInterval(() => {
    if (i >= full.length) {
      clearInterval(t);
      setTimeout(() => { console.log('=== fin del tecleado ==='); done(sawData > 0 ? 0 : 1); }, 1200);
      return;
    }
    ws.send(JSON.stringify({ type: 'input', payload: { data: full[i++] } }));
  }, 16);
}

ws.on('close', () => { clearTimeout(killer); });
