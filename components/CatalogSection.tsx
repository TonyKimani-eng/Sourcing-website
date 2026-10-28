import { IphoneProductCard } from "@/components/IphoneProductCard";
import { CatalogSection as CatalogSectionData, retailPriceKes } from "@/data/catalog";

export function CatalogSection({ section }: { section: CatalogSectionData }) {
  return (
    <section id={section.id} className="scroll-mt-24 border-t border-slate-100 bg-[#f8fbff] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 border-l-4 border-teal-500 pl-4">
          <p className="text-sm font-black uppercase text-teal-600">{section.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">{section.title}</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-600">{section.description}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {section.products.map((product) => (
            <IphoneProductCard
              key={product.name}
              product={{
                name: product.name,
                brand: section.title,
                storageOptions: product.variants.map((variant) => ({
                  storage: variant.label,
                  price: retailPriceKes(variant.rmb, section.kind)
                }))
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
