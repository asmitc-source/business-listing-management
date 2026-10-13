import { createFileRoute } from "@tanstack/react-router";
import { llmsIndex } from "@/lib/discovery";
import { publishedDiscoveryArticles, discoveryFailure } from "@/lib/discovery-server";
export const Route = createFileRoute("/llms.txt")({
  server: { handlers: { GET: async () => {
    try {
      return new Response(llmsIndex(await publishedDiscoveryArticles()), {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300", "X-Robots-Tag": "noindex", "Access-Control-Allow-Origin": "*" },
      });
    } catch { return discoveryFailure(); }
  } } },
});
