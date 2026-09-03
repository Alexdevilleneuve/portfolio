const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || 'chrome',
  });
  const page = await browser.newPage({
    viewport: { width: 1480, height: 940 },
    deviceScaleFactor: 2,
  });
  const html = path.resolve(__dirname, 'song-variants.html');
  await page.goto('file://' + html);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.body.classList.add('capture'));
  await page.waitForTimeout(600);

  for (const el of await page.$$('.band')) {
    const v = await el.getAttribute('data-v');
    const out = path.resolve(__dirname, 'storyboard', `song-${v}.png`);
    await el.screenshot({ path: out, type: 'png' });
    console.log('wrote', out);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
