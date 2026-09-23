import assert from "node:assert/strict";
import test from "node:test";
import { pageHead, publicOrigin } from "../src/lib/seo.ts";

test("og:url follows an absolute canonical override", () => {
  const head = pageHead({
    title: "How to evaluate listing software before you buy",
    description: "Product doc.",
    path: "/blog/blm-before-you-adopt",
    canonical: "https://businesslistingmanagement.com/product",
    type: "article",
  });
  const og = head.meta.find((m) => m.property === "og:url");
  const canonical = head.links.find((l) => l.rel === "canonical");
  assert.equal(og?.content, "https://businesslistingmanagement.com/product");
  assert.equal(canonical?.href, "https://businesslistingmanagement.com/product");
});

test("og:url stays on the page path when no canonical override is set", () => {
  const head = pageHead({
    title: "Who owns listing management?",
    description: "Editorial.",
    path: "/blog/listing-management-raci",
    type: "article",
  });
  const og = head.meta.find((m) => m.property === "og:url");
  assert.equal(og?.content, `${publicOrigin()}/blog/listing-management-raci`);
});
