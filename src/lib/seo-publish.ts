import { SITE } from "./site";
import { NOINDEX_BLOG_SLUGS } from "./seo-noindex";

/** Product-doc slugs stay product-canonicaled. Editorial slugs may not. */
export const PRODUCT_DOC_SLUG_PREFIX = "blm-";

export function isProductDocSlug(slug: string): boolean {
  return slug.trim().toLowerCase().startsWith(PRODUCT_DOC_SLUG_PREFIX);
}

export function publicPathForKind(kind: string | undefined, slug: string): string {
  const s = slug.trim().replace(/^\/+|\/+$/g, "");
  if (kind === "comparison") return `/compare/${s}`;
  return `/blog/${s}`;
}

export function selfCanonicalUrl(kind: string | undefined, slug: string): string {
  return `${SITE.domain}${publicPathForKind(kind, slug)}`;
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** Blank canonical is treated as self (pageHead uses the live path). */
export function isSelfCanonical(
  canonicalUrl: string | undefined | null,
  kind: string | undefined,
  slug: string,
): boolean {
  const incoming = (canonicalUrl || "").trim();
  if (!incoming) return true;
  return normalizeUrl(incoming) === normalizeUrl(selfCanonicalUrl(kind, slug));
}

/**
 * On publish: `blm-*` product-docs keep an override.
 * Every other slug stores blank so the live path is the canonical.
 */
export function resolvePublishCanonical(input: {
  slug: string;
  kind?: string;
  canonical_url?: string | null;
}): string {
  const slug = input.slug.trim();
  const incoming = (input.canonical_url || "").trim();
  if (isProductDocSlug(slug)) return incoming;
  return "";
}

export function isSitemapArticle(input: {
  status: string;
  slug: string;
  kind?: string;
  canonical_url?: string | null;
}): boolean {
  if (input.status !== "published") return false;
  if (input.kind === "comparison") return false;
  if (NOINDEX_BLOG_SLUGS.has(input.slug)) return false;
  return isSelfCanonical(input.canonical_url, input.kind, input.slug);
}

/**
 * Static library posts have no `canonical_url`. Blank counts as self inside
 * `isSitemapArticle`, which would put renamed alias slugs back on `/blog`.
 * Pass `knownSelfCanonical` only for the restored editorial set. Product-docs
 * stay off the hub even if that flag is set.
 */
export function includeStaticBlogExtra(slug: string, knownSelfCanonical: boolean): boolean {
  if (isProductDocSlug(slug)) return false;
  return isSitemapArticle({
    status: "published",
    slug,
    kind: "article",
    canonical_url: knownSelfCanonical ? "" : `${SITE.domain}/product`,
  });
}
