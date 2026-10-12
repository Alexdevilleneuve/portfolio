/**
 * Capture About constellation direction boards as PNGs.
 * Usage: node layout-check/shot-about-boards.mjs
 */
import { chromium } from "playwright-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const shots = path.join(__dirname, "shots");
const url = "http://127.0.0.1:8091/layout-check/about-constellation-boards.html";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1480, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

for (const id of ["dir-a", "dir-b", "dir-c"]) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await el.screenshot({ path: path.join(shots, `about-constellation-${id.slice(-1)}-full.png`) });
}

await page.setViewportSize({ width: 1480, height: 900 });
await page.locator("#dir-a").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator("#dir-a .a-hero").screenshot({ path: path.join(shots, "about-constellation-a-hero.png") });
await page.locator("#dir-c .c-ocean").screenshot({ path: path.join(shots, "about-constellation-c-ocean.png") });
await page.locator("#dir-c .c-nebula").screenshot({ path: path.join(shots, "about-constellation-c-nebula.png") });

await browser.close();
console.log("Wrote about-constellation-*.png to layout-check/shots/");
