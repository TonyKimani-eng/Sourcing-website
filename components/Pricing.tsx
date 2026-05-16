"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { assetPath } from "@/data/paths";
import { siteContent } from "@/data/site";

export function Pricing() {
  const [isCbmOpen, setIsCbmOpen] = useState(false);

  return (
    <section id="pricing" className="bg-[#f8fbff] py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Pricing"
          title="Clear rates for air, sea, and sourcing"
          description="Use these main rates to estimate your import budget, then contact us for a confirmed quote."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {siteContent.pricing.map((item) => (
            <article
              id={item.title === "Sourcing Fee" ? "sourcing-fee" : undefined}
              className={`relative overflow-hidden rounded-lg p-7 shadow-soft ring-1 ${
                item.highlight
                  ? "bg-navy-950 text-white ring-gold-400/40"
                  : "bg-white text-navy-950 ring-slate-200"
              }`}
              key={item.title}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${item.highlight ? "bg-gold-400" : "bg-teal-500"}`} />
              <p className={`text-sm font-black uppercase ${item.highlight ? "text-gold-400" : "text-teal-600"}`}>
                {item.title}
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black sm:text-5xl">{item.price}</span>
                {item.title === "Sea Freight" ? (
                  <button
                    type="button"
                    onClick={() => setIsCbmOpen(true)}
                    className="pb-1 text-left font-bold text-slate-500 underline decoration-teal-500 decoration-2 underline-offset-4 transition hover:text-teal-600"
                    aria-haspopup="dialog"
                  >
                    {item.unit}
                  </button>
                ) : (
                  <span className={`pb-1 font-bold ${item.highlight ? "text-white/[0.62]" : "text-slate-500"}`}>
                    {item.unit}
                  </span>
                )}
              </div>
              <p className={`mt-5 leading-7 ${item.highlight ? "text-white/[0.72]" : "text-slate-600"}`}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>

      {isCbmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cbm-title"
          onClick={() => setIsCbmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-teal-600">CBM guide</p>
                <h3 id="cbm-title" className="mt-1 text-2xl font-black text-navy-950">
                  How to measure CBM
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCbmOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black leading-none text-navy-950 transition hover:bg-ember-500 hover:text-white"
                aria-label="Close CBM guide"
              >
                x
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image
                src={assetPath("/cbm-exp.png")}
                alt="CBM measurement guide showing carton boxes measured by length, width, and height"
                width={1398}
                height={1116}
                className="h-auto w-full"
              />
            </div>

            <div className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-slate-600">
              <p>
                Measure in meters: Length x Width x Height = CBM.
              </p>
              <div className="grid gap-2 rounded-lg bg-[#f8fbff] p-3 text-navy-950 sm:grid-cols-2">
                <p>
                  <span className="font-black">1 CBM</span> = KES 58,000
                </p>
                <p>
                  <span className="font-black">0.6 CBM</span> = KES 34,800
                </p>
              </div>
              <p>
                Smaller volume costs less because sea freight is charged per CBM.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
