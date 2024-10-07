import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkeNs3-0Iv0OUzQ4fwqTFK4geu6iBAF3g",
  authDomain: "kk-rad-app.firebaseapp.com",
  projectId: "kk-rad-app",
  storageBucket: "kk-rad-app.appspot.com",
  messagingSenderId: "869698456608",
  appId: "1:869698456608:web:42793b664c57b7ab9f4045"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);