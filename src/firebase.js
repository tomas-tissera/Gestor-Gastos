// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importar Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvq6K1DcCFh5bgz-wWEWmU5GSMLP7R9-E",
  authDomain: "gestor-gastos-tomas.firebaseapp.com",
  projectId: "gestor-gastos-tomas",
  storageBucket: "gestor-gastos-tomas.appspot.com",
  messagingSenderId: "453994152217",
  appId: "1:453994152217:web:729d1b58ca7fe85da9c588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Inicializar Firestore

// Export the auth and db instances
export { auth, db };
