const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const file = "file://" + path.resolve(__dirname, "..", "index-2.html");
  const out = path.resolve(__dirname, "shots/v2-endorse-wide.png");
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
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

  const size = await page.evaluate(() => {
    const st = window.ScrollTrigger?.getById("endorse-horizontal");
    if (st) window.scrollTo(0, st.start);
    const track = document.querySelector("[data-endorse-track]");
    const w = track.scrollWidth;
    const h = document.querySelector(".endorse-horizon").offsetHeight;
    const selectors = [
      ".endorse-stop",
      ".endorse-card",
      ".endorse-sticky",
      ".endorse-strip",
      ".endorse-thanks",
      ".endorse-more",
      ".endorse-journey-head",
      ".endorse-beat",
      ".journey-boat",
      ".journey-lighthouse",
    ];
    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      const cs = getComputedStyle(el);
      el.style.left = cs.left;
      el.style.top = cs.top;
      el.style.right = cs.right;
      el.style.bottom = cs.bottom;
      el.style.width = cs.width;
      el.style.maxWidth = cs.width;
      el.style.height = cs.height;
      el.style.flexBasis = cs.width;
      el.style.transform = cs.transform;
    });
    window.gsap?.set(
      ".endorse-stop .endorse-card, .endorse-stop .endorse-strip, .endorse-stop .endorse-sticky, .endorse-stop .endorse-thanks",
      { autoAlpha: 1, y: 0 }
    );
    window.ScrollTrigger?.getAll().forEach((t) => t.kill());
    window.gsap?.set(track, { x: 0, y: 0, clearProps: "transform" });
    const sky = document.querySelector("[data-endorse-sky]");
    if (sky) window.gsap?.set(sky, { x: 0, clearProps: "transform" });
    const nav = document.querySelector(".ver-nav");
    if (nav) nav.style.display = "none";
    document.documentElement.style.overflow = "visible";
    document.body.style.overflow = "visible";
    const root = document.querySelector("#endorsements");
    const horizon = document.querySelector(".endorse-horizon");
    root.style.width = w + "px";
    root.style.maxWidth = "none";
    root.style.margin = "0";
    horizon.style.width = w + "px";
    horizon.style.height = h + "px";
    horizon.style.overflow = "visible";
    track.style.width = w + "px";
    track.style.transform = "none";
    if (sky) {
      sky.style.width = w + "px";
      sky.style.height = h + "px";
      sky.style.objectFit = "cover";
      sky.style.objectPosition = "left center";
      sky.style.transform = "none";
    }
    return { w, h };
  });

  await page.setViewportSize({ width: size.w, height: size.h });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    document.querySelector("#endorsements")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(200);
  await page.locator(".endorse-horizon").screenshot({
    path: out,
    animations: "disabled",
  });
  console.log(JSON.stringify({ out, ...size }));
  await browser.close();
})();
