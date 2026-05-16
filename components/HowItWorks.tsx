import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f8fbff] py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="A simple import process from product link to delivery"
          description="Teekay keeps each step clear so you always know what is happening with your order."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {siteContent.howItWorks.map((step, index) => (
            <article className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-1" key={step.title}>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ember-500 to-gold-400" />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-950 text-sm font-black text-gold-400 transition group-hover:bg-ember-500 group-hover:text-white">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-black text-navy-950">{step.title}</h3>
              {index === 1 ? (
                <p className="mt-3 leading-7 text-slate-600">
                  We source, verify the supplier, and prepare a clear quote. A{" "}
                  <a
                    href="#sourcing-fee"
                    className="font-black text-teal-600 underline decoration-teal-500 decoration-2 underline-offset-4 transition hover:text-ember-500"
                  >
                    sourcing fee
                  </a>{" "}
                  applies for supplier search, product checks, and order coordination.
                </p>
              ) : (
                <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
