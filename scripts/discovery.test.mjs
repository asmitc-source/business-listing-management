import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("src/lib/discovery.ts", "utf8");
const indexRoute = fs.readFileSync("src/routes/llms[.]txt.ts", "utf8");
const corpusRoute = fs.readFileSync("src/routes/llms-full[.]txt.ts", "utf8");
const feedRoute = fs.readFileSync("src/routes/rss[.]xml.ts", "utf8");
const mirrorRoute = fs.readFileSync("src/routes/md/$slug.ts", "utf8");
const cmsSource = fs.readFileSync("src/lib/discovery-server.ts", "utf8");
const sitemap = fs.readFileSync("src/lib/sitemap.ts", "utf8");

test("all machine discovery endpoints are generated from published CMS content", () => {
  assert.ok(!fs.existsSync("public/llms.txt"), "Static llms.txt must not shadow dynamic route");
  for (const route of [indexRoute, corpusRoute, feedRoute]) {
    assert.match(route, /publishedDiscoveryArticles\(\)/);
    assert.match(route, /discoveryFailure\(\)/);
  }
  assert.match(cmsSource, /listPublished\(\)/);
  assert.match(cmsSource, /503/);
  assert.match(source, /articles\.filter\(article => isSitemapArticle\(article\)\)/);
  assert.match(source, /last|updated_at/);
  assert.match(source, /const BASE = SITE\.domain/);
});

test("GMB audit intent is honest and points at canonical evidence", () => {
  assert.match(source, /GMB audit and Free GMB audit tool/);
  assert.match(source, /not a live Google Business Profile/);
  assert.match(source, /not a GMB audit/);
  assert.match(source, /articleUrl\(article\)/);
  assert.match(source, /Current pricing/);
});

test("Markdown mirrors never compete with canonical HTML and do not leak private articles", () => {
  assert.match(mirrorRoute, /getArticleBySlug\(slug, true\)/);
  assert.match(mirrorRoute, /isSitemapArticle\(article\)/);
  assert.match(mirrorRoute, /"X-Robots-Tag": "noindex, follow"/);
  assert.ok(mirrorRoute.includes('rel="canonical"'), "Mirrors must reference canonical HTML");
  assert.doesNotMatch(sitemap, /\.md.{0,40}add\(/);
});

test("RSS and LLM full corpus preserve freshness and canonical citations", () => {
  assert.match(feedRoute, /application\/rss\+xml/);
  assert.match(corpusRoute, /X-Robots-Tag/);
  assert.match(source, /article\.updated_at \|\| article\.date/);
  assert.match(source, /Only self-canonical, published editorials/);
});
