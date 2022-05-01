// Login validation
export function checkLoginForm (form) {
    let status = true;
    let usernameError = document.getElementById("usernameError")
    let passwordError = document.getElementById("passwordError")

    if (!form.username.value || form.username.value.trim() === "") {
        usernameError.innerHTML = "Please enter username";
        status = false;
    } else {
        usernameError.innerHTML = "";
    }
        
    if (!form.password.value) {
        passwordError.innerHTML = "Please enter password";
        status = false;
    } else {
        passwordError.innerHTML = "";
    }
        
    return status;
}

export function checkCreateUserForm (form) {
    let status = true;
    let usernameError = document.getElementById("createUsernameError");
    let passwordError = document.getElementById("createPasswordError");
    let fnameError = document.getElementById("createFnameError");
    let lnameError = document.getElementById("createLnameError"); 

    if (!form.username.value || form.username.value.trim() === "") {
        usernameError.innerHTML = "Please enter username";
        status = false;
    } else {
        usernameError.innerHTML = "";
    }

    if (!form.password.value) {
        passwordError.innerHTML = "Please enter password";
        status = false;
    } else {
        passwordError.innerHTML = "";
    }

    if (!form.fname.value) {
        fnameError.innerHTML = "Please enter first name";
        status = false;
    } else {
        fnameError.innerHTML = "";
    }

    if (!form.lname.value) {
        lnameError.innerHTML = "Please enter last name";
        status = false;
    } else {
        lnameError.innerHTML = "";
    }

    return status;
}

export function resetCreateForm() {
    document.getElementById("createUsernameError").innerHTML = "";
    document.getElementById("createPasswordError").innerHTML = "";
    document.getElementById("createFnameError").innerHTML = "";
    document.getElementById("createLnameError").innerHTML = "";
}

export function checkUpdateForm (form, oldUserData) {
    let status = true;
    let outMsg = document.getElementById("updateOut");
    let usernameError = document.getElementById("updateUsernameError");
    let passwordError = document.getElementById("updatePasswordError");
    let fnameError = document.getElementById("updateFnameError");
    let lnameError = document.getElementById("updateLnameError"); 

    if (!form.username.value || form.username.value.trim() === "") {
        usernameError.innerHTML = "Please enter username";
        status = false;
    } else {
        usernameError.innerHTML = "";
    }

    if (!form.password.value) {
        passwordError.innerHTML = "Please enter password";
        status = false;
    } else {
        passwordError.innerHTML = "";
    }

    if (!form.fname.value) {
        fnameError.innerHTML = "Please enter first name";
        status = false;
    } else {
        fnameError.innerHTML = "";
    }

    if (!form.lname.value) {
        lnameError.innerHTML = "Please enter last name";
        status = false;
    } else {
        lnameError.innerHTML = "";
    }

    // 3 possible state
    // 0 - No change to form
    // 1 - Change to username (Verify in db that no conflict)
    // 2 - Change to everything other than username (No verification need with db)
    // 3 - Username field is empty
    if (status) {
        if (form.username.value.toLowerCase() == oldUserData.username.toLowerCase() &&
        form.password.value === oldUserData.password &&
        form.fname.value === oldUserData.fname &&
        form.lname.value === oldUserData.lname &&
        form.profile.value === oldUserData.userProfile) {

        outMsg.innerHTML = "No changes in user data";
        status = 0;
        }
        else if (!(form.username.value.toLowerCase() === oldUserData.username.toLowerCase()) && !form.username.value == "") {
            outMsg.innerHTML = "";
            status = 1;
        }
        else if (!(form.password.value === oldUserData.password) ||
            !(form.fname.value === oldUserData.fname) ||
            !(form.lname.value === oldUserData.lname) ||
            !(form.profile.value === oldUserData.userProfile)) {
            outMsg.innerHTML = "";
            status = 2;
        }    
        else {
            outMsg.innerHTML = "";
        }
    } else {
        outMsg.innerHTML = "";
    }

    return status;
}

export function checkCreateProfileForm (form) {
    let status = true;
    let prNameError = document.getElementById("createProfileError");

    if (!form.profileName.value || form.profileName.value.trim() === "") {
        status = false;
        prNameError.innerHTML = "Please enter profile name";
    }
    else {
        prNameError.innerHTML = "";
    }

    return status;
}

export function resetCreateProfileForm() {
    document.getElementById("createProfileError").innerHTML = "";
}

export function checkUpdateProfileForm (form) {
    let status = true;
    if (!form.profileName.value || form.profileName.value.trim() === "") {
        document.getElementById("updateProfileNameError").innerHTML = "Please enter profile name";
        status = false;
    } else {
        document.getElementById("updateProfileNameError").innerHTML = "";
    }
    
    return status;
}