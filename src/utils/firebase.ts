import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAk3lTFXdRGT7Wy5ubEKub5pQhKw8Cmtmg",
  authDomain: "city-reporter11.firebaseapp.com",
  projectId: "city-reporter11",
  storageBucket: "city-reporter11.appspot.com",
  messagingSenderId: "239239552066",
  appId: "1:239239552066:web:75667d68fb185086d4a1db",
  measurementId: "G-WM93CZMT0B"
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
