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
        if (this.controller) {
            result = await this.controller.validateLogin();
        }
        
        if (result == 1)
            return "Login sucess";
        else if (result == 0)
            return "Invalid username";
        else if (result > 1 || !this.controller)
            return "Invalid username or password";
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