import Image from "next/image";
import { siteContent } from "@/data/site";

export function HeroVisual() {
  const { brand } = siteContent;

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-2xl sm:p-5">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-gold-400 via-teal-500 to-navy-950" />
      <Image
        src={brand.logo}
        alt={`${brand.name} China to Kenya shipping logo`}
        width={1100}
        height={1100}
        className="relative mx-auto aspect-square w-full object-contain"
        priority
      />
      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur">
        <p className="text-sm font-black text-teal-600">China to Kenya</p>
        <p className="mt-1 text-sm font-semibold text-navy-950">Air freight, sea freight, sourcing, and consolidation.</p>
      </div>
    </div>
  );
}
