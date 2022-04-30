import { AdminController } from "../controller/adminController.js";

export class AdminUI {
    adminCtrl = new AdminController();

    // == Account functions ==
    async createAcct(form) {
        let result = await this.adminCtrl.doCreateAcct(form.username.value.toLowerCase(), form.password.value, 
            form.fname.value, form.lname.value, form.profile.value);

        let sysMsg;
        if (result) {
            form.reset();
            sysMsg = "Account created";
        } else {
            sysMsg = "Username is taken";
        }

        document.getElementById("createUser_Out").innerHTML = sysMsg;
    }

    async updateAcct(form, userId) {
        return await this.adminCtrl.doUpdateAcct(form.username.value.toLowerCase(), form.password.value, 
            form.fname.value, form.lname.value, form.profile.value, userId);
    }

    async suspendAcct(form) {
        let acctStatus = (form.status.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doSuspendAcct(form.username.value.toLowerCase(), acctStatus);

        if (result) {
            return "Account activated";
        } else {
            return "Account suspended";
        }
    }

    async searchAcct(form, searchData, searchType) {
        let name;
        if (searchData === "name") {
            name = form.name.value.toLowerCase();
        } else {
            name = form.username.value.toLowerCase();
        }

        let searchResult = await this.adminCtrl.doSearchAcct(name, searchData);

        if (searchType === "search") {
            const viewTbl = document.getElementById("view_user");
            viewTbl.innerHTML = "";

            const tbl = document.getElementById("search_result");
            tbl.innerHTML = ""; // Clear table

            // Add table header
            const trhead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "searchResult_header");
            th.setAttribute("class", "searchResult_header");
            th.innerHTML = "Search Result";
            trhead.appendChild(th);

            // Add table row for each result found
            searchResult.forEach((row) => {
                const tr = tbl.insertRow();
                const tdUser = tr.insertCell();
                tdUser.appendChild(document.createTextNode(row.fname + " " + row.lname))
                tdUser.setAttribute("class", "viewUser_row");

                tdUser.addEventListener("click", () => {
                    document.getElementById("search_result").style.display = "none";
                    document.getElementById("createusertable").style.display = "none";
                    document.getElementById("view_user").style.display = "table";

                    sessionStorage.setItem("currentViewUser", JSON.stringify(row));
                    this.displayUser(row);
                });
            });
        }
        else {
            return searchResult;
        }
    }


    // == Profile functions ==
    async createProfile(form) {
        let status = (form.profileStatus.value.toLowerCase() === "activated") ? true : false;
        let result = await this.adminCtrl.doCreateProfile(form.profileName.value.toLowerCase(), status);

        let sysMsg;
        if (result) {
            form.reset();
            sysMsg = "Profile created";
        } else {
            sysMsg = "Profile exist";
        }

        document.getElementById("createProfile_Out").innerHTML = sysMsg;
    }

    async updateProfile(form, userId) {
        return await this.adminCtrl.doUpdateProfile(form.profileName.value.toLowerCase(), userId);
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
    
    async searchProfile(form = null, type = "dropdown", searchType) {
        let profileName = (form != null) ? form.profileName.value : "";
        let searchResult = await this.adminCtrl.doSearchProfile(profileName, type);

        if (searchType === "search") {
            const viewTbl = document.getElementById("view_profile");
            viewTbl.innerHTML = "";

            const tbl = document.getElementById("searchProfile_result");
            tbl.innerHTML = ""; // Clear table

            // Add table header
            const trhead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "searchProfile_header");
            th.setAttribute("class", "searchProfile_header");
            th.innerHTML = "Search Result";
            trhead.appendChild(th);

            // Add table row for each result found
            searchResult.forEach((row) => {
                const tr = tbl.insertRow();
                const tdUser = tr.insertCell();
                tdUser.appendChild(document.createTextNode(row.profileName));
                tdUser.setAttribute("class", "viewProfile_row");

                tdUser.addEventListener("click", () => {
                    document.getElementById("createProfileTable").style.display = "none";
                    document.getElementById("searchProfile_result").style.display = "none";
                    document.getElementById("view_profile").style.display = "table";

                    sessionStorage.setItem("currentViewProfile", JSON.stringify(row));
                    this.displayProfile(row);
                });
            });
        }
        else {
            return searchResult;
        }
    }


    // Display user information
    displayUser(data) {
        const tbl = document.getElementById("view_user");
        tbl.innerHTML = ""; // Clear table

        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "view_header");
        th.setAttribute("class", "view_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Update Account";
        trhead.appendChild(th);
        
        // Username
        let tr = tbl.insertRow();
        let tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Username"));

        let tdValue = tr.insertCell();
        let inputField = document.createElement("input");

        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "username");
        inputField.setAttribute("id", "viewUser_name");    
        inputField.setAttribute("value", data.username);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        let errorField = document.createElement("span");
        errorField.setAttribute("id", "updateUsernameError");
        tdValue.appendChild(errorField);
        //================================================

