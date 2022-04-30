import { AdminController } from "../controller/adminController.js";

export class LoginUI {
    constructor (form) {
        switch (form.profile.value.toLowerCase()) {
            case "admin":
                this.controller = new AdminController(form.username.value.toLowerCase(), form.password.value.toLowerCase());
                break;
            case "owner":
                break;
            case "manager":
                break;
            case "staff":
                break;
        }        
    }

    // Methods
    async loginUser() {
        let result;
        let sysMsg;
        if (this.controller) {
            result = await this.controller.validateLogin();
        }
        
        if (result == 1)
            sysMsg = "Login sucess";
        else if (result == 0)
            sysMsg = "Invalid username";
        else if (result > 1 || !this.controller)
            sysMsg = "Invalid username or password";

        document.getElementById("loginUser_Out").innerHTML = sysMsg;

        // Get user info
        if (this.getLoginStatus) {
            // Store user login info into browser session
            sessionStorage.setItem("loginStatus", this.getLoginStatus);
            for (const [key, value] of Object.entries(this.getUserInfo)) {
                sessionStorage.setItem(key, value);
            }

            document.location.href="./index.html";
        }
    }

    // Get user info
    get getUserInfo() {
        return this.controller.getUserInfo;
    }

    // Get login status
    get getLoginStatus() {
        if (this.controller)
            return this.controller.getLoginStatus;
        else
            return false;
    }
}