/* global window, document */
/* probe-examples-modal — probe del popup «ejemplos» del cliente (LevelPanel → ExamplesModal).
 * Uso: node scripts/probe-examples-modal.mjs [urlApp]  — espera nivel activo,
 * pulsa el botón «ejemplos», verifica modal + contenido, cierra con Esc. */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const APP_URL = process.argv[2] || 'http://127.0.0.1:5173/';
const SHOTS = path.resolve('tests/webshots');
mkdirSync(SHOTS, { recursive: true });

const fails = [];
const oks = [];
const ok = (m) => { oks.push(m); console.log('  ✓', m); };
const fail = (m) => { fails.push(m); console.log('  ✗', m); };

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => { console.error('PAGEERROR:', e.message); fail(`pageerror: ${e.message}`); });

await page.addInitScript(() => {
  window.__arenaData = '';
  window.__arenaLevel = null;
  const OrigWS = window.WebSocket;
  const wrapped = function (url) {
    const ws = new OrigWS(url);
    ws.addEventListener('message', (ev) => {
      try {
        const m = JSON.parse(ev.data);
        if (m.type === 'data') window.__arenaData += m.payload.data;
        if (m.type === 'levelState') window.__arenaLevel = m.payload?.level?.id ?? null;
      } catch { /* no JSON */ }
    });
    return ws;
  };
  wrapped.prototype = OrigWS.prototype;
  window.WebSocket = wrapped;
});

await page.goto(APP_URL, { waitUntil: 'domcontentloaded' }).catch((e) => fail(`goto: ${e.message}`));

try {
  await page.waitForFunction(() => window.__arenaLevel !== null, { timeout: 45_000 });
  ok(`nivel activo por WS: ${await page.evaluate(() => window.__arenaLevel)}`);
} catch {
  fail('no llegó levelState en 45s');
}

// botón «ejemplos» visible
const btn = page.getByRole('button', { name: /ejemplos/ });
try {
  await btn.waitFor({ state: 'visible', timeout: 10_000 });
  ok('botón «ejemplos» visible en el panel del nivel');
} catch {
  fail('botón «ejemplos» no visible');
}

// abrir modal
await btn.click();
const dialog = page.getByRole('dialog', { name: /ejemplos del nivel/ });
try {
  await dialog.waitFor({ state: 'visible', timeout: 5_000 });
  ok('popup de ejemplos abierto (aria-modal)');
} catch {
  fail('popup no apareció');
}

// contenido: chip SALIDA ESPERADA + bloque pre con la flag demo
const chip = dialog.getByText('SALIDA ESPERADA').first();
try {
  await chip.waitFor({ state: 'visible', timeout: 5_000 });
  ok('chip «SALIDA ESPERADA» visible');
} catch {
  fail('chip SALIDA ESPERADA ausente');
}
const pre = dialog.locator('pre');
try {
  const text = (await pre.first().textContent()) ?? '';
  if (text.includes('FLAG{d3b09a4f7c2e1b8d6041a5f3}')) ok('bloque pre contiene la flag demo');
  else fail(`bloque pre sin la flag demo (${text.slice(0, 80)}…)`);
} catch (e) {
  fail(`bloque pre no legible: ${e.message}`);
}

// sin el comando: el pre no debe contener prompts como agent@dojo ni "$ "
{
  const text = (await pre.first().textContent()) ?? '';
  if (!/\$ |agent@dojo/.test(text)) ok('la salida NO revela el comando (solo resultado)');
  else fail('la salida parece contener comando/prompt');
}

// captura de pantalla
await page.screenshot({ path: path.join(SHOTS, 'ejemplos-modal.png'), fullPage: true });
ok('captura: tests/webshots/ejemplos-modal.png');

// cerrar con Esc
await page.keyboard.press('Escape');
try {
  await dialog.waitFor({ state: 'detached', timeout: 3_000 });
  ok('Esc cierra el popup');
} catch {
  fail('Esc no cerró el popup');
}

// responsive: móvil 390px
{
  const m = await ctx.newPage();
  await m.setViewportSize({ width: 390, height: 844 });
  await m.goto(APP_URL, { waitUntil: 'domcontentloaded' }).catch(() => {});
  try {
    await m.waitForFunction(() => window.__arenaLevel !== null, { timestamp: undefined, timeout: 45_000 });
    const b2 = m.getByRole('button', { name: /ejemplos/ });
    await b2.waitFor({ state: 'visible', timeout: 10_000 });
    await b2.click();
    const d2 = m.getByRole('dialog', { name: /ejemplos del nivel/ });
    await d2.waitFor({ state: 'visible', timeout: 5_000 });
    const noHScroll = await m.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    if (noHScroll) ok('móvil 390px: popup visible sin scroll horizontal');
    else fail('móvil 390px: hay scroll horizontal');
    await m.screenshot({ path: path.join(SHOTS, 'ejemplos-modal-movil.png'), fullPage: true });
  } catch (e) {
    fail(`móvil: ${e.message?.slice(0, 120)}`);
  }
}

await browser.close();
console.log(fails.length ? `EJEMPLOS-MODAL-FAIL (${fails.length})` : 'EJEMPLOS-MODAL-OK');
process.exit(fails.length ? 1 : 0);
