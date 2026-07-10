import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";

export type InquiryStatus = "New" | "Reviewed" | "Contacted" | "Quoted" | "Paid" | "Shipped" | "Completed";

export type InquiryInput = {
  requestType?: "product" | "sourcing";
  productName: string;
  productCategory: string;
  description?: string;
  contactMethod?: string;
  photoUrls?: string[];
  storage?: string;
  color?: string;
  priceEstimate?: number;
  quantity?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentNote?: string;
  paymentCode?: string;
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
    requestType: "product",
    ...inquiry,
    ...customer,
    status: "New" satisfies InquiryStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

export async function uploadInquiryPhotos(userId: string, files: File[]) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const configuredStorage = storage;
  const uploadTime = Date.now();

  return Promise.all(
    files.map(async (file, index) => {
      const imageRef = ref(
        configuredStorage,
        `sourcing-orders/${userId}/${uploadTime}-${index}-${safeFileName(file.name)}`
      );

      await uploadBytes(imageRef, file, {
        contentType: file.type
      });

      return getDownloadURL(imageRef);
    })
  );
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
            requestType: (data.requestType === "sourcing" ? "sourcing" : "product") as "sourcing" | "product",
            description: data.description ? String(data.description) : undefined,
            contactMethod: data.contactMethod ? String(data.contactMethod) : undefined,
            photoUrls: Array.isArray(data.photoUrls)
              ? data.photoUrls.map((url) => String(url))
              : undefined,
            storage: data.storage ? String(data.storage) : undefined,
            color: data.color ? String(data.color) : undefined,
            priceEstimate:
              typeof data.priceEstimate === "number" ? data.priceEstimate : undefined,
            quantity: typeof data.quantity === "number" ? data.quantity : undefined,
            paymentMethod: data.paymentMethod ? String(data.paymentMethod) : undefined,
            paymentStatus: data.paymentStatus ? String(data.paymentStatus) : undefined,
            paymentNote: data.paymentNote ? String(data.paymentNote) : undefined,
            paymentCode: data.paymentCode ? String(data.paymentCode) : undefined,
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
