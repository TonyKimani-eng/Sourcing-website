"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PurchaseLink } from "@/components/Auth";
import { assetPath } from "@/data/paths";

type StorageOption = {
  storage: string;
  price: number;
};

type IphoneProductCardProps = {
  product: {
    name: string;
    brand: string;
    image: string;
    storageOptions: StorageOption[];
  };
  whatsappUrl: string;
};

function formatKes(price: number) {
  return `KSh ${Math.round(price).toLocaleString("en-KE")}`;
}

function formatStorage(storage: string) {
  return storage.toUpperCase().endsWith("T") ? storage.toUpperCase() : `${storage}GB`;
}

function ProductPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-56 overflow-hidden rounded-lg bg-slate-100">
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/25 via-transparent to-transparent" />
    </div>
  );
}

export function IphoneProductCard({ product, whatsappUrl }: IphoneProductCardProps) {
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions[0]?.storage ?? "");

  const selectedOption = useMemo(
    () =>
      product.storageOptions.find((option) => option.storage === selectedStorage) ??
      product.storageOptions[0],
    [product.storageOptions, selectedStorage]
  );

  const message = selectedOption
    ? `Hello Teekay, I want to source ${product.name} ${formatStorage(selectedOption.storage)}.`
    : `Hello Teekay, I want to source ${product.name}.`;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-ember-500/30">
      <ProductPhoto src={product.image} alt={`${product.name} product photo`} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-black uppercase text-teal-600">{product.brand}</p>
        <h3 className="mt-2 min-h-14 text-xl font-black leading-tight text-navy-950">
          {product.name}
        </h3>
        <p className="mt-3 text-2xl font-black leading-tight text-ember-500">
          {selectedOption ? formatKes(selectedOption.price) : "Ask for price"}
        </p>
        <div className="mt-4">
          <p className="text-xs font-black uppercase text-slate-400">Storage</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.storageOptions.map((option) => {
              const isSelected = option.storage === selectedOption?.storage;

              return (
                <button
                  type="button"
                  className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-black transition ${
                    isSelected
                      ? "border-ember-500 bg-ember-500 text-white"
                      : "border-slate-200 bg-[#f8fbff] text-navy-950 hover:border-ember-500"
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedStorage(option.storage)}
                  key={option.storage}
                >
                  {formatStorage(option.storage)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-auto pt-5">
          <PurchaseLink
            href={`${whatsappUrl}?text=${encodeURIComponent(message)}`}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-navy-950 px-4 text-sm font-black text-white transition hover:bg-ember-500"
          >
            Ask supplier
          </PurchaseLink>
        </div>
      </div>
    </article>
  );
}
