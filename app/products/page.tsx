import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthButtons, PurchaseLink } from "@/components/Auth";
import { Container } from "@/components/Container";
import { IphoneProductCard } from "@/components/IphoneProductCard";
import { assetPath } from "@/data/paths";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  title: `Products | ${siteContent.brand.name}`,
  description:
    "Browse product categories Teekay can help source from trusted China suppliers, including iPhones, watches, t-shirts, and caps."
};

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
              <AuthButtons compact />
            </div>
          </header>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-6 text-white sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,74,28,0.18),transparent_24rem),radial-gradient(circle_at_86%_30%,rgba(17,169,157,0.18),transparent_28rem)]" />
        <Container>
          <div className="relative max-w-4xl">
              <p className="inline-flex border-l-4 border-ember-500 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase leading-5 text-gold-400 sm:text-xs">
                {products.eyebrow}
              </p>
              <h1 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">
                Supplier-backed product catalog
              </h1>
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

      <section id="iphones" className="scroll-mt-24 bg-[#f8fbff] py-8 sm:py-12">
        <Container>
          <div className="mb-5 border-l-4 border-ember-500 pl-4">
            <div>
              <p className="text-sm font-black uppercase text-ember-500">iPhones</p>
              <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">
                Factory refurbished iPhones, 100% battery
              </h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.iphoneProducts.map((product) => (
              <IphoneProductCard product={product} key={product.name} />
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
                <PurchaseLink
                  href={`${brand.whatsappUrl}?text=Hello%20Teekay%2C%20I%20want%20to%20source%20${encodeURIComponent(product.title)}.`}
                  inquiry={{
                    productName: product.title,
                    productCategory: product.title
                  }}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
                >
                  Ask about {product.title}
                </PurchaseLink>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
