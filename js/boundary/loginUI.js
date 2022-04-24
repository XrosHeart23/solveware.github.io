import { LoginController } from "../controller/loginController.js";

export class LoginUI {
    constructor (username, password) {
        this.username = username;
        this.password = password;
        this.loginCtrl = new LoginController(this.username, this.password);
    }

    // Methods
    async loginUser() {
        return await this.loginCtrl.validateLogin();
    }

    // Get user info
    getUserInfo() {
        return this.loginCtrl.getUserInfo();
    }
}