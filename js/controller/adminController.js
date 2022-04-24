import { Admin } from "../entity/admin.js";

export class AdminController {
    admin = new Admin();
    
    // Account functions
    async doCreateAcct(username, password, fname, lname, profile) {
        let acctStatus = true;
        return await this.admin.addAcct(username, password, fname, lname, profile, acctStatus);
    }

    async doUpdateAcct() {

    }

    async doSuspendAcct(username, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendAcct(username, status);

        return status;
    }

    async doSearchAcct() {
        
    }


    // Profile functions
    async doCreateProfile(profileName) {
        let profileStatus = true;
        return await this.admin.addProfile(profileName, profileStatus);
    }

    async doUpdateProfile() {

    }

    async doSuspendProfile(profileName, status) {
        status = !status; // Toggle status boolean
        await this.admin.suspendProfile(profileName, status);

        return status;
    }
    
    async doSearchProfile() {

    }
}