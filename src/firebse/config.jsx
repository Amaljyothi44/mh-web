import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: "mh-website-1428b.firebaseapp.com",
  projectId: "mh-website-1428b",
  storageBucket: "mh-website-1428b.appspot.com",
  messagingSenderId: "685153373869",
  appId: "1:685153373869:web:28ec6e25966027cc5e0024",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
