import { LoginController } from "../controller/loginController.js";

export class LoginUI {
    constructor (username, password) {
        this.username = username;
        this.password = password;
        this.loginCtrl = new LoginController(this.username, this.password);
    }

    // Methods
    async loginUser() {
        let result = await this.loginCtrl.validateLogin();

        if (result == 1)
            return "Login sucess";
        else if (result == 0)
            return "Username does not exist";
        else if (result > 1)
            return "Invalid username or password";
    }

    // Get user info
    getUserInfo() {
        return this.loginCtrl.getUserInfo();
    }

    // Get login status
    get getLoginStatus() {
        return this.loginCtrl.getLoginStatus;
    }
}