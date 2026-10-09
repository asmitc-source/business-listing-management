import { PRODUCTION_ORIGIN } from "./public-host";
import { isSitemapArticle, publicPathForKind } from "./seo-publish";

/** Marketing URLs that stay in the sitemap. No product-doc blog URLs. */
export const MARKETING_PATHS: ReadonlyArray<{ path: string; lastmod?: string }> = [
  { path: "/", lastmod: "2026-10-07" },
  { path: "/product", lastmod: "2026-09-23" },
  { path: "/how-it-works", lastmod: "2026-09-23" },
  { path: "/pricing", lastmod: "2026-09-23" },
  { path: "/integrations", lastmod: "2026-09-23" },
  { path: "/security", lastmod: "2026-09-23" },
  { path: "/about", lastmod: "2026-09-23" },
  { path: "/contact", lastmod: "2026-09-23" },
  { path: "/book", lastmod: "2026-09-23" },
  { path: "/resources", lastmod: "2026-09-23" },
  { path: "/blog", lastmod: "2026-09-23" },
  { path: "/glossary", lastmod: "2026-09-23" },
  { path: "/tools/listing-ops-roi-engine", lastmod: "2026-10-07" },
  { path: "/privacy", lastmod: "2026-09-23" },
  { path: "/terms", lastmod: "2026-09-23" },
  { path: "/cookies", lastmod: "2026-09-23" },
];

/** These pages render the newest published editorials and change when a post is published. */
const ARTICLE_DRIVEN_MARKETING_PATHS = new Set(["/", "/resources", "/blog"]);

/** Known self-canonical editorials if CMS is unreachable. */
export const FALLBACK_EDITORIAL_SLUGS = [
  "how-to-do-google-business-listing-management-at-scale",
  "listing-change-qa-evidence",
  "listing-management-raci",
  "listing-vendor-migration-checklist",
  "location-open-move-close-playbook",
] as const;

export type SitemapArticle = {
  slug: string;
  kind?: string;
  status: string;
  canonical_url?: string | null;
  date?: string;
  updated_at?: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function dateOnly(value: string | undefined, fallback: string): string {
  const candidate = String(value || fallback).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : fallback;
}

export function sitemapXml(opts: {
  origin?: string;
  marketing?: ReadonlyArray<{ path: string; lastmod?: string }>;
  articles: SitemapArticle[];
  today?: string;
}): string {
  const origin = (opts.origin || PRODUCTION_ORIGIN).replace(/\/+$/, "");
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const urls: { loc: string; lastmod: string }[] = [];
  const seen = new Set<string>();
  const add = (loc: string, lastmod: string) => {
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push({ loc, lastmod });
  };

  const articles: SitemapArticle[] = opts.articles.length
    ? opts.articles
    : FALLBACK_EDITORIAL_SLUGS.map((slug) => ({
        slug,
        kind: "article",
        status: "published",
        canonical_url: "",
        date: today,
      }));

  // Only live CMS rows drive hub freshness. A temporary CMS failure must not
  // make static fallback rows claim that the homepage and hubs changed today.
  const newestPublishedLastmod = opts.articles
    .filter(isSitemapArticle)
    .map((article) => dateOnly(article.updated_at || article.date, today))
    .reduce<string | undefined>((newest, lastmod) => (!newest || lastmod > newest ? lastmod : newest), undefined);

  for (const row of opts.marketing ?? MARKETING_PATHS) {
    const staticLastmod = dateOnly(row.lastmod, today);
    const lastmod =
      ARTICLE_DRIVEN_MARKETING_PATHS.has(row.path) && newestPublishedLastmod && newestPublishedLastmod > staticLastmod
        ? newestPublishedLastmod
        : staticLastmod;
    add(`${origin}${row.path}`, lastmod);
  }

  for (const article of articles) {
    if (!isSitemapArticle(article)) continue;
    const path = publicPathForKind(article.kind, article.slug);
    add(`${origin}${path}`, dateOnly(article.updated_at || article.date, today));
  }

  const body = urls
    .map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${escapeXml(u.lastmod)}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
