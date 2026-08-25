/**
 * Full-page homepage capture that freezes scroll-driven UI:
 * kills ScrollTrigger pins, expands about arch, reveals sections.
 *
 * Usage: node layout-check/shots/capture-homepage.mjs [url] [outfile]
 */
import { chromium } from "playwright-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "http://127.0.0.1:8080/index.html";
const out =
  process.argv[3] || path.join(__dirname, "homepage-1.0-full.png");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1000);

await page.evaluate(async () => {
  if (window.ScrollTrigger) {
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
  }
  if (window.gsap) {
    gsap.globalTimeline.clear();
    gsap.set(
      [
        ".hero-fg",
        ".about-arch",
        ".hero-copy",
        ".hero-stats",
        ".cloud",
        ".cloud-top",
        ".cloud-back",
        ".cloud-bob",
      ],
      { clearProps: "transform,opacity,visibility,scale,y,yPercent,x,xPercent" }
    );
  }

  document.querySelectorAll(".pin-spacer").forEach((el) => {
    const child = el.firstElementChild;
    if (child) el.replaceWith(child);
    else el.remove();
  });

  const intro = document.querySelector(".intro-pin");
  if (intro) {
    intro.classList.add("is-expanded");
    intro.style.height = "auto";
    intro.style.maxHeight = "none";
    intro.style.overflow = "visible";
    intro.style.minHeight = "0";
  }

  const arch = document.querySelector("[data-about-arch]");
  if (arch) {
    arch.classList.add("is-content-visible");
    arch.style.transform = "none";
    arch.style.opacity = "1";
    arch.style.pointerEvents = "auto";
    arch.style.willChange = "auto";
  }

  document.getElementById("hero")?.classList.add("is-in");
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.position = "relative";
    hero.style.height = "100vh";
    hero.style.minHeight = "640px";
    hero.style.inset = "auto";
  }

  document.querySelectorAll(".cloud").forEach((c) => {
    c.classList.remove("is-hot", "is-peeking", "is-revealed");
    c.style.opacity = "1";
    c.style.transform = "none";
  });
  document
    .querySelectorAll(".cloud-top, .cloud-back, .hero-copy, .hero-stats")
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });

  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));

  document.querySelectorAll(".acc-item").forEach((el, i) => {
    el.classList.toggle("is-open", i === 0);
  });

  const stage = document.querySelector(".about-stage");
  if (stage) {
    stage.style.minHeight = "0";
    stage.style.height = "auto";
    stage.style.overflow = "visible";
    stage.style.display = "block";
  }

  if (document.fonts?.ready) await document.fonts.ready.catch(() => {});
  window.scrollTo(0, 0);
});

await page.waitForTimeout(400);

// Paint lazy content by walking the page once
await page.evaluate(async () => {
  const h = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  for (let y = 0; y < h; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 45));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(350);

await page.screenshot({ path: out, fullPage: true, animations: "disabled" });
await browser.close();
console.log("wrote", out);
