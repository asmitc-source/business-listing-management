import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Markdown } from "@/components/markdown";
import { ArticleHtml } from "@/components/article-html";
import { JsonLd } from "@/components/json-ld";
import { loadPublicArticle } from "@/lib/cms/public";
import { absoluteShareImage } from "@/lib/content/share-image";
import { stripDuplicateMarkdownOpener } from "@/lib/content/strip-duplicate-opener";
import {
  articleDates,
  articleJsonLd,
  articleModifiedAt,
  breadcrumbJsonLd,
  defaultShareImage,
  faqJsonLd,
  pageHead,
  pageShareImage,
  publicOrigin,
} from "@/lib/seo";
import { robotsForBlogSlug } from "@/lib/seo-noindex";
import { resolveAuthor } from "@/lib/authors";
import { AuthorBlock } from "@/components/blog/author-block";

function resolvedArticleDescription(article: { slug?: string; description?: string; answer?: string; title?: string } | null | undefined) {
  return (
    article?.description?.trim() ||
    article?.answer?.trim() ||
    (article?.title ? `A BLM guide to ${article.title}.` : "") ||
    "Business listing management guide from BLM."
  ).slice(0, 170);
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const data = await loadPublicArticle({ data: { slug: params.slug } });
    if (!data) throw notFound();
    if (data.source === "redirect" && data.redirectTo) {
      throw redirect({
        to: "/blog/$slug",
        params: { slug: data.redirectTo },
        statusCode: 301,
      });
    }
    if (!data.article) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    const description = resolvedArticleDescription(article);
    const origin = publicOrigin();
    const path = `/blog/${article?.slug ?? ""}`;
    const mapped = pageShareImage(path);
    const image = mapped?.image ?? absoluteShareImage(article?.cover_url, origin, defaultShareImage(origin));
    const dates = articleDates(article?.date ?? "", articleModifiedAt(article));
    return pageHead({
      title: (article?.meta_title || article?.title) ?? "Article",
      description,
      path,
      canonical: article?.canonical_url || undefined,
      image,
      imageWidth: mapped?.imageWidth,
      imageHeight: mapped?.imageHeight,
      type: "article",
      imageAlt: article?.cover_alt?.trim() || article?.title || undefined,
      robots: robotsForBlogSlug(article?.slug),
      ...(dates.datePublished ? { published: dates.datePublished, modified: dates.dateModified } : {}),
    });
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { article, markdown, source } = Route.useLoaderData();
  const answer = article.answer?.trim() ?? "";
  const bodyMarkdown =
    source === "static" && markdown
      ? stripDuplicateMarkdownOpener(markdown, answer)
      : markdown;
  const shareImage = absoluteShareImage(article.cover_url, publicOrigin(), defaultShareImage());
  const author = resolveAuthor(article.author);
  const description = resolvedArticleDescription(article);

  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description,
          path: `/blog/${article.slug}`,
          date: article.date,
          modified: articleModifiedAt(article),
          author: article.author,
          image: shareImage,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ])}
      />
      <JsonLd
        data={faqJsonLd([
          {
            q: article.title,
            a: article.answer,
          },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{article.tags[0]}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-faint">
          {article.author} · {article.date} · {article.minutes} min read
        </p>
        {answer ? (
          <aside className="mt-8 rounded-2xl bg-cream px-5 py-4 hairline sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Definition</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">{answer}</p>
          </aside>
        ) : null}
        <div className="mt-10">
          {source === "static" && bodyMarkdown ? (
            <Markdown source={bodyMarkdown} />
          ) : (
            <ArticleHtml html={article.body_html} answer={answer} title={article.title} />
          )}
        </div>
        <AuthorBlock author={author} />
      </article>
    </SiteShell>
  );
}
