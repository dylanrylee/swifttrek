// Import Firebase functions
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtVetfy-n7pPCCccj_EIArrlbHQGEZ2TQ",
  authDomain: "seng513-project.firebaseapp.com",
  projectId: "seng513-project",
  storageBucket: "seng513-project.firebasestorage.app",
  messagingSenderId: "888422866543",
  appId: "1:888422866543:web:57f170ae027e8abfdff79a",
  measurementId: "G-G9WNFE7KBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export instances for use in other files
export { db, auth };