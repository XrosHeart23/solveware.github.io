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

    async updateAcct(form, userId) {
        return await this.adminCtrl.doUpdateAcct(form.username.value, form.password.value, 
            form.fname.value, form.lname.value, form.profile.value, userId);
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

    async searchAcct(form, searchData) {
        let name;
        if (searchData === "name") {
            name = form.name.value;
        } else {
            name = form.username.value;
        }

        return await this.adminCtrl.doSearchAcct(name, searchData);
    }


    // == Profile functions ==
    async createProfile(form) {
        let status = (form.profileStatus.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doCreateProfile(form.profileName.value, status);

        if (result) {
            form.reset();
            return "Profile created";
        } else {
            return "Profile exist";
        }
    }

    async updateProfile(form, userId) {
        return await this.adminCtrl.doUpdateProfile(form.profileName.value, userId);
    }

    async suspendProfile(form, userId) {
        let status = (form.profileStatus.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doSuspendProfile(form.profileName.value, status, userId);

        if (result) {
            return "Profile activated";
        } else {
            return "Profile suspended";
        }
    }
    
    async searchProfile(form = null, type = "dropdown") {
        let profileName = (form != null) ? form.profileName.value : "";
        return await this.adminCtrl.doSearchProfile(profileName, type);
    }
}