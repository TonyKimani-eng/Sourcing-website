import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InquiryStatus, SavedInquiry } from "@/lib/inquiries";

export const ADMIN_PHONE = "+254719241166";

export type AdminInquiry = SavedInquiry & {
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  createdAtMs: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentNote?: string;
  paymentCode?: string;
};

function formatDate(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toLocaleString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return "Just now";
}

function getTime(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().getTime();
  }

  return Date.now();
}

export function isAdminPhone(phone: string | undefined) {
  return phone === ADMIN_PHONE;
}

export function subscribeToAdminInquiries(
  onChange: (inquiries: AdminInquiry[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(
    collection(db, "inquiries"),
    (snapshot) => {
      const inquiries = snapshot.docs
        .map((inquiryDoc) => {
          const data = inquiryDoc.data();
          const orderItems = Array.isArray(data.orderItems)
            ? data.orderItems.map((item) => ({
                productName: String(item.productName ?? ""),
                storage: String(item.storage ?? ""),
                color: String(item.color ?? ""),
                quantity: Number(item.quantity ?? 0),
                unitPrice: Number(item.unitPrice ?? 0),
                subtotal: Number(item.subtotal ?? 0)
              }))
            : undefined;

          return {
            id: inquiryDoc.id,
            userId: String(data.userId ?? ""),
            customerName: String(data.customerName ?? "Customer"),
            customerPhone: String(data.customerPhone ?? ""),
            customerEmail: String(data.customerEmail ?? ""),
            productName: String(data.productName ?? ""),
            productCategory: String(data.productCategory ?? ""),
            storage: data.storage ? String(data.storage) : undefined,
            color: data.color ? String(data.color) : undefined,
            priceEstimate:
              typeof data.priceEstimate === "number" ? data.priceEstimate : undefined,
            quantity: typeof data.quantity === "number" ? data.quantity : undefined,
            paymentMethod: data.paymentMethod ? String(data.paymentMethod) : undefined,
            paymentStatus: data.paymentStatus ? String(data.paymentStatus) : undefined,
            paymentNote: data.paymentNote ? String(data.paymentNote) : undefined,
            paymentCode: data.paymentCode ? String(data.paymentCode) : undefined,
            orderItems,
            status: (data.status ?? "New") as InquiryStatus,
            createdAtText: formatDate(data.createdAt),
            createdAtMs: getTime(data.createdAt)
          };
        })
        .sort((first, second) => second.createdAtMs - first.createdAtMs);

      onChange(inquiries);
    },
    onError
  );
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  if (status === "Paid") {
    await updateDoc(doc(db, "inquiries", inquiryId), {
      status,
      paymentStatus: "Order received",
      updatedAt: serverTimestamp()
    });
    return;
  }

  await updateDoc(doc(db, "inquiries", inquiryId), {
    status,
    updatedAt: serverTimestamp()
  });
}
