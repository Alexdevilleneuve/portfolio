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
  const html = path.resolve(__dirname, 'theme-variants.html');
  await page.goto('file://' + html);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.body.classList.add('capture'));
  await page.waitForTimeout(500);

  const variants = await page.$$('.variant');
  for (const el of variants) {
    const theme = await el.getAttribute('data-theme');
    const out = path.resolve(__dirname, 'storyboard', `theme-${theme}.png`);
    await el.screenshot({ path: out, type: 'png' });
    console.log('wrote', out);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
