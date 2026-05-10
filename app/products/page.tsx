import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { assetPath } from "@/data/paths";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  title: `Products | ${siteContent.brand.name}`,
  description:
    "Browse product categories Teekay can help source from trusted China suppliers, including iPhones, watches, t-shirts, and caps."
};

const phoneStyles = {
  graphite: {
    body: "from-slate-950 to-slate-700",
    screen: "from-slate-900 via-violet-900 to-slate-950",
    glow: "bg-violet-300"
  },
  purple: {
    body: "from-violet-400 to-indigo-500",
    screen: "from-indigo-950 via-blue-600 to-violet-300",
    glow: "bg-blue-200"
  },
  blue: {
    body: "from-sky-300 to-blue-500",
    screen: "from-sky-100 via-blue-500 to-white",
    glow: "bg-sky-200"
  },
  green: {
    body: "from-emerald-300 to-teal-600",
    screen: "from-emerald-950 via-teal-500 to-emerald-200",
    glow: "bg-teal-100"
  },
  white: {
    body: "from-white to-slate-200",
    screen: "from-slate-100 via-white to-slate-300",
    glow: "bg-white"
  },
  pink: {
    body: "from-rose-100 to-pink-400",
    screen: "from-slate-950 via-rose-800 to-amber-200",
    glow: "bg-rose-200"
  },
  teal: {
    body: "from-teal-200 to-teal-500",
    screen: "from-teal-950 via-teal-500 to-cyan-200",
    glow: "bg-cyan-100"
  },
  black: {
    body: "from-neutral-950 to-neutral-700",
    screen: "from-neutral-950 via-indigo-950 to-violet-500",
    glow: "bg-fuchsia-200"
  },
  sky: {
    body: "from-blue-100 to-sky-400",
    screen: "from-white via-sky-300 to-blue-700",
    glow: "bg-sky-100"
  },
  silver: {
    body: "from-white to-zinc-300",
    screen: "from-white via-zinc-200 to-zinc-500",
    glow: "bg-white"
  },
  navy: {
    body: "from-slate-900 to-blue-950",
    screen: "from-black via-slate-900 to-blue-500",
    glow: "bg-blue-200"
  },
  copper: {
    body: "from-orange-300 to-orange-700",
    screen: "from-black via-orange-950 to-orange-500",
    glow: "bg-orange-200"
  }
};

