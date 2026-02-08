import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBR8J051VHOX-BduceAAR8GqRZPZnil4RE",
    authDomain: "antigravity-firebase-72e9d.firebaseapp.com",
    projectId: "antigravity-firebase-72e9d",
    storageBucket: "antigravity-firebase-72e9d.firebasestorage.app",
    messagingSenderId: "315031405103",
    appId: "1:315031405103:web:143939e0aa84dce53f7cda",
    measurementId: "G-BK2PVR7XQF"
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
