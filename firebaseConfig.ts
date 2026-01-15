
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcPPq0_YHvYdmCuSjs8LB6Pt4u8V971e8",
  authDomain: "nurse-match.firebaseapp.com",
  projectId: "nurse-match",
  storageBucket: "nurse-match.firebasestorage.app",
  messagingSenderId: "648967769561",
  appId: "1:648967769561:web:ce26ac6deff26693ba1dc8",
  measurementId: "G-6HSS2M69C7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
