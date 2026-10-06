const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto("file://" + path.resolve(__dirname, "flow-seam-variants.html"));
  await page.waitForTimeout(700);
  for (const id of ["f", "g", "h"]) {
    const el = await page.$(`#${id} .stage`);
    await el.screenshot({ path: path.join(__dirname, "shots", `flow-seam-${id}.png`) });
  }
  await browser.close();
})();
