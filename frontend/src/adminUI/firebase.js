// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCnkAHKbdygTDGRIqTzLhD511luEjNgcyQ",
  authDomain: "seng513admin.firebaseapp.com",
  projectId: "seng513admin",
  storageBucket: "seng513admin.firebasestorage.app",
  messagingSenderId: "710297455796",
  appId: "1:710297455796:web:3804b5a3a16e8fe65b1be1",
  measurementId: "G-N4XBXQ2R03"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore database and Authentication
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
