
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp5CqDtoR7-1_F5EjtdEAdE21x6t2lLS4",
  authDomain: "aura-pulse-dd3e9.firebaseapp.com",
  projectId: "aura-pulse-dd3e9",
  storageBucket: "aura-pulse-dd3e9.firebasestorage.app",
  messagingSenderId: "872762436340",
  appId: "1:872762436340:web:e4dcf887d4897ea6dc4ca1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);