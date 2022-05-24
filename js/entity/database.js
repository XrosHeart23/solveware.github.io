/*
Do you use ESM and want to use browser modules? Replace all your import lines to use the following pattern:
import { } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-SERVICE.js'
(where SERVICE is an SDK name such as firebase-firestore).
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-UXEmOzuwqDY24UJkCUzrbV5KIsOgGAg",
    authDomain: "solveware-72d0e.firebaseapp.com",
    projectId: "solveware-72d0e",
    storageBucket: "solveware-72d0e.appspot.com",
    messagingSenderId: "237669933514",
    appId: "1:237669933514:web:15dac6ae0b98086d496f33"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore();

export { db };