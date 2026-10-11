import { createFileRoute } from "@tanstack/react-router";
import { sitemapXml, type SitemapArticle } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articles: SitemapArticle[] = [];
        try {
          const { listPublished } = await import("@/lib/cms/store");
          const rows = await Promise.race([
            listPublished(),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 4_000)),
          ]);
          if (!rows) throw new Error("Published article lookup timed out");
          articles = rows.map((row) => ({
            slug: row.slug,
            kind: row.kind,
            status: row.status,
            canonical_url: row.canonical_url,
            date: row.date,
            updated_at: row.updated_at,
          }));
        } catch {
          // Never temporarily publish a truncated sitemap if the CMS is unavailable.
          // Returning 503 asks crawlers to retry, preserving the last complete sitemap.
          return new Response("Sitemap temporarily unavailable; please retry", {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Retry-After": "120",
              "Cache-Control": "no-store",
            },
          });
        }
        const body = sitemapXml({ articles });
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        });
      },
    },
  },
});
