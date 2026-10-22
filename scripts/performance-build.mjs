import { readFileSync, readdirSync, statSync } from "node:fs";
import assert from "node:assert/strict";
const dir = ".vercel/output/static/assets";
const files = readdirSync(dir);
const cssFiles = files.filter((p) => p.endsWith(".css"));
const rootCss = cssFiles.filter((p) => /^styles-/.test(p));
assert.ok(rootCss.length, "Built site stylesheet must exist");
for (const file of rootCss) {
  const css = readFileSync(dir + "/" + file, "utf8");
  assert.ok(Buffer.byteLength(css) < 125_000, "Shared CSS exceeded 125 KB budget");
  assert.doesNotMatch(css, /https:\/\/fonts\.(googleapis|gstatic)\.com/);
}
for (const prefix of ["newsreader-latin-standard-normal-", "newsreader-latin-standard-italic-", "plus-jakarta-sans-latin-wght-normal-"]) {
  const file = files.find((p) => p.startsWith(prefix) && p.endsWith(".woff2"));
  assert.ok(file, "Missing self-hosted font: " + prefix);
  assert.ok(statSync(dir + "/" + file).size > 1000);
}
const heroFonts = files.filter(p => /^newsreader-hero-600-.*\.woff2$/.test(p));
assert.equal(heroFonts.length, 2, "Both homepage heading subsets must be bundled");
for (const file of heroFonts) assert.ok(statSync(dir + "/" + file).size < 25_000, "Hero font exceeded 25 KB budget");
console.log("Performance build checks passed: CSS budget and self-hosted font assets.");
