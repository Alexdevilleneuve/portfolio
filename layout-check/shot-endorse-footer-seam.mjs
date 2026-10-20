/**
 * Capture endorse→footer seam lab previews.
 * Usage: node layout-check/shot-endorse-footer-seam.mjs
 */
import { chromium } from "playwright-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(__dirname, "shots");
const url = "http://127.0.0.1:8765/layout-check/endorse-footer-seam-lab.html";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);

await page.screenshot({
  path: path.join(shots, "endorse-footer-seam-lab-full.png"),
  fullPage: true,
});

const labels = ["a", "b", "c", "d"];
for (let i = 0; i < labels.length; i++) {
  const stage = page.locator(".grid .idea").nth(i).locator(".stage");
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await stage.screenshot({
    path: path.join(shots, `endorse-footer-seam-${labels[i]}.png`),
  });
}

await browser.close();
console.log("Wrote endorse-footer-seam-*.png to layout-check/shots/");
