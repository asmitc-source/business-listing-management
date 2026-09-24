import type { BlogPost } from "@/lib/content/blog";
import { includeStaticBlogExtra, isSitemapArticle } from "@/lib/seo-publish";

export type BlogHubCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  minutes: number;
  tags: string[];
};

type HubArticle = {
  status: string;
  slug: string;
  kind?: string;
  canonical_url?: string | null;
  title: string;
  answer?: string;
  description?: string;
  date: string;
  author: string;
  minutes: number;
  tags: string[];
};

/**
 * Cards rendered on /blog. Same #50 rules: CMS rows must pass
 * isSitemapArticle; static extras only fill restored self-canonical editorials.
 */
export function visibleBlogHubCards(
  articles: readonly HubArticle[],
  staticPosts: readonly BlogPost[],
  editorialSlugs: ReadonlySet<string>,
): BlogHubCard[] {
  const cmsPosts = articles.filter((article) => isSitemapArticle(article)).map(cardFromArticle);
  const have = new Set(cmsPosts.map((post) => post.slug));
  const staticExtra = staticPosts
    .filter(
      (post) =>
        !have.has(post.slug) && includeStaticBlogExtra(post.slug, editorialSlugs.has(post.slug)),
    )
    .map(cardFromStatic);
  return [...cmsPosts, ...staticExtra].sort((a, b) => b.date.localeCompare(a.date));
}

function cardFromArticle(article: HubArticle): BlogHubCard {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.answer || article.description || "",
    date: article.date,
    author: article.author,
    minutes: article.minutes,
    tags: article.tags,
  };
}

function cardFromStatic(post: BlogPost): BlogHubCard {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    author: post.author,
    minutes: post.minutes,
    tags: post.tags,
  };
}
