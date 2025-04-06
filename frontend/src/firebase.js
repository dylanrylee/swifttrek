// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnkAHKbdygTDGRIqTzLhD511luEjNgcyQ",
  authDomain: "seng513admin.firebaseapp.com",
  projectId: "seng513admin",
  storageBucket: "seng513admin.firebasestorage.app",
  messagingSenderId: "710297455796",
  appId: "1:710297455796:web:3804b5a3a16e8fe65b1be1",
  measurementId: "G-N4XBXQ2R03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);