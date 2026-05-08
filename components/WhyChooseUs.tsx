import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(217,169,45,0.18),transparent_28rem),radial-gradient(circle_at_80%_80%,rgba(17,169,157,0.16),transparent_30rem)]" />
      <Container>
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Why choose us"
            title="Built for trust, speed, and clear communication"
            description="From supplier checks to freight updates, Teekay helps reduce uncertainty when importing from China."
            inverse
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {siteContent.reasons.map((reason) => (
              <div
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.10] p-5 shadow-soft backdrop-blur"
                key={reason}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-sm font-black text-navy-950">
                  +
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
