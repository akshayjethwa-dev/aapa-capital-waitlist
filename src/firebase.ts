// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace this with your actual Firebase config object from Step 1
const firebaseConfig = {
  apiKey: "AIzaSyA1ffI5RpvS3PVjljkozaLlhzY9NJMZ7qc",
  authDomain: "aapa-capital-waitlist-a99bd.firebaseapp.com",
  projectId: "aapa-capital-waitlist-a99bd",
  storageBucket: "aapa-capital-waitlist-a99bd.firebasestorage.app",
  messagingSenderId: "66552767965",
  appId: "1:66552767965:web:72342aa79497d87bd20234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);