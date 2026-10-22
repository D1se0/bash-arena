/*
 * test-web-visual — test visual/funcional del stack con Chromium real:
 *  A. App local (:8091): tecleo real en la terminal, captura de flag por la UI,
 *     sin desbordes en «Sesión activa», sidebar ni scroll horizontal.
 *  B. Docs (dist servido local): las 6 páginas a 1440/1024/390 px,
 *     sin scroll horizontal ni header con envoltura.
 * Salida: TEST-VISUAL-OK / FAIL + capturas en tests/webshots/.
 * Uso: node scripts/test-web-visual.mjs [urlApp] [urlDocs]
 */
/* global window, document, navigator, getComputedStyle */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const APP_URL = process.argv[2] || 'http://127.0.0.1:8091/';
const DOCS_URL = process.argv[3] || 'http://127.0.0.1:4173/';
const SHOTS = path.resolve('tests/webshots');
mkdirSync(SHOTS, { recursive: true });

const fails = [];
const oks = [];
const ok = (m) => oks.push(m);
const fail = (m) => fails.push(m);

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

/* ───────────── A. app local ───────────── */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`pageerror app: ${e.message}`));

  // sniffer de WS: guarda todos los «data» que llegan a la terminal en __arenaData
  await page.addInitScript(() => {
    window.__arenaData = '';
    window.__arenaLevel = null;
    window.__arenaHint = null;
    const OrigWS = window.WebSocket;
    const wrapped = function (url) {
      const ws = new OrigWS(url);
      ws.addEventListener('message', (ev) => {
        try {
          const m = JSON.parse(ev.data);
          if (m.type === 'data') window.__arenaData += m.payload.data;
          if (m.type === 'levelState') window.__arenaLevel = m.payload?.level?.id ?? window.__arenaLevel;
          if (m.type === 'hint') window.__arenaHint = m.payload?.text ?? null;
        } catch {
          /* no JSON */
        }
      });
      return ws;
    };
    wrapped.prototype = OrigWS.prototype;
    window.WebSocket = wrapped;
  });

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' }).catch((e) => fail(`goto app: ${e.message}`));

  // espera al prompt del nivel
  try {
    await page.waitForFunction(() => (window.__arenaData || '').includes('LVL'), { timeout: 45_000 });
    ok('terminal: prompt del nivel visible (WS → xterm)');
  } catch {
    fail('terminal: no llegó el prompt LVL en 45s');
  }

  // sin desbordes en el app
  await page.waitForTimeout(800);
  const layout = await page.evaluate(() => {
    const noHScroll = document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1;
    const aside = document.querySelector('aside');
    const bottom = aside
      ? Math.max(...[...aside.children].map((s) => s.getBoundingClientRect().bottom))
      : 0;
    const bounded = aside ? aside.scrollHeight <= aside.clientHeight + 2 : true;
    const panel = document.querySelector('section');
    const panelOk = panel ? panel.scrollHeight <= panel.clientHeight * 4 : false;
    return { noHScroll, bounded, panelOk, asideBottom: bottom, vh: window.innerHeight };
  });
  if (layout.noHScroll) {
    ok('app: sin scroll horizontal');
  } else {
    fail('app: scroll horizontal');
  }
  if (layout.bounded) {
    ok('app: sidebar sin contenido recortado (scroll interno ok)');
  } else {
    fail('app: sidebar con contenido recortado');
  }
  if (layout.asideBottom <= layout.vh + 2) {
    ok('app: «Sesión activa» dentro del viewport');
  } else {
    fail(`app: sidebar desborda (${layout.asideBottom} > ${layout.vh})`);
  }

  // tecleo con teclado REAL
  await page.locator('.xterm').click();
  await page.keyboard.type('ls -l /home/agent', { delay: 30 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1400);
  // el gateway puede intercalar borrados de retención (\x1b[2K\r al hacer flush):
  // se limpian los escapes antes de comparar el eco literario
  const echoed = (await page.evaluate(() => window.__arenaData))
    .replace(/\x1b\[[0-9;?]*/g, '').replace(/\x1b\][^\x07]*\x07/g, '')
    .includes('ls -l /home/agent');
  if (echoed) {
    ok('terminal: teclado real capturado y eco visible');
  } else {
    fail('terminal: el puerto no recibió el tecleo');
  }

  // capturar la flag vía terminal y submitearla por la UI nueva
  await page.keyboard.type('cat ~/.secreto');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  const flag = (await page.evaluate(() => window.__arenaData)).match(/FLAG\{[0-9a-f]{24}\}/)?.[0];
  if (!flag) {
    fail('terminal: no se capturó la FLAG del nivel');
  } else {
    ok('terminal: FLAG capturada con cat ~/.secreto');
    await page.getByRole('button', { name: /Capturar flag/ }).click();
    await page.locator('#flag-input').fill(flag);
    await page.locator('form button[type=submit]').click();
    try {
      // polling del texto (frágil con spans anidados): hasta 20 s tras submit
      await page.waitForFunction(
        () => document.body.innerText.includes('flag correcta'),
        { timeout: 20_000 },
      );
      ok('flag: submiteada por la UI nueva → «flag correcta» con diseño ✓');
    } catch {
      const dbg = await page.evaluate(() => ({
        body: document.body.innerText.replace(/\s+/g, ' ').slice(-500),
        streamHasPass: (window.__arenaData || '').includes('FLAG CORRECTA'),
        arenaLen: (window.__arenaData || '').length,
        inputs: document.querySelectorAll('input').length,
        statusEls: document.querySelectorAll('[role=status]').length,
      }));
      writeFileSync(`${SHOTS}/fail-dom.html`, await page.content());
      fail(
        `flag: no apareció «flag correcta» tras submitear — streamHasPass=${dbg.streamHasPass} arenaLen=${dbg.arenaLen} statusEls=${dbg.statusEls} inputs=${dbg.inputs} body: ${dbg.body}`,
      );
    }    }

    // — pista en el panel: un clic y el texto de la pista llega en claro
    await page.getByRole('button', { name: /pista/i }).first().click();
    try {
      await page.waitForFunction(
        () => typeof window.__arenaHint === 'string' && window.__arenaHint.length > 0 &&
              document.body.innerText.toLowerCase().includes('pista'),
        { timeout: 10_000 },
      );
      const hint = await page.evaluate(() => window.__arenaHint);
      if (!hint.includes('\u001b[')) {
        ok('panel: la pista aparece en la UI en texto plano tras un clic');
      } else {
        fail('panel: la pista llega con códigos ANSI a la UI');
      }
    } catch {
      fail('panel: la pista no llegó al panel de nivel tras el clic');
    }

    // — segunda pista + solución: el bloque en la UI sin ANSI ni lienzos raros
    await page.getByRole('button', { name: /pista/i }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /solution/i }).first().click();
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes('solución de referencia'),
        { timeout: 10_000 },
      );
      const raw = await page.evaluate(() => window.__arenaData);
      const bad = raw.includes('contradición') || raw.includes('[ix]') || raw.includes('undefined');
      if (!bad) {
        ok('panel: la solución desbloqueada se muestra en bloque limpio (2 pistas → desbloqueo)');
      } else {
        fail('panel: el bloque de solución sale con texto sucio (revisar renderSolution)');
      }
    } catch {
      fail('panel: «solution» no se desbloqueó/vio tras 2 pistas');
    }

    // — pantalla completa de la terminal: botón ves→ fija overlay, Esc vuelve
    await page.getByRole('button', { name: /pantalla completa/ }).first().click();
    await page.waitForTimeout(400);
    let fs = await page.evaluate(() => {
      const pane = document.querySelector('.arena-terminal');
      let fixed = false;
      if (pane) {
        const pos = getComputedStyle(pane).position;
        fixed = pos === 'fixed' || pos === 'static' && pane.closest('.fixed') !== null;
        if (pos !== 'fixed') fixed = getComputedStyle(pane.parentElement).position === 'fixed';
      }
      const aside = document.querySelector('aside');
      const covered = aside ? getComputedStyle(aside.parentElement).position : '';
      return { fixed, visible: !!pane };
    });
    if (fs.visible && fs.fixed) {
      ok('app: terminal ampliada a pantalla completa sobre el resto de la página');
    } else {
      fail(`app: pantalla completa de terminal no activó overlay (${JSON.stringify(fs)})`);
    }
    await page.screenshot({ path: `${SHOTS}/app-fullscreen.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    fs = await page.evaluate(() => ({
      fixed: getComputedStyle(document.querySelector('.arena-terminal')?.parentElement || document.body).position === 'fixed',
    }));
    if (!fs.fixed) {
      ok('app: Esc sale de la pantalla completa y la página vuelve');
    } else {
      fail('app: Esc no salió de la pantalla completa');
    }

    // — navegador de niveles: abre, busca «awk», ya y salta
    await page.getByRole('button', { name: /niveles/ }).first().click();
    try {
      await page.waitForSelector('[data-testid="level-browser-list"]', { timeout: 10_000 });
      const rows = await page.evaluate(() =>
        document.querySelector('[data-testid="level-browser-list"]')?.textContent || '');
      if (rows.includes('-l1')) {
        ok('navegador: abre con el catálogo de niveles por sesión/tracks');
      } else {
        fail('navegador: no muestra el catálogo de niveles');
      }
    } catch {
      fail('navegador: no abrió el modal de niveles');
    }
    await page.locator('input[aria-label*="buscar"]').fill('awk');
    let awkRows = [];
    try {
      await page.waitForFunction(
        () => {
          const list = document.querySelector('[data-testid="level-browser-list"]');
          if (!list) return false;
          return [...list.querySelectorAll(':scope > div')].some((c) =>
            /awk/i.test(c.textContent || ''));
        },
        { timeout: 5_000 },
      );
      awkRows = await page.evaluate(() =>
        [...document.querySelectorAll('[data-testid="level-browser-list"] > div')]
          .map((c) => ({ txt: (c.textContent || '').replace(/\s+/g, ' ').trim(), locked: /🔒/.test(c.textContent || '') }))
          .filter((r) => /awk/i.test(r.txt)));
    } catch {
      /* sin resultados con «awk»: probamos con «grep» (keyword universal) */
      await page.locator('input[aria-label*="buscar"]').fill('grep');
      await page.waitForTimeout(600);
      awkRows = await page.evaluate(() =>
        [...document.querySelectorAll('[data-testid="level-browser-list"] > div')]
          .map((c) => ({ txt: (c.textContent || '').replace(/\s+/g, ' ').trim(), locked: /🔒/.test(c.textContent || '') }))
          .filter((r) => /grep/i.test(r.txt)));
    }
    if (awkRows.length > 0) {
      ok(`navegador: búsqueda por término devuelve niveles relevantes (${awkRows.length} filas, ${awkRows.filter((r) => !r.locked).length} jugables)`);
      if (awkRows.some((r) => r.locked)) {
        ok('navegador: la búsqueda muestra también niveles bloqueados (🔒 visible)');
      }
    } else {
      fail('navegador: ni «awk» ni «grep» devolvieron resultados');
    }
    await page.screenshot({ path: `${SHOTS}/app-browser-busqueda.png` });
    // jugar el primer nivel disponible de la búsqueda (o de la sección si no hubo)
    const played = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('[data-testid="level-browser-list"] button')]
        .find((b) => !b.disabled && /jugar|volver/.test(b.textContent || ''));
      if (btn) { window.__prePlayLevel = window.__arenaLevel; btn.click(); return true; }
      return false;
    });
    try {
      await page.waitForFunction(
        () => Boolean(window.__arenaLevel) && window.__arenaLevel !== window.__prePlayLevel,
        undefined,
        { timeout: 60_000 },
      );
      await page.waitForTimeout(2_000);
      ok(`navegador: «jugar» de un nivel salta a su session (${await page.evaluate(() => window.__arenaLevel)})`);
    } catch {
      fail(played ? 'navegador: «jugar» no cambió de nivel en 60 s' : 'navegador: ningún nivel jugable en la búsqueda');
    }
    await page.locator('.xterm').click();

    // — Ctrl+C con selección: copia al portapapeles sin SIGINT
    await page.locator('.xterm').click();
    await page.evaluate(() => window.__arenaTerm?.selectAll());
    await page.keyboard.press('Control+c');
    await page.waitForTimeout(500);
    const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
    const stream = await page.evaluate(() => window.__arenaData);
    if (clip.includes('FLAG{') && !stream.includes('^C')) {
      ok('terminal: Ctrl+C con selección copia al portapapeles (sin SIGINT)');
    } else {
      fail(`terminal: Ctrl+C no copió la selección (clipboard.len=${clip.length} ^C=${stream.includes('^C')})`);
    }

    // — «next» tecleado en la terminal: cambia de nivel sin caer en bash
    const prevLevel = await page.evaluate(() => window.__arenaLevel);
    await page.locator('.xterm').click();
    await page.keyboard.type('next', { delay: 35 });
    await page.keyboard.press('Enter');
    try {
      await page.waitForFunction(
        (prev) => Boolean(window.__arenaLevel) && window.__arenaLevel !== prev,
        prevLevel,
        { timeout: 40_000 },
      );
      const raw = await page.evaluate(() => window.__arenaData);
      if (raw.includes('bash: next')) {
        fail('terminal: «next» se coló a bash (bash: next: command not found)');
      } else {
        ok(`terminal: «next» tecleado avanza de nivel (${await page.evaluate(() => window.__arenaLevel)})`);
      }
    } catch {
      fail('terminal: «next» no cambió de nivel en 40 s');
    }

    await page.screenshot({ path: `${SHOTS}/app-desktop.png`, fullPage: true });

  // layout móvil
  const m = await ctx.newPage();
  await m.setViewportSize({ width: 390, height: 812 });
  await m.goto(APP_URL, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await m.waitForTimeout(2500);
  const mLayout = await m.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  if (mLayout) {
    ok('app móvil (390px): sin scroll horizontal');
  } else {
    fail('app móvil (390px): scroll horizontal');
  }
  await m.screenshot({ path: `${SHOTS}/app-movil.png`, fullPage: true });
  await ctx.close();
}

/* ───────────── B. docs ───────────── */
{
  const PAGES = ['', 'aprende', 'funciona', 'desplegar', 'tecnico', 'extras'];
  for (const width of [1440, 1024, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const url = DOCS_URL + p;
      await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => fail(`docs ${p}: no carga`));
      await page.waitForTimeout(700);
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const head = document.querySelector('header');
        return {
          noH: de.scrollWidth <= de.clientWidth + 1,
          headH: head ? head.getBoundingClientRect().height : 0,
        };
      });
      if (r.noH) {
        ok(`docs /${p} (${width}px): sin scroll horizontal`);
      } else {
        fail(`docs /${p} (${width}px): scroll horizontal`);
      }
      if (width >= 1024) {
        if (r.headH <= 58) {
          ok(`docs /${p} (${width}px): header sin envoltura (${r.headH}px)`);
        } else {
          fail(`docs /${p} (${width}px): header envuelto (${r.headH}px)`);
        }
      }
      await page.screenshot({ path: `${SHOTS}/docs-${p || 'home'}-${width}.png`, fullPage: true });
    }
    await ctx.close();
  }
}

await browser.close();
writeFileSync(
  `${SHOTS}/result.txt`,
  `${oks.length} ok · ${fails.length} fail\n\n${[...oks, ...fails].join('\n')}\n`,
);
console.log(`\n=== RESULTADO VISUAL ===\n${oks.map((m) => `  ✓ ${m}`).join('\n')}`);
if (fails.length) {
  console.log(fails.map((m) => `  ✗ ${m}`).join('\n'));
  console.log('TEST-VISUAL-FAIL');
  process.exit(1);
}
console.log('TEST-VISUAL-OK');
