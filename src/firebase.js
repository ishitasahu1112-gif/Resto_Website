import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBbR9Un5QNrL3pwvdb8ifiJO6YCt0ANvAo",
    authDomain: "thejhopdi-46c8a.firebaseapp.com",
    projectId: "thejhopdi-46c8a",
    storageBucket: "thejhopdi-46c8a.firebasestorage.app",
    messagingSenderId: "16325634841",
    appId: "1:16325634841:web:b5245781ac379c8dbef388",
    measurementId: "G-QMQT4DGSPR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        // ...
        console.warn("Persistence failed: Multiple tabs open");
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn("Persistence failed: Browser not supported");
    }
});
export default app;
