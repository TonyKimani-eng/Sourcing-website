"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/Auth";
import { assetPath } from "@/data/paths";
import { CatalogSection as CatalogSectionData, retailPriceKes } from "@/data/catalog";

function formatKes(price: number) {
  return `KSh ${price.toLocaleString("en-KE")}`;
}

export function CatalogSection({ section }: { section: CatalogSectionData }) {
  const { addItem } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleProducts = isExpanded ? section.products : section.products.slice(0, 12);

  return (
    <section id={section.id} className="scroll-mt-24 border-t border-slate-100 bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[17rem_1fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 shadow-soft">
              <Image src={assetPath(section.image)} alt={`${section.title} supplier catalogue`} fill sizes="(min-width: 1024px) 17rem, 100vw" className="object-cover" />
            </div>
            <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
              Supplier catalogue image retained for model reference. Availability is confirmed before payment.
            </p>
          </div>
          <div>
            <p className="text-sm font-black uppercase text-teal-600">{section.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">{section.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{section.description}</p>
            {section.kind === "phone" ? (
              <p className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
                KSh price includes RMB × 20, KSh 5,000 shipping and a competitive retail margin.
              </p>
            ) : null}
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {visibleProducts.map((product) => (
                <article key={product.name} className="rounded-lg border border-slate-100 bg-[#fbfdff] p-4 shadow-sm">
                  <h3 className="text-base font-black text-navy-950">{product.name}</h3>
                  <div className="mt-3 grid gap-2">
                    {product.variants.map((variant) => {
                      const price = retailPriceKes(variant.rmb, section.kind);
                      return (
                        <div key={variant.label} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
                          <span className="text-sm font-bold text-slate-600">{variant.label}</span>
                          <button
                            type="button"
                            className="shrink-0 text-sm font-black text-ember-500 transition hover:text-navy-950"
                            onClick={() => addItem({ productName: product.name, storage: variant.label, color: "", unitPrice: price, quantity: 1 })}
                            aria-label={`Add ${product.name} ${variant.label} to cart`}
                          >
                            {formatKes(price)} +
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            {section.products.length > 12 ? (
              <button type="button" onClick={() => setIsExpanded((expanded) => !expanded)} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-navy-950 px-5 text-sm font-black text-navy-950 transition hover:bg-navy-950 hover:text-white">
                {isExpanded ? "Show fewer models" : `View all ${section.products.length} models`}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
