"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/Auth";
import { siteContent } from "@/data/site";
import { saveInquiry, uploadInquiryPhotos } from "@/lib/inquiries";

const maxPhotoCount = 4;
const sourcingFeeKes = 5000;
const manualPaymentName = siteContent.brand.paymentName;
const manualPaymentPhone = siteContent.brand.phone;

type SourcingStep = "details" | "payment" | "submitted";

function formatKes(value: number) {
  return `KSh ${value.toLocaleString("en-KE")}`;
}

function PhotoPreview({
  photo,
  index,
  onRemove
}: {
  photo: File;
  index: number;
  onRemove: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const nextPreviewUrl = URL.createObjectURL(photo);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [photo]);

  return (
    <div className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`Selected reference photo ${index + 1}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 44vw, 160px"
            className="object-cover"
          />
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${photo.name}`}
          title="Remove photo"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy-950 text-xl font-black leading-none text-white shadow-md transition hover:bg-ember-500 focus:outline-none focus:ring-4 focus:ring-white/80"
        >
          &times;
        </button>
      </div>
      <p className="mt-1 truncate text-xs font-bold text-slate-500" title={photo.name}>
        {photo.name}
      </p>
    </div>
  );
}

export function SourcingOrderForm() {
  const { user, openAuth } = useAuth();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [paymentCode, setPaymentCode] = useState("");
  const [step, setStep] = useState<SourcingStep>("details");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedPhotoText = useMemo(() => {
    if (!photos.length) {
      return "No photos selected";
    }

    return `${photos.length} photo${photos.length === 1 ? "" : "s"} selected`;
  }, [photos.length]);

  const removePhoto = (photoIndex: number) => {
    setPhotos((currentPhotos) => currentPhotos.filter((_, index) => index !== photoIndex));
    setSubmitState("idle");
    setMessage("");
  };

  const continueToPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.phone) {
      openAuth("signin");
      return;
    }

    const nextItemName = itemName.trim();
    const nextDescription = description.trim();
    if (!nextItemName || !nextDescription) {
      setSubmitState("error");
      setMessage("Enter the item name and description before submitting.");
      return;
    }

    setSubmitState("idle");
    setMessage("");
    setStep("payment");
  };

  const submitRequest = async () => {
    if (!user?.phone) {
      openAuth("signin");
      return;
    }

    const nextItemName = itemName.trim();
    const nextDescription = description.trim();
    const nextContactMethod = contactMethod.trim() || user.email || user.phone;
    const nextPaymentCode = paymentCode.trim();

    if (!nextItemName || !nextDescription) {
      setStep("details");
      setSubmitState("error");
      setMessage("Enter the item name and description before continuing.");
      return;
    }

    if (!nextPaymentCode) {
      setSubmitState("error");
      setMessage("Paste the M-Pesa payment code before submitting your sourcing request.");
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
          photoUrls,
          priceEstimate: sourcingFeeKes,
          paymentMethod: "Manual M-Pesa",
          paymentStatus: "Payment submitted - awaiting admin confirmation",
          paymentNote: "Customer submitted a manual M-Pesa code for the KES 5,000 sourcing fee. Confirm payment before reviewing the request.",
          paymentCode: nextPaymentCode.toUpperCase()
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
      setPaymentCode("");
      setStep("submitted");
      setSubmitState("submitted");
      setMessage("");
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

        <form
          className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6"
          onSubmit={(event) => {
            if (step === "details") {
              continueToPayment(event);
              return;
            }

            event.preventDefault();
            if (step === "payment") {
              void submitRequest();
            }
          }}
        >
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

          {step === "details" ? (
          <>
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
                const selectedPhotos = Array.from(event.target.files ?? []);
                setPhotos((currentPhotos) => [...currentPhotos, ...selectedPhotos].slice(0, maxPhotoCount));
                setSubmitState("idle");
                setMessage("");
                event.target.value = "";
              }}
              className="rounded-lg border border-dashed border-slate-300 bg-[#f8fbff] px-3 py-3 text-sm font-bold text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-navy-950 file:px-4 file:py-2 file:text-xs file:font-black file:text-white"
            />
            <span className="text-xs font-bold text-slate-500">{selectedPhotoText}. Up to {maxPhotoCount} images.</span>
          </label>

          {photos.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Selected reference photos">
              {photos.map((photo, index) => (
                <PhotoPreview
                  key={`${photo.name}-${photo.size}-${photo.lastModified}-${index}`}
                  photo={photo}
                  index={index}
                  onRemove={() => removePhoto(index)}
                />
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">Sourcing fee</p>
              <p className="mt-1 text-xl font-black text-ember-500">{formatKes(sourcingFeeKes)}</p>
            </div>
            <p className="max-w-xs text-right text-xs font-bold leading-5 text-slate-500">
              Deducted from your first order purchase.
            </p>
          </div>
          </>
          ) : null}

          {step === "payment" ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-teal-500/25 bg-teal-500/10 p-4">
                <p className="text-xs font-black uppercase text-teal-700">Sourcing request</p>
                <p className="mt-1 text-lg font-black text-navy-950">{itemName}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  Pay the sourcing fee, then enter the M-Pesa confirmation code to submit this request.
                </p>
              </div>

              <div className="grid gap-3 border-y border-slate-200 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-black text-slate-500">Amount</span>
                  <span className="text-2xl font-black text-ember-500">{formatKes(sourcingFeeKes)}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md bg-[#f8fbff] px-3 py-2">
                    <p className="text-xs font-bold text-slate-500">M-Pesa name</p>
                    <p className="mt-1 text-sm font-black text-navy-950">{manualPaymentName}</p>
                  </div>
                  <div className="rounded-md bg-[#f8fbff] px-3 py-2">
                    <p className="text-xs font-bold text-slate-500">Mobile number</p>
                    <p className="mt-1 text-sm font-black text-navy-950">{manualPaymentPhone}</p>
                  </div>
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-black text-navy-950">M-Pesa payment code</span>
                <input
                  value={paymentCode}
                  onChange={(event) => {
                    setPaymentCode(event.target.value.toUpperCase());
                    setSubmitState("idle");
                    setMessage("");
                  }}
                  className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold uppercase text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  placeholder="Paste payment code"
                />
              </label>
            </div>
          ) : null}

          {step === "submitted" ? (
            <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
              <p className="text-lg font-black text-teal-700">Waiting payment confirmation</p>
              <p className="mt-2 text-sm font-bold leading-6 text-teal-800">
                Your sourcing request and payment code were sent to Teekay admin. You can follow its status from your account panel.
              </p>
            </div>
          ) : null}

          {message ? (
            <p
              className={`rounded-md px-3 py-2 text-sm font-black leading-6 ${
                submitState === "submitted" ? "bg-teal-500/10 text-teal-700" : "bg-ember-500/10 text-ember-600"
              }`}
            >
              {message}
            </p>
          ) : null}

          {step === "details" ? (
            <button
              type="submit"
              disabled={!user}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {user ? `Continue to payment - ${formatKes(sourcingFeeKes)}` : "Sign in to continue"}
            </button>
          ) : null}

          {step === "payment" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setSubmitState("idle");
                  setMessage("");
                }}
                disabled={submitState === "submitting"}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-black text-navy-950 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting" ? "Submitting..." : "I paid - submit request"}
              </button>
            </div>
          ) : null}

          {step === "submitted" ? (
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setSubmitState("idle");
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-950 px-5 text-sm font-black text-white transition hover:bg-ember-500"
            >
              Create another sourcing request
            </button>
          ) : null}
        </form>
      </div>
    </section>
  );
}
