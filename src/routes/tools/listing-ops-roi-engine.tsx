import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { OpsPulseRoiEngine } from "@/components/tools/opspulse-roi-engine";
import { JsonLd } from "@/components/json-ld";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/tools/listing-ops-roi-engine")({
  head: () => pageHead({
    title: "Free Business Listing Management ROI Calculator",
    description: "Calculate listing-management workload, correction exposure, manual operating cost and automation opportunity with the free OpsPulse ROI Engine.",
    path: "/tools/listing-ops-roi-engine",
  }),
  component: OpsPulsePage,
});

function OpsPulsePage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OpsPulse Listing ROI Engine",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE.domain}/tools/listing-ops-roi-engine`,
    description: "A free browser-based calculator for business listing management workload, operating cost and automation scenarios.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return <SiteShell>
    <JsonLd data={appSchema} />
    <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "OpsPulse ROI Engine", path: "/tools/listing-ops-roi-engine" }])} />
    <main>
      <section className="overflow-hidden border-b border-line bg-ink text-cream">
        <div className="page-wrap grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_.65fr] lg:items-center lg:py-24">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">Free technical planning tool</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[.93] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl">OpsPulse<br /><span className="text-brand-soft">Listing ROI Engine</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">Model the hidden labor behind business listing updates. See annual touches, rework, exception cost, FTE load, and a transparent automation scenario in one live operating dashboard.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#calculator" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-fg">Run the engine <ArrowRight className="size-4" /></a><Link to="/how-it-works" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-white hover:border-white">See how BLM works</Link></div></div>
          <div className="rounded-[2rem] border border-white/20 bg-white/[.06] p-6 shadow-[18px_18px_0_var(--brand)]"><div className="flex items-center justify-between border-b border-white/15 pb-4 text-xs font-semibold uppercase tracking-[.15em] text-white/60"><span>Live cost model</span><i className="size-2 rounded-full bg-brand-soft shadow-[0_0_0_6px_rgba(230,235,255,.1)]" /></div><div className="grid grid-cols-2 gap-px bg-white/15"><div className="bg-ink p-5"><strong className="block text-4xl text-white">12×</strong><span className="mt-2 block text-xs text-white/55">monthly model</span></div><div className="bg-ink p-5"><strong className="block text-4xl text-white">8</strong><span className="mt-2 block text-xs text-white/55">cost drivers</span></div><div className="col-span-2 bg-ink p-5"><div className="space-y-3"><i className="block h-2 w-[88%] bg-brand-soft" /><i className="block h-2 w-[63%] bg-brand" /><i className="block h-2 w-[74%] bg-white/45" /></div></div></div></div>
        </div>
      </section>
      <section id="calculator" className="page-wrap py-12 sm:py-16 lg:py-20"><OpsPulseRoiEngine /></section>
    </main>
  </SiteShell>;
}
