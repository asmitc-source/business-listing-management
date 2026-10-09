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
          if (rows) {
            articles = rows.map((row) => ({
              slug: row.slug,
              kind: row.kind,
              status: row.status,
              canonical_url: row.canonical_url,
              date: row.date,
              updated_at: row.updated_at,
            }));
          }
        } catch {
          articles = [];
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
