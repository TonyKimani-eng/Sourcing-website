"use client";

import { useMemo, useState } from "react";
import { PurchaseLink } from "@/components/Auth";
import { Container } from "@/components/Container";
import { siteContent } from "@/data/site";

const airUsdPerKg = 13;
const seaKesPerCbm = 58000;
const sourcingFeeKes = 5000;

function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Math.max(0, value));
}

function Field({
  label,
  value,
  onChange,
  suffix,
  min = 0
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-navy-950">{label}</span>
      <span className="flex min-h-12 overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-bold text-navy-950 outline-none"
        />
        {suffix ? (
          <span className="inline-flex min-w-16 items-center justify-center border-l border-slate-200 bg-[#f8fbff] px-3 text-sm font-black text-slate-500">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function ImportCostAnalyzer() {
  const { brand } = siteContent;
  const [method, setMethod] = useState<"air" | "sea">("air");
  const [weightKg, setWeightKg] = useState(12);
  const [volumeCbm, setVolumeCbm] = useState(0.35);
  const [productCost, setProductCost] = useState(85000);
  const [quantity, setQuantity] = useState(20);
  const [sellPrice, setSellPrice] = useState(6500);
  const [usdRate, setUsdRate] = useState(130);

  const result = useMemo(() => {
    const freight =
      method === "air" ? weightKg * airUsdPerKg * usdRate : volumeCbm * seaKesPerCbm;
    const totalCost = productCost + sourcingFeeKes + freight;
    const costPerItem = quantity > 0 ? totalCost / quantity : 0;
    const projectedRevenue = sellPrice * quantity;
    const projectedProfit = projectedRevenue - totalCost;
    const margin = projectedRevenue > 0 ? (projectedProfit / projectedRevenue) * 100 : 0;

    return {
      freight,
      totalCost,
      costPerItem,
      projectedRevenue,
      projectedProfit,
      margin
    };
  }, [method, weightKg, volumeCbm, productCost, quantity, sellPrice, usdRate]);

  const whatsappText = encodeURIComponent(
    `Hello Teekay, I used the import cost analyzer. Method: ${method.toUpperCase()}, estimated landed cost: ${formatKes(
      result.totalCost
    )}. Please confirm my quote.`
  );

  return (
    <section id="cost-analyzer" className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-teal-600">Cost analyzer</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-navy-950 sm:text-4xl">
              Estimate your landed import cost before you ship
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Compare air or sea freight, add your product cost, and see the estimated total,
              unit cost, and resale margin using Teekay&apos;s standard rates.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
                <span className="block text-xs font-black uppercase text-teal-600">Air</span>
                <span className="mt-1 block text-lg font-black text-navy-950">13 USD/kg</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
                <span className="block text-xs font-black uppercase text-teal-600">Sea</span>
                <span className="mt-1 block text-lg font-black text-navy-950">58k KES/CBM</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
                <span className="block text-xs font-black uppercase text-teal-600">Sourcing</span>
                <span className="mt-1 block text-lg font-black text-navy-950">5k KES</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 rounded-lg border border-slate-200 bg-[#f8fbff] p-4 shadow-soft sm:p-6">
            <div className="grid gap-2 sm:grid-cols-2">
              {(["air", "sea"] as const).map((option) => (
                <button
                  type="button"
                  onClick={() => setMethod(option)}
                  className={`min-h-12 rounded-lg border px-4 text-sm font-black uppercase transition ${
                    method === option
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-slate-200 bg-white text-navy-950 hover:border-teal-500"
                  }`}
                  key={option}
                >
                  {option === "air" ? "Air freight" : "Sea freight"}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product cost" value={productCost} onChange={setProductCost} suffix="KES" />
              <Field label="Quantity" value={quantity} onChange={setQuantity} suffix="items" min={1} />
              {method === "air" ? (
                <>
                  <Field label="Cargo weight" value={weightKg} onChange={setWeightKg} suffix="kg" />
                  <Field label="USD rate" value={usdRate} onChange={setUsdRate} suffix="KES" min={1} />
                </>
              ) : (
                <Field label="Cargo volume" value={volumeCbm} onChange={setVolumeCbm} suffix="CBM" />
              )}
              <Field label="Expected selling price" value={sellPrice} onChange={setSellPrice} suffix="KES" />
            </div>

            <div className="grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">Freight estimate</p>
                <p className="mt-2 text-2xl font-black text-navy-950">{formatKes(result.freight)}</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">Total landed cost</p>
                <p className="mt-2 text-2xl font-black text-ember-500">{formatKes(result.totalCost)}</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">Cost per item</p>
                <p className="mt-2 text-2xl font-black text-navy-950">{formatKes(result.costPerItem)}</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">Projected margin</p>
                <p className={`mt-2 text-2xl font-black ${result.margin >= 0 ? "text-teal-600" : "text-ember-500"}`}>
                  {result.margin.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 text-slate-500">
                Estimates exclude duty, taxes, supplier changes, and special handling. Teekay can confirm the final quote.
              </p>
              <PurchaseLink
                href={`${brand.whatsappUrl}?text=${whatsappText}`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
              >
                Confirm quote
              </PurchaseLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
