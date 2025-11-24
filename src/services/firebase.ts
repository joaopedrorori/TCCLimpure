import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAWIjGruMltSY77BxgEc22mL_7Lf18IGGc",
    authDomain: "limpure.firebaseapp.com",
    databaseURL: "https://limpure-default-rtdb.firebaseio.com",
    projectId: "limpure",
    storageBucket: "limpure.firebasestorage.app",
    messagingSenderId: "953658635420",
    appId: "1:953658635420:web:f336f4581169a8f257e959",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase();
export { app, auth, db, database };
