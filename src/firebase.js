import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRAbAdZTKxW1JgfIaYKKmeQM1pKSw32No",
  authDomain: "raithabandhucom.firebaseapp.com",
  projectId: "raithabandhucom",
  storageBucket: "raithabandhucom.firebasestorage.app",
  messagingSenderId: "80364538893",
  appId: "1:80364538893:web:1c58a75eb94b20a15d9944",
  measurementId: "G-JP8E6W5570"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
