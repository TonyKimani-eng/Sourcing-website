"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/components/Auth";
import { saveInquiry, uploadInquiryPhotos } from "@/lib/inquiries";

const maxPhotoCount = 4;

export function SourcingOrderForm() {
  const { user, openAuth } = useAuth();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedPhotoText = useMemo(() => {
    if (!photos.length) {
      return "No photos selected";
    }

    return `${photos.length} photo${photos.length === 1 ? "" : "s"} selected`;
  }, [photos.length]);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.phone) {
      openAuth("signin");
      return;
    }

    const nextItemName = itemName.trim();
    const nextDescription = description.trim();
    const nextContactMethod = contactMethod.trim() || user.email || user.phone;

    if (!nextItemName || !nextDescription) {
      setSubmitState("error");
      setMessage("Enter the item name and description before submitting.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const photoUrls = photos.length ? await uploadInquiryPhotos(user.uid, photos) : [];

      await saveInquiry(
        {
          requestType: "sourcing",
          productName: nextItemName,
          productCategory: "Sourcing order",
          description: nextDescription,
          contactMethod: nextContactMethod,
          photoUrls
        },
        {
          userId: user.uid,
          customerName: user.name,
          customerPhone: user.phone,
          customerEmail: user.email
        }
      );

      setItemName("");
      setDescription("");
      setContactMethod("");
      setPhotos([]);
      setSubmitState("submitted");
      setMessage("Sourcing order submitted. You can check review status from your account panel.");
    } catch (error) {
      console.error("Could not submit sourcing order", error);
      setSubmitState("error");
      setMessage(
        photos.length
          ? "Could not submit photos. Confirm Firebase Storage is enabled, or submit without photos."
          : "Could not submit sourcing order. Please try again."
      );
    }
  };

  return (
    <section id="sourcing-order" className="bg-[#f8fbff] py-10 sm:py-14">
      <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:px-6 lg:px-8">
        <div className="border-l-4 border-ember-500 pl-4">
          <p className="text-sm font-black uppercase text-ember-500">Sourcing order</p>
          <h2 className="mt-1 text-2xl font-black text-navy-950 sm:text-3xl">
            Looking for something not listed?
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Sign in, describe the item, and attach reference photos. Teekay will review the request and update your account.
          </p>
        </div>

        <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6" onSubmit={submitRequest}>
          {!user ? (
            <div className="rounded-lg border border-gold-400/40 bg-gold-400/15 p-4">
              <p className="text-sm font-black text-navy-950">Sign in before submitting a sourcing order.</p>
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-navy-950 px-4 text-xs font-black text-white transition hover:bg-ember-500"
              >
                Sign in or create account
              </button>
            </div>
          ) : null}

          <label className="grid gap-2">
            <span className="text-sm font-black text-navy-950">Item name</span>
            <input
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              placeholder="Example: baby stroller, gaming chair, salon sink"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-navy-950">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm font-bold leading-6 text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              placeholder="Describe size, color, quantity, budget, material, links, or any details you care about."
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-navy-950">Email or phone for follow-up</span>
            <input
              value={contactMethod}
              onChange={(event) => setContactMethod(event.target.value)}
              className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              placeholder={user?.email || user?.phone || "Email or phone number"}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-navy-950">Reference photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                setPhotos(Array.from(event.target.files ?? []).slice(0, maxPhotoCount));
                setSubmitState("idle");
                setMessage("");
              }}
              className="rounded-lg border border-dashed border-slate-300 bg-[#f8fbff] px-3 py-3 text-sm font-bold text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-navy-950 file:px-4 file:py-2 file:text-xs file:font-black file:text-white"
            />
            <span className="text-xs font-bold text-slate-500">{selectedPhotoText}. Up to {maxPhotoCount} images.</span>
          </label>

          {message ? (
            <p
              className={`rounded-md px-3 py-2 text-sm font-black leading-6 ${
                submitState === "submitted" ? "bg-teal-500/10 text-teal-700" : "bg-ember-500/10 text-ember-600"
              }`}
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!user || submitState === "submitting"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState === "submitting" ? "Submitting..." : "Submit sourcing order"}
          </button>
        </form>
      </div>
    </section>
  );
}
