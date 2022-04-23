import { LoginController } from "../controller/loginController.js";

export class LoginUI {

    constructor (username, password) {
        this.username = username;
        this.password = password;
        this.loginCont = new LoginController(this.username, this.password);
    }

    // Methods
    async loginStatus() {
        return await this.loginCont.validateLogin();
    }

    // Get user info
    getUserInfo() {
        return this.loginCont.getUserInfo();
    }
}