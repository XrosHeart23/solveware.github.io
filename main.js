import * as login from "./js/boundary/login.js";






// Add event listener for login click button
const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", function (e) {
    e.preventDefault();
    //login.doLogin(login_form);

    let user_login = new login.Login(login_form);

    console.log(user_login.loginUsername);
    console.log(user_login.loginPassword);
})