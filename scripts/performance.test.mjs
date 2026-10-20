import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selectHomeCards } from "../src/lib/cms/home.ts";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("homepage cards preserve CMS precedence, stable ordering and six-card limit without article bodies", () => {
  const cms = [
    { slug: "shared", title: "CMS title", answer: "CMS answer", description: "Description", date: "2026-10-01", updated_at: "2026-10-02", status: "published", kind: "article", tags: ["SEO", "Extra"], body_html: "large body".repeat(1000) },
    { slug: "draft", date: "2026-12-01", status: "draft", kind: "article" },
    { slug: "news", date: "2026-12-01", status: "published", kind: "news" },
    { slug: "same-date", title: "Second", answer: "", description: "Fallback description", date: "2026-10-01", updated_at: "2026-10-01", status: "published", kind: "article", tags: [] },
  ];
  const fallback = [
    { slug: "shared", title: "Old static title", date: "2026-10-20", tags: [] },
    ...Array.from({ length: 8 }, (_, i) => ({ slug: "static-" + i, title: "Static " + i, excerpt: "Excerpt", tags: ["Guides"], date: "2026-09-" + String(20 - i) })),
  ];
  const before = JSON.stringify({ cms, fallback });
  const cards = selectHomeCards(cms, fallback);
  assert.equal(cards.length, 6);
  assert.deepEqual(cards.map((c) => c.slug), ["shared", "same-date", "static-0", "static-1", "static-2", "static-3"]);
  assert.equal(cards[0].title, "CMS title");
  assert.equal(cards[1].excerpt, "Fallback description");
  assert.deepEqual(cards[0].tags, ["SEO"]);
  for (const card of cards) assert.deepEqual(Object.keys(card).sort(), ["excerpt", "slug", "tags", "title"]);
  assert.equal(JSON.stringify({ cms, fallback }), before);
});

test("homepage has six fallback cards when CMS is empty", () => {
  const posts = Array.from({ length: 9 }, (_, i) => ({ slug: String(i), title: String(i), excerpt: "", tags: [], date: "2026-10-" + String(10 + i) }));
  assert.deepEqual(selectHomeCards([], posts).map((c) => c.slug), ["8", "7", "6", "5", "4", "3"]);
});

test("critical text is visible immediately and font files are served locally", () => {
  const root = read("src/routes/__root.tsx");
  const css = read("src/styles.css");
  const home = read("src/components/home/home-page.tsx");
  const hero = home.slice(home.indexOf("function Hero"), home.indexOf("function DirectoryRail"));
  assert.doesNotMatch(root, /fonts\.googleapis\.com|fonts\.gstatic\.com|FONT_CSS/);
  assert.match(root, /as: "font"/);
  assert.match(css, /@fontsource-variable\/newsreader\/standard\.css/);
  assert.match(css, /@fontsource-variable\/plus-jakarta-sans/);
  assert.doesNotMatch(hero, /animate-fade-up|opacity-0|animationDelay/);
  assert.doesNotMatch(home, /import .*BLOG_POSTS|import .*toCard/);
  assert.match(read("src/routes/index.tsx"), /loader: \(\) => loadHomePage\(\)/);
});
