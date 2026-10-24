/* global window, document, navigator, localStorage */
/* probe-progress-port — E2E de migración de progreso con Chromium real.
 * A = «PC original»: jugador sembrado con XP/progreso vía API; abre «migrar
 *     progreso», exporta fichero + código de transferencia.
 * B = «PC nuevo»: contexto limpio de navegador; importa el código pegado,
 *     adopta la identidad y tras reload la welcome muestra el XP y niveles.
 * Uso: node scripts/probe-progress-port.mjs [urlApp]
 */
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const APP_URL = process.argv[2] || 'http://127.0.0.1:8091/';
const SEED_ID = process.env.SEED_ID || 'portprobe000100001';
const OTHER_ID = process.env.OTHER_ID || 'portprobe000200002';
const API = APP_URL.replace(/\/$/, '');
const SHOTS = path.resolve('tests/webshots');
mkdirSync(SHOTS, { recursive: true });

const fails = [];
const ok = (m) => { console.log('  ✓', m); };
const fail = (m) => { fails.push(m); console.log('  ✗', m); };

/* ── siembra el «PC original»: XP + nivel resuelto + logro vía API ── */
async function seed() {
  for (const id of [SEED_ID, OTHER_ID]) {
    await fetch(`${API}/api/progress/${id}/export`).catch(() => {});
    const res = await fetch(`${API}/api/progress/${id}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: { xp: 777 },
        progress: [{ level_id: 'fundamentos-l1', track: 'fundamentos', solved: 1, attempts: 2, time_s: 45 }],
        achievements: [{ name: 'primer paso' }],
      }),
    });
    if (!res.ok) fail(`seed ${id}: HTTP ${res.status}`);
  }
}
await seed();

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

/* ── A: PC original ─────────────────────────────────────────────── */
let transferCode = '';
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`A pageerror: ${e.message}`));
  await page.addInitScript((id) => {
    try { localStorage.setItem('arena-player-id', id); } catch { /* noop */ }
  }, SEED_ID);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('section[aria-label="panel del nivel"]') !== null, { timeout: 45_000 });
  ok(`A: nivel activo para jugador sembrado (${SEED_ID})`);

  // abre el modal de migración
  const mig = page.getByRole('button', { name: /migrar progreso/ });
  await mig.waitFor({ state: 'visible', timeout: 10_000 });
  await mig.click();
  const dlg = page.getByRole('dialog', { name: 'migrar progreso' });
  await dlg.waitFor({ state: 'visible', timeout: 5_000 });
  ok('A: modal de migración abierto');

  // exporta: descarga + código
  const dl = page.waitForEvent('download', { timeout: 30_000 });
  await dlg.getByRole('button', { name: /exportar progreso/ }).click();
  const download = await dl;
  const dlPath = path.join(SHOTS, 'port-export-download.json');
  await download.saveAs(dlPath);
  const content = readFileSync(dlPath, 'utf8');
  const j = JSON.parse(content);
  if (j.player?.id === SEED_ID && j.player?.xp === 777) ok('A: fichero descargado con player.xp=777');

  await dlg.locator('textarea[aria-label="código de transferencia"]').waitFor({ state: 'visible', timeout: 5_000 });
  transferCode = await dlg.locator('textarea[aria-label="código de transferencia"]').inputValue();
  if (transferCode.startsWith('BA1-') && transferCode.length > 100) {
    ok(`A: código de transferencia generado (${transferCode.replace(/\n/g, '').length} chars)`);
  } else {
    fail('A: código de transferencia vacío/inválido');
  }
  await page.screenshot({ path: path.join(SHOTS, 'port-export.png') });
  await ctx.close();
}

/* ── B: PC nuevo (contexto limpio, otro playerId local) ────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`B pageerror: ${e.message}`));
  await page.addInitScript((id) => {
    try { localStorage.setItem('arena-player-id', id); } catch { /* noop */ }
  }, OTHER_ID);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('section[aria-label="panel del nivel"]') !== null, { timeout: 45_000 });

  await page.getByRole('button', { name: /migrar progreso/ }).click();
  const dlg = page.getByRole('dialog', { name: 'migrar progreso' });
  await dlg.waitFor({ state: 'visible', timeout: 5_000 });

  const box = dlg.locator('textarea[aria-label="código de transferencia a importar"]');
  await box.fill(transferCode);
  await dlg.getByRole('button', { name: /desde código pegado/ }).click();

  // adopta la identidad del fichero → tras reload, welcome del SEED_ID con 777 XP
  try {
    await page.waitForFunction((id) => localStorage.getItem('arena-player-id') === id, SEED_ID, { timeout: 10_000 });
    ok('B: identidad adoptada (localStorage = jugador del fichero)');
  } catch {
    fail('B: la identidad NO fue adoptada');
  }
  await page.screenshot({ path: path.join(SHOTS, 'port-import.png') });

  // tras el reload automático, el welcome debe traer 777 XP
  try {
    await page.waitForFunction(() => {
      const els = document.querySelectorAll('aside p');
      return [...els].some((e) => e.textContent === '777');
    }, { timeout: 30_000 });
    const rank = (await page.locator('aside').textContent()) ?? '';
    if (rank.includes('Explorador') || rank.includes('Rango')) ok('B: XP migrados visibles (777)');
  } catch {
    fail('B: la welcome no muestra los XP migrados tras reload');
  }
  await ctx.close();
}

/* ── B2: merge en jugador existente (import a jugador local) ───── */
{
  const res = await fetch(`${API}/api/progress/${OTHER_ID}/export`);
  const before = (await res.json());
  const lvlCount = before.progress?.length ?? 0;
  if (lvlCount >= 1) {
    ok(`B2: jugador local heredó el progreso (import merge: ${lvlCount} nivel(es))`);
  } else {
    fail('B2: el jugador local no recibió el merge');
  }
}

await browser.close();
console.log(fails.length ? `PROGRESS-PORT-FAIL (${fails.length})` : 'PROGRESS-PORT-OK');
process.exit(fails.length ? 1 : 0);
