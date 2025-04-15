// firebaseService.js
import { 
  collection, 
  getDocs, 
  addDoc,
  doc, 
  deleteDoc,
  query
} from "firebase/firestore";
import { db } from "./firebase";

// Generic function to get all documents from a collection
export const getCollectionData = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to add a document to a collection
export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

// Generic function to delete a document
export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Function to fetch business listings by type (e.g., "Cars", "Hotels", "Flights")
export const getBusinessListings = async (type) => {
  const q = query(collection(db, `business${type}`));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
