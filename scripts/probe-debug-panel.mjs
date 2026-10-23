/* debug: propiedades flex resueltas del branch y del panel (lg) */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('http://127.0.0.1:8091/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('section[aria-label="panel del nivel"]', { timeout: 45_000 });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const col = document.querySelector('main').firstElementChild;
  const branch = col.children[0];
  const panel = document.querySelector('section[aria-label="panel del nivel"]');
  const f = (e) => {
    const c = getComputedStyle(e);
    return 'shrink=' + c.flexShrink + ' grow=' + c.flexGrow + ' basis=' + c.flexBasis +
      ' h=' + Math.round(e.getBoundingClientRect().height) +
      ' min=' + c.minHeight + ' max=' + c.maxHeight;
  };
  return { branch: f(branch), panel: f(panel), colH: col.getBoundingClientRect().height, panelScroll: panel.scrollHeight };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
