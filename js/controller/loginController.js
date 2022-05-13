import { UserAccount } from "../entity/userAccount.js";

// Possible state
// 0 - No account found
// Account found
// 1 - Account with correct password
// 2 - Account with wrong password or profile
// 3 - More than 1 account found (Very rarely possible but still track)

// Admin login controller
export class AdminLoginController {
    loginStatus = false;

    constructor(username, password) {
        this.admin = new UserAccount(username, password);
    }

    async validateLogin() {
        const userAcct = await this.admin.getLogin();
        let status = 0;
        if (userAcct.length == 1){
            if ((userAcct[0].password === this.admin.password) && (userAcct[0].userProfile === "admin")) {
                status = 1;
                this.loginStatus = true;
                this.admin.setUserInfo(userAcct[0].fname, userAcct[0].lname, userAcct[0].userProfile, userAcct[0].acctStatus);
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
        return this.admin;
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}


// Staff login controller
export class StaffLoginController {
    loginStatus = false;

    constructor(username, password) {
        this.staff = new UserAccount(username, password);
    }

    async validateLogin() {
        const userAcct = await this.staff.getLogin();
        let status = 0;
        if (userAcct.length == 1){
            if ((userAcct[0].password === this.staff.password) && (userAcct[0].userProfile === "staff")) {
                status = 1;
                this.loginStatus = true;
                this.staff.setUserInfo(userAcct[0].fname, userAcct[0].lname, userAcct[0].userProfile, userAcct[0].acctStatus);
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
        return this.staff;
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}


// Manager login controller
export class ManagerLoginController {
    loginStatus = false;

    constructor(username, password) {
        this.manager = new UserAccount(username, password);
    }

    async validateLogin() {
        const userAcct = await this.manager.getLogin();
        let status = 0;
        if (userAcct.length == 1){
            if ((userAcct[0].password === this.manager.password) && (userAcct[0].userProfile === "manager")) {
                status = 1;
                this.loginStatus = true;
                this.manager.setUserInfo(userAcct[0].fname, userAcct[0].lname, userAcct[0].userProfile, userAcct[0].acctStatus);
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
        return this.manager;
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}


// Owner login controller
export class OwnerLoginController {
    loginStatus = false;

    constructor(username, password) {
        this.owner = new UserAccount(username, password);
    }

    async validateLogin() {
        const userAcct = await this.owner.getLogin();

        let status = 0;
        if (userAcct.length == 1){
            if ((userAcct[0].password === this.owner.password) && (userAcct[0].userProfile === "owner")) {
                status = 1;
                this.loginStatus = true;
                this.owner.setUserInfo(userAcct[0].fname, userAcct[0].lname, userAcct[0].userProfile, userAcct[0].acctStatus);
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
        return this.owner;
    }

    // Get login status
    get getLoginStatus() {
        return this.loginStatus;
    }
}