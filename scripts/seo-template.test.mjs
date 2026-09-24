import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { visibleBlogHubCards } from "../src/lib/blog-hub.ts";
import { BLOG_POSTS } from "../src/lib/content/blog.ts";
import { robotsTxtForHost } from "../src/lib/public-host.ts";
import {
  articleJsonLd,
  blogCollectionJsonLd,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PAGE_OG_BY_PATH,
  pageHead,
  pageShareImage,
} from "../src/lib/seo.ts";
import { SITE } from "../src/lib/site.ts";
import { FALLBACK_EDITORIAL_SLUGS } from "../src/lib/sitemap.ts";

const AI_RETRIEVAL_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

const PRIVATE_PATHS = ["/app", "/login", "/signup", "/demo", "/trial", "/unsubscribe", "/admin"];

test("dateModified is never earlier than datePublished", () => {
  const unchanged = articleJsonLd({
    title: "Who owns listing management?",
    description: "Editorial.",
    path: "/blog/listing-management-raci",
    date: "2026-09-16",
  });
  assert.equal(unchanged.datePublished, "2026-09-16");
  assert.equal(unchanged.dateModified, "2026-09-16");

  const updated = articleJsonLd({
    title: "Who owns listing management?",
    description: "Editorial.",
    path: "/blog/listing-management-raci",
    date: "2026-09-16",
    modified: "2026-09-20T15:04:00.000Z",
  });
  assert.equal(updated.datePublished, "2026-09-16");
  assert.equal(updated.dateModified, "2026-09-20T15:04:00.000Z");
  assert.ok(Date.parse(updated.dateModified) >= Date.parse(updated.datePublished));

  const inverted = articleJsonLd({
    title: "Who owns listing management?",
    description: "Editorial.",
    path: "/blog/listing-management-raci",
    date: "2026-09-16",
    modified: "2026-09-01T00:00:00.000Z",
  });
  assert.equal(inverted.datePublished, "2026-09-16");
  assert.equal(inverted.dateModified, "2026-09-16");

  const head = pageHead({
    title: "Who owns listing management?",
    description: "Editorial.",
    path: "/blog/listing-management-raci",
    type: "article",
    published: "2026-09-16",
    modified: "2026-09-01",
  });
  const published = head.meta.find((meta) => meta.property === "article:published_time");
  const modified = head.meta.find((meta) => meta.property === "article:modified_time");
  assert.equal(published?.content, "2026-09-16");
  assert.equal(modified?.content, "2026-09-16");
});

test("blog hub ItemList matches the filtered cards", () => {
  const editorial = new Set(FALLBACK_EDITORIAL_SLUGS);
  const articles = [
    ...FALLBACK_EDITORIAL_SLUGS.map((slug, index) => ({
      slug,
      title: `Editorial ${index + 1}`,
      answer: "Operator guide.",
      description: "Operator guide.",
      status: "published",
      kind: "article",
      canonical_url: "",
      date: `2026-09-${String(10 + index).padStart(2, "0")}`,
      author: "Asmit Choudhary",
      minutes: 8,
      tags: ["Ops"],
    })),
    {
      slug: "blm-before-you-adopt",
      title: "How to evaluate listing software before you buy",
      answer: "Product doc.",
      description: "Product doc.",
      status: "published",
      kind: "article",
      canonical_url: "https://businesslistingmanagement.com/product",
      date: "2026-05-18",
      author: "Asmit Choudhary",
      minutes: 11,
      tags: ["Comparisons"],
    },
    {
      slug: "what-is-business-listing-management",
      title: "What multi-location listing ops actually cover",
      answer: "Ranking article.",
      description: "Ranking article.",
      status: "published",
      kind: "article",
      canonical_url:
        "https://businesslistingmanagement.com/blog/what-is-business-listing-management-alias",
      date: "2026-03-12",
      author: "Asmit Choudhary",
      minutes: 9,
      tags: ["Fundamentals"],
    },
    {
      slug: "business-listing-management-pricing-2026",
      title: "BLM pricing: Starter $49 and Growth $149",
      answer: "Ranking article.",
      description: "Ranking article.",
      status: "published",
      kind: "article",
      canonical_url: "https://businesslistingmanagement.com/pricing",
      date: "2026-04-02",
      author: "Asmit Choudhary",
      minutes: 8,
      tags: ["Pricing"],
    },
  ];

  const cards = visibleBlogHubCards(articles, BLOG_POSTS, editorial);
  const schema = blogCollectionJsonLd(cards);
  const items = schema.mainEntity.itemListElement;

  assert.equal(schema["@type"], "CollectionPage");
  assert.equal(schema.mainEntity["@type"], "ItemList");
  assert.equal(schema.mainEntity.numberOfItems, cards.length);
  assert.equal(items.length, cards.length);
  assert.equal(cards.length, FALLBACK_EDITORIAL_SLUGS.length);
  assert.deepEqual(
    cards.map((card) => card.slug),
    [...FALLBACK_EDITORIAL_SLUGS].reverse(),
  );

  items.forEach((item, index) => {
    assert.equal(item.position, index + 1);
    assert.equal(item.name, cards[index].title);
    assert.equal(item.url, `https://businesslistingmanagement.com/blog/${cards[index].slug}`);
  });

  const slugs = cards.map((card) => card.slug);
  assert.equal(
    slugs.some((slug) => slug.startsWith("blm-")),
    false,
  );
  assert.equal(slugs.includes("what-is-business-listing-management"), false);
  assert.equal(slugs.includes("business-listing-management-pricing-2026"), false);
});

