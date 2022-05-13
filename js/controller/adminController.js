import { UserAccount } from "../entity/userAccount.js";

// Admin login controller
export class AdminLoginController {
    loginStatus = false;

    constructor(username, password) {
        this.admin = new UserAccount(username, password);
    }

    // Logical check if user account is valid
    // Account count == 1 - Login Success
    // Account count < 1 - No account exist
    // Account count > 1 - Invalid username/password
    async validateLogin() {
        const userAcct = await this.admin.getLogin();
        // Possible state
        // 0 - No account found
        // Account found
        // 1 - Account with correct password
        // 2 - Account with wrong password
        // 3 - More than 1 account found (Very rarely possible but still track)
        let status = 0;
        if (userAcct.length == 1){
            if (userAcct[0].password == this.admin.password) {
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

// ======== Account Controller ========
// Create account controller
export class AdminCreateAcctCtrl {
    constructor() {
        this.admin = new UserAccount()
    }

    async doCreateAcct(username, password, fname, lname, profile) {
        let acctStatus = true; // Account status = True - Default setting when creating new acount
        return await this.admin.addAcct(username, password, fname, lname, profile, acctStatus);
    }
}


// Update account controller
export class AdminUpdateAcctCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doUpdateAcct(username, password, fname, lname, profile, userId) {
        return await this.admin.updateAcct(username, password, fname, lname, profile, userId);
    }
}


// Suspend account controller
export class AdminSuspendAcctCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doSuspendAcct(username, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendAcct(username, status);

        return status;
    }
}


// Search account controller
export class AdminSearchAcctCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doSearchAcct(name, searchData) {
        return await this.admin.searchAcct(name, searchData);
    }
}
// ======== End Account Controller ========


// ======== Profile Controller ========
// Create profile controller
export class AdminCreatePrfCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doCreateProfile(profileName, profileStatus) {
        return await this.admin.addProfile(profileName, profileStatus);
    }
}


// Update profile controller
export class AdminUpdatePrfCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doUpdateProfile(profileName, userId) {
        return await this.admin.updateProfile(profileName, userId);
    }
}


// Suspend profile controller
export class AdminSuspendPrfCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doSuspendProfile(profileName, status, userId) {
        status = !status; // Toggle status boolean
        await this.admin.suspendProfile(profileName, status, userId);

        return status;
    }
}


// Search profile controller
export class AdminSearchPrfCtrl {
    constructor() {
        this.admin = new UserAccount();
    }

    async doSearchProfile(profileName, type) {
        return await this.admin.searchProfile(profileName, type);
    }
}
// ======== End Profile Controller ========


/* Depecrated controller
export class AdminController {
    loginStatus = false;

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.admin = new UserAccount(this.username, this.password);
    }

    // Logical check if user account is valid
    // Account count == 1 - Login Success
    // Account count < 1 - No account exist
    // Account count > 1 - Invalid username/password
    async validateLogin() {
        const userAcct = await this.admin.getLogin();

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

    
    // == Account functions ==
    async doCreateAcct(username, password, fname, lname, profile) {
        let acctStatus = true; // Account status = True - Default setting when creating new acount
        return await this.admin.addAcct(username, password, fname, lname, profile, acctStatus);
    }

    async doUpdateAcct(username, password, fname, lname, profile, userId) {
        return await this.admin.updateAcct(username, password, fname, lname, profile, userId);
    }

    async doSuspendAcct(username, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendAcct(username, status);

        return status;
    }

    async doSearchAcct(name, searchData) {
        return await this.admin.searchAcct(name, searchData);
    }


    // == Profile functions ==
    async doCreateProfile(profileName, profileStatus) {
        return await this.admin.addProfile(profileName, profileStatus);
    }

    async doUpdateProfile(profileName, userId) {
        return await this.admin.updateProfile(profileName, userId);
    }

    async doSuspendProfile(profileName, status, userId) {
        status = !status; // Toggle status boolean
        await this.admin.suspendProfile(profileName, status, userId);

        return status;
    }
    
    async doSearchProfile(profileName, type) {
        return await this.admin.searchProfile(profileName, type);
    }
} 
*/