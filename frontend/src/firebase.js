// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // If using authentication

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAv_KxFdgxDOiw88GLGenXmEMisxrDJJ8",
  authDomain: "swifttrek-f2470.firebaseapp.com",
  projectId: "swifttrek-f2470",
  storageBucket: "swifttrek-f2470.appspot.com", // Fixed URL typo
  messagingSenderId: "693315735179",
  appId: "1:693315735179:web:c2b9b906f2f0c3d7b50e8e",
  measurementId: "G-B36QR3Z8NY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth (if needed)
const auth = getAuth(app);

// Export instances for use in other files
export { db, auth };
