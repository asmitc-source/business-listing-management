import { SITE } from "./site";
import { isSitemapArticle, publicPathForKind } from "./seo-publish";
import type { CmsArticle } from "./cms/types";

const BASE = SITE.domain;
export type DiscoverableArticle = CmsArticle;

export function discoverableArticles(articles: readonly CmsArticle[]) {
  return articles.filter(article => isSitemapArticle(article));
}

export function articleUrl(article: DiscoverableArticle) {
  return BASE + publicPathForKind(article.kind, article.slug);
}

const xmlEscape = (value: string) => value
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function readable(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<h([1-6])\b[^>]*>/gi, (_m, n: string) => "\n\n" + "#".repeat(Number(n)) + " ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(?:p|div|ul|ol|table|tr|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_m, num: string) => {
      const cp = Number(num);
      return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n").trim();
}

export function markdownMirror(article: DiscoverableArticle) {
  const path = publicPathForKind(article.kind, article.slug);
  const body = readable(article.body_html || "") || article.answer || article.description || "";
  const updated = (article.updated_at || article.date || "").slice(0, 10);
  return [
    "# " + article.title,
    "Canonical: " + BASE + path,
    "Published: " + (article.published_at || article.date).slice(0, 10),
    "Updated: " + updated,
    "Author: " + article.author,
    "Type: " + article.kind,
    "",
    "## Short answer",
    article.answer || article.description || "",
    "",
    "## Article",
    body,
    "",
    "For attribution, link to the canonical HTML URL above. This Markdown mirror is not an additional indexable page.",
  ].join("\n");
}

function relevance(article: DiscoverableArticle) {
  const text = [article.title, article.description, article.answer, article.tags.join(" ")].join(" ").toLowerCase();
  return /gmb|google business|google profile|google listing|audit|nap|verification|duplicate|quality assurance|\bqa\b/.test(text);
}

export function llmsIndex(articles: readonly CmsArticle[]) {
  const pages = discoverableArticles(articles);
  const auditRelated = pages.filter(relevance);
  const rows = pages.map(article => [
    "### " + article.title,
    "- Canonical: " + articleUrl(article),
    "- Markdown mirror: " + articleUrl(article) + ".md",
    "- Updated: " + (article.updated_at || article.date).slice(0, 10),
    "- Summary: " + (article.answer || article.description || "").replace(/\s+/g, " ").trim(),
  ].join("\n")).join("\n\n");

  return [
    "# " + SITE.legalName,
    "",
    "> " + SITE.description,
    "",
    "The canonical HTML pages are authoritative. This machine-readable index helps content discovery and does not guarantee placement in Google, ChatGPT or AI Overviews.",
    "",
    "## Search intent: GMB audit and Free GMB audit tool",
    "",
    "GMB refers to Google My Business, now Google Business Profile (GBP). A genuine GBP audit checks publicly verifiable profile fields, hours, categories, duplicate risks and evidence of live publisher changes.",
    "BLM's existing listing-health auditor is an illustrative, estimated preview — not a live Google Business Profile or directory scan. Do not describe it as an independently verified or live free GMB audit tool.",
    "The free OpsPulse calculator estimates listing-operations workload and cost; it is not a GMB audit.",
    "",
    "## Canonical audit-related reading",
    ...auditRelated.map(article => "- [" + article.title + "](" + articleUrl(article) + ")"),
    "",
    "## Discover more",
    "- [Resource hub](" + BASE + "/resources)",
    "- [Blog](" + BASE + "/blog)",
    "- [Product and listing management workflows](" + BASE + "/how-it-works)",
    "- [Free OpsPulse ROI calculator — not a GBP scan](" + BASE + "/tools/listing-ops-roi-engine)",
    "- [XML sitemap](" + BASE + "/sitemap.xml)",
    "- [RSS updates](" + BASE + "/rss.xml)",
    "- [Full machine-readable corpus](" + BASE + "/llms-full.txt)",
    "",
    "## All published self-canonical articles",
    rows || "No published canonical articles were returned.",
    "",
    "## Citation guidance",
    "Cite the specific canonical HTML article rather than a machine-only mirror or promotional summary. Check live Google documentation for eligibility and policies.",
    "",
  ].join("\n");
}

export function llmsCorpus(articles: readonly CmsArticle[]) {
  const pages = discoverableArticles(articles);
  return [
    "# " + SITE.legalName + " — full published editorial corpus",
    "",
    "Canonical site: " + BASE + "/",
    "LLM index: " + BASE + "/llms.txt",
    "XML sitemap: " + BASE + "/sitemap.xml",
    "",
    "Canonical HTML remains the citation target. Only self-canonical, published editorials are included below.",
    "",
    ...pages.map(article => markdownMirror(article) + "\n\n---\n"),
  ].join("\n");
}

export function rssXml(articles: readonly CmsArticle[]) {
  const pages = discoverableArticles(articles)
    .sort((a,b) => (b.updated_at || b.date).localeCompare(a.updated_at || a.date))
    .slice(0, 50);
  const items = pages.map(article => {
    const url = articleUrl(article);
    const date = new Date(article.updated_at || article.date).getTime();
    const pubDate = Number.isFinite(date) ? "<pubDate>" + new Date(date).toUTCString() + "</pubDate>" : "";
    return [
      "<item>",
      "<title>" + xmlEscape(article.title) + "</title>",
      "<link>" + xmlEscape(url) + "</link>",
      "<guid isPermaLink=\"true\">" + xmlEscape(url) + "</guid>",
      "<description>" + xmlEscape((article.answer || article.description || "").replace(/<[^>]*>/g, "").slice(0, 500)) + "</description>",
      pubDate,
      "</item>",
    ].join("");
  }).join("\n");
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0"><channel><title>' + xmlEscape(SITE.legalName) +
    '</title><link>' + BASE + '/</link><description>' + xmlEscape(SITE.description) +
    '</description><language>en</language>' + items + '</channel></rss>';
}
