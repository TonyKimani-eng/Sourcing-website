import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type InquiryStatus = "New" | "Contacted" | "Quoted" | "Paid" | "Shipped" | "Completed";

export type InquiryInput = {
  productName: string;
  productCategory: string;
  storage?: string;
  color?: string;
  priceEstimate?: number;
  quantity?: number;
  orderItems?: Array<{
    productName: string;
    storage: string;
    color: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
};

export type SavedInquiry = InquiryInput & {
  id: string;
  status: InquiryStatus;
  createdAtText: string;
};

type CustomerInput = {
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
};

function formatDate(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric"
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

export async function saveInquiry(inquiry: InquiryInput, customer: CustomerInput) {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  await addDoc(collection(db, "inquiries"), {
    ...inquiry,
    ...customer,
    status: "New" satisfies InquiryStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function subscribeToUserInquiries(
  userId: string,
  onChange: (inquiries: SavedInquiry[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  const inquiriesQuery = query(collection(db, "inquiries"), where("userId", "==", userId));

  return onSnapshot(
    inquiriesQuery,
    (snapshot) => {
      const inquiries = snapshot.docs
        .map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            productName: String(data.productName ?? ""),
            productCategory: String(data.productCategory ?? ""),
            storage: data.storage ? String(data.storage) : undefined,
            color: data.color ? String(data.color) : undefined,
            priceEstimate:
              typeof data.priceEstimate === "number" ? data.priceEstimate : undefined,
            status: (data.status ?? "New") as InquiryStatus,
            createdAtText: formatDate(data.createdAt),
            createdAtMs: getTime(data.createdAt)
          };
        })
        .sort((first, second) => second.createdAtMs - first.createdAtMs)
        .map(({ createdAtMs, ...inquiry }) => inquiry);

      onChange(inquiries);
    },
    onError
  );
}
