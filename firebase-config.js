// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAiGVZtmlGJmU386DR0PI2k-BWMK8SLvoE",
    authDomain: "levelup-wedding.firebaseapp.com",
    projectId: "levelup-wedding",
    storageBucket: "levelup-wedding.appspot.com",
    messagingSenderId: "240732359221",
    appId: "1:240732359221:web:4be49e7c975d56504bbf7c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Obtiene una instancia de Firestore

console.log("Firebase inicializado correctamente:", firebaseApp); // Verifica la inicialización de Firebase
console.log(" DB Firestore inicializado correctamente:", db); // Verifica la inicialización de Firestore

export { firebaseApp, db };



