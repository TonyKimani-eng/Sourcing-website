import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function envValue(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

const firebaseConfig = {
  apiKey: envValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: envValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: envValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  appId: envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
