"use client";

import { useState } from "react";

type Category = {
  id: string;
  label: string;
};

export function ProductCategoryMenu({
  categories,
  label = "Browse catalog",
  buttonClassName = ""
}: {
  categories: Category[];
  label?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mt-5 inline-block text-left">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-navy-950 bg-white px-4 text-sm font-black text-navy-950 shadow-sm transition hover:border-ember-500 hover:text-ember-500 ${buttonClassName}`}
      >
        {label}
        <svg viewBox="0 0 20 20" aria-hidden="true" className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m5 7 5 5 5-5" />
        </svg>
      </button>
      {isOpen ? (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="menuitem"
              onClick={() => {
                document.getElementById(category.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsOpen(false);
              }}
              className="flex min-h-11 w-full items-center rounded-md px-3 text-sm font-black text-navy-950 transition hover:bg-teal-50 hover:text-teal-700"
            >
              {category.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
