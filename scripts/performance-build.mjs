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
console.log("Performance build checks passed: CSS budget and self-hosted font assets.");
