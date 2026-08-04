const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || 'chrome',
  });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 2,
  });
  const html = path.resolve(__dirname, 'render-compass.html');
  await page.goto('file://' + html);
  await page.waitForTimeout(200);
  const out = path.resolve(__dirname, '..', 'assets/images/footer/sketch-compass-cloud.png');
  await page.screenshot({
    path: out,
    omitBackground: true,
    type: 'png',
  });
  await browser.close();
  console.log('wrote', out);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
