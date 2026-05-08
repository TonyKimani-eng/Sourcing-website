import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function Faq() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Common questions before importing"
          description="Quick answers about timing, sourcing, consolidation, payments, and restricted goods."
        />
        <div className="mx-auto grid max-w-4xl gap-4">
          {siteContent.faqs.map((faq) => (
            <details
              className="group rounded-lg border border-slate-100 bg-white p-6 shadow-soft open:border-teal-100"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-navy-950">
                {faq.question}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl leading-none text-teal-600 group-open:bg-teal-500 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
