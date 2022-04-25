import { AdminController } from "../controller/adminController.js";

export class AdminUI {
    adminCtrl = new AdminController();

    // == Account functions ==
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

    async updateAcct(form) {
        return await this.adminCtrl.doUpdateAcct(form.username.value, form.password.value, 
            form.fname.value, form.lname.value, form.profile.value);
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

    async searchAcct(form) {
        return await this.adminCtrl.doSearchAcct(form.username.value);
    }


    // == Profile functions ==
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

    async updateProfile(form) {
        return await this.adminCtrl.doUpdateProfile(form.profileName.value);
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
    
    async searchProfile(form = null, type = "dropdown") {
        let profileName = (form != null) ? form.profileName.value : "";
        return await this.adminCtrl.doSearchProfile(profileName, type);
    }
}