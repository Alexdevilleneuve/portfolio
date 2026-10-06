const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "..", "index-3.html");
  const shots = path.join(__dirname, "shots");

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(file);
  await page.waitForTimeout(500);

  const pinCheck = await page.evaluate(() => {
    const voyage = document.querySelector("#voyage-compare");
    const work = document.querySelector("#work");
    const delay = document.querySelector(".work-v2-delay");
    const st = window.ScrollTrigger;
    const stackPin = st && st.getById ? st.getById("section-stack-base") : null;
    const pins = st ? st.getAll().filter((t) => t.vars && t.vars.pin === voyage) : [];
    const cs = voyage ? getComputedStyle(voyage) : null;
    const workCs = work ? getComputedStyle(work) : null;
    return {
      hasDelay: !!delay,
      hasStackPin: !!stackPin,
      voyagePinnedByST: pins.length,
      voyagePosition: cs && cs.position,
      workMarginTop: workCs && workCs.marginTop,
      workRadius: workCs && workCs.borderTopLeftRadius,
    };
  });
  console.log("PIN_CHECK", JSON.stringify(pinCheck));

  await page.evaluate(() => {
    const coda = document.querySelector("[data-voyage-coda]");
    if (coda) {
      const top = coda.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(shots, "v3-sky-wash-seam.png"),
    fullPage: false,
  });

  await page.evaluate(() => {
    const el = document.querySelector("#work");
    if (el) window.scrollTo(0, el.offsetTop - 8);
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(shots, "v3-sky-wash-work-head.png"),
    fullPage: false,
  });

  const tab = page.locator('[data-work-tab="2"]');
  if (await tab.count()) {
    await tab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(shots, "v3-sky-wash-work-tab.png"),
      fullPage: false,
    });
  }

  await page.evaluate(() => {
    const how = document.querySelector("#how") || document.querySelector(".how-v2");
    if (how) window.scrollTo(0, how.offsetTop - 40);
  });
  await page.waitForTimeout(500);
  const itemBtn = page.locator(".how-v2-item-btn").first();
  if (await itemBtn.count()) {
    const before = await itemBtn.getAttribute("aria-expanded");
    await itemBtn.click();
    await page.waitForTimeout(400);
    const after = await itemBtn.getAttribute("aria-expanded");
    console.log("ACCORDION", JSON.stringify({ before, after }));
    await page.screenshot({
      path: path.join(shots, "v3-sky-wash-how.png"),
      fullPage: false,
    });
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await mobile.goto(file);
  await mobile.waitForTimeout(500);
  await mobile.evaluate(() => {
    const coda = document.querySelector("[data-voyage-coda]");
    if (coda) {
      const top = coda.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo(0, top);
    }
  });
  await mobile.waitForTimeout(800);
  await mobile.screenshot({
    path: path.join(shots, "v3-sky-wash-seam-mobile.png"),
    fullPage: false,
  });

  await browser.close();
})();