function PhoneMockup({ color }: { color: keyof typeof phoneStyles }) {
  const style = phoneStyles[color];

  return (
    <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-lg bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,74,28,0.18),transparent_16rem),radial-gradient(circle_at_82%_78%,rgba(245,200,95,0.16),transparent_18rem)]" />
      <div className="absolute left-4 top-4 z-20 grid gap-1">
        <span className="rounded bg-ember-500 px-3 py-1 text-sm font-bold leading-none text-white">
          OFFER
        </span>
        <span className="rounded bg-teal-500 px-4 py-1 text-sm font-bold leading-none text-white">
          HOT
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#020b14] to-transparent" />
      <div className={`relative -mr-3 h-36 w-20 rounded-[1.35rem] bg-gradient-to-br ${style.body} shadow-xl ring-2 ring-white/20`}>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-black/45 ring-1 ring-white/20" />
          <span className="h-3.5 w-3.5 rounded-full bg-black/35 ring-1 ring-white/20" />
        </div>
        <div className="absolute inset-x-0 top-1/2 mx-auto h-7 w-7 -translate-y-1/2 rounded-full bg-white/10" />
      </div>
      <div className="relative h-40 w-24 rounded-[1.45rem] bg-black p-1 shadow-2xl ring-2 ring-black/20">
        <div className={`relative h-full overflow-hidden rounded-[1.15rem] bg-gradient-to-br ${style.screen}`}>
          <div className="absolute left-1/2 top-1.5 h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
          <div className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full ${style.glow} opacity-70 blur-md`} />
          <div className="absolute inset-5 rounded-full border border-white/30" />
          <div className="absolute bottom-4 right-3 h-16 w-7 rounded-full border border-white/20" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { brand, products } = siteContent;

  return (
    <main className="min-h-screen bg-[#f8fbff] text-navy-950">
      <section className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white shadow-soft backdrop-blur">
        <Container className="py-0">
          <header className="flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src={assetPath(brand.logo)}
                alt={`${brand.name} logo`}
                width={48}
                height={48}
                className="h-10 w-10 shrink-0 rounded-full bg-white object-contain"
                priority
              />
              <span className="min-w-0 text-sm font-black leading-tight sm:text-base">
                Teekay Products
              </span>
            </Link>
            <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
              {products.categories.map((product) => (
                <a
                  href={`#${product.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/12 px-4 text-sm font-black text-white/82 transition hover:border-gold-400 hover:text-gold-400"
                  key={product.title}
                >
                  {product.title}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/" className="hidden text-sm font-black text-white/70 transition hover:text-gold-400 sm:inline">
                Home
              </Link>
              <a
                href={brand.whatsappUrl}
                className="inline-flex min-h-10 items-center rounded-full bg-ember-500 px-4 text-sm font-black text-white transition hover:bg-gold-400 hover:text-navy-950"
              >
                WhatsApp
              </a>
            </div>
          </header>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-10 text-white sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,74,28,0.18),transparent_24rem),radial-gradient(circle_at_86%_30%,rgba(17,169,157,0.18),transparent_28rem)]" />
        <Container>
          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex border-l-4 border-ember-500 bg-white/10 px-4 py-2 text-xs font-black uppercase leading-5 text-gold-400">
                {products.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
                Supplier-backed product catalog
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/72">
                Browse products Teekay can source through known suppliers, then ask for current stock, storage, colors, samples, and shipping guidance.
              </p>
            </div>
            <div className="grid gap-3 rounded-lg border border-white/10 bg-white/10 p-4 shadow-soft backdrop-blur sm:grid-cols-2">
              {products.process.map((step, index) => (
                <div className="flex gap-3 rounded-lg bg-white p-3 text-navy-950" key={step}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember-500 text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white py-4">
        <Container>
          <div className="flex gap-2 overflow-x-auto pb-1">
              {products.categories.map((product) => (
                <a
                  href={`#${product.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-slate-200 bg-[#f8fbff] px-5 text-sm font-black text-navy-950 transition hover:border-ember-500 hover:bg-ember-500 hover:text-white"
                  key={product.title}
                >
                  {product.title}
                </a>
              ))}
          </div>
        </Container>
      </section>

      <section id="iphones" className="scroll-mt-24 bg-[#f8fbff] py-10 sm:py-14">
        <Container>
          <div className="mb-7 flex flex-col gap-2 border-l-4 border-ember-500 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-ember-500">iPhones</p>
              <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">
                Supplier-checked iPhone models
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-500">
              Prices are guide ranges and can change by storage, condition, supplier stock, and exchange rate.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.iphoneProducts.map((product) => (
              <article className="group min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-ember-500/30" key={product.name}>
                <PhoneMockup color={product.color as keyof typeof phoneStyles} />
                <div className="p-5">
                  <p className="text-xs font-black uppercase text-teal-600">{product.brand}</p>
                  <h3 className="mt-2 text-xl font-black leading-tight text-navy-950">{product.name}</h3>
                  <p className="mt-3 text-2xl font-black leading-tight text-ember-500">
                    {product.price}
                  </p>
                  <p className="text-base font-semibold leading-tight text-slate-400 line-through">{product.oldPrice}</p>
                  <a
                    href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.name)}.`}
                    className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-navy-950 px-4 text-sm font-black text-white transition hover:bg-ember-500"
                  >
                    Ask supplier
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mb-7 border-l-4 border-teal-500 pl-4">
            <p className="text-sm font-black uppercase text-teal-600">More categories</p>
            <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">
              Other supplier-ready products
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {products.categories.slice(1).map((product) => (
              <article
                id={product.title.toLowerCase().replaceAll(" ", "-")}
                className="relative scroll-mt-24 overflow-hidden rounded-lg border border-slate-100 bg-[#fbfdff] p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal-500/30"
                key={product.title}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-gold-400" />
                <p className="text-sm font-black uppercase text-teal-600">{product.tag}</p>
                <h2 className="mt-3 text-2xl font-black text-navy-950">{product.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{product.description}</p>
                <div className="mt-5 grid gap-2">
                  {product.items.map((item) => (
                    <div className="flex items-center gap-3" key={item}>
                      <span className="h-2.5 w-2.5 rounded-full bg-ember-500" />
                      <span className="text-sm font-bold text-navy-950">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.title)}.`}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
                >
                  Ask about {product.title}
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
