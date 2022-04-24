import { AdminController } from "../controller/adminController.js";

export class AdminUI {
    adminCtrl = new AdminController();

    // Account functions
    async createAcct(form) {
        // TODO: Update form names
        let result = await this.adminCtrl.doCreateAcct(form.username.value, form.password.value, 
            form.fname.value, form.lname.value, form.profile.value);

        if (result) {
            form.reset();
            return "Account created";
        } else {
            return "Account exist";
        }   
    }

    async updateAcct() {

    }

    async suspendAcct(form) {
        let acctStatus = (form.status.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doSuspendAcct(form.username.value, acctStatus);

        if (result) {
            return "Account activated";
        } else {
            return "Account suspended"
        }
    }

    async searchAcct() {

    }


    // Profile functions
    async createProfile(form) {
        // TODO: Update form profile name
        let result = await this.adminCtrl.doCreateProfile(form.profileName.value);

        if (result) {
            form.reset();
            return "Profile created";
        } else {
            return "Profile exist";
        }
    }

    async updateProfile() {

    }

    async suspendProfile(form) {
        // TODO: Update form name
        let profileStatus = (form.status.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doSuspendAcct(form.profileName.value, profileStatus);

        if (result) {
            return "Profile activated";
        } else {
            return "Profile suspended"
        }
    }
    
    async searchProfile() {

    }
}