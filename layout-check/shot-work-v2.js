const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "..", "index-2.html");

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(file);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const el = document.querySelector("#work");
    if (el) window.scrollTo(0, el.offsetTop - 220);
  });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(__dirname, "shots", "work-v2-handoff.png"),
    fullPage: false,
  });

  await page.evaluate(() => {
    const el = document.querySelector("#work");
    if (el) window.scrollTo(0, el.offsetTop - 20);
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(__dirname, "shots", "work-v2-desktop-01.png"),
    fullPage: false,
  });

  await page.evaluate(() => {
    const panel = document.querySelector('[data-work-panel="2"]');
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - Math.round(window.innerHeight * 0.18);
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({
    path: path.join(__dirname, "shots", "work-v2-desktop-03.png"),
    fullPage: false,
  });

  await page.evaluate(() => {
    const panel = document.querySelector('[data-work-panel="1"]');
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - Math.round(window.innerHeight * 0.12);
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(__dirname, "shots", "work-v2-stack.png"),
    fullPage: false,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await mobile.goto(file);
  await mobile.waitForTimeout(400);
  await mobile.evaluate(() => {
    const el = document.querySelector("#work");
    if (el) window.scrollTo(0, el.offsetTop - 12);
  });
  await mobile.waitForTimeout(700);
  await mobile.screenshot({
    path: path.join(__dirname, "shots", "work-v2-mobile-01.png"),
    fullPage: false,
  });

  await browser.close();
})();
