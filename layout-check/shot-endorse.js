const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || 'chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForTimeout(600);
  const section = page.locator('#endorsements');
  await section.scrollIntoViewIfNeeded();
  // let reveal-on-scroll animations settle
  await page.evaluate(async () => {
    const el = document.querySelector('#endorsements');
    const step = 400;
    for (let y = el.offsetTop - 600; y < el.offsetTop + el.offsetHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, el.offsetTop - 80);
  });
  await page.waitForTimeout(900);
  await section.screenshot({ path: path.join(__dirname, 'endorse-stage.png') });

  // mobile
  const mpage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mpage.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await mpage.waitForTimeout(600);
  const msection = mpage.locator('#endorsements');
  await msection.scrollIntoViewIfNeeded();
  await mpage.evaluate(async () => {
    const el = document.querySelector('#endorsements');
    const step = 300;
    for (let y = el.offsetTop - 600; y < el.offsetTop + el.offsetHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await mpage.waitForTimeout(900);
  await msection.screenshot({ path: path.join(__dirname, 'endorse-mobile.png') });

  await browser.close();
})();
