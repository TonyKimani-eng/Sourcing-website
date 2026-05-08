import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function WhyChooseUs() {
  return (
    <section className="bg-navy-950 py-16 text-white sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Why choose us"
            title="Built for trust, speed, and clear communication"
            description="From supplier checks to freight updates, Teekay helps reduce uncertainty when importing from China."
            inverse
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {siteContent.reasons.map((reason) => (
              <div
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.08] p-5 shadow-soft"
                key={reason}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-sm font-black text-navy-950">
                  OK
                </span>
                <p className="font-bold text-white/90">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
