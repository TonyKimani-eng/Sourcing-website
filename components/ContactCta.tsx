import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { siteContent } from "@/data/site";

export function ContactCta() {
  const { brand, finalCta } = siteContent;

  return (
    <section id="contact" className="bg-[#f7fbff] px-4 py-16 sm:py-24">
      <Container className="rounded-lg border border-gold-400/30 bg-white px-6 py-12 text-center text-navy-950 shadow-soft sm:px-10 lg:py-16">
        <p className="text-sm font-black uppercase text-gold-400">Contact</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black sm:text-5xl">
          {finalCta.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{finalCta.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={brand.whatsappUrl} variant="primary">
            {finalCta.button}
          </ButtonLink>
          <div className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold-400 bg-white px-6 text-sm font-extrabold text-navy-950 shadow-soft">
            {finalCta.wechatButton}: {brand.wechat}
          </div>
        </div>
      </Container>
    </section>
  );
}
