import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { HomePage } from "@/components/home/home-page";
import { pageHead, pageShareImage } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { loadHomePage } from "@/lib/cms/public";
import heroFont from "@/assets/fonts/newsreader-hero-600-normal.woff2?url";
import heroItalicFont from "@/assets/fonts/newsreader-hero-600-italic.woff2?url";

export const Route = createFileRoute("/")({
  loader: () => loadHomePage(),
  head: () => {
    const head = pageHead({
      title: "Business Listing Management for Multi-Location Teams",
      description: SITE.description,
      path: "/",
      ...pageShareImage("/"),
    });
    return {
      ...head,
      links: [...(head.links ?? []), ...[heroFont, heroItalicFont].map(href => ({
        rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const, href,
      }))],
    };
  },
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return (
    <SiteShell>
      <HomePage copy={data} />
    </SiteShell>
  );
}
