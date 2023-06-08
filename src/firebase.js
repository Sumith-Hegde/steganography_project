import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBQbl_aXmS8BrH1D1tANz4B2KgSJBi2deo",
  authDomain: "chatapplication-debb0.firebaseapp.com",
  projectId: "chatapplication-debb0",
  storageBucket: "chatapplication-debb0.appspot.com",
  messagingSenderId: "191787117851",
  appId: "1:191787117851:web:84f1bcaa576eb0a1a5b7be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();
