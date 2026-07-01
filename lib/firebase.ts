import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasConfig = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key";

// Initialize Firebase safely
let app: any;
let auth: any;
let db: any;
let storage: any;
let analytics: any = null;

if (hasConfig) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analytics = typeof window !== "undefined" ? isSupported().then((supported) => supported ? getAnalytics(app) : null) : null;
} else {
  if (typeof window !== "undefined") {
    console.warn("Firebase configuration credentials are not configured in your environment. Analytics, Auth, and Dashboard features will be inactive.");
  }
}

export { app, auth, db, storage, analytics };
