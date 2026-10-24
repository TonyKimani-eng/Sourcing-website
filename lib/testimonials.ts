import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export type Testimonial = {
  id: string;
  inquiryId: string;
  userId: string;
  reviewerName: string;
  rating: number;
  message: string;
  orderLabel: string;
  photoUrl: string;
  photoPath: string;
  published: boolean;
  createdAtText: string;
  createdAtMs: number;
};

function getTime(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  return Date.now();
}

function mapTestimonial(id: string, data: Record<string, unknown>): Testimonial {
  const createdAtMs = getTime(data.createdAt);

  return {
    id,
    inquiryId: String(data.inquiryId ?? id),
    userId: String(data.userId ?? ""),
    reviewerName: String(data.reviewerName ?? "Verified customer"),
    rating: Number(data.rating ?? 5),
    message: String(data.message ?? ""),
    orderLabel: String(data.orderLabel ?? "Delivered order"),
    photoUrl: String(data.photoUrl ?? ""),
    photoPath: String(data.photoPath ?? ""),
    published: data.published === true,
    createdAtText: new Date(createdAtMs).toLocaleDateString("en-KE", {
      month: "short",
      year: "numeric"
    }),
    createdAtMs
  };
}

export function subscribeToPublishedTestimonials(
  onChange: (testimonials: Testimonial[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(
    query(collection(db, "testimonials"), where("published", "==", true)),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((testimonialDoc) => mapTestimonial(testimonialDoc.id, testimonialDoc.data()))
          .sort((first, second) => second.createdAtMs - first.createdAtMs)
      );
    },
    onError
  );
}

export function subscribeToUserTestimonials(
  userId: string,
  onChange: (testimonials: Testimonial[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(
    query(collection(db, "testimonials"), where("userId", "==", userId)),
    (snapshot) => onChange(snapshot.docs.map((item) => mapTestimonial(item.id, item.data()))),
    onError
  );
}

export async function saveTestimonial(input: {
  inquiryId: string;
  userId: string;
  reviewerName: string;
  rating: number;
  message: string;
  orderLabel: string;
  photoUrl?: string;
  photoPath?: string;
}) {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  await setDoc(doc(db, "testimonials", input.inquiryId), {
    ...input,
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    message: input.message.trim(),
    reviewerName: input.reviewerName.trim().slice(0, 80),
    published: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function uploadTestimonialPhoto(userId: string, inquiryId: string, file: File) {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "review-image";
  const photoPath = `testimonial-photos/${userId}/${inquiryId}/${Date.now()}-${safeName}`;
  const photoRef = ref(storage, photoPath);
  await uploadBytes(photoRef, file, { contentType: file.type });
  try {
    return { photoPath, photoUrl: await getDownloadURL(photoRef) };
  } catch (error) {
    await deleteObject(photoRef).catch(() => undefined);
    throw error;
  }
}

export async function removeTestimonialPhoto(photoPath: string) {
  if (storage && photoPath) await deleteObject(ref(storage, photoPath)).catch(() => undefined);
}

export function subscribeToAdminTestimonials(
  onChange: (testimonials: Testimonial[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(collection(db, "testimonials"), (snapshot) => {
    onChange(
      snapshot.docs
        .map((item) => mapTestimonial(item.id, item.data()))
        .sort((first, second) => second.createdAtMs - first.createdAtMs)
    );
  }, onError);
}

export async function setTestimonialPublished(testimonialId: string, published: boolean) {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  await updateDoc(doc(db, "testimonials", testimonialId), {
    published,
    updatedAt: serverTimestamp()
  });
}
