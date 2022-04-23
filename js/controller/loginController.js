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

        let outputMessage;
        if (loginAcct.length == 1){
            outputMessage = "Login success";
            this.loginStatus = true;
            this.name = loginAcct[0].name;
            this.userProfile = loginAcct[0].staffProfile;
            this.acctStatus = loginAcct[0].acctStatus;
        }
        else if (loginAcct.length > 1)
            outputMessage = "Invalid username or password";
        else if (loginAcct.length == 0) 
            outputMessage = "Username does not exist";

        return outputMessage;
    }

    // Get user info
    // Return key-value pair for user info
    getUserInfo() {
        return {"username" : this.username, 
                "loginStatus" : this.loginStatus,
                "name" : this.name, 
                "userProfile" : this.userProfile, 
                "acctStatus" : this.acctStatus};
    }
}