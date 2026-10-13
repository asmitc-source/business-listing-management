import { createFileRoute } from "@tanstack/react-router";
import { llmsCorpus } from "@/lib/discovery";
import { publishedDiscoveryArticles, discoveryFailure } from "@/lib/discovery-server";
export const Route = createFileRoute("/llms-full.txt")({
  server: { handlers: { GET: async () => {
    try {
      return new Response(llmsCorpus(await publishedDiscoveryArticles()), {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600", "X-Robots-Tag": "noindex", "Access-Control-Allow-Origin": "*" },
      });
    } catch { return discoveryFailure(); }
  } } },
});
