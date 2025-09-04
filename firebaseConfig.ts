import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase configuration
// NOTE: This is a placeholder configuration for development
// For production, use environment variables and don't commit actual API keys
const firebaseConfig = {
  apiKey: "AIzaSyDevelopmentKeyPlaceholder123",
  authDomain: "skills-finder-dev.firebaseapp.com",
  projectId: "skills-finder-dev",
  storageBucket: "skills-finder-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ",
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
