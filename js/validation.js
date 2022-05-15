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


export function checkPaymentForm (form) {
    let status = true;
    let phoneNumberErr = document.getElementById("phoneNumberError");
    let ccErr = document.getElementById("ccError");

    if (form.phoneNumber.value.trim() == "" || !form.phoneNumber.value) {
        phoneNumberErr.innerHTML = "Please enter phone number";
        status = false;
    }
    else if (!(/^[89]{1}\d{7}$/.test(form.phoneNumber.value))) {
        phoneNumberErr.innerHTML = "Phone number must have 8 digit and starts with either 8 or 9";
        status = false;
    }
    else {
        phoneNumberErr.innerHTML = "";
    }

    if (form.creditCard.value.trim() == "" || !form.creditCard.value) {
        ccErr.innerHTML = "Please enter credit card";
        status = false;
    }
    else if (!(/^\d{16}$/.test(form.creditCard.value))) {
        ccErr.innerHTML = "Credit card must have 16 digit";
        status = false;
    }
    else {
        ccErr.innerHTML = "";
    }

    return status;
}


export function checkNewCouponForm(form) {
    let status = true;
    let couponCodeErr = document.getElementById("createCouponCodeError");
    let discountErr = document.getElementById("createDiscountError");

    if (form.couponCode.value.trim() === "" || !form.couponCode.value) {
        couponCodeErr.innerHTML = "Please enter coupon code";
        status = false;
    }
    else {
        couponCodeErr.innerHTML = "";
    }

    if (form.discount.value.trim() === "" || !form.discount.value) {
        discountErr.innerHTML = "Please enter discount (0-100)%";
        status = false;
    }
    else {
        discountErr.innerHTML = "";
    }

    return status;
}


export function checkUpdateCouponForm(form) {
    let status = true;
    let couponCodeErr = document.getElementById("updateCouponCodeError");
    let couponCodeRowStyle = document.getElementById("updateCouponCodeErrorRow");
    let discountErr = document.getElementById("updateDiscountError");
    let discountRowStyle = document.getElementById("updateDiscountErrorRow");
    let currentViewCoupon = JSON.parse(sessionStorage.getItem("currentViewCoupon"));

    if (form.couponCode.value.trim() === "" || !form.couponCode.value) {
        couponCodeErr.innerHTML = "Please enter coupon code";
        couponCodeRowStyle.style.display = "table-row";
        status = false;
    }
    else {
        couponCodeErr.innerHTML = "";
        couponCodeRowStyle = "none";
    }

    if (form.discount.value.trim() === "" || !form.discount.value) {
        discountErr.innerHTML = "Please enter discount (0-100)%";
        discountRowStyle.style.display = "table-row";
        status = false;
    }
    else {
        discountErr.innerHTML = "";
        discountRowStyle = "none";
    }
    
    let outMsg = document.getElementById("coupon_updateOut");
    if (status) {
        if (form.couponCode.value === currentViewCoupon.couponCode &&
            form.category.value === currentViewCoupon.catID &&
            (form.discount.value/100) == currentViewCoupon.discount) {
            outMsg.innerHTML = "No changes in coupon code";
            status = false;
        }
        else {
            outMsg.innerHTML = "";
        }
    }
    else {
        outMsg.innerHTML = "";
    }

    return status;
}