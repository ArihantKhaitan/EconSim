// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "econsim-a2bab.firebaseapp.com",
  projectId: "econsim-a2bab",
  storageBucket: "econsim-a2bab.firebasestorage.app",
  messagingSenderId: "721248405252",
  appId: "1:721248405252:web:25a46a13fb466d34497251"
};

// Initialize Firebase (Only once!)
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
