import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC74scwpRRJuSji3xwcdDnuUQKw4ALrJqU",
    authDomain: "fdm-expenses-2055f.firebaseapp.com",
    projectId: "fdm-expenses-2055f",
    storageBucket: "fdm-expenses-2055f.appspot.com",
    messagingSenderId: "646075217127",
    appId: "1:646075217127:web:d849caacc3f9a3342d5e42",
    measurementId: "G-JKJQKM21G7"
  };

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const auth = getAuth(firebase);
export const storage = getStorage(firebase);
export const provider = new GoogleAuthProvider();
