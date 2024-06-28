import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCqsKCMM5q8kqvZe-f1NMqesaRhGkcOTXU",
  authDomain: "twitterclone-95828.firebaseapp.com",
  projectId: "twitterclone-95828",
  storageBucket: "twitterclone-95828.appspot.com",
  messagingSenderId: "648221315087",
  appId: "1:648221315087:web:cacf0331c7b9f83f49937a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);