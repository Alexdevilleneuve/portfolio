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
  const html = path.resolve(__dirname, 'render-compass-variants.html');
  await page.goto('file://' + html);
  await page.waitForTimeout(200);

  const outDir = path.resolve(__dirname, '..', 'assets/images/footer');
  const jobs = [
    ['#vA', 'compass-design-a.png'],
    ['#vB', 'compass-design-b.png'],
    ['#vC', 'compass-design-c.png'],
  ];
  for (const [sel, file] of jobs) {
    const el = page.locator(sel);
    await el.screenshot({
      path: path.join(outDir, file),
      omitBackground: true,
      type: 'png',
    });
    console.log('wrote', file);
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
