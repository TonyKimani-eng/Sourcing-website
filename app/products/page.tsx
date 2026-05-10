import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  title: `Products | ${siteContent.brand.name}`,
  description:
    "Browse product categories Teekay can help source from trusted China suppliers, including iPhones, watches, t-shirts, and caps."
};

const accentStyles = {
  teal: {
    panel: "from-teal-500/24 to-navy-950",
    badge: "bg-teal-500 text-white",
    line: "bg-teal-500"
  },
  gold: {
    panel: "from-gold-400/30 to-navy-950",
    badge: "bg-gold-400 text-navy-950",
    line: "bg-gold-400"
  },
  ember: {
    panel: "from-ember-500/28 to-navy-950",
    badge: "bg-ember-500 text-white",
    line: "bg-ember-500"
  },
  navy: {
    panel: "from-navy-500/34 to-navy-950",
    badge: "bg-navy-50 text-navy-950",
    line: "bg-navy-500"
  }
};

export default function ProductsPage() {
  const { brand, products } = siteContent;

  return (
    <main className="min-h-screen bg-[#f8fbff] text-navy-950">
      <section className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-soft backdrop-blur">
        <Container className="py-0">
          <header className="flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src={brand.logo}
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
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase text-teal-600">{products.eyebrow}</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-navy-950 sm:text-4xl">
                {products.headline}
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">{products.description}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
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

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {products.categories.map((product) => {
              const accent = accentStyles[product.accent as keyof typeof accentStyles];

              return (
                <article
                  id={product.title.toLowerCase().replaceAll(" ", "-")}
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-soft"
                  key={product.title}
                >
                  <div className={`relative min-h-52 bg-gradient-to-br ${accent.panel} p-6 text-white`}>
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${accent.line}`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase text-white/64">{product.tag}</p>
                        <h2 className="mt-3 text-3xl font-black">{product.title}</h2>
                      </div>
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-lg font-black ${accent.badge}`}>
                        {product.initials}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-6 right-6 h-16 rounded-lg border border-white/12 bg-white/10 backdrop-blur">
                      <div className="flex h-full items-center gap-3 px-4">
                        <div className="h-9 w-9 rounded-full bg-white/22" />
                        <div className="h-3 flex-1 rounded-full bg-white/24" />
                        <div className="h-3 w-16 rounded-full bg-white/18" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="leading-7 text-slate-600">{product.description}</p>
                    <div className="mt-5 grid gap-2">
                      {product.items.map((item) => (
                        <div className="flex items-center gap-3" key={item}>
                          <span className={`h-2.5 w-2.5 rounded-full ${accent.line}`} />
                          <span className="text-sm font-bold text-navy-950">{item}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.title)}.`}
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-navy-950 px-5 text-sm font-black text-white transition hover:bg-ember-500 sm:w-auto"
                    >
                      Ask about {product.title}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
