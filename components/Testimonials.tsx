"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import {
  subscribeToPublishedTestimonials,
  Testimonial
} from "@/lib/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tracking-[0.12em] text-gold-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (index < rating ? "★" : "☆")).join("")}
    </span>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(
    () => subscribeToPublishedTestimonials(setTestimonials, () => setTestimonials([])),
    []
  );

  return (
    <section id="reviews" className="border-y border-slate-200/80 bg-white py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-600">
              From delivered orders
            </p>
            <h2 className="mt-2 text-2xl font-black text-navy-950 sm:text-3xl">
              What customers say
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Reviews open only after Teekay marks an order delivered and the customer confirms receipt.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {!testimonials.length ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-[#fbfdff] p-5 text-sm font-semibold leading-6 text-slate-500 lg:col-span-3">
              Verified customer delivery notes will appear here after recipients confirm their goods and submit a review.
            </div>
          ) : null}
          {testimonials.slice(0, 3).map((testimonial) => (
            <article
              className="rounded-lg border border-slate-200 bg-[#fbfdff] p-5"
              key={testimonial.id}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <Stars rating={testimonial.rating} />
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] text-white">
                    ✓
                  </span>
                  Verified delivery
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-navy-950">
                “{testimonial.message}”
              </p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-sm font-black text-navy-950">{testimonial.reviewerName}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{testimonial.orderLabel}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-slate-400">
                  {testimonial.createdAtText}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
