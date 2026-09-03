const { chromium } = require('playwright-core');
const path = require('path');

const FRAMES = [
  { p: 0.05, tag: 'g0-greeting' },
  { p: 0.22, tag: 'transit-0-1' },
  { p: 0.39, tag: 'g1-companies' },
  { p: 0.55, tag: 'transit-1-2' },
  { p: 0.71, tag: 'g2-universities' },
  { p: 0.86, tag: 'transit-2-3' },
  { p: 0.98, tag: 'g3-practice' },
];

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || 'chrome',
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const html = path.resolve(__dirname, 'storyboard-voyage.html');
  await page.goto('file://' + html);
  await page.evaluate(() => {
    document.body.classList.add('capture');
    document.querySelector('.hero')?.classList.add('is-in');
  });
  await page.evaluate(() => Promise.all([
    document.fonts.ready,
    ...Array.from(document.images).map((img) =>
      img.complete ? Promise.resolve() : new Promise((res) => { img.onload = img.onerror = res; })
    ),
  ]));
  await page.waitForTimeout(500);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  await page.screenshot({
    path: path.resolve(__dirname, 'storyboard', 'voyage-f0-hero.png'),
    type: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  console.log('wrote hero');

  for (let i = 0; i < FRAMES.length; i++) {
    const { p, tag } = FRAMES[i];
    await page.evaluate((v) => window.setProgress(v), p);
    await page.waitForTimeout(160);
    const out = path.resolve(__dirname, 'storyboard', `voyage-f${i + 1}-${tag}.png`);
    await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log('wrote', out);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
