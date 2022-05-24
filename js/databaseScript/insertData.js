/*
Do you use ESM and want to use browser modules? Replace all your import lines to use the following pattern:
import { } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-SERVICE.js'
(where SERVICE is an SDK name such as firebase-firestore).
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
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

const NUM_OF_DATA = 100; // Number of rows of data that need to be add into the database
const precision = 100; // 2 decimals
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

// Datas used for in generating firestore database;
const fNameList = ["Ivor", "Lyndi", "Chantal", "Malinda", "Norm", "Winfield", "Jadyn", "Willard", "Mick", "Munroe"];
const lNameList = ["Lizbeth", "Pearl", "Millie", "Issy", "Alfred", "Rosabel", "Katrina", "Drina", "Lexy", "Creighton"];
const profileList = ["admin", "owner", "manager", "staff"];
const itemCategoryList = ["cat001", "cat002", "cat003", "cat004"];
const orderTicketStatusList = ["received", "kitchen", "completed"];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Add user account data into firestore database
let colRef = collection(db, "userAccount");
for (let i = 0; i < NUM_OF_DATA; i++) {
    let newUsername = "user" + (i + 1);
    let newPwd = "user" + (i + 1);
    let newFname = fNameList[Math.floor((Math.random() * fNameList.length))];
    let newLname = lNameList[Math.floor((Math.random() * lNameList.length))];
    let newProfile = profileList[Math.floor((Math.random() * profileList.length))];

    addDoc(colRef, {
        username: newUsername,
        password: newPwd,
        fname: newFname,
        lname: newLname,
        userProfile: newProfile,
        acctStatus: true,
    });
};

// Get data from userAccount table from firestore database
// Count the number of rows in the table
getDocs(colRef).then((snapshot) => {
    let data = [];
    snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
    });
    console.log(`Total row in userAccount table: ${data.length}`);
});

// ================================================================
// Add coupon code data into firestore database
colRef = collection(db, "couponCode");
for (let i = 0; i < NUM_OF_DATA; i++) {
    let cpnCode = "couponCode" + (i+1);
    let category = itemCategoryList[Math.floor((Math.random() * profileList.length))];
    let disc = (Math.floor(Math.random() * (20 - 10 + 1)) + 10) / precision;

    addDoc(colRef, {
        couponCode: cpnCode,
        discount: disc,
        catID: category,
        couponStatus: true,
    });
};

// Get data from couponCode table from firestore database
// Count the number of rows in the table
getDocs(colRef).then((snapshot) => {
    let data = [];
    snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
    });
    console.log(`Total row in couponCode table: ${data.length}`);
});

// ================================================================
// Add menu item data into firestore database
colRef = collection(db, "menuItem");
for (let i = 0; i < NUM_OF_DATA; i++) {
    let category = itemCategoryList[Math.floor((Math.random() * profileList.length))];
    let itmName = "Item" + (i + 1);
    let itmImg = "item" + (i + 1) + ".jpg";
    let price = Math.floor(Math.random() * (20 * precision - 1 * precision) + 1 * precision) / (1 * precision);

    addDoc(colRef, {
        itemCategory: category,
        itemImage: itmImg,
        itemName: itmName,
        itemPrice: price,
        itemStatus: true,
    });
};

// Get data from menuItem table from firestore database
// Count the number of rows in the table
let result = await getDocs(colRef);
let menuItem = [];
result.docs.forEach((doc) => {
    menuItem.push({ ...doc.data(), id: doc.id });
});
console.log(`Total row in menuItem table: ${menuItem.length}`);


// ================================================================

// Add order item data into firestore database
colRef = collection(db, "orders");
for (let i = 0; i < NUM_OF_DATA; i++) {
    let min = 80000000
    let max = 99999999
    let pNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    let visitDuration = Math.floor((Math.random() * 60) + 1);
    let randVisitDate = randomDate(new Date(2022, 4, 1), new Date());
    let oStatus = orderTicketStatusList[Math.floor((Math.random() * orderTicketStatusList.length))];

    let totalP = 0;
    let cart = {};
    let randInt = Math.floor((Math.random() * 10) + 1);
    let usedRandInt = [];
    for (let i = 0; i < randInt; i++) {
        let chosenInt = Math.floor((Math.random() * menuItem.length));
        while (usedRandInt.includes(chosenInt)) {
            chosenInt = Math.floor((Math.random() * menuItem.length));
        }
        
        usedRandInt.push(chosenInt);
        let itemChosen = menuItem[chosenInt];

        cart[itemChosen.id] = Math.floor(Math.random() * (MAX_QUANTITY - MIN_QUANTITY + 1)) + MIN_QUANTITY;
        totalP += itemChosen.itemPrice;
    }

    addDoc(colRef, {
        phoneNumber: Number(pNumber),
        totalPrice: Number(totalP),
        orderInfo: cart,
        visitDurationInSec: Number(visitDuration),
        visitDate: randVisitDate,
        orderStatus: oStatus,
        orderTicketStatus: false,
    });
};

// Get data from orders table from firestore database
// Count the number of rows in the table
getDocs(colRef).then((snapshot) => {
    let data = [];
    snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
    });
    console.log(`Total row in orders table: ${data.length}`);
});