import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { HomePage } from "@/components/home/home-page";
import { pageHead, pageShareImage } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { loadPublicSite } from "@/lib/cms/public";

export const Route = createFileRoute("/")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Business Listing Management for Multi-Location Teams",
      description: SITE.description,
      path: "/",
      ...pageShareImage("/"),
    }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return (
    <SiteShell>
      <HomePage copy={{ lede: data.copy.home.lede, trialLine: data.copy.home.trialLine, faqs: data.faqs, articles: data.articles }} />
    </SiteShell>
  );
}
