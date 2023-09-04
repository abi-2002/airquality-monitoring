// Firebase Configuration file

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// The app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD93zQWZN_jUFgjM-eOjRJwlam13s7QZ5A",
  authDomain: "fir-test-94d67.firebaseapp.com",
  databaseURL: "https://fir-test-94d67-default-rtdb.firebaseio.com",
  projectId: "fir-test-94d67",
  storageBucket: "fir-test-94d67.appspot.com",
  messagingSenderId: "909861169024",
  appId: "1:909861169024:web:88835f6436d148d21a8365"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);