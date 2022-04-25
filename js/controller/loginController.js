import { Login } from "../entity/login.js";

export class LoginController {
    loginStatus = false;
    name = "";
    userProfile;
    acctStatus;

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    // Logical check if user account is valid
    // Account count == 1 - Login Success
    // Account count < 1 - No account exist
    // Account count > 1 - Invalid username/password
    async validateLogin() {
        const login = new Login(this.username, this.password);
        const loginAcct = await login.getLogin();

        let status = 0;
        if (loginAcct.length == 1){
            status = 1;
            this.loginStatus = true;
            this.fname = loginAcct[0].fname;
            this.lname = loginAcct[0].lname;
            this.userProfile = loginAcct[0].staffProfile;
            this.acctStatus = loginAcct[0].acctStatus;
        }
        else if (loginAcct.length > 1)
            status = 2;

        return status;
    }

    // Get user info
    // Return key-value pair for user info
    getUserInfo() {
        return {"username" : this.username,
                "password" : this.password, 
                "loginStatus" : this.loginStatus,
                "fname" : this.fname, 
                "lname" : this.lname,
                "userProfile" : this.userProfile, 
                "acctStatus" : this.acctStatus};
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}