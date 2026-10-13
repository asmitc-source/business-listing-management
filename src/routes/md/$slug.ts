import { createFileRoute } from "@tanstack/react-router";
import { isSitemapArticle } from "@/lib/seo-publish";
import { markdownMirror } from "@/lib/discovery";
import { discoveryFailure } from "@/lib/discovery-server";

export const Route = createFileRoute("/md/$slug")({
  server: { handlers: { GET: async ({ params }) => {
    try {
      const slug = String(params.slug || "");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return new Response("Not found", { status: 404 });
      }
      const { getArticleBySlug } = await import("@/lib/cms/store");
      const article = await Promise.race([
        getArticleBySlug(slug, true),
        new Promise<"timeout">(resolve => setTimeout(() => resolve("timeout"), 4000)),
      ]);
      if (article === "timeout") return discoveryFailure();
      if (!article || !isSitemapArticle(article)) {
        return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
      }
      return new Response(markdownMirror(article), {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
          "X-Robots-Tag": "noindex, follow",
          "Link": '<https://businesslistingmanagement.com/blog/' + article.slug + '>; rel="canonical"',
        },
      });
    } catch { return discoveryFailure(); }
  } } },
});