        // Password
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Password"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "password");
        inputField.setAttribute("name", "password");
        inputField.setAttribute("id", "viewUser_password");    
        inputField.setAttribute("value", data.password);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updatePasswordError");
        tdValue.appendChild(errorField);
        //================================================

        // First Name
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("First Name"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "fname");
        inputField.setAttribute("id", "viewUser_fname");    
        inputField.setAttribute("value", data.fname);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updateFnameError");
        tdValue.appendChild(errorField);
        //================================================

        // Last Name
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Last Name"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "lname");
        inputField.setAttribute("id", "viewUser_lname");    
        inputField.setAttribute("value", data.lname);
        tdValue.appendChild(inputField);
        
        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updateLnameError");
        tdValue.appendChild(errorField);
        //================================================

        // User Profile
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("User Profile"));

        tdValue = tr.insertCell();
        let selectField = document.createElement("select");
        selectField.setAttribute("name", "profile");
        selectField.setAttribute("id", "viewUser_profile");
        this.displayProfileDropDown(selectField, data.userProfile);
        tdValue.appendChild(selectField);
        //================================================

        // Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Status"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "status");
        inputField.setAttribute("id", "viewUser_status");
        inputField.setAttribute("style", "border:0;outline:none;");
        let status = (data.acctStatus) ? "Activated" : "Suspended";
        inputField.setAttribute("value", status);
        inputField.readOnly = true;
        tdValue.appendChild(inputField);
        //================================================

        // Update button - Left side
        tr = tbl.insertRow();
        let tdLeft = tr.insertCell();

        let btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "update");
        btn.setAttribute("id", "update_user");
        btn.innerHTML = "Update";
        tdLeft.appendChild(btn);
        //===============================================

        // Suspend button - Right side
        let tdRight = tr.insertCell();

        btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "suspend");
        btn.setAttribute("id", "suspend_user");
        status = (data.acctStatus) ? "Suspend" : "Activate";
        btn.innerHTML = status;
        tdRight.appendChild(btn);
        //===============================================

        // Output for form
        tr = tbl.insertRow();
        let tdOutput = tr.insertCell();
        tdOutput.setAttribute("colspan", 2);
        tdOutput.setAttribute("id", "updateOut");
        tdOutput.setAttribute("class", "updateOut");
    }

    // Display profile in dropdown selection
    async displayProfileDropDown(dropdownID, userProfile = "") {
        let searchProfile = await this.searchProfile();
        dropdownID.innerHTML = "";

        searchProfile.forEach((row) => {
            const option = document.createElement("option");
            option.setAttribute("value", row.profileName);
            option.innerHTML = row.profileName.charAt(0).toUpperCase() + row.profileName.slice(1);

            if (row.profileName === userProfile)
                option.setAttribute("selected", "selected");

            dropdownID.appendChild(option);
    });
    }

    displayProfile (data) {
        const tbl = document.getElementById("view_profile");
        tbl.innerHTML = ""; // Clear table
    
        // Add table header
        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "view_header");
        th.setAttribute("class", "view_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Update Profile";
        trhead.appendChild(th);
    
        // Profile Name
        let tr = tbl.insertRow();
        let tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Profile Name"));
    
        let tdValue = tr.insertCell();
        let inputField = document.createElement("input");
    
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "profileName");
        inputField.setAttribute("id", "viewProfile_name");    
        inputField.setAttribute("value", data.profileName);
        tdValue.appendChild(inputField);
    
        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        let errorField = document.createElement("span");
        errorField.setAttribute("id", "updateProfileNameError");
        tdValue.appendChild(errorField);
        //================================================
    
        // Profile Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Profile Status"));
    
        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "profileStatus");
        inputField.setAttribute("id", "viewProfile_status");
        inputField.setAttribute("style", "border:0;outline:none;");
        let status = (data.profileStatus) ? "Activated" : "Suspended";
        inputField.setAttribute("value", status);
        inputField.readOnly = true;
        tdValue.appendChild(inputField);
        //================================================
    
        // Update button - Left side
        tr = tbl.insertRow();
        let tdLeft = tr.insertCell();
    
        let btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "update");
        btn.setAttribute("id", "update_profile");
        btn.innerHTML = "Update";
        tdLeft.appendChild(btn);
        //===============================================
    
        // Suspend button - Right side
        let tdRight = tr.insertCell();
    
        btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "suspend");
        btn.setAttribute("id", "suspend_profile");
        status = (data.profileStatus) ? "Suspend" : "Activate";
        btn.innerHTML = status;
        tdRight.appendChild(btn);
        //===============================================
    
        // Output for form
        tr = tbl.insertRow();
        let tdOutput = tr.insertCell();
        tdOutput.setAttribute("colspan", 2);
        tdOutput.setAttribute("id", "updateOut");
        tdOutput.setAttribute("class", "updateOut");
    }
}