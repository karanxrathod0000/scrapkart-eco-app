import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAu-uqDbSUoq14ERruWYPMbV0RZmSJ1wmc',  authDomain: 'scrapkart-8c065.firebaseapp.com',
  projectId: 'scrapkart-8c065',
  storageBucket: 'scrapkart-8c065.firebasestorage.app',
  messagingSenderId: '62266874851',
  appId: '1:62266874851:web:717577b39c4eca2f125ed6',
  measurementId: 'G-X68X11KYGJ',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { db };
export { storage };
