import { LoginUI } from "./js/boundary/loginUI.js";
import { AdminUI } from "./js/boundary/adminUI.js";


// Add event listener for login click button
const loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const userLogin = new LoginUI(loginForm.username.value, loginForm.password.value);
    let result = await userLogin.loginUser();
    // console.log(result);

    // Get user info
    let userInfo = userLogin.getUserInfo()

    if (userInfo.loginStatus) {
        let span = document.createElement("span");
        span.innerHTML = result;
        
        loginForm.appendChild(span);
        
        // TODO: After login need to reload page to homepage (index.html)
    }

    // Store user login info into browser session
    for (const [key, value] of Object.entries(userInfo)) {
        sessionStorage.setItem(key, value);
    }
});


// Add event listener for create new user button
const createUserForm = document.getElementById("createUser_form");

createUserForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();
    let result = await admin.createAcct(createUserForm);

    let span = document.getElementById("createUser_Out");
    span.innerHTML = result;
});


// Add event listener for suspend user button
const deleteForm = document.getElementById("delete_form");

deleteForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();
    let result = await admin.suspendAcct(deleteForm);

    let span = document.getElementById("delete_Out");
    span.innerHTML = result;
});