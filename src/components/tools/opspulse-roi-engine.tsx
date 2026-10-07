import { useMemo, useState } from "react";
import { Activity, ArrowRight, Clock3, DollarSign, Layers3, ShieldCheck, TrendingDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function bound(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function OpsPulseRoiEngine() {
  const [locations, setLocations] = useState(50);
  const [changes, setChanges] = useState(2.5);
  const [publishers, setPublishers] = useState(8);
  const [minutes, setMinutes] = useState(7);
  const [hourlyCost, setHourlyCost] = useState(38);
  const [rework, setRework] = useState(14);
  const [incidents, setIncidents] = useState(3);
  const [efficiency, setEfficiency] = useState(68);
  const [workflow, setWorkflow] = useState("spreadsheet");

  const result = useMemo(() => {
    const touches = locations * changes * publishers * 12;
    const publishingHours = touches * minutes / 60;
    const reworkHours = publishingHours * (rework / 100);
    const incidentHours = incidents * 4 * 12;
    const annualHours = publishingHours + reworkHours + incidentHours;
    const annualCost = annualHours * hourlyCost;
    const retainedHours = publishingHours * (1 - efficiency / 100) + reworkHours * 0.45 + incidentHours * 0.55;
    const hoursRecovered = Math.max(0, annualHours - retainedHours);
    const costRecovered = hoursRecovered * hourlyCost;
    const fte = annualHours / 2080;
    const monthlyOpportunity = costRecovered / 12;
    const workflowPenalty = { governed: 2, shared: 10, spreadsheet: 22, adHoc: 34 }[workflow] ?? 20;
    const drag = Math.round(bound((annualHours / Math.max(locations, 1)) * 3.4 + rework * 1.25 + incidents * 1.8 + workflowPenalty, 0, 100));
    const stage = drag >= 75 ? "Operational bottleneck" : drag >= 50 ? "Scaling pressure" : drag >= 28 ? "Emerging drag" : "Controlled workflow";
    const monthly = [0.88, 0.94, 0.91, 1.02, 1.06, 1.12, 0.96, 1.04, 1.18, 1.09, 1.14, 1.26].map((factor) => annualHours / 12 * factor);
    const maxMonth = Math.max(...monthly);
    const priorities = [
      { value: workflow === "governed" ? 15 : workflow === "shared" ? 45 : 88, title: "Establish one governed record", text: "Assign field owners, approvers, effective dates, and an audit trail before automating distribution." },
      { value: rework * 4, title: "Reduce correction loops", text: `${rework}% rework adds ${number.format(reworkHours)} hours a year. Track submitted, accepted, rejected, and verified-live as separate states.` },
      { value: incidents * 12, title: "Design for exceptions", text: `${incidents} monthly incidents create roughly ${number.format(incidentHours)} annual recovery hours at the current assumption.` },
      { value: publishers * changes, title: "Consolidate repeated publishing", text: `${number.format(touches)} annual publisher touches make batch controls and direct verification economically meaningful.` },
    ].sort((a, b) => b.value - a.value);
    return { touches, publishingHours, reworkHours, incidentHours, annualHours, annualCost, retainedHours, hoursRecovered, costRecovered, fte, monthlyOpportunity, drag, stage, monthly, maxMonth, priorities };
  }, [changes, efficiency, hourlyCost, incidents, locations, minutes, publishers, rework, workflow]);

  const numericInput = (setter: (value: number) => void, min: number, max: number) => (event: React.ChangeEvent<HTMLInputElement>) => setter(bound(Number(event.target.value), min, max));

  return (
    <div className="space-y-8">
      <section className="grid overflow-hidden rounded-[2rem] border border-line bg-cream shadow-[var(--shadow-soft)] lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-line bg-sand/45 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="border-b border-line pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">01 · Operating inputs</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Model the work behind every update.</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">Nothing is uploaded or stored. Change any assumption and the business case recalculates instantly.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <NumberField label="Locations" value={locations} min={1} max={5000} onChange={numericInput(setLocations, 1, 5000)} />
            <NumberField label="Changes / location / month" value={changes} min={0.1} max={30} step={0.1} onChange={numericInput(setChanges, 0.1, 30)} />
            <NumberField label="Publishers touched" value={publishers} min={1} max={80} onChange={numericInput(setPublishers, 1, 80)} />
            <NumberField label="Minutes per manual touch" value={minutes} min={1} max={60} onChange={numericInput(setMinutes, 1, 60)} />
            <NumberField label="Loaded hourly cost ($)" value={hourlyCost} min={10} max={250} onChange={numericInput(setHourlyCost, 10, 250)} />
            <NumberField label="Rework rate (%)" value={rework} min={0} max={100} onChange={numericInput(setRework, 0, 100)} />
            <NumberField label="Exceptions / month" value={incidents} min={0} max={100} onChange={numericInput(setIncidents, 0, 100)} />
            <label className="grid gap-2 text-sm font-semibold text-ink-soft"><span>Current workflow</span><select value={workflow} onChange={(event) => setWorkflow(event.target.value)} className="h-12 rounded-xl border border-line-strong bg-cream px-3 text-[15px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"><option value="governed">Governed system</option><option value="shared">Shared operations tool</option><option value="spreadsheet">Spreadsheets + tickets</option><option value="adHoc">Ad hoc logins</option></select></label>
          </div>
          <label className="mt-6 block rounded-2xl border border-line bg-cream p-4"><span className="flex items-center justify-between gap-4 text-sm font-semibold"><b>Modeled touch reduction</b><output className="rounded-full bg-brand px-3 py-1 text-brand-fg">{efficiency}%</output></span><input className="mt-4 w-full accent-brand" type="range" min="20" max="90" value={efficiency} onChange={(event) => setEfficiency(Number(event.target.value))} /><small className="mt-2 block text-xs leading-relaxed text-muted">Scenario control, not a product guarantee. Keep it conservative for planning.</small></label>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">02 · Live operating model</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{result.stage}</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">The drag index combines workload per location, rework, exception volume, and workflow maturity.</p></div>
            <div className="relative grid size-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--brand) ${result.drag * 3.6}deg, var(--sand) 0deg)` }}><div className="grid size-20 place-items-center rounded-full bg-cream text-center"><strong className="text-3xl leading-none">{result.drag}</strong><span className="text-[9px] font-semibold uppercase tracking-wider text-muted">drag index</span></div></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line xl:grid-cols-4">
            <Metric icon={Layers3} value={number.format(result.touches)} label="annual touches" />
            <Metric icon={Clock3} value={number.format(result.annualHours)} label="manual hours" />
            <Metric icon={DollarSign} value={money.format(result.annualCost)} label="operating cost" />
            <Metric icon={Activity} value={result.fte.toFixed(2)} label="FTE equivalent" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.78fr]">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Annual workload pattern</p><h3 className="mt-1 text-lg font-semibold">Manual hours by month</h3></div><TrendingDown className="size-5 text-brand" /></div>
              <div className="mt-6 flex h-40 items-end gap-2" aria-label="Estimated manual workload by month">{result.monthly.map((value, index) => <div className="flex h-full flex-1 items-end" key={index}><i className="w-full rounded-t-md bg-brand/75 transition-[height]" style={{ height: `${Math.max(10, value / result.maxMonth * 100)}%` }} title={`${number.format(value)} hours`} /></div>)}</div>
              <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-faint"><span>Jan</span><span>Jun</span><span>Dec</span></div>
            </div>
            <div className="rounded-2xl bg-ink p-5 text-cream">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">Modeled opportunity</p>
              <strong className="mt-5 block font-display text-5xl leading-none text-white">{money.format(result.costRecovered)}</strong><span className="mt-2 block text-sm text-white/60">annual labor capacity potentially recovered</span>
              <div className="mt-6 border-t border-white/15 pt-5"><b className="text-2xl text-white">{number.format(result.hoursRecovered)} hours</b><p className="mt-1 text-sm text-white/60">or {money.format(result.monthlyOpportunity)} per month at the current assumptions</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-7 rounded-[2rem] bg-ink p-5 text-cream sm:p-8 lg:grid-cols-[0.55fr_1fr]">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">03 · Control plan</p><h2 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Convert cost into operating priorities.</h2><p className="mt-4 text-[15px] leading-relaxed text-white/65">The priority stack ranks structural risk before software. Fix the workflow that creates bad data, then reduce repetitive publishing.</p><ButtonLink /></div>
        <ol className="divide-y divide-white/15 border-y border-white/15">{result.priorities.map((item, index) => <li className="grid grid-cols-[2.5rem_1fr] gap-4 py-5" key={item.title}><span className="font-mono text-sm text-brand-soft">{String(index + 1).padStart(2, "0")}</span><div><h3 className="text-lg font-semibold text-white">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p></div></li>)}</ol>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-line bg-cream p-5 sm:p-8 lg:grid-cols-[.55fr_1fr]">
        <div><ShieldCheck className="size-8 text-brand" /><h2 className="mt-4 font-display text-3xl font-semibold">Transparent assumptions</h2></div>
        <div className="space-y-3 text-[15px] leading-relaxed text-ink-soft"><p>OpsPulse multiplies locations, monthly changes, publishers, and minutes per touch. It adds rework and four hours per modeled exception, then applies your chosen touch-reduction scenario.</p><p>Results estimate labor capacity, not guaranteed savings or revenue. Validate the model with actual ticket timestamps, salaries, vendor scope, publisher behavior, and implementation cost before making a purchase decision.</p></div>
      </section>
    </div>
  );
}

function NumberField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return <label className="grid gap-2 text-sm font-semibold text-ink-soft"><span>{label}</span><input className="h-12 rounded-xl border border-line-strong bg-cream px-3 text-[15px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" type="number" value={value} min={min} max={max} step={step} onChange={onChange} /></label>;
}

function Metric({ icon: Icon, value, label }: { icon: typeof Activity; value: string; label: string }) {
  return <article className="min-h-32 bg-cream p-4"><Icon className="size-4 text-brand" /><strong className="mt-5 block text-2xl tracking-tight sm:text-3xl">{value}</strong><span className="mt-1 block text-xs text-muted">{label}</span></article>;
}

function ButtonLink() {
  return <Link to="/trial" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-fg transition-transform hover:-translate-y-0.5">Start a free workspace <ArrowRight className="size-4" /></Link>;
}
