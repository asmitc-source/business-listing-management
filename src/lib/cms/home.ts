import type { CmsArticle } from "./types";
import type { BlogPost } from "../content/blog";

export type HomeCard = {
  slug: string; title: string; excerpt: string; tags: string[];
};

/** Keep homepage selection on the server and transmit only visible card fields. */
export function selectHomeCards(articles: CmsArticle[], fallback: BlogPost[]): HomeCard[] {
  const cms = articles
    .filter((a) => a.status === "published" && a.kind === "article")
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || (b.updated_at || "").localeCompare(a.updated_at || ""));
  const have = new Set(cms.map((a) => a.slug));
  return [
    ...cms.map((a) => ({ slug: a.slug, title: a.title, excerpt: a.answer || a.description, tags: a.tags, date: a.date })),
    ...fallback.filter((a) => !have.has(a.slug)),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
    .map(({ slug, title, excerpt, tags }) => ({ slug, title, excerpt, tags: tags.slice(0, 1) }));
}
