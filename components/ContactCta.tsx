import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { siteContent } from "@/data/site";

export function ContactCta() {
  const { brand, finalCta } = siteContent;

  return (
    <section id="contact" className="bg-[#f7fbff] px-4 py-16 sm:py-24">
      <Container className="rounded-lg bg-navy-950 px-6 py-12 text-center text-white shadow-soft sm:px-10 lg:py-16">
        <p className="text-sm font-black uppercase text-gold-400">Contact</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black sm:text-5xl">
          {finalCta.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/[0.72]">{finalCta.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={brand.whatsappUrl} variant="gold">
            {finalCta.button}
          </ButtonLink>
          <a href={`tel:${brand.phone}`} className="text-lg font-black text-white hover:text-gold-400">
            {brand.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
