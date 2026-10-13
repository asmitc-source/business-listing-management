import type { CmsArticle } from "./cms/types";

// Dynamic discovery feeds must never claim the CMS has zero articles during an outage.
export async function publishedDiscoveryArticles(): Promise<CmsArticle[]> {
  const { listPublished } = await import("./cms/store");
  const rows = await Promise.race([
    listPublished(),
    new Promise<null>(resolve => setTimeout(() => resolve(null), 4000)),
  ]);
  if (!rows) throw new Error("Published CMS inventory is temporarily unavailable");
  return rows;
}

export function discoveryFailure() {
  return new Response("Content discovery temporarily unavailable. Please retry.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "120" },
  });
}
