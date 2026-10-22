/* global window, document, getComputedStyle */
/*
 * probe-fullscreen — diagnóstico interactivo real de la terminal:
 *  1) entra en pantalla completa, teclea comandos de lectura (`ls -l`, `cat`),
 *     mide cols/rows del fit y captura pantalla
 *  2) abre el cheat sheet y mide desbordes (terminal fuera de su caja,
 *     scroll vertical, panel cortando contenido)
 *  3) repite a 1440 / 1024 / 390 px
 * Salida: medidas en consola + capturas en tests/webshots/probe-*.png
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const APP_URL = process.argv[2] || 'http://127.0.0.1:8080/';
const SHOTS = path.resolve('tests/webshots');
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function probeAt(width, height) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`[${width}] pageerror:`, e.message));
  await page.addInitScript(() => {
    window.__arenaData = '';
    const OrigWS = window.WebSocket;
    const wrapped = function (url) {
      const ws = new OrigWS(url);
      ws.addEventListener('message', (ev) => {
        try {
          const m = JSON.parse(ev.data);
          if (m.type === 'data') window.__arenaData += m.payload.data;
        } catch { /* no JSON */ }
      });
      return ws;
    };
    wrapped.prototype = OrigWS.prototype;
    window.WebSocket = wrapped;
  });
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForFunction(() => (window.__arenaData || '').includes('LVL'), { timeout: 60_000 });
  } catch { console.log(`[${width}] FAIL: no llegó prompt LVL`); }
  await page.waitForTimeout(800);

  const measure = (label) => page.evaluate((l) => {
    const de = document.documentElement;
    const term = document.querySelector('.arena-terminal');
    const host = document.querySelector('.xterm');
    const tr = term?.getBoundingClientRect();
    const hr = host?.getBoundingClientRect();
    // xterm dims del terminal subyacente
    const core = window.__arenaTerm;
    return {
      label: l,
      docOverflowY: de.scrollHeight > de.clientHeight + 1,
      scrollY: de.scrollHeight - de.clientHeight,
      termRect: tr ? { top: Math.round(tr.top), bottom: Math.round(tr.bottom), h: Math.round(tr.height) } : null,
      xtermRect: hr ? { top: Math.round(hr.top), bottom: Math.round(hr.bottom), h: Math.round(hr.height) } : null,
      xtermOutside: tr && hr ? hr.bottom > tr.bottom + 1 || hr.top < tr.top - 1 : null,
      cols: core?._core?.dimensions?.css?.canvas?.width ?? null,
      rows: core?.rows ?? null,
      colsNum: core?.cols ?? null,
    };
  }, label);

  // 1) estado base
  console.log(`\n===== ancho ${width} =====`);
  console.log('base:', JSON.stringify(await measure('base')));

  // 2) cheat sheet abierto
  await page.getByRole('button', { name: /cheat sheet/i }).click();
  await page.waitForTimeout(900);
  const withSheet = await measure('cheatsheet');
  console.log('cheatsheet:', JSON.stringify(withSheet));
  await page.screenshot({ path: `${SHOTS}/probe-cheatsheet-${width}.png`, fullPage: true });

  // cierra cheat sheet
  await page.getByRole('button', { name: /cerrar cheat sheet/i }).click();
  await page.waitForTimeout(400);

  // 3) fullscreen: teclear y leer archivos
  await page.getByRole('button', { name: /pantalla completa/ }).first().click();
  await page.waitForTimeout(900);
  await page.locator('.xterm').click();
  await page.keyboard.type('ls -l /home/agent', { delay: 25 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  await page.keyboard.type('cat ~/.secreto', { delay: 25 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  const fsData = await measure('fullscreen');
  console.log('fullscreen:', JSON.stringify(fsData));
  const echoed = (await page.evaluate(() => window.__arenaData)).includes('ls -l /home/agent');
  const flagEcho = (await page.evaluate(() => window.__arenaData)).match(/FLAG\{[0-9a-f]+\}/);
  console.log(`fullscreen eco ls=${echoed} flag=${flagEcho ? 'sí' : 'no'}`);
  await page.screenshot({ path: `${SHOTS}/probe-fullscreen-${width}.png` });

  const fs = await page.evaluate(() => ({
    fixed: getComputedStyle(document.querySelector('.arena-terminal')?.parentElement || document.body).position === 'fixed',
  }));
  console.log('fullscreen overlay fixed:', fs.fixed);

  // salir con Esc
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  const back = await measure('tras Esc');
  console.log('tras Esc:', JSON.stringify(back));
  await page.screenshot({ path: `${SHOTS}/probe-escaped-${width}.png`, fullPage: true });

  await ctx.close();
}

for (const [w, h] of [[1440, 900], [1024, 900], [390, 812]]) {
  await probeAt(w, h);
}

await browser.close();
console.log('\nPROBE-DONE');
