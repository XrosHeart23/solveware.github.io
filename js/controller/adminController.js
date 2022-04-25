import { Admin } from "../entity/admin.js";

export class AdminController {
    admin = new Admin();
    
    // == Account functions ==
    async doCreateAcct(username, password, fname, lname, profile) {
        let acctStatus = true; // Account status = True - Default setting when creating new acount
        return await this.admin.addAcct(username, password, fname, lname, profile, acctStatus);
    }

    async doUpdateAcct(username, password, fname, lname, profile) {
        return await this.admin.updateAcct(username, password, fname, lname, profile);
    }

    async doSuspendAcct(username, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendAcct(username, status);

        return status;
    }

    async doSearchAcct(username) {
        return await this.admin.searchAcct(username);
    }


    // == Profile functions ==
    async doCreateProfile(profileName) {
        let profileStatus = true;
        return await this.admin.addProfile(profileName, profileStatus);
    }

    async doUpdateProfile(profileName) {
        return await this.admin.updateProfile(profileName);
    }

    async doSuspendProfile(profileName, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendProfile(profileName, status);

        return status;
    }
    
    async doSearchProfile(profileName, type) {
        return await this.admin.searchProfile(profileName, type);
    }
}