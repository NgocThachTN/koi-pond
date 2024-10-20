import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAyy8VJH_53YOEca1PvM6ft7dEc_HraZi0",
  authDomain: "koi-pond-586e9.firebaseapp.com",
  databaseURL: "https://koi-pond-586e9-default-rtdb.firebaseio.com",
  projectId: "koi-pond-586e9",
  storageBucket: "koi-pond-586e9.appspot.com",
  messagingSenderId: "115796998092",
  appId: "1:115796998092:web:0ce399bcf8ab737fa68f69",
  measurementId: "G-QLGHN5YCLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Analytics (if you need it)
export const analytics = getAnalytics(app);
