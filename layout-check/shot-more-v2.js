const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "..", "index-2.html");

  const shoot = async (width, height, name) => {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(file);
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const el = document.querySelector("#more");
      if (el) window.scrollTo(0, el.offsetTop - 12);
    });
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(__dirname, "shots", name),
      fullPage: false,
    });
    await page.close();
  };

  await shoot(1440, 1100, "more-v2-desktop.png");
  await shoot(390, 900, "more-v2-mobile.png");

  const full = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await full.goto(file);
  await full.waitForTimeout(500);
  await full.evaluate(() => {
    const el = document.querySelector("#more");
    if (el) el.scrollIntoView({ block: "start" });
  });
  await full.waitForTimeout(400);
  const more = await full.$("#more");
  if (more) {
    await more.screenshot({
      path: path.join(__dirname, "shots", "more-v2-section.png"),
      type: "png",
    });
  }

  await browser.close();
})();
