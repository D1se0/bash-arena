/*
 * probe-specials-ws — tecleeo REAL (char a char, 60 cps) de comandos con
 * caracteres especiales contra el server desplegado, y verifica:
 *   1. acentos/ñ/comillas simples+dobles → el eco es exacto y ejecuta bien
 *   2. backspace (\x7f) intercalado → el editor corrige y ejecuta el texto
 *      final, sin remanentes tipo «cat.profile: command not found»
 *   3. pipes, ; , && , $( ) , glob \* → bash los interpreta
 *   4. ejecución anticipada (tecleeo completo en ráfaga + Enter) tras un
 *      comando anterior: el prompt resincroniza y no rompe la línea
 *   5. ↑ recupera de historial el comando con pipes/símbolos intacto
 * Uso: node scripts/probe-specials-ws.mjs [puerto=18080]
 */
import WebSocket from 'ws';

const port = process.argv[2] || '18080';
const playerId = 'sp' + Math.random().toString(36).slice(2, 8);
let buf = '';
const results = [];
let ws;

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
async function until(cond, ms = 8000) {
  const t0 = Date.now();
  while (!cond()) {
    if (Date.now() - t0 > ms) return false;
    await wait(60);
  }
  return true;
}
const promptCount = () => (buf.match(/\x1b\]133;A/g) || []).length;

/** teclear char a char (60 cps) + Enter */
async function type(cmd) {
  for (const ch of cmd) {
    ws.send(JSON.stringify({ type: 'input', payload: { data: ch } }));
    await wait(16);
  }
  ws.send(JSON.stringify({ type: 'input', payload: { data: '\r' } }));
}

const done = (code) => {
  console.log('=== RESULTADO probe-specials ===');
  for (const r of results) console.log(' ', r.pass ? '✓' : '✗', r.name, r.detail ? `— ${r.detail}` : '');
  const fails = results.filter((r) => !r.pass).length;
  console.log(`${results.length - fails}/${results.length} ok`);
  try { ws?.close(); } catch { /* ya cerrado */ }
  process.exit(fails ? 1 : 0);
};
const killer = setTimeout(() => { results.push({ name: 'timeout global', pass: false }); done(1); }, 90_000);

ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
ws.on('error', (e) => { results.push({ name: 'ws error: ' + e.message, pass: false }); done(1); });
ws.on('message', (raw) => {
  let m; try { m = JSON.parse(String(raw)); } catch { return; }
  if (m.type === 'data') buf += m.payload.data;
  if (m.type === 'welcome') ws.send(JSON.stringify({ type: 'start', payload: {} }));
  if (m.type === 'levelState') step().catch((e) => { results.push({ name: 'step fail: ' + e.message, pass: false }); done(1); });
  if (m.type === 'error') results.push({ name: `server error: ${m.payload?.message}`, pass: false });
});
ws.on('open', () => ws.send(JSON.stringify({ type: 'hello', payload: { playerId } })));

async function step() {
  // esperar el primer prompt del nivel antes de teclear
  await until(() => promptCount() >= 1, 20_000);

  // 1 ─ acentos, ñ, comillas y eco exacto
  buf = '';
  await type(`echo "ñañaco ünlê é→" 'quo$te'`);
  await until(() => buf.includes('\x1b[?2004l\r') || /(not found|syntax)/.test(buf));
  await wait(700);
  results.push({
    name: 'eco exacto de ñ/acento/comillas',
    pass: buf.includes('ñañaco ünlê é→') && buf.includes('quo$te') && !/not found|syntax/.test(buf),
  });

  // 2 ─ backspaces intercalados: «echX» + retroceso + «o DOJO» → «echo DOJO»
  await until(() => promptCount() >= 2, 8000);
  buf = '';
  await type(`echX\x7fo DOJO`);
  await until(() => /DOJO\r/.test(buf) || /(not found|syntax)/.test(buf));
  await wait(500);
  results.push({ name: 'backspace intercalado corrige (echo DOJO)', pass: /DOJO\r/.test(buf) && !/not found|syntax/.test(buf) });

  // 3 ─ pipes + && + $( ) + glob \* + ;
  await until(() => promptCount() >= 3, 8000);
  buf = '';
  await type(`printf '%s\\n' áéíóú-ubuntu-ñ | grep -c ubuntu && echo sub=$(expr 2 + 3) ; ls | head -3`);
  await until(() => /sub=5/.test(buf) || /(not found|syntax)/.test(buf));
  await wait(700);
  results.push({
    name: 'pipe + grep + $(expr) + ;',
    pass: /[\r\n]1[\r\n]/.test(buf) && /sub=5/.test(buf) && !/not found|syntax/.test(buf),
    detail: buf.replace(/\x1b\[[0-9;?]*[a-zA-Z]|\x1b\][^\x07]*\x07/g, '·').slice(0, 300),
  });

  // 4 ─ tecleo anticipado en ráfaga (todo de golpe + Enter)
  await until(() => promptCount() >= 4, 8000);
  buf = '';
  for (const ch of `echo ANTI-çIPADO && echo DOS\r`) ws.send(JSON.stringify({ type: 'input', payload: { data: ch } }));
  await until(() => /DOS\r\n/.test(buf) || /(not found|syntax)/.test(buf), 10_000);
  await wait(600);
  results.push({ name: 'ejecución anticipada en ráfaga', pass: /DOS\r\n/.test(buf) && !/not found|syntax/.test(buf), detail: buf.slice(-100) });

  // 5 ─ ↑ recupera de historial el ÚLTIMO comando (el de la ráfaga), intacto
  await until(() => promptCount() >= 5, 8000);
  buf = '';
  ws.send(JSON.stringify({ type: 'input', payload: { data: '\x1b[A' } }));
  await until(() => buf.includes('ANTI-çIPADO') || /(not found|syntax)/.test(buf));
  await wait(400);
  results.push({ name: '↑ recupera el último comando con acento/símbolos intacto', pass: buf.includes('ANTI-çIPADO') && !/not found|syntax/.test(buf) });

  clearTimeout(killer);
  done(results.every((r) => r.pass) ? 0 : 1);
}
