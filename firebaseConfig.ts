import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase configuration
// NOTE: This is a placeholder configuration for development
// For production, use environment variables and don't commit actual API keys
const firebaseConfig = {
  "apiKey": process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  "authDomain": process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  "projectId": process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  "storageBucket": process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  "messagingSenderId": process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  "appId": process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
