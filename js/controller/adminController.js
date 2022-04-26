import { Admin } from "../entity/admin.js";

export class AdminController {
    admin = new Admin();
    
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