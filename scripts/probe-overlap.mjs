/*
 * probe-overlap — mide el layout real al abrir «Capturar flag» y «cheat sheet»:
 * para cada estado captura los rects de la terminal, el panel del nivel y el
 * footer, y comprueba:
 *   · desktop (lg): la terminal sigue solo al lado del panel, sin invadirlo
 *     (terminal.right <= panel.left + 1) y dentro del viewport;
 *   · móvil (<lg): todo el contenido cabe dentro de main (sin solaparse con
 *     el footer ni desbordar la ventana).
 * Uso: node scripts/probe-overlap.mjs [url=8091]
 */
import { chromium } from 'playwright-core';

const APP_URL = process.argv[2] || 'http://127.0.0.1:8091/';
const problems = [];
const oklog = [];

async function measure(page, label) {
  const r = await page.evaluate(() => {
    const termEl = document.querySelector('.arena-terminal');
    const panelEl = document.querySelector('section[aria-label="panel del nivel"]');
    const mainEl = document.querySelector('main');
    const footerEl = document.querySelector('footer');
    const rect = (e) => e
      ? (({ x, y, width, height, top, bottom, right }) => ({ x, y, width, height, top, bottom, right }))(e.getBoundingClientRect())
      : null;
    return {
      win: { w: window.innerWidth, h: window.innerHeight },
      scrollY: window.scrollY,
      main: rect(mainEl),
      term: rect(termEl),
      panel: rect(panelEl),
      footer: rect(footerEl),
    };
  }).catch((e) => {
    problems.push(`${label}: evaluación falló: ${e.message}`);
    return null;
  });
  if (!r) return null;
  return { label, ...r };
}

function checkOut(m, mode) {
  if (!m || !m.term || !m.panel) { problems.push(`${m?.label ?? m}: faltan rects (term/panel)`); return; }
  if (mode === 'lg') {
    // fila: terminal a la izquierda, panel a la derecha — pueden compartir x,
    // pero terminal no debe solapar el panel ni salir del viewport.
    if (m.term.right > m.win.w + 1) problems.push(`${m.label}: la terminal desborda el viewport (${m.term.right} > ${m.win.w})`);
    const horizontalOverlap = m.term.right > m.panel.x + 1 && m.term.x < m.panel.right - 1;
    const verticalOverlap = m.term.bottom > m.panel.y + 1 && m.term.y < m.panel.bottom - 1;
    if (horizontalOverlap && verticalOverlap) {
      problems.push(`${m.label}: la terminal SOLAPA el panel del nivel (term.bottom=${m.term.bottom} panel.y=${m.panel.y})`);
    } else oklog.push(`${m.label}: sin solape (term.bottom=${Math.round(m.term.bottom)}, panel.y=${Math.round(m.panel.y)})`);
  } else {
    // columna: el panel no debe invadir la caja visual del terminal…
    const coversTerm = m.panel.y < m.term.bottom - 4 && m.panel.y > m.term.y + 8;
    if (coversTerm) problems.push(`${m.label}: el panel SOLAPA la terminal (panel.y=${Math.round(m.panel.y)} < term.bottom=${Math.round(m.term.bottom)})`);
    // el panel DEBE caber dentro de la caja visible del main (el footer está
    // fuera del scroll container y t: odas… el main recorta) — comparar por el
    // main, no por el footer, porque los rects ya vienen con el scroll hecho
    const mainBottom = m.main ? m.main.y + m.main.height : (m.footer?.y ?? m.win.h);
    if (m.panel.bottom > mainBottom + 2) problems.push(`${m.label}: el panel invade el footer (panel.bottom=${Math.round(m.panel.bottom)} > main.bottom=${Math.round(mainBottom)})`);
    else oklog.push(`${m.label}: panel íntegro (panel.bottom=${Math.round(m.panel.bottom)}, main.bottom=${Math.round(mainBottom)})`);
    if (m.term.width > m.win.w + 1) problems.push(`${m.label}: scroll horizontal (term.width=${Math.round(m.term.width)} > ${m.win.w})`);
  }
}

async function clickFirst(page, name) {
  const loc = page.getByRole('button', { name });
  if (!(await loc.count())) return false;
  await loc.first().scrollIntoViewIfNeeded().catch(() => {});
  await loc.first().click({ timeout: 8000 });
  return true;
}

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const [w, h, mode] of [[1440, 900, 'lg'], [1024, 768, 'lg'], [390, 844, 'sm']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  console.log(`— viewport ${w}x${h} (${mode})`);
  try {
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.arena-terminal'), { timeout: 20_000 });
    await page.waitForSelector('section[aria-label="panel del nivel"]', { timeout: 45_000 });
    await page.waitForTimeout(800);

    // scroll al fondo del main en <lg antes de medir (ver comentario en form flag)
    if (mode === 'sm') {
      await page.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = m.scrollHeight; });
      await page.waitForTimeout(250);
    }
    checkOut(await measure(page, 'base'), mode);

    // abrir el formulario de «Capturar flag» (los dos caminos: tarjeta y botón de acciones)
    const opened = (await clickFirst(page, /Capturar flag/)) || (await clickFirst(page, 'submit flag…'));
    if (!opened) throw new Error('no hay botón Capturar flag/submit flag…');
    await page.waitForTimeout(300);
    await page.waitForTimeout(400);
    // llevar el scroll del main al fondo: en <lg el contenido desborda el
    // main (clip) y los rects sin scroll confunden; lo que importa es que
    // al llegar al final TODO quede dentro del viewport
    if (mode === 'sm') {
      await page.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = m.scrollHeight; });
      await page.waitForTimeout(250);
    }
    checkOut(await measure(page, 'form flag'), mode);

    // dejar el form abierto Y abrir el cheat sheet encima (el caso del usuario)
    await clickFirst(page, /cheat sheet/);

    // cerrar form, dejar solo cheatsheet abierta
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    checkOut(await measure(page, 'cheat sheet solo'), mode);
  } catch (e) {
    problems.push(`${w}x${h}: ${e.message.split('\n')[0]}`);
  }
  await ctx.close();
}

await browser.close();
console.log('=== RESULTADO ===');
for (const o of oklog) console.log('  ✓', o);
for (const p of problems) console.log('  ✗', p);
process.exit(problems.length ? 1 : 0);
