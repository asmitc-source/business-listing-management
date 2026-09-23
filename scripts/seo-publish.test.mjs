import assert from "node:assert/strict";
import test from "node:test";
import {
  includeStaticBlogExtra,
  isProductDocSlug,
  isSelfCanonical,
  isSitemapArticle,
  resolvePublishCanonical,
  selfCanonicalUrl,
} from "../src/lib/seo-publish.ts";
import { sitemapXml } from "../src/lib/sitemap.ts";

test("product-doc slugs keep a product canonical; editorial slugs cannot", () => {
  assert.equal(isProductDocSlug("blm-before-you-adopt"), true);
  assert.equal(isProductDocSlug("listing-management-raci"), false);
  assert.equal(
    resolvePublishCanonical({
      slug: "blm-before-you-adopt",
      kind: "article",
      canonical_url: "https://businesslistingmanagement.com/product",
    }),
    "https://businesslistingmanagement.com/product",
  );
  assert.equal(
    resolvePublishCanonical({
      slug: "new-ops-playbook",
      kind: "article",
      canonical_url: "https://businesslistingmanagement.com/product",
    }),
    "",
  );
  assert.equal(
    resolvePublishCanonical({
      slug: "new-ops-playbook",
      kind: "article",
      canonical_url: "",
    }),
    "",
  );
});

test("blank or self URL counts as self-canonical", () => {
  assert.equal(isSelfCanonical("", "article", "listing-management-raci"), true);
  assert.equal(
    isSelfCanonical(
      selfCanonicalUrl("article", "listing-management-raci"),
      "article",
      "listing-management-raci",
    ),
    true,
  );
  assert.equal(
    isSelfCanonical("https://businesslistingmanagement.com/product", "article", "blm-before-you-adopt"),
    false,
  );
});

test("sitemap includes published self-canonical posts and skips product-docs", () => {
  const xml = sitemapXml({
    today: "2026-09-24",
    articles: [
      {
        slug: "new-ops-playbook",
        kind: "article",
        status: "published",
        canonical_url: "",
        date: "2026-09-24",
      },
      {
        slug: "blm-before-you-adopt",
        kind: "article",
        status: "published",
        canonical_url: "https://businesslistingmanagement.com/product",
        date: "2026-09-23",
      },
      {
        slug: "draft-only",
        kind: "article",
        status: "draft",
        canonical_url: "",
        date: "2026-09-24",
      },
    ],
  });
  assert.match(xml, /\/blog\/new-ops-playbook/);
  assert.doesNotMatch(xml, /blm-before-you-adopt/);
  assert.doesNotMatch(xml, /draft-only/);
  assert.match(xml, /\/product</);
  assert.equal(isSitemapArticle({ status: "published", slug: "new-ops-playbook", kind: "article" }), true);
});

test("static blog extras do not reintroduce aliases or product-docs", () => {
  assert.equal(includeStaticBlogExtra("listing-management-raci", true), true);
  assert.equal(includeStaticBlogExtra("listing-management-raci", false), false);
  assert.equal(includeStaticBlogExtra("what-is-business-listing-management", false), false);
  assert.equal(includeStaticBlogExtra("business-listing-management-pricing-2026", false), false);
  assert.equal(includeStaticBlogExtra("blm-before-you-adopt", true), false);
  assert.equal(includeStaticBlogExtra("blm-before-you-adopt", false), false);
});
