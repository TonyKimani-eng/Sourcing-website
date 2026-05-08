import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f7fbff] py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="A simple import process from product link to delivery"
          description="Teekay keeps each step clear so you always know what is happening with your order."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {siteContent.howItWorks.map((step, index) => (
            <article className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-slate-100" key={step.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-950 text-sm font-black text-gold-400">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-black text-navy-950">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
