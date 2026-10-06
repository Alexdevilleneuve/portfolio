const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "..", "index-2.html");
  const shots = path.join(__dirname, "shots");

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(file);
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const sky = document.querySelector("[data-endorse-sky]");
    return sky && sky.complete ? true : new Promise((resolve) => {
      if (!sky) return resolve(false);
      sky.addEventListener("load", () => resolve(true), { once: true });
      setTimeout(() => resolve(false), 2000);
    });
  });
  await page.evaluate(() => window.ScrollTrigger?.refresh());
  await page.waitForTimeout(400);

  const pin = await page.evaluate(() => {
    const st = window.ScrollTrigger;
    const horizontal = st && st.getById && st.getById("endorse-horizontal");
    const track = document.querySelector("[data-endorse-track]");
    return {
      hasEndorsePin: !!(st && st.getById && st.getById("endorse-stack-base")),
      hasHorizontal: !!horizontal,
      horizontalDistance: horizontal ? Math.round(horizontal.end - horizontal.start) : 0,
      trackWidth: track ? track.scrollWidth : 0,
      stopCount: document.querySelectorAll("[data-endorse-stop]").length,
      marginTop: getComputedStyle(document.querySelector("#endorsements")).marginTop,
      radius: getComputedStyle(document.querySelector("#endorsements"), "::before").borderTopLeftRadius,
      z: getComputedStyle(document.querySelector("#endorsements")).zIndex,
    };
  });
  console.log("PIN", JSON.stringify(pin));

  const captureProgress = async (progress, name) => {
    await page.evaluate((p) => {
      const st = window.ScrollTrigger?.getById("endorse-horizontal");
      if (st) window.scrollTo(0, st.start + (st.end - st.start) * p);
    }, progress);
    await page.waitForTimeout(900);
    const state = await page.evaluate(() => {
      const track = document.querySelector("[data-endorse-track]");
      const transform = track ? getComputedStyle(track).transform : "";
      return {
        progress: window.ScrollTrigger?.getById("endorse-horizontal")?.progress || 0,
        transform,
      };
    });
    console.log(name, JSON.stringify(state));
    await page.screenshot({ path: path.join(shots, name), fullPage: false });
  };

  const stopProgresses = await page.evaluate(() => {
    const st = window.ScrollTrigger?.getById("endorse-horizontal");
    const track = document.querySelector("[data-endorse-track]");
    const dist = track ? track.scrollWidth - window.innerWidth : 1;
    const stops = [...document.querySelectorAll("[data-endorse-stop]")].map((stop) => stop.offsetLeft / dist);
    return { dist, stops, start: st?.start, end: st?.end };
  });
  console.log("STOPS", JSON.stringify(stopProgresses));

  const names = [
    "v2-endorse-horizontal-01.png",
    "v2-endorse-horizontal-02.png",
    "v2-endorse-horizontal-03.png",
    "v2-endorse-horizontal-04.png",
  ];
  for (let i = 0; i < names.length; i++) {
    await captureProgress(stopProgresses.stops[i] ?? i / 4, names[i]);
  }

  const href = await page.locator(".endorse-more a").getAttribute("href");
  const post = await page.locator(".endorse-card--post-shot a").getAttribute("href");
  console.log("LINKS", JSON.stringify({ href, post }));

  console.log("ERRORS", JSON.stringify(errors));

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await mobile.goto(file);
  await mobile.waitForTimeout(700);
  await mobile.evaluate(() => {
    const el = document.querySelector('[data-endorse-stop="launch"]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: path.join(shots, "v2-endorse-horizontal-mobile-01.png"), fullPage: false });
  await mobile.evaluate(() => {
    const el = document.querySelector('[data-endorse-stop="lead"]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: path.join(shots, "v2-endorse-horizontal-mobile-03.png"), fullPage: false });
  await mobile.evaluate(() => {
    const el = document.querySelector('[data-endorse-stop="close"]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: path.join(shots, "v2-endorse-horizontal-mobile-05.png"), fullPage: false });

  await browser.close();
})();
