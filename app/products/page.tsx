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
    <div className="relative flex h-56 items-center justify-center rounded-lg bg-[#f7f7f9]">
      <div className="absolute left-4 top-4 z-20 grid gap-1">
        <span className="rounded bg-[#ed1c2e] px-3 py-1 text-sm font-bold leading-none text-white">
          OFFER
        </span>
        <span className="rounded bg-[#0067b9] px-4 py-1 text-sm font-bold leading-none text-white">
          HOT
        </span>
      </div>
      <div className={`relative -mr-3 h-36 w-20 rounded-[1.35rem] bg-gradient-to-br ${style.body} shadow-xl ring-2 ring-black/15`}>
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
      <section className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-soft backdrop-blur">
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
              <span className="min-w-0 text-sm font-black leading-tight text-navy-950 sm:text-base">
                Products
              </span>
            </Link>
            <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
              {products.categories.map((product) => (
                <a
                  href={`#${product.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-slate-200 px-4 text-sm font-black text-navy-950 transition hover:border-ember-500 hover:text-ember-500"
                  key={product.title}
                >
                  {product.title}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/" className="hidden text-sm font-black text-slate-600 transition hover:text-ember-500 sm:inline">
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

      <section className="border-b border-slate-200 bg-white py-8">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase text-teal-600">{products.eyebrow}</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-navy-950">
                Product Catalog
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Choose a category below. iPhones are listed first with offer-style product cards for quick browsing.
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {products.categories.map((product) => (
                <a
                  href={`#${product.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-slate-200 bg-[#f8fbff] px-4 text-sm font-black text-navy-950"
                  key={product.title}
                >
                  {product.title}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="iphones" className="scroll-mt-24 bg-white py-8 sm:py-10">
        <Container>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.iphoneProducts.map((product) => (
              <article className="group min-w-0" key={product.name}>
                <PhoneMockup color={product.color as keyof typeof phoneStyles} />
                <div className="mt-5 px-1">
                  <h3 className="text-xl font-black leading-tight text-black">{product.name}</h3>
                  <p className="mt-3 text-base text-slate-500">{product.brand}</p>
                  <p className="mt-2 text-2xl font-black leading-tight text-[#ed1c2e]">
                    {product.price}
                  </p>
                  <p className="text-lg leading-tight text-slate-400 line-through">{product.oldPrice}</p>
                  <a
                    href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.name)}.`}
                    className="mt-4 inline-flex min-h-10 items-center rounded-full bg-navy-950 px-4 text-sm font-black text-white opacity-0 transition group-hover:bg-ember-500 group-hover:opacity-100 focus:opacity-100"
                  >
                    Ask supplier
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {products.categories.slice(1).map((product) => (
              <article
                id={product.title.toLowerCase().replaceAll(" ", "-")}
                className="scroll-mt-24 rounded-lg border border-slate-100 bg-white p-6 shadow-soft"
                key={product.title}
              >
                <p className="text-sm font-black uppercase text-teal-600">{product.tag}</p>
                <h2 className="mt-3 text-2xl font-black text-navy-950">{product.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{product.description}</p>
                <a
                  href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.title)}.`}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
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
