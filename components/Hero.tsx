import { siteContent } from "@/data/site";
import { Container } from "@/components/Container";
import Image from "next/image";

export function Hero() {
  const { brand, hero, nav, stats, topBar, highlights } = siteContent;

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <Image
        src="/hero-logistics-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,11,20,0.96)_0%,rgba(3,20,38,0.88)_38%,rgba(3,20,38,0.52)_66%,rgba(3,20,38,0.28)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(255,74,28,0.16),transparent_28rem),radial-gradient(circle_at_78%_30%,rgba(245,200,95,0.10),transparent_30rem)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#f8fbff] to-transparent" />
      <div className="border-b border-white/10 bg-[#020b14]/95">
        <Container className="flex flex-col gap-2 py-3 text-[11px] font-bold leading-5 text-white/72 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <span className="max-w-full">{topBar.location}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{topBar.help}</span>
            <span>WeChat: {brand.wechat}</span>
            <span className="hidden md:inline">{topBar.email}</span>
          </div>
        </Container>
      </div>
      <Container className="py-0">
        <header className="flex items-stretch justify-between gap-0">
          <a href="#" className="flex min-h-16 min-w-0 flex-1 items-center gap-3 bg-white px-3 shadow-soft sm:min-h-20 sm:flex-none sm:px-6 sm:pr-12 sm:[clip-path:polygon(0_0,92%_0,100%_100%,0%_100%)]">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={48}
              height={48}
              className="h-11 w-11 shrink-0 rounded-full object-contain sm:h-12 sm:w-12"
              priority
            />
            <span className="min-w-0 text-sm font-black leading-tight text-navy-950 sm:text-base">
              {brand.name}
            </span>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-7 bg-ember-500 px-6 text-sm font-black text-white shadow-soft lg:flex">
            {nav.map((item) => (
              <a
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="transition hover:text-navy-950"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href={brand.whatsappUrl}
            className="inline-flex min-h-16 shrink-0 items-center bg-ember-500 px-4 text-xs font-black text-white transition hover:bg-gold-400 hover:text-navy-950 sm:min-h-20 sm:bg-white sm:px-6 sm:text-sm sm:text-navy-950"
          >
            WhatsApp
          </a>
        </header>
      </Container>
      <Container className="pb-14 pt-10 sm:pb-20 lg:pb-24 lg:pt-20">
        <div className="relative min-h-[520px] lg:min-h-[560px]">
          <div className="max-w-3xl pt-4 sm:pt-10 lg:pt-16">
            <p className="inline-flex max-w-full border-l-4 border-ember-500 bg-white/10 px-4 py-2 text-xs font-black uppercase leading-5 text-gold-400 backdrop-blur sm:text-sm">
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-[2.35rem] font-black leading-[1.04] text-white sm:text-6xl lg:text-7xl">
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
