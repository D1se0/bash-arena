/**
 * test-readline — prueba profunda del mini-readline del gateway vía WS real:
 * flechas ↑↓ (historial), ←→ (cursor), Home/Delete, Backspace e inserción a
 * mitad, Ctrl+W, Tab-completado (comandos y ficheros del cwd real del shell),
 * Enter en línea vacía e interceptación de comandos dojo (goal).
 * Uso: node scripts/test-readline.mjs [puerto=18080]
 */
import WebSocket from 'ws';

const port = process.argv[2] || '18080';
const playerId = 'probe' + Math.random().toString(36).slice(2, 10);
const results = [];
const pass = (name) => { results.push([true, name]); console.log(`  ✓ ${name}`); };
const fail = (name, extra = '') => { results.push([false, name]); console.log(`  ✗ ${name} ${extra}`); };
const strip = (s) => s
  .replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g, '')
  .replace(/\x1b\[[0-9;?]*[ -/]*[a-zA-Z]/g, '');

let all = '';
const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
ws.on('error', (e) => { console.error('WS error:', e.message); process.exit(1); });
ws.on('message', (raw) => {
  let m; try { m = JSON.parse(String(raw)); } catch { return; }
  if (m.type === 'data') all += m.payload.data ?? '';
  if (m.type === 'error') console.error('server error:', m.payload?.message);
  if (m.type === 'welcome') ws.send(JSON.stringify({ type: 'start', payload: {} }));
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const type = (s, gap = 12) => new Promise((r) => {
  let i = 0;
  if (s.length === 0) return r();
  const t = setInterval(() => {
    if (i >= s.length) { clearInterval(t); r(); return; }
    ws.send(JSON.stringify({ type: 'input', payload: { data: s[i++] } }));
  }, gap);
});
const resize = (cols) => ws.send(JSON.stringify({ type: 'resize', payload: { cols, rows: 24 } }));
const tail = () => strip(all).length;
const sawAfter = async (frag, since, ms = 5000) => {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (strip(all).slice(since).includes(frag)) return true;
    await sleep(100);
  }
  return false;
};

async function main() {
  await new Promise((r) => ws.once('open', r));
  ws.send(JSON.stringify({ type: 'hello', payload: { playerId } }));
  resize(100);
  // espera al arranque real del nivel (levelState ⇒ datos del shell)
  const deadline = Date.now() + 30_000;
  while (strip(all).length === 0 && Date.now() < deadline) await sleep(200);
  if (strip(all).length === 0) { fail('nivel arranca (datos en 30 s)'); return 1; }
  await sleep(600); // primer prompt asentado

  // 1) dos comandos base para el historial
  for (const [cmd, frag] of [['echo uno\r', 'uno'], ['echo dos\r', 'dos']]) {
    const since = tail();
    await type(cmd);
    if (await sawAfter(frag, since)) pass(`eco de ${frag}`); else fail(`eco de ${frag}`);
  }

  // 2) ↑ recupera `echo dos` y el Enter lo vuelve a ejecutar
  {
    const since = tail();
    await type('\x1b[A\r');
    if (await sawAfter('dos', since)) pass('↑ recupera historial y ejecuta'); else fail('↑ historial');
  }

  // 3) ↑↑ recupera `echo uno`
  {
    const since = tail();
    await type('\x1b[A\x1b[A\r');
    if (await sawAfter('uno', since)) pass('↑↑ segunda entrada del historial'); else fail('↑↑ historial');
  }

  // 4) ↓↓ vuelve al draft (línea vacía) sin escapes visibles ni basura
  {
    const before = tail();
    await type('\x1b[A\x1b[B');
    await sleep(400);
    const garbage = /(\x1b|\[A|\[B|\[D|\[C)/.test(strip(all).slice(before)) ? 'escapes visibles' : '';
    if (garbage) fail('↓↓ draft, sin escapes visibles', garbage); else pass('↓↓ draft limpio sin escapes');
    // el shell sigue vivo tras Enter en línea vacía (nuevo prompt ecoa el shell)
    await type('\r');
    if (await sawAfter('agent@dojo', before)) pass('shell vivo tras Enter vacío'); else fail('shell vivo tras Enter vacío');
  }

  // 5) edición a mitad de línea: echo hula → ←← + "z" ⇒ echo huzla ⇒ salida "huzla"
  {
    const since = tail();
    await type('echo hula');
    await type('\x1b[D\x1b[D'); // pos: entre 'l' y 'a'
    await type('z');            // inserción en medio
    await type('\r');
    if (await sawAfter('huzla', since)) pass('← + inserción a mitad + Enter sin basura de bash');
    else fail('edición a mitad', JSON.stringify(strip(all).slice(since, since + 240)));
  }

  // 6) Home(\x01) + Delete(\x1b[3~): `eecho hola` → `echo hola` ⇒ "hola"
  {
    const since = tail();
    await type('eecho hola');
    await type('\x01');        // home
    await type('\x1b[3~');     // delete
    await type('\r');
    if (await sawAfter('hola', since)) pass('Home + Delete corrigen la línea'); else fail('Home+Delete');
  }

  // 7) Ctrl+W mata la palabra anterior: `echo hola mundo` → `echo hola` ⇒ "hola"
  {
    const since = tail();
    await type('echo hola mundo');
    await type('\x17');
    await type('\r');
    await sleep(600);
    const s = strip(all).slice(since);
    const gotHello = s.includes('hola');
    const garbage2 = s.split('hola').pop()?.includes('mundo') ?? true;
    if (gotHello && !garbage2) pass('Ctrl+W borra palabra sin tocar lo demás'); else fail('Ctrl+W', JSON.stringify(s.slice(-160)));
  }

  // 8) Tab completado de comando: `hea` progresa hacia `head`
  {
    const since = tail();
    await type('hea\t');
    await sleep(1200);
    const last = (strip(all).slice(since).split(/\r?\n/).pop() ?? '');
    if (/hea[a-z]/.test(last)) pass('Tab completa comando'); else fail('Tab comando', JSON.stringify(last.slice(0, 120)));
  }

  // 9) Tab completado de FICHERO en el cwd real: `cat .pro` → `.profile` ⇒ su contenido
  {
    const since = tail();
    await type('\x15'); // Ctrl+U: línea limpia
    await type('cat .pro\t');
    await sleep(1500);
    const filled = /cat \.profil/.test(strip(all).slice(since));
    if (!filled) fail('Tab fichero: no completó .profile');
    await type('\r');
    // el .profile del sistema es de comentarios: basta con que cat corra (su contenido)
    const ok = await sawAfter('bash_profile', since);
    const noBashErr = !(await sawAfter('cat: .pro', since));
    if (filled && ok && noBashErr) pass('Tab fichero del cwd real y `cat .profile` sin error de bash');
    else fail('Tab fichero', JSON.stringify(strip(all).slice(since, since + 380).slice(-260)));
  }

  // 10) comando dojo interceptado intacto: `goal` responde sin rompass del editor
  {
    const since = tail();
    await type('goal\r');
    const ok = await sawAfter('goal>', since);
    const garbage = /(\x1b\[[A-D])/.test(strip(all).slice(since));
    if (ok && !garbage) pass('comando dojo `goal` intacto'); else fail('comando dojo goal');
  }

  const okN = results.filter((r) => r[0]).length;
  console.log(`\n=== ${okN}/${results.length} ok ===`);
  process.exitCode = okN === results.length ? 0 : 1;
}

main().finally(() => {
  try { ws.close(); } catch { /* ya cerrado */ }
  setTimeout(() => process.exit(process.exitCode), 250);
});