test("production robots names retrieval bots and still disallows /app", () => {
  const robots = robotsTxtForHost("businesslistingmanagement.com");
  assert.ok(robots.startsWith("User-agent: *\nAllow: /\n"));
  assert.ok(robots.indexOf("User-agent: *") < robots.indexOf("User-agent: GPTBot"));

  for (const agent of AI_RETRIEVAL_AGENTS) {
    const block = [
      `User-agent: ${agent}`,
      "Allow: /",
      ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
      "",
    ].join("\n");
    assert.ok(robots.includes(block), `missing Allow group for ${agent}`);
  }

  assert.match(robots, /Disallow: \/app/);
  assert.match(robots, /Sitemap: https:\/\/businesslistingmanagement.com\/sitemap.xml/);

  const preview = robotsTxtForHost("blm-git-abc.vercel.app");
  assert.equal(preview, "User-agent: *\nDisallow: /\n");
  assert.equal(preview.includes("GPTBot"), false);
  assert.equal(preview.includes("Allow: /"), false);

  const local = robotsTxtForHost("localhost");
  assert.equal(local.includes("User-agent: GPTBot"), false);
  assert.match(local, /User-agent: \*\nAllow: \//);
});

test("home and blog titles and metas sit in the house length band", () => {
  const homeTitle = "Business Listing Management for Multi-Location Teams";
  const blogTitle = "Business listing management blog: NAP and duplicates";
  const blogDescription =
    "Business listing management blog from BLM: guides covering NAP, governance, QA, migration, duplicates, Google Business Profile, cost, and agency operations.";

  const home = pageHead({ title: homeTitle, description: SITE.description, path: "/" });
  const blog = pageHead({ title: blogTitle, description: blogDescription, path: "/blog" });
  const homeTitleTag = home.meta.find((meta) => meta.title);
  const homeDescription = home.meta.find((meta) => meta.name === "description");
  const blogTitleTag = blog.meta.find((meta) => meta.title);
  const blogDescriptionTag = blog.meta.find((meta) => meta.name === "description");

  assert.equal(homeTitleTag?.title, homeTitle);
  assert.ok(homeTitle.length >= 50 && homeTitle.length <= 60);
  assert.match(homeTitle, /Business Listing Management/);
  assert.equal(homeDescription?.content, SITE.description);
  assert.ok(SITE.description.length >= 150 && SITE.description.length <= 160);
  assert.match(SITE.description, /keeps NAP, hours, categories, and duplicates accurate/);
  assert.match(SITE.description, /Google, Apple, Bing, and key directories/);

  assert.equal(blogTitleTag?.title, blogTitle);
  assert.ok(blogTitle.length >= 50 && blogTitle.length <= 60);
  assert.match(blogTitle, /[Bb]usiness listing management/);
  assert.equal(blogDescriptionTag?.content, blogDescription);
  assert.ok(blogDescription.length >= 150 && blogDescription.length <= 160);

  const homeSrc = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
  const blogSrc = readFileSync(new URL("../src/routes/blog/index.tsx", import.meta.url), "utf8");
  assert.match(homeSrc, /title: "Business Listing Management for Multi-Location Teams"/);
  assert.match(homeSrc, /description: SITE\.description/);
  assert.match(blogSrc, /title: "Business listing management blog: NAP and duplicates"/);
  assert.match(blogSrc, /Business listing management blog from BLM: guides covering NAP, governance, QA, migration, duplicates, Google Business Profile, cost, and agency operations\./);

  const raci = BLOG_POSTS.find((post) => post.slug === "listing-management-raci");
  assert.equal(raci?.title, "Who owns listing management? A RACI for multi-location teams");
  assert.equal(
    raci?.description,
    "Assign Accountable and Responsible owners for NAP, hours, categories, duplicates, and publisher access so franchisees and agencies cannot fork listings.",
  );
  assert.equal(raci?.title.length, 60);
  assert.equal(raci?.description.length, 152);
});

test("seven pages use 1200x630 Gohan cards; other pages keep the 1280x640 banner", () => {
  const paths = Object.keys(PAGE_OG_BY_PATH);
  assert.deepEqual(paths, [
    "/",
    "/blog",
    "/blog/listing-management-raci",
    "/blog/listing-vendor-migration-checklist",
    "/blog/listing-change-qa-evidence",
    "/blog/location-open-move-close-playbook",
    "/blog/how-to-do-google-business-listing-management-at-scale",
  ]);

  for (const path of paths) {
    const share = pageShareImage(path);
    const file = PAGE_OG_BY_PATH[path];
    assert.equal(share?.image, `https://businesslistingmanagement.com${file}`);
    assert.equal(share?.imageWidth, "1200");
    assert.equal(share?.imageHeight, "630");

    const png = readFileSync(new URL(`../public${file}`, import.meta.url));
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);

    const head = pageHead({
      title: "Share",
      description: "Share card.",
      path,
      ...share,
    });
    assert.equal(head.meta.find((meta) => meta.property === "og:image")?.content, share.image);
    assert.equal(head.meta.find((meta) => meta.property === "og:image:width")?.content, "1200");
    assert.equal(head.meta.find((meta) => meta.property === "og:image:height")?.content, "630");
    assert.equal(head.meta.find((meta) => meta.name === "twitter:image")?.content, share.image);
    assert.equal(head.links.find((link) => link.rel === "image_src")?.href, share.image);
  }

  assert.equal(pageShareImage("/pricing"), undefined);
  assert.equal(pageShareImage("/blog/what-is-business-listing-management"), undefined);
  const fallback = pageHead({
    title: "Pricing",
    description: "Listed rates.",
    path: "/pricing",
  });
  assert.match(fallback.meta.find((meta) => meta.property === "og:image")?.content, /\/og\.png$/);
  assert.equal(fallback.meta.find((meta) => meta.property === "og:image:width")?.content, OG_IMAGE_WIDTH);
  assert.equal(fallback.meta.find((meta) => meta.property === "og:image:height")?.content, OG_IMAGE_HEIGHT);
  assert.equal(OG_IMAGE_WIDTH, "1280");
  assert.equal(OG_IMAGE_HEIGHT, "640");
});
