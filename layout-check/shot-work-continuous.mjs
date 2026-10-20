/**
 * One continuous capture of Homepage 3.0 #work
 * (selected studies, more studies, research philosophy).
 */
import { chromium } from "playwright-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(__dirname, "shots");
const url = "http://127.0.0.1:8765/index.html";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.locator("#more").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.evaluate(async () => {
  const imgs = [...document.querySelectorAll("#work img")];
  await Promise.all(imgs.map((img) => {
    img.loading = "eager";
    if (img.complete && img.naturalWidth) return null;
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  }));
});
await page.waitForTimeout(400);
await page.addStyleTag({
  content: `
    .work-v2-panels { -webkit-mask-image: none !important; mask-image: none !important; }
    .work-v2-head, .work-v2-nav-wrap { position: relative !important; top: auto !important; transform: none !important; }
    .work-v2-media-wrap { opacity: 1 !important; transform: none !important; }
  `,
});
const work = page.locator("#work");
await work.screenshot({
  path: path.join(shots, "3-work-continuous.png"),
});

await page.evaluate(async () => {
  document.querySelectorAll(".endorse .reveal").forEach((el) => el.classList.add("in"));
  const imgs = [...document.querySelectorAll(".endorse-footer-scene img")];
  await Promise.all(imgs.map((img) => {
    img.loading = "eager";
    if (img.complete && img.naturalWidth) return null;
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  }));
});
await page.locator(".endorse-footer-scene").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.locator(".endorse-footer-scene").screenshot({
  path: path.join(shots, "3-endorse-footer-continuous.png"),
});
await browser.close();
console.log("Wrote 3-work-continuous.png and 3-endorse-footer-continuous.png");
