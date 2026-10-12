import { Link } from "@tanstack/react-router";

const faqs = [
  { question: "What is business listing management ROI?", answer: "Business listing management ROI compares the measurable value of time and correction work reduced by a new operating process with the full cost of implementing and running that process. OpsPulse models potentially recoverable labor capacity only; it does not subtract software, migration, training, or verification expenses, so its output is not a net ROI percentage." },
  { question: "Does the calculator measure revenue from Google Business Profile rankings?", answer: "No. The calculator estimates publishing workload, rework, and exception-handling time using your assumptions. It does not connect to Google Business Profile, measure search rankings, count conversions, or attribute customer revenue to listings." },
  { question: "Can I use OpsPulse for a franchise or multi-location brand?", answer: "Yes. Enter the locations you operate, average monthly changes per location, number of publisher destinations touched, time per manual update, and fully loaded hourly cost. Franchise teams should distinguish corporate-approved fields from local edits and validate a sample of location-level tickets before presenting the result." },
  { question: "How do I estimate realistic savings from listings automation?", answer: "Begin with real update tickets and timesheets, then run conservative and optimistic touch-reduction scenarios. Include duplicate or rejected submissions, manual verifications, integrations, subscription fees, and rollout time separately. Only count hours as cash savings if staffing or paid service expense actually decreases." },
  { question: "Are Google Business Profile bulk updates the same as automated listings management?", answer: "No. Google's bulk import supports eligible multi-location profile management, but maintaining correct data across other publishers still depends on each destination's rules, supported fields, review procedures, and verification. A centralized publishing system may reduce repeated work but cannot guarantee acceptance everywhere." },
] as const;

export function OpsPulseExplainer() {
  return <div className="page-wrap pb-20 sm:pb-28">
    <section aria-labelledby="opspulse-definition" className="border-t border-line pt-12 sm:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">A practical business case</p>
      <h2 id="opspulse-definition" className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">What is a business listing management ROI calculator?</h2>
      <p className="mt-5 max-w-4xl text-lg leading-relaxed text-ink-soft">A business listing management ROI calculator estimates the staff time and operating cost involved in updating local business profiles across locations and publishing platforms. OpsPulse helps agencies, franchises, and multi-location operations teams compare today's manual workload with a hypothetical, more efficient process. It is a <strong>workload and labor-opportunity model</strong>, not an audit of live listings or proof of financial return.</p>
      <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink-soft">Business listing operations include maintaining names, addresses, phone numbers (NAP), opening hours, location status, website URLs, categories, and other supported fields across Google Business Profile, Apple Business Connect, Bing Places, and relevant directories. Because every publisher can have its own requirements, a successful submission is not always the same as a verified live correction.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { name: "For franchises", text: "Estimate what it costs to distribute approved corporate changes across branches and manage local exceptions." },
          { name: "For agencies", text: "Scope client onboarding, recurring listing maintenance, correction tickets, and the manual hours within a service retainer." },
          { name: "For multi-location teams", text: "Build a finance-ready baseline for location data governance, listing operations, and automation planning." },
        ].map(item => <div className="rounded-2xl border border-line bg-paper p-6" key={item.name}><h3 className="text-lg font-semibold">{item.name}</h3><p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.text}</p></div>)}
      </div>
    </section>

    <section aria-labelledby="opspulse-formula" className="mt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Transparent methodology</p>
      <h2 id="opspulse-formula" className="mt-4 font-display text-4xl font-semibold tracking-tight">How OpsPulse calculates listing management cost</h2>
      <p className="mt-4 max-w-4xl leading-relaxed text-ink-soft">The live model uses eight adjustable numeric drivers plus the workflow type. Every result comes from your inputs; there are no industry-average savings claims hidden behind the score. Annual hours are calculated from monthly publishing work, modeled rework, and a fixed four-hour allowance for each exception.</p>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[590px] text-left text-sm">
          <thead className="bg-ink text-white"><tr><th className="px-5 py-4">Output</th><th className="px-5 py-4">How it is calculated</th><th className="px-5 py-4">How to use it</th></tr></thead>
          <tbody className="divide-y divide-line bg-cream">
            <tr><th className="px-5 py-4 font-semibold">Annual publisher touches</th><td className="px-5 py-4">Locations × monthly changes × publishers × 12</td><td className="px-5 py-4">Estimated manual update events</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Publishing hours</th><td className="px-5 py-4">Touches × minutes per touch ÷ 60</td><td className="px-5 py-4">Base editing and submission labor</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Rework hours</th><td className="px-5 py-4">Publishing hours × rework rate</td><td className="px-5 py-4">Estimated extra corrections</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Exception hours</th><td className="px-5 py-4">Monthly exceptions × 4 hours × 12</td><td className="px-5 py-4">Illustrative recovery workload</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Annual operating cost</th><td className="px-5 py-4">(Publishing + rework + exception hours) × hourly cost</td><td className="px-5 py-4">Modeled labor cost, not total vendor spend</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Full-time equivalents (FTE)</th><td className="px-5 py-4">Annual operating hours ÷ 2,080</td><td className="px-5 py-4">A planning conversion, not a hiring recommendation</td></tr>
            <tr><th className="px-5 py-4 font-semibold">Recoverable labor capacity</th><td className="px-5 py-4">Original hours minus retained scenario hours</td><td className="px-5 py-4">Potential time freed, not guaranteed savings</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-4xl text-sm leading-relaxed text-ink-soft">The efficiency slider reduces modeled publishing hours only. Remaining rework is modeled at 45% of its original amount and exception work at 55%. These are <strong>scenario assumptions built into OpsPulse</strong>, not independently validated automation-performance benchmarks. The drag index is also a custom planning score, not a Google or industry certification.</p>
    </section>

    <section aria-labelledby="opspulse-example" className="mt-16 grid gap-8 rounded-[2rem] border border-line bg-sand/35 p-6 sm:p-10 lg:grid-cols-[.95fr_1.05fr]">
      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Worked example</p><h2 id="opspulse-example" className="mt-3 font-display text-4xl font-semibold">What does manual listings management cost for 40 locations?</h2><p className="mt-5 leading-relaxed text-ink-soft">Consider a hypothetical operator with 40 business locations, two field changes per location each month, six publishers, eight minutes per update, a $35 loaded hourly labor rate, 10% rework, and two exceptions each month.</p><p className="mt-4 leading-relaxed text-ink-soft">The model produces <strong>5,760 annual publisher touches</strong>, <strong>940.8 annual labor hours</strong>, and <strong>$32,928 in modeled annual labor cost</strong>. With a 60% touch-reduction assumption, the illustrative recoverable capacity is <strong>546.24 hours</strong> (about <strong>$19,118</strong> at that labor rate).</p></div>
      <div className="rounded-2xl bg-cream p-6"><h3 className="text-xl font-semibold">Validate the baseline before making a decision</h3><ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink-soft"><li>Export a representative month of location-change tickets. Separate routine edits from claims, verification, and rejections.</li><li>Time a sample of manual publisher updates and use your real fully loaded hourly cost.</li><li>Run three scenarios by changing touch reduction, rework, and exceptions rather than using one best-case estimate.</li><li>Add annual platform fees, onboarding, integrations, support, internal approvals, and migration costs outside OpsPulse.</li><li>Compare forecast hours with actual accepted-and-live updates after a pilot, then revisit the assumptions.</li></ol><p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">Illustrative example only. Labor value is not automatically cash returned to the business; it may instead represent capacity available for higher-value work.</p></div>
    </section>

    <section aria-labelledby="opspulse-scope" className="mt-16 grid gap-10 lg:grid-cols-2">
      <div><h2 id="opspulse-scope" className="font-display text-4xl font-semibold">What belongs in a complete listings ROI business case?</h2><p className="mt-4 leading-relaxed text-ink-soft">Labor efficiency is only one part of total cost of ownership (TCO). A defensible business case includes recurring license fees, onboarding, data cleanup, location and user limits, integrations, monitoring, change-approval workflows, and time spent verifying that changes actually appear on publisher pages.</p><p className="mt-4 leading-relaxed text-ink-soft">For local SEO operations, track approved changes, submitted changes, accepted updates, rejected updates, verified-live locations, and time to resolution. These measures make it possible to separate distribution activity from actual local listing accuracy.</p><Link to="/how-it-works" className="mt-5 inline-block font-semibold text-brand underline underline-offset-4">See the business listing management workflow →</Link></div>
      <div><h2 className="font-display text-4xl font-semibold">What OpsPulse does not measure</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-ink-soft"><li>Live Google Business Profile data, NAP consistency, duplicate listings, or directory API acceptance.</li><li>Search visibility, local-pack rankings, clicks, calls, leads, store visits, or revenue attribution.</li><li>Actual software prices, one-time cleanup, change-management costs, or vendor support levels.</li><li>Publisher-specific publishing restrictions and how quickly edits go live.</li><li>Net financial ROI, unless you independently add all costs and verified financial benefits.</li></ul></div>
    </section>

    <section aria-labelledby="opspulse-questions" className="mt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Frequently asked questions</p>
      <h2 id="opspulse-questions" className="mt-3 font-display text-4xl font-semibold">Questions about listings cost and ROI</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">{faqs.map(item=><article key={item.question} className="rounded-2xl border border-line bg-cream p-6"><h3 className="text-xl font-semibold">{item.question}</h3><p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.answer}</p></article>)}</div>
    </section>

    <section aria-labelledby="opspulse-sources" className="mt-16 rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h2 id="opspulse-sources" className="font-display text-3xl font-semibold">Source notes and next steps</h2>
      <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-soft">OpsPulse calculations are a clearly labeled editorial model. For publisher-specific instructions, use primary documentation rather than assumptions about universal sync or guaranteed rankings.</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
        <li><a className="underline underline-offset-4" href="https://support.google.com/business/answer/3370250?hl=en" rel="noopener noreferrer" target="_blank">Google Business Profile Help: create a bulk upload spreadsheet</a> — how multi-location imports and required profile fields work.</li>
        <li><a className="underline underline-offset-4" href="https://support.google.com/business/answer/7091?hl=en" rel="noopener noreferrer" target="_blank">Google Business Profile Help: local ranking factors</a> — why cost reduction cannot be interpreted as a ranking guarantee.</li>
        <li><Link className="underline underline-offset-4" to="/resources">Browse our listing-management resources</Link> for related operating guidance.</li>
      </ul>
    </section>
  </div>;
}
