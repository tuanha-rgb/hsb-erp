import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { setLogLevel } from 'firebase/app';

// Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize
const app = initializeApp(firebaseConfig);

if (import.meta.env.VITE_FIREBASE_LOGGING === 'false') {
  setLogLevel('silent');
}

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Polls
export const pollsRef = collection(db, 'polls');
export const activePollsQuery = query(
  pollsRef,
  where('status', '==', 'active'),
  orderBy('startTime', 'desc')
);