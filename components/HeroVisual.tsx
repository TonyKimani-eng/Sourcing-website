import Image from "next/image";
import { siteContent } from "@/data/site";

export function HeroVisual() {
  const { brand } = siteContent;

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-white/15 bg-white/10 p-2.5 shadow-2xl backdrop-blur sm:p-5">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,74,28,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(245,200,95,0.20),transparent_25rem)]" />
      <div className="absolute inset-x-0 top-0 h-2 bg-ember-500" />
      <Image
        src={brand.logo}
        alt={`${brand.name} China to Kenya shipping logo`}
        width={1100}
        height={1100}
        className="relative mx-auto aspect-square w-full rounded-lg bg-white object-contain p-2 sm:p-3"
        priority
      />
      <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/20 bg-navy-950/90 p-3 shadow-soft backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
        <p className="text-xs font-black text-gold-400 sm:text-sm">China to Kenya</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-white/[0.82] sm:text-sm">Air freight, sea freight, sourcing, and consolidation.</p>
      </div>
    </div>
  );
}
