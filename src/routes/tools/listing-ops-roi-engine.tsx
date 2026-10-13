import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { OpsPulseRoiEngine } from "@/components/tools/opspulse-roi-engine";
import { OpsPulseExplainer } from "@/components/tools/opspulse-explainer";
import { JsonLd } from "@/components/json-ld";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/tools/listing-ops-roi-engine")({
  head: () => pageHead({
    title: "Free GMB Audit Tool: Checklist & ROI Planner | OpsPulse",
    description: "Use our free GMB audit tool for manual checks and ROI planning. Turn GMB audit findings into estimates of listing correction costs and staff hours.",
    path: "/tools/listing-ops-roi-engine",
  }),
  component: OpsPulsePage,
});

function OpsPulsePage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OpsPulse Free GMB Audit Tool & Listing ROI Planner",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE.domain}/tools/listing-ops-roi-engine`,
    description: "Free GMB audit tool combining a manual Google Business Profile checklist with a browser-based listing ROI planner. Estimate follow-up workload and correction costs from your own GMB audit findings; no live profile scan.",
    featureList: ["Manual GMB audit checklist", "GMB audit follow-up cost planning", "Annual publisher touches", "Manual listing update cost", "FTE-equivalent workload", "Rework and exception estimates", "Scenario-based labor opportunity"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return <SiteShell>
    <JsonLd data={appSchema} />
    <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free GMB Audit Tool & ROI Planner", path: "/tools/listing-ops-roi-engine" }])} />
    <main>
      <section className="overflow-hidden border-b border-line bg-ink text-cream">
        <div className="page-wrap grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_.65fr] lg:items-center lg:py-24">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">OpsPulse · Manual GMB audit & ROI planning</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[.93] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl">Free GMB Audit Tool<br /><span className="text-brand-soft">& ROI Planner</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">Use the manual GMB audit checklist to review Google Business Profile details, then model the work needed to maintain accurate listings. Estimate staff hours, correction costs, FTE load, and automation scenarios from your own findings. No login or payment required; OpsPulse does not scan live profiles.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#calculator" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-fg">Plan GMB audit follow-up <ArrowRight className="size-4" /></a><Link to="/how-it-works" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-white hover:border-white">See how BLM works</Link></div></div>
          <div className="rounded-[2rem] border border-white/20 bg-white/[.06] p-6 shadow-[18px_18px_0_var(--brand)]"><div className="flex items-center justify-between border-b border-white/15 pb-4 text-xs font-semibold uppercase tracking-[.15em] text-white/60"><span>Live cost model</span><i className="size-2 rounded-full bg-brand-soft shadow-[0_0_0_6px_rgba(230,235,255,.1)]" /></div><div className="grid grid-cols-2 gap-px bg-white/15"><div className="bg-ink p-5"><strong className="block text-4xl text-white">12×</strong><span className="mt-2 block text-xs text-white/55">monthly model</span></div><div className="bg-ink p-5"><strong className="block text-4xl text-white">8</strong><span className="mt-2 block text-xs text-white/55">cost drivers</span></div><div className="col-span-2 bg-ink p-5"><div className="space-y-3"><i className="block h-2 w-[88%] bg-brand-soft" /><i className="block h-2 w-[63%] bg-brand" /><i className="block h-2 w-[74%] bg-white/45" /></div></div></div></div>
        </div>
      </section>
      <section id="calculator" className="page-wrap py-12 sm:py-16 lg:py-20"><OpsPulseRoiEngine /></section>
      <OpsPulseExplainer />
    </main>
  </SiteShell>;
}
