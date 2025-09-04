import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Prefer EXPO_PUBLIC_* env vars; fallback to app.json -> expo.extra.firebase
const extra = (Constants.expoConfig as any)?.extra ?? {};

const envConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const extraConfig = (extra.firebase as Record<string, string>) || {};

const firebaseConfig = {
  apiKey: envConfig.apiKey || extraConfig.apiKey,
  authDomain: envConfig.authDomain || extraConfig.authDomain,
  projectId: envConfig.projectId || extraConfig.projectId,
  storageBucket: envConfig.storageBucket || extraConfig.storageBucket,
  messagingSenderId: envConfig.messagingSenderId || extraConfig.messagingSenderId,
  appId: envConfig.appId || extraConfig.appId,
};

function computeConfigIssues(config: Record<string, any>) {
  const required = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  const missing = required.filter((k) => !config[k] || String(config[k]).trim() === "");
  const isPlaceholder =
    typeof config.apiKey === "string" &&
    (config.apiKey.includes("Placeholder") ||
      config.apiKey === "YOUR_API_KEY" ||
      config.apiKey.startsWith("AIzaSyDevelopmentKeyPlaceholder"));
  return { missing, isPlaceholder };
}

const { missing, isPlaceholder } = computeConfigIssues(firebaseConfig);
export const firebaseConfigured = missing.length === 0 && !isPlaceholder;

if (!firebaseConfigured) {
  const details = [
    missing.length ? `Missing: ${missing.join(", ")}` : undefined,
    isPlaceholder ? "apiKey looks like a placeholder" : undefined,
  ]
    .filter(Boolean)
    .join("; ");
  // Warn instead of throwing to avoid crashing the app at import time
  console.warn(
    `Firebase config is not set. ${details}. Provide values via EXPO_PUBLIC_* env vars or app.json -> expo.extra.firebase.`
  );
}

// Initialize Firebase only when configured to prevent runtime crashes
let app: any;
let auth: any;
let firestore: any;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export { app, auth, firestore };
