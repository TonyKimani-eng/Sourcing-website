import { siteContent } from "@/data/site";
import { Container } from "@/components/Container";
import { HeroVisual } from "@/components/HeroVisual";
import Image from "next/image";

export function Hero() {
  const { brand, hero, nav, stats } = siteContent;

  return (
    <section className="relative isolate overflow-hidden bg-[#f8fbff] text-navy-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(217,169,45,0.22),transparent_24rem),radial-gradient(circle_at_84%_18%,rgba(17,169,157,0.16),transparent_26rem),linear-gradient(180deg,#ffffff_0%,#f8fbff_62%,#edf6fa_100%)]" />
      <div className="absolute left-0 top-0 -z-10 h-2 w-full bg-[linear-gradient(90deg,#061f3d,#0b857e,#d9a92d)]" />
      <div className="absolute -left-24 top-20 -z-10 h-72 w-72 rounded-full border-[42px] border-navy-950/[0.04]" />
      <div className="absolute -right-28 bottom-20 -z-10 h-96 w-96 rounded-full border-[56px] border-gold-400/[0.10]" />
      <Container className="py-5">
        <header className="flex items-center justify-between gap-5">
          <a href="#" className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-soft backdrop-blur">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-contain"
              priority
            />
            <span className="text-sm font-black text-navy-950 sm:text-base">{brand.name}</span>
          </a>
          <nav className="hidden items-center gap-7 rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-sm font-semibold text-navy-900 shadow-soft backdrop-blur lg:flex">
            {nav.map((item) => (
              <a
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="transition hover:text-teal-600"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href={brand.whatsappUrl}
            className="hidden rounded-full border border-gold-400 bg-navy-950 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-navy-800 sm:inline-flex"
          >
            WhatsApp
          </a>
        </header>
      </Container>
      <Container className="pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <p className="inline-flex rounded-full border border-gold-400/50 bg-white px-4 py-2 text-sm font-black text-navy-950 shadow-soft">
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] text-navy-950 sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-700 sm:text-xl">
              {hero.subheadline}
            </p>
          </div>
          <HeroVisual />
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
              key={stat.label}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 via-teal-500 to-navy-950" />
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-black text-navy-950">{stat.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
