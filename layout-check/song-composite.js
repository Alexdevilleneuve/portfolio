const { chromium } = require('playwright-core');
const path = require('path');

const NAMES = [
  'hero',
  'companies',
  'universities',
  'practice-areas',
  'selected-work',
  'philosophy',
];

(async () => {
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1560, height: 1000 },
    deviceScaleFactor: 2,
  });

  await page.goto('file://' + path.resolve(__dirname, 'song-composite.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  const bands = await page.$$('.band');
  for (let i = 0; i < bands.length; i++) {
    const out = path.resolve(__dirname, `composite-${i + 1}-${NAMES[i]}.png`);
    await bands[i].screenshot({ path: out });
    console.log('wrote', out);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
