import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { routePath } from "@/data/paths";
import { siteContent } from "@/data/site";

export function ContactCta() {
  const { finalCta } = siteContent;

  return (
    <section id="contact" className="bg-[#f8fbff] px-4 py-16 sm:py-24">
      <Container className="relative overflow-hidden rounded-lg bg-navy-950 px-6 py-12 text-center text-white shadow-soft sm:px-10 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,74,28,0.20),transparent_28rem),radial-gradient(circle_at_84%_80%,rgba(245,200,95,0.16),transparent_28rem)]" />
        <div className="relative">
          <p className="text-sm font-black uppercase text-gold-400">Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black sm:text-5xl">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/[0.72] sm:text-lg sm:leading-8">{finalCta.description}</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href={`${routePath("/products")}#sourcing-order`} variant="primary" className="w-full sm:w-auto">
              {finalCta.button}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
