/* probe-pdf-progress — insufla progreso sintético a un jugador de test y
 * genera su PDF a través de la app desplegada (flujos: tabla paginada,
 * logros, diploma, barras por track). Uso: node scripts/probe-pdf-progress.mjs */
/* global window, localStorage */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const APP = 'http://127.0.0.1:8091/';
const API = 'http://127.0.0.1:18080';
const PID = 'pdfprobe00000000000000aaa';
const TRACKS = [['fundamentos', 20], ['filtrado', 20], ['busqueda', 20], ['procesado', 20], ['permisos', 20]];
const progress = [];
const tracks = {};
for (const [track, n] of TRACKS) {
  const range = '0123456789abcdef';
  for (let i = 1; i <= 14; i++) {
    const level_id = `${track}-l${i}`;
    progress.push({
      level_id, track, solved: 1, attempts: 1 + (i % 3), hints_used: i % 3, time_s: 45 + i * 7,
      xp_earned: 40 + (i % 4) * 10, solved_at: `2026-10-2${(i % 5) + 1}T10:0${i % 10}:00`,
    });
    tracks[track] = (tracks[track] ?? 0) + 1;
  }
}
const state = {
  format: 'bash-arena-progress', version: 3, exported_at: '2026-10-25T00:00:00Z',
  player: { id: PID, xp: 620, name: 'test-probe' },
  progress, achievements: [
    { name: 'Primera flag', earned_at: '2026-10-10T08:00:00Z' },
    { name: 'Manos limpias (sin pistas)', earned_at: '2026-10-12T09:00:00Z' },
    { name: 'Racha de 5', earned_at: '2026-10-14T11:00:00Z' },
  ],
  stats: [],
};
const res = await fetch(`${API}/api/progress/${PID}/import`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) });
console.log('import →', res.status, await res.text());

const SHOTS = 'tests/webshots'; mkdirSync(SHOTS, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((id) => window.localStorage.setItem('arena-player-id', id), PID);
await page.goto(APP, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
page.once('download', (d) => console.log('download evt:', d.suggestedFilename()));
await page.getByTitle(/genera un PDF/).click();
await page.locator('input[placeholder*="ruxdev"]').fill('Concepto Bamboo');
const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByText('⬇ generar y descargar PDF').click()]);
const pdf = `${SHOTS}/probe-${download.suggestedFilename()}`;
await download.saveAs(pdf);
console.log('pdf:', pdf);
try { execFileSync('pdftoppm', ['-png', '-r', '50', pdf, `${SHOTS}/probe-pdf`]); console.log('preview PNG por página ✓'); } catch { console.log('pdftoppm no disponible'); }
await browser.close();
