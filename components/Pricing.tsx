import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#f8fbff] py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Pricing"
          title="Clear rates for air, sea, and sourcing"
          description="Use these main rates to estimate your import budget, then contact us for a confirmed quote."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {siteContent.pricing.map((item) => (
            <article
              className={`relative overflow-hidden rounded-lg p-7 shadow-soft ring-1 ${
                item.highlight
                  ? "bg-navy-950 text-white ring-gold-400/40"
                  : "bg-white text-navy-950 ring-slate-200"
              }`}
              key={item.title}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${item.highlight ? "bg-gold-400" : "bg-teal-500"}`} />
              <p className={`text-sm font-black uppercase ${item.highlight ? "text-gold-400" : "text-teal-600"}`}>
                {item.title}
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black sm:text-5xl">{item.price}</span>
                <span className={`pb-1 font-bold ${item.highlight ? "text-white/[0.62]" : "text-slate-500"}`}>
                  {item.unit}
                </span>
              </div>
              <p className={`mt-5 leading-7 ${item.highlight ? "text-white/[0.72]" : "text-slate-600"}`}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
