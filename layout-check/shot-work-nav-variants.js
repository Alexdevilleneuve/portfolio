const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "work-nav-variants.html");
  const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
  await page.goto(file);
  await page.waitForTimeout(300);

  for (const id of ["a", "b", "c", "d"]) {
    await page.evaluate((hash) => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
      window.scrollBy(0, -70);
    }, id);
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(__dirname, "shots", `work-nav-${id}.png`),
      fullPage: false,
    });
  }

  const live = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await live.goto("file://" + path.resolve(__dirname, "..", "index-2.html"));
  await live.waitForTimeout(400);
  await live.evaluate(() => {
    const el = document.querySelector("#work");
    if (el) window.scrollTo(0, el.offsetTop - 20);
  });
  await live.waitForTimeout(600);
  await live.screenshot({
    path: path.join(__dirname, "shots", "work-v2-slim-nav.png"),
    fullPage: false,
  });

  await browser.close();
})();
