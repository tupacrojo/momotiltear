import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMAIQv0V7-bYcavsW-R4wnuHhdCz05So8",
  authDomain: "momotiltear-d47ff.firebaseapp.com",
  projectId: "momotiltear-d47ff",
  storageBucket: "momotiltear-d47ff.firebasestorage.app",
  messagingSenderId: "307683476341",
  appId: "1:307683476341:web:205b9e23482c576286c93c",
  measurementId: "G-2GSGM6GG10",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
