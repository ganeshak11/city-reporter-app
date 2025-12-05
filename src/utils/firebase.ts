import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDiE0Lp6cGMWAnOQjhTHYT9z9dme1ojVs",
  authDomain: "city-reporter-bbe62.firebaseapp.com",
  projectId: "city-reporter-bbe62",
  storageBucket: "city-reporter-bbe62.firebasestorage.app",
  messagingSenderId: "62156823540",
  appId: "1:62156823540:web:240b35e29706ed29ddb7a1",
  measurementId: "G-VGTDPJYWXC"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);

// Log storage configuration
console.log("Storage bucket:", storage.app.options.storageBucket);

// Add CORS headers to storage requests
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.includes('firebasestorage.googleapis.com')) {
      init = init || {};
      init.headers = {
        ...init.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      };
    }
    return originalFetch(input, init);
  };
}
