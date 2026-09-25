"use client";

import { useEffect, useState } from "react";
import {
  setTestimonialPublished,
  subscribeToAdminTestimonials,
  Testimonial
} from "@/lib/testimonials";

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [savingId, setSavingId] = useState("");

  useEffect(() => subscribeToAdminTestimonials(setTestimonials, () => undefined), []);

  const togglePublished = async (testimonial: Testimonial) => {
    setSavingId(testimonial.id);
    try {
      await setTestimonialPublished(testimonial.id, !testimonial.published);
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="text-sm font-black uppercase text-teal-600">Verified reviews</p>
        <h2 className="mt-1 text-2xl font-black text-navy-950">Testimonial approval</h2>
      </div>
      {!testimonials.length ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-soft">
          No customer reviews yet.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" key={testimonial.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-navy-950">{testimonial.reviewerName}</p>
                  <p className="mt-1 text-xs font-bold text-gold-600">
                    {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)} · Verified delivery
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${testimonial.published ? "bg-teal-500/10 text-teal-700" : "bg-gold-400/20 text-navy-950"}`}>
                  {testimonial.published ? "Published" : "Pending"}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">“{testimonial.message}”</p>
              <button
                type="button"
                onClick={() => void togglePublished(testimonial)}
                disabled={savingId === testimonial.id}
                className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full bg-navy-950 px-4 text-xs font-black text-white hover:bg-teal-600 disabled:opacity-60"
              >
                {savingId === testimonial.id ? "Saving..." : testimonial.published ? "Hide review" : "Approve & publish"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
