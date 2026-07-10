"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AuthButtons, useAuth } from "@/components/Auth";
import { Container } from "@/components/Container";
import {
  ADMIN_PHONE,
  AdminInquiry,
  isAdminPhone,
  subscribeToAdminInquiries,
  updateInquiryStatus
} from "@/lib/admin";
import { InquiryStatus } from "@/lib/inquiries";
import { routePath } from "@/data/paths";

const statuses: InquiryStatus[] = ["New", "Reviewed", "Contacted", "Quoted", "Paid", "Shipped", "Completed"];

function formatKes(value: number) {
  return `KSh ${Math.round(value).toLocaleString("en-KE")}`;
}

function InquiryCard({ inquiry }: { inquiry: AdminInquiry }) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    setStatus(inquiry.status);
    setSaveState("idle");
  }, [inquiry.status]);

  const saveStatus = async (nextStatus: InquiryStatus) => {
    setStatus(nextStatus);
    setSaveState("saving");

    try {
      await updateInquiryStatus(inquiry.id, nextStatus);
      setSaveState("saved");
    } catch {
      setStatus(inquiry.status);
      setSaveState("error");
    }
  };

  const isCartOrder = inquiry.orderItems && inquiry.orderItems.length > 0;
  const isSourcingOrder = inquiry.requestType === "sourcing";
  const hasPaymentAlert =
    inquiry.paymentStatus?.toLowerCase().includes("payment submitted") && inquiry.status !== "Paid";

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-teal-600">
            {isSourcingOrder ? "Sourcing order" : isCartOrder ? "iPhone cart order" : inquiry.productCategory}
          </p>
          <h2 className="mt-1 text-xl font-black text-navy-950">{inquiry.productName}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{inquiry.createdAtText}</p>
        </div>

        <div className="grid gap-2 sm:min-w-48">
          <label className="text-xs font-black uppercase text-slate-500" htmlFor={`status-${inquiry.id}`}>
            Status
          </label>
          <select
            id={`status-${inquiry.id}`}
            value={status}
            onChange={(event) => void saveStatus(event.target.value as InquiryStatus)}
            className="min-h-10 rounded-lg border border-slate-200 bg-[#f8fbff] px-3 text-sm font-black text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          >
            {statuses.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {saveState === "saving" ? <span className="text-xs font-bold text-slate-500">Updating...</span> : null}
          {saveState === "saved" ? <span className="text-xs font-bold text-teal-700">Status updated.</span> : null}
          {saveState === "error" ? <span className="text-xs font-bold text-ember-600">Could not update.</span> : null}
        </div>
      </div>

      <div className="grid gap-3 rounded-lg bg-[#f8fbff] p-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-500">Customer</p>
          <p className="mt-1 text-sm font-black text-navy-950">{inquiry.customerName}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-slate-500">Phone</p>
          <p className="mt-1 text-sm font-black text-navy-950">{inquiry.customerPhone || "Not available"}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-slate-500">Email</p>
          <p className="mt-1 truncate text-sm font-black text-navy-950">{inquiry.customerEmail || "Not added"}</p>
        </div>
      </div>

      {inquiry.paymentMethod || inquiry.paymentStatus ? (
        <div
          className={`grid gap-3 rounded-lg border p-3 sm:grid-cols-2 ${
            hasPaymentAlert
              ? "border-ember-500/30 bg-ember-500/10"
              : "border-teal-500/20 bg-teal-500/10"
          }`}
        >
          {hasPaymentAlert ? (
            <div className="sm:col-span-2">
              <p className="text-xs font-black uppercase text-ember-600">Payment alert</p>
              <p className="mt-1 text-sm font-black text-navy-950">
                Customer says they have paid. Confirm in M-Pesa, then mark this order as paid.
              </p>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-black uppercase text-slate-500">Payment method</p>
            <p className="mt-1 text-sm font-black text-navy-950">
              {inquiry.paymentMethod || "Manual confirmation"}
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500">Payment status</p>
            <p className="mt-1 text-sm font-black text-navy-950">
              {inquiry.paymentStatus || "Awaiting payment details"}
            </p>
          </div>
          {inquiry.paymentCode ? (
            <div>
              <p className="text-xs font-black uppercase text-slate-500">Payment code</p>
              <p className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-black uppercase text-navy-950">
                {inquiry.paymentCode}
              </p>
            </div>
          ) : null}
          {hasPaymentAlert ? (
            <button
              type="button"
              onClick={() => void saveStatus("Paid")}
              disabled={saveState === "saving"}
              className="inline-flex min-h-10 items-center justify-center self-end rounded-full bg-ember-500 px-4 text-xs font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Confirm paid
            </button>
          ) : null}
          {inquiry.paymentNote ? (
            <p className="text-sm font-bold leading-6 text-slate-600 sm:col-span-2">
              {inquiry.paymentNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {isSourcingOrder ? (
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-[#fbfdff] p-3">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">Item description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-navy-950">
              {inquiry.description || "No description added."}
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500">Follow-up contact</p>
            <p className="mt-1 text-sm font-black text-navy-950">
              {inquiry.contactMethod || inquiry.customerEmail || inquiry.customerPhone || "Not added"}
            </p>
          </div>
          {inquiry.photoUrls?.length ? (
            <div className="grid gap-2">
              <p className="text-xs font-black uppercase text-slate-500">Reference photos</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {inquiry.photoUrls.map((url, index) => (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                    key={url}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${inquiry.productName} reference ${index + 1}`} className="h-32 w-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {inquiry.status !== "Reviewed" ? (
            <button
              type="button"
              onClick={() => void saveStatus("Reviewed")}
              disabled={saveState === "saving"}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-teal-600 px-4 text-xs font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Mark reviewed
            </button>
          ) : null}
        </div>
      ) : isCartOrder ? (
        <div className="grid gap-2">
          {inquiry.orderItems?.map((item, index) => (
            <div className="rounded-lg border border-slate-200 bg-[#fbfdff] p-3" key={`${item.productName}-${index}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-navy-950">{item.productName}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {item.storage} / {item.color} / Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-navy-950">{formatKes(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-[#fbfdff] p-3">
          <p className="text-sm font-black text-navy-950">
            {[inquiry.storage, inquiry.color].filter(Boolean).join(" / ") || "Supplier request"}
          </p>
          {inquiry.quantity ? (
            <p className="mt-1 text-xs font-bold text-slate-500">Quantity: {inquiry.quantity}</p>
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-xs font-black uppercase text-slate-500">
          {isSourcingOrder ? "Request status" : "Estimated total"}
        </span>
        <span className="text-xl font-black text-ember-500">
          {isSourcingOrder ? inquiry.status : inquiry.priceEstimate ? formatKes(inquiry.priceEstimate) : "Confirm quote"}
        </span>
      </div>
    </article>
  );
}

export function AdminDashboard() {
  const { user, openAuth } = useAuth();
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  const summary = useMemo(
    () => ({
      total: inquiries.length,
      newCount: inquiries.filter((inquiry) => inquiry.status === "New").length,
      iPhoneOrders: inquiries.filter((inquiry) => inquiry.orderItems?.length).length,
      sourcingOrders: inquiries.filter((inquiry) => inquiry.requestType === "sourcing").length,
      paymentAlerts: inquiries.filter(
        (inquiry) =>
          inquiry.paymentStatus?.toLowerCase().includes("payment submitted") &&
          inquiry.status !== "Paid"
      ).length
    }),
    [inquiries]
  );

  useEffect(() => {
    if (!isAdminPhone(user?.phone)) {
      setInquiries([]);
      setLoadState("ready");
      return undefined;
    }

    setLoadState("loading");

    return subscribeToAdminInquiries(
      (nextInquiries) => {
        setInquiries(nextInquiries);
        setLoadState("ready");
      },
      () => setLoadState("error")
    );
  }, [user?.phone]);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8fbff] text-navy-950">
        <section className="bg-navy-950 py-5 text-white">
          <Container className="flex items-center justify-between gap-4">
            <Link href={routePath("/")} className="text-sm font-black text-white">
              Teekay Admin
            </Link>
            <AuthButtons compact />
          </Container>
        </section>
        <Container className="py-10">
          <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase text-teal-600">Admin</p>
            <h1 className="mt-2 text-3xl font-black text-navy-950">Admin sign in required</h1>
            <p className="mt-3 leading-7 text-slate-600">
              Sign in with the admin phone number ending in 1166 to view customer requests.
            </p>
            <button
              type="button"
              onClick={() => openAuth("signin")}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
            >
              Sign in
            </button>
          </div>
        </Container>
      </main>
    );
  }

  if (!isAdminPhone(user.phone)) {
    return (
      <main className="min-h-screen bg-[#f8fbff] text-navy-950">
        <section className="bg-navy-950 py-5 text-white">
          <Container className="flex items-center justify-between gap-4">
            <Link href={routePath("/")} className="text-sm font-black text-white">
              Teekay Admin
            </Link>
            <AuthButtons compact />
          </Container>
        </section>
        <Container className="py-10">
          <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase text-ember-500">Restricted</p>
            <h1 className="mt-2 text-3xl font-black text-navy-950">Admin access only</h1>
            <p className="mt-3 leading-7 text-slate-600">
              This page only opens for {ADMIN_PHONE}. Your signed-in phone is not authorized.
            </p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] text-navy-950">
      <section className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white shadow-soft backdrop-blur">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <div>
            <Link href={routePath("/")} className="text-sm font-black text-white">
              Teekay Admin
            </Link>
            <p className="mt-1 hidden text-xs font-bold text-white/60 sm:block">Signed in as {user.phone}</p>
          </div>
          <AuthButtons compact />
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <div className="mb-6">
          <p className="text-sm font-black uppercase text-teal-600">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-navy-950 sm:text-4xl">Customer requests</h1>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-black text-navy-950">{summary.total}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase text-slate-500">New</p>
            <p className="mt-2 text-3xl font-black text-ember-500">{summary.newCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase text-slate-500">Sourcing orders</p>
            <p className="mt-2 text-3xl font-black text-teal-600">{summary.sourcingOrders}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase text-slate-500">Payment alerts</p>
            <p className="mt-2 text-3xl font-black text-gold-400">{summary.paymentAlerts}</p>
          </div>
        </div>

        {loadState === "loading" ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-black text-slate-600 shadow-soft">
            Loading requests...
          </div>
        ) : null}

        {loadState === "error" ? (
          <div className="rounded-lg border border-ember-500/30 bg-ember-500/10 p-5 text-sm font-black text-ember-600">
            Could not load admin requests. Confirm Firestore rules allow admin access for {ADMIN_PHONE}.
          </div>
        ) : null}

        {loadState === "ready" && inquiries.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-black text-slate-600 shadow-soft">
            No customer requests yet.
          </div>
        ) : null}

        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <InquiryCard inquiry={inquiry} key={inquiry.id} />
          ))}
        </div>
      </Container>
    </main>
  );
}
