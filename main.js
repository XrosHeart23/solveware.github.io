import { LoginUI } from "./js/boundary/loginUI.js";

// Add event listener for login click button
const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const userLogin = new LoginUI(login_form.username.value, login_form.password.value);
    let result = await userLogin.loginStatus();
    console.log(result);

    // Get user info
    let userInfo = userLogin.getUserInfo()

    if (userInfo.loginStatus) {
        let span = document.createElement("span");
        span.innerHTML = result;
        
        login_form.appendChild(span);
    }

    // Store user login info into browser session
    for (const [key, value] of Object.entries(userInfo)) {
        sessionStorage.setItem(key, value);
    }
});