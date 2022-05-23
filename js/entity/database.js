/*
Do you use ESM and want to use browser modules? Replace all your import lines to use the following pattern:
import { } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-SERVICE.js'
(where SERVICE is an SDK name such as firebase-firestore).
*/
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

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

// import {
//     getFirestore, collection, getDocs, onSnapshot,
//     addDoc, deleteDoc, doc,
//     query, where,
//     getDoc, updateDoc
// } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js"

// // Collection reference
// const colRef = collection(db, 'userAccount');

// // Queries
// const qry = query(colRef, 
//     where("username" , "==", "admin"),
//     where("password", "==", "password"));

// // Get Collection data
// // getDocs(colRef).then((snapshot) => {
// //     let acct = [];

// //     // Snapshot contain the current table selected
// //     // forEach loop through snapshot and pass each data as doc
// //     snapshot.docs.forEach((doc) => {

// //         // Data in doc is than added into acct array
// //         // doc.data() = data of each row in table
// //         // doc.id = id of the row
// //         acct.push({ ...doc.data(), id: doc.id });
// //     })

// //     console.log(acct);

// // }).catch(err => {
// //     console.log(err.message); //Catch any error messages
// // });

// // Real time collection data
// onSnapshot(qry, (snapshot) => {
//     let acct = [];
//     console.log(snapshot.size);
//     // // Snapshot contain the current table selected
//     // // forEach loop through snapshot and pass each data as doc
//     // snapshot.docs.forEach((doc) => {

//     //     // Data in doc is than added into acct array
//     //     // doc.data() = data of each row in table
//     //     // doc.id = id of the row
//     //     acct.push({ ...doc.data(), id: doc.id });
//     // })

//     // console.log(acct);
// });


// // Adding document
// const signUp_form = document.getElementById("signUp_form");
// signUp_form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     // ID is auto generated
//     addDoc(colRef, {
//         name: signUp_form.name.value,
//         username: signUp_form.username.value,
//         password: signUp_form.password.value,
//         profile: signUp_form.profile.value,
//     }).then(() => {
//         signUp_form.reset()
//     });
// });


// // Deleting document
// const delete_form = document.getElementById("delete_form");
// delete_form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const docRef = doc(db, 'userAccount', delete_form.username.value);

//     deleteDoc(docRef).then(() => {
//         delete_form.reset()
//     });
// });


// // Update a single document
// // const docRef = doc(db, 'userAccount', updateForm.id.value);

// // updateDoc(docRef, {
// //     name: "nameeeeeeee",
// // });

