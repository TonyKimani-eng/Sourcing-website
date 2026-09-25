import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db, firebaseConfig, isFirebaseConfigured } from "@/lib/firebase";

export type ChatMessage = {
  id: string;
  sender: "visitor" | "admin";
  text: string;
  createdAtMs: number;
};

export type ChatThread = {
  id: string;
  visitorName: string;
  visitorContact: string;
  lastMessage: string;
  lastSender: "visitor" | "admin";
  unreadByAdmin: number;
  updatedAtMs: number;
};

let publicChatApp: FirebaseApp | null = null;
let publicChatAuth: Auth | null = null;
let publicChatDb: Firestore | null = null;

function getPublicChatServices() {
  if (!isFirebaseConfigured) {
    throw new Error("Chat is not configured yet.");
  }

  if (!publicChatApp) {
    publicChatApp =
      getApps().find((app) => app.name === "teekay-public-chat") ??
      initializeApp(firebaseConfig, "teekay-public-chat");
    publicChatAuth = getAuth(publicChatApp);
    publicChatDb = getFirestore(publicChatApp);
  }

  return { auth: publicChatAuth as Auth, firestore: publicChatDb as Firestore };
}

function getTime(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }
  return Date.now();
}

export async function startOrResumePublicChat() {
  const services = getPublicChatServices();
  const user = services.auth.currentUser ?? (await signInAnonymously(services.auth)).user;
  return { chatId: user.uid, firestore: services.firestore };
}

export async function sendVisitorMessage(input: {
  visitorName: string;
  visitorContact: string;
  text: string;
}) {
  const { chatId, firestore } = await startOrResumePublicChat();
  const cleanText = input.text.trim().slice(0, 1000);

  await setDoc(
    doc(firestore, "chats", chatId),
    {
      visitorUid: chatId,
      visitorName: input.visitorName.trim().slice(0, 80),
      visitorContact: input.visitorContact.trim().slice(0, 120),
      lastMessage: cleanText,
      lastSender: "visitor",
      unreadByAdmin: 1,
      status: "open",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  await addDoc(collection(firestore, "chats", chatId, "messages"), {
    sender: "visitor",
    text: cleanText,
    createdAt: serverTimestamp()
  });

  return chatId;
}

export async function subscribeToPublicChatMessages(
  onChange: (messages: ChatMessage[]) => void,
  onError: () => void
) {
  const { chatId, firestore } = await startOrResumePublicChat();
  const unsubscribe = onSnapshot(
    collection(firestore, "chats", chatId, "messages"),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((messageDoc) => {
            const data = messageDoc.data();
            return {
              id: messageDoc.id,
              sender: data.sender === "admin" ? "admin" : "visitor",
              text: String(data.text ?? ""),
              createdAtMs: getTime(data.createdAt)
            } as ChatMessage;
          })
          .sort((first, second) => first.createdAtMs - second.createdAtMs)
      );
    },
    onError
  );

  return unsubscribe;
}

export function subscribeToAdminChats(
  onChange: (threads: ChatThread[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(collection(db, "chats"), (snapshot) => {
    onChange(
      snapshot.docs
        .map((chatDoc) => {
          const data = chatDoc.data();
          return {
            id: chatDoc.id,
            visitorName: String(data.visitorName ?? "Website visitor"),
            visitorContact: String(data.visitorContact ?? ""),
            lastMessage: String(data.lastMessage ?? ""),
            lastSender: data.lastSender === "admin" ? "admin" : "visitor",
            unreadByAdmin: Number(data.unreadByAdmin ?? 0),
            updatedAtMs: getTime(data.updatedAt)
          } as ChatThread;
        })
        .sort((first, second) => second.updatedAtMs - first.updatedAtMs)
    );
  }, onError);
}

export function subscribeToAdminChatMessages(
  chatId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError: () => void
) {
  if (!db) {
    onChange([]);
    return () => undefined;
  }

  return onSnapshot(collection(db, "chats", chatId, "messages"), (snapshot) => {
    onChange(
      snapshot.docs
        .map((messageDoc) => {
          const data = messageDoc.data();
          return {
            id: messageDoc.id,
            sender: data.sender === "admin" ? "admin" : "visitor",
            text: String(data.text ?? ""),
            createdAtMs: getTime(data.createdAt)
          } as ChatMessage;
        })
        .sort((first, second) => first.createdAtMs - second.createdAtMs)
    );
  }, onError);
}

export async function sendAdminChatMessage(chatId: string, text: string) {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const cleanText = text.trim().slice(0, 1000);
  await addDoc(collection(db, "chats", chatId, "messages"), {
    sender: "admin",
    text: cleanText,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: cleanText,
    lastSender: "admin",
    unreadByAdmin: 0,
    updatedAt: serverTimestamp()
  });
}

export async function markChatRead(chatId: string) {
  if (!db) return;
  await updateDoc(doc(db, "chats", chatId), { unreadByAdmin: 0 });
}
