import { siteContent } from "@/data/site";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { HeroVisual } from "@/components/HeroVisual";

export function Hero() {
  const { brand, hero, nav, stats } = siteContent;

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#031426_0%,#0a2d55_48%,#0b857e_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-[#f7fbff] to-transparent" />
      <Container className="py-5">
        <header className="flex items-center justify-between gap-5">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-400 text-base font-black text-navy-950">
              TK
            </span>
            <span className="text-sm font-black sm:text-base">{brand.name}</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/80 lg:flex">
            {nav.map((item) => (
              <a
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="transition hover:text-white"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href={brand.whatsappUrl}
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            {brand.phone}
          </a>
        </header>
      </Container>
      <Container className="pb-16 pt-10 sm:pb-20 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-gold-400">
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78] sm:text-xl">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contact" variant="gold">
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href={brand.whatsappUrl} variant="secondary">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>
          <HeroVisual />
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur"
              key={stat.label}
            >
              <p className="text-sm font-bold text-white/[0.62]">{stat.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
