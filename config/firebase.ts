import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAu-uqD8bSUoq14ERruWYPMbV0RZmSi1Wmc",
  authDomain: "scrapkart-8c065.firebaseapp.com",
  projectId: "scrapkart-8c065",
  storageBucket: "scrapkart-8c065.firebasestorage.app",
  messagingSenderId: "62266874851",
  appId: "1:62266874851:web:717577b39c4eca2f125ed6",
  measurementId: "G-X68X11KYGJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { db };
