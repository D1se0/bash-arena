/* debug 390 v4: rects del aside y de sus secciones internas */
import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8091/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('section[aria-label="panel del nivel"]', { timeout: 45_000 });
await page.waitForTimeout(1200);
const res = await page.evaluate(() => {
  const main = document.querySelector('main');
  const aside = document.querySelector('aside');
  const r = (e) => e ? (({ x, y, width, height, bottom, top }) => ({ x, y, width, height, bottom, top }))(e.getBoundingClientRect()) : null;
  const asides = [...aside.querySelectorAll('section')].map((s) => ({ txt: (s.textContent || '').trim().slice(0, 24), ...r(s) }));
  const cols = [...main.children].map((c) => ({ tag: c.tagName.toLowerCase(), cls: String(c.className).split(' ').slice(0, 4).join(' '), ...r(c) }));
  return { win: innerHeight, main: { ...r(main), sh: main.scrollHeight, ch: main.clientHeight }, cols, aside: { ...r(aside), ov: getComputedStyle(aside).overflowY }, asides };
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
