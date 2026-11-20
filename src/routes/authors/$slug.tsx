import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { JsonLd } from "@/components/json-ld";
import { AUTHORS, resolveAuthor } from "@/lib/authors";
import { loadPublicSite } from "@/lib/cms/public";
import { pageHead } from "@/lib/seo";

function findAuthor(slug: string) {
  return Object.values(AUTHORS).find((profile) => profile.slug === slug);
}

export const Route = createFileRoute("/authors/$slug")({
  loader: async ({ params }) => {
    const author = findAuthor(params.slug);
    if (!author) throw notFound();
    const site = await loadPublicSite();
    const posts = site.articles
      .filter((article) => article.status === "published" && resolveAuthor(article.author).slug === author.slug)
      .sort((a, b) => b.date.localeCompare(a.date));
    return { author, posts };
  },
  head: ({ loaderData }) => loaderData?.author
    ? pageHead({
        title: `${loaderData.author.name} — Author at BLM`,
        description: `About ${loaderData.author.name} and articles written for Business Listing Management.`,
        path: `/authors/${loaderData.author.slug}`,
      })
    : pageHead({ title: "Authors", description: "BLM editorial contributors", path: "/authors" }),
  component: AuthorPage,
});

function AuthorPage() {
  const { author, posts } = Route.useLoaderData();
  const url = `https://businesslistingmanagement.com/authors/${author.slug}`;
  return (
    <SiteShell>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": url,
        url,
        mainEntity: {
          "@type": "Person",
          name: author.name,
          description: author.bio,
          url,
          ...(author.linkedinUrl ? { sameAs: [author.linkedinUrl] } : {}),
        },
      }} />
      <InnerPage
        eyebrow="BLM / AUTHOR"
        title={author.name}
        lede={author.bio}
      >
        <section aria-labelledby="author-articles">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <h2 id="author-articles" className="font-display text-2xl font-semibold text-ink">Articles by {author.name}</h2>
            <span className="text-sm text-muted">{posts.length} published {posts.length === 1 ? "article" : "articles"}</span>
          </div>
          <div className="grid gap-4">
            {posts.map((article) => (
              <Link
                key={article.slug}
                to="/blog/$slug"
                params={{ slug: article.slug }}
                className="group block rounded-2xl border border-line bg-cream p-5 transition hover:border-brand sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{article.date}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-brand sm:text-2xl">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{article.answer || article.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand">Read article →</span>
              </Link>
            ))}
          </div>
          {posts.length === 0 && <p className="rounded-xl bg-cream p-6 text-ink-soft">No published articles have been attributed to this author yet.</p>}
        </section>
      </InnerPage>
    </SiteShell>
  );
}
