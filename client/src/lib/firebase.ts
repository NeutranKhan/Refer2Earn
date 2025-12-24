import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDg3uIfjF-vLTuuVmMBiRxxiV4eVqT73ZY",
    authDomain: "pizzadelivery-d6ef4.firebaseapp.com",
    projectId: "pizzadelivery-d6ef4",
    storageBucket: "pizzadelivery-d6ef4.firebasestorage.app",
    messagingSenderId: "621077956048",
    appId: "1:621077956048:web:c4de43c62a2bd22b3725d5",
    measurementId: "G-Z2BNF8FWEB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only if supported
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
