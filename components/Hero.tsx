import { siteContent } from "@/data/site";
import { AuthButtons } from "@/components/Auth";
import { Container } from "@/components/Container";
import { assetPath, routePath } from "@/data/paths";
import Image from "next/image";

export function Hero() {
  const { brand, hero, nav, stats, highlights } = siteContent;

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <Image
        src={assetPath("/hero-logistics-bg.png")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,11,20,0.96)_0%,rgba(3,20,38,0.88)_38%,rgba(3,20,38,0.52)_66%,rgba(3,20,38,0.28)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(255,74,28,0.16),transparent_28rem),radial-gradient(circle_at_78%_30%,rgba(245,200,95,0.10),transparent_30rem)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#f8fbff] to-transparent" />
      <Container className="pt-3">
        <header className="flex items-stretch justify-between gap-0">
          <a href="#" className="flex min-h-14 min-w-0 flex-1 items-center gap-3 bg-white px-3 shadow-soft sm:min-h-20 sm:flex-none sm:px-6 sm:pr-12 sm:[clip-path:polygon(0_0,92%_0,100%_100%,0%_100%)]">
            <Image
              src={assetPath(brand.logo)}
              alt={`${brand.name} logo`}
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-12 sm:w-12"
              priority
            />
            <span className="min-w-0 text-xs font-black leading-tight text-navy-950 sm:text-base">
              {brand.name}
            </span>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-7 bg-ember-500 px-6 text-sm font-black text-white shadow-soft lg:flex">
            {nav.map((item) => (
              <a
                href={item === "Products" ? routePath("/products") : `#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="transition hover:text-navy-950"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex min-h-14 items-center bg-navy-950 px-2 shadow-soft sm:min-h-20 sm:px-4">
            <AuthButtons compact />
          </div>
        </header>
        <nav className="-mx-4 flex gap-2 overflow-x-auto border-t border-white/10 bg-ember-500 px-4 py-3 text-sm font-black text-white shadow-soft lg:hidden">
          {nav.map((item) => (
            <a
              href={item === "Products" ? routePath("/products") : `#${item.toLowerCase().replaceAll(" ", "-")}`}
              className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-white/12 px-4 transition hover:bg-gold-400 hover:text-navy-950"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </Container>
      <Container className="pb-24 pt-8 sm:pb-20 lg:pb-24 lg:pt-20">
        <div className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-[560px]">
          <div className="max-w-3xl pt-3 sm:pt-10 lg:pt-16">
            <p className="inline-flex max-w-full border-l-4 border-ember-500 bg-white/10 px-4 py-2 text-[11px] font-black uppercase leading-5 text-gold-400 backdrop-blur sm:text-sm">
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-[2.15rem] font-black leading-[1.04] text-white sm:mt-6 sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/[0.78] sm:mt-6 sm:text-xl sm:leading-8">
              {hero.subheadline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              {highlights.map((item) => (
                <span
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white backdrop-blur sm:px-4 sm:text-sm"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              className="relative min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white p-4 shadow-soft sm:p-5"
              key={stat.label}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-ember-500" />
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="mt-2 text-xl font-black leading-tight text-navy-950 sm:text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
