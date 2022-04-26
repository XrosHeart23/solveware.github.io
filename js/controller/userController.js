import { User } from "../entity/user.js";

export class UserController {
    loginStatus = false;

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.user = new User(this.username, this.password);
    }

    // Logical check if user account is valid
    // Account count == 1 - Login Success
    // Account count < 1 - No account exist
    // Account count > 1 - Invalid username/password
    async validateLogin() {
        const userAcct = await this.user.getLogin();

        // Possible state
        // 0 - No account found
        // Account found
        // 1 - Account with correct password
        // 2 - Account with wrong password
        // 3 - More than 1 account found (Very rarely possible but still track)
        let status = 0;
        if (userAcct.length == 1){
            if (userAcct[0].password == this.password) {
                status = 1;
                this.loginStatus = true;
                this.user.setUserInfo(userAcct[0].fname, userAcct[0].lname, userAcct[0].staffProfile, userAcct[0].acctStatus);
            } else {
                status = 2;
            }
        }
        else if (userAcct.length > 1)
            status = 3;

        return status;
    }

    // Get user info
    // Return key-value pair for user info
    get getUserInfo() {
        return this.user;
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}