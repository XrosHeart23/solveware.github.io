import { UserUI } from "./boundary/userUI.js";
import { AdminUI } from "./boundary/adminUI.js";
import * as Validation from "./validation.js";
import { Admin } from "./entity/admin.js";

// Add event listener for login click button
const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing

    let checkValid = Validation.checkLoginForm(loginForm);
    if (checkValid) {
        const userLogin = new UserUI(loginForm.username.value, loginForm.password.value);
        let result = await userLogin.loginUser();

        console.log(userLogin.getLoginStatus);

        let span = document.getElementById("loginUser_Out");
        span.innerHTML = result;

        // Get user info
        if (userLogin.getLoginStatus) {
            // TODO: After login need to reload page to homepage (index.html)
            // Store user login info into browser session
            sessionStorage.setItem("loginStatus", userLogin.getLoginStatus);
            for (const [key, value] of Object.entries(userLogin.getUserInfo)) {
                sessionStorage.setItem(key, value);
            }

            document.location.href="./index.html";
        }
    }
});


// Display profile dropdown in create user
const createDropdown = document.getElementById("createUser_profile");
createDropdown.addEventListener("load", displayProfileDropDown(createDropdown));

// Add event listener for create new user button
const createUserForm = document.getElementById("createUser_form");
createUserForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();

    let checkValid = Validation.checkCreateUserForm(createUserForm);
    if (checkValid) {
        let result = await admin.createAcct(createUserForm);
        
        let span = document.getElementById("createUser_Out");
        span.innerHTML = result;
    }
});

const newAccountBtn = document.getElementById("newAccount_btn");
newAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();
    createUserForm.reset();
    Validation.resetCreateForm();

    document.getElementById("createUser_form").style.display = "table";
    document.getElementById("search_result").style.display = "none";
    document.getElementById("view_user").style.display = "none";
});


// Add event listener for search function
const searchForm = document.getElementById("search_form");
searchForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    document.getElementById("search_result").style.display = "table";
    document.getElementById("createUser_form").style.display = "none";
    document.getElementById("view_user").style.display = "none";

    const admin = new AdminUI();
    const searchResult = await admin.searchAcct(searchForm, "name");

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

        tdUser.addEventListener("click", function (e) {
            document.getElementById("search_result").style.display = "none";
            document.getElementById("createUser_form").style.display = "none";
            document.getElementById("view_user").style.display = "table";

            sessionStorage.setItem("currentViewUser", JSON.stringify(row));
            displayUser(row);
        });
    });
});

// Add event listener for update form
const updateForm = document.getElementById("update_form");
updateForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const admin = new AdminUI();
    let action = e.submitter.name;
    let formAction = false;
    let formMsg;

    // Suspend or Activate account
    if (action === "suspend") {
        formMsg = await admin.suspendAcct(updateForm);
        formAction = true;
    }
    // Update account
    else if (action === "update") {
        // Check for update
        let oldUserData = JSON.parse(sessionStorage.getItem("currentViewUser"));
        let result = Validation.checkUpdateForm(updateForm, oldUserData);
        let proceed = false;
        // Search if username exist
        if (result == 1) {
            let searchResult = await admin.searchAcct(updateForm, "username");
            if (searchResult.length > 0) {
                document.getElementById("updateOut").innerHTML = "Username exist";
            } else {
                proceed = true;
                document.getElementById("updateOut").innerHTML = "";
            }
        } else if (result == 2){
            proceed = true;
        }
        
        if (proceed) { 
            await admin.updateAcct(updateForm, oldUserData.id);
            formMsg = "User account updated";
            formAction = true;
        };
    }

    if (formAction) {
        let searchResult = await admin.searchAcct(updateForm, "username");
        // Update browser with updated details
        sessionStorage.setItem("currentViewUser", JSON.stringify((searchResult[0])));
        
        displayUser(searchResult[0]);
        document.getElementById("updateOut").innerHTML = formMsg;
    }
});


// Display user information
function displayUser(data) {
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
    displayProfileDropDown(selectField, data.staffProfile);
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
    //inputField.innerHTML = status;
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
async function displayProfileDropDown(dropdownID, staffProfile = "") {
    const profileDropdown = dropdownID;
    const admin = new AdminUI();
    let searchProfile = await admin.searchProfile();

    searchProfile.forEach((row) => {
        const option = document.createElement("option");
        option.setAttribute("value", row.profileName);
        option.innerHTML = row.profileName.charAt(0).toUpperCase() + row.profileName.slice(1);

        if (row.profileName === staffProfile)
            option.setAttribute("selected", "selected");

        profileDropdown.appendChild(option);
    });
}


// ====== Profile Listner ======
const newProfileBtn = document.getElementById("newProfile_btn");
newProfileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileForm.reset();
    Validation.resetCreateProfileForm();

    document.getElementById("createProfile_form").style.display = "table";
    document.getElementById("searchProfile_result").style.display = "none";
    document.getElementById("view_profile").style.display = "none";
});

// Add listener for create profile button
const createProfileForm = document.getElementById("createProfile_form");
createProfileForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();

    let checkValid = Validation.checkCreateProfileForm(createProfileForm);
    if (checkValid) {
        let result = await admin.createProfile(createProfileForm);
        
        let span = document.getElementById("createProfile_Out");
        span.innerHTML = result;
    }
});

const searchProfileForm = document.getElementById("searchProfile_form");
searchProfileForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("createProfile_form").style.display = "none";
    document.getElementById("searchProfile_result").style.display = "table";
    document.getElementById("view_profile").style.display = "none";

    const admin = new AdminUI();
    const searchResult = await admin.searchProfile(searchProfileForm, "all");

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

        tdUser.addEventListener("click", function (e) {
            document.getElementById("createProfile_form").style.display = "none";
            document.getElementById("searchProfile_result").style.display = "none";
            document.getElementById("view_profile").style.display = "table";

            sessionStorage.setItem("currentViewProfile", JSON.stringify(row));
            displayProfile(row);
        });
    });
});

// Add event listener for profile update form
const profileUpdateForm = document.getElementById("profileUpdate_form");
profileUpdateForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const admin = new AdminUI();
    let action = e.submitter.name;
    let formAction = false;
    let formMsg;
    let oldUserData = JSON.parse(sessionStorage.getItem("currentViewProfile"));

    // Suspend or Activate account
    if (action === "suspend") {
        formMsg = await admin.suspendProfile(profileUpdateForm, oldUserData.id);
        formAction = true;
    }
    // Update account
    else if (action === "update") {
        // Check for update
        let proceed = true;

        // Search if profile exist
        let result = await admin.searchProfile(profileUpdateForm, "exact");

        if (profileUpdateForm.profileName.value === oldUserData.profileName) {
            document.getElementById("updateOut").innerHTML = "No changes in profile name";
            proceed = false;
        }
        else if (result.length > 0) {
            document.getElementById("updateOut").innerHTML = "Profile name exist";
            proceed = false;
        }
        else {
            document.getElementById("updateOut").innerHTML = "";
        }
        
        if (proceed) { 
            await admin.updateProfile(profileUpdateForm, oldUserData.id);
            formMsg = "User account updated";
            formAction = true;
        };
    }

    if (formAction) {
        let searchResult = await admin.searchProfile(profileUpdateForm, "exact");
        // Update browser with updated details
        sessionStorage.setItem("currentViewUser", JSON.stringify((searchResult[0])));
        
        console.log(searchResult);

        displayProfile(searchResult[0]);
        document.getElementById("updateOut").innerHTML = formMsg;
    }
});

function displayProfile (data) {
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