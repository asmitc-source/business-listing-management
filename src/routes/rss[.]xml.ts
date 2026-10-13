import { createFileRoute } from "@tanstack/react-router";
import { rssXml } from "@/lib/discovery";
import { publishedDiscoveryArticles, discoveryFailure } from "@/lib/discovery-server";
export const Route = createFileRoute("/rss.xml")({
  server: { handlers: { GET: async () => {
    try {
      return new Response(rssXml(await publishedDiscoveryArticles()), {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600", "X-Robots-Tag": "noindex" },
      });
    } catch { return discoveryFailure(); }
  } } },
});
