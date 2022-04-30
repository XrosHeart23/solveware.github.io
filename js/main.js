import { LoginUI } from "./boundary/loginUI.js";
import { AdminUI } from "./boundary/adminUI.js";
import * as Validation from "./validation.js";

// Add event listener for login click button
const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing

    let checkValid = Validation.checkLoginForm(loginForm);
    if (checkValid) {
        const userLogin = new LoginUI(loginForm);
        await userLogin.loginUser();
    }
});

// ====== Account Listner ======
// Add event listener for create new user button
const createUserForm = document.getElementById("createUser_form");
createUserForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    let checkValid = Validation.checkCreateUserForm(createUserForm);
    if (checkValid) {
        const admin = new AdminUI();
        await admin.createAcct(createUserForm);
    }
});

const createDropdown = document.getElementById("createUser_profile");
const newAccountBtn = document.getElementById("newAccount_btn");
newAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const admin = new AdminUI();

    createUserForm.reset();
    admin.displayProfileDropDown(createDropdown); // Display profile dropdown in create user
    Validation.resetCreateForm();

    document.getElementById("createusertable").style.display = "table";
    document.getElementById("search_result").style.display = "none";
    document.getElementById("view_user").style.display = "none";
});

// Add event listener for search function
const searchForm = document.getElementById("search_form");
searchForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    document.getElementById("search_result").style.display = "table";
    document.getElementById("createusertable").style.display = "none";
    document.getElementById("view_user").style.display = "none";

    const admin = new AdminUI();
    await admin.searchAcct(searchForm, "name", "search");    
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
        let validation = Validation.checkUpdateForm(updateForm, oldUserData);
        let proceed = false;

        // Search if username exist
        if (validation == 1) {
            let searchResult = await admin.searchAcct(updateForm, "username", "update");
            if (searchResult.length > 0) {
                document.getElementById("updateOut").innerHTML = "Username taken";
            } else {
                proceed = true;
                document.getElementById("updateOut").innerHTML = "";
            }
        } else if (validation == 2){
            proceed = true;
        }
        
        if (proceed) { 
            await admin.updateAcct(updateForm, oldUserData.id);
            formMsg = "User account updated";
            formAction = true;
        };
    }

    if (formAction) {
        let searchResult = await admin.searchAcct(updateForm, "username", "update");
        // Update browser with updated details
        sessionStorage.setItem("currentViewUser", JSON.stringify((searchResult[0])));
        
        admin.displayUser(searchResult[0]);
        document.getElementById("updateOut").innerHTML = formMsg;
    }
});
// ====== End of Account Listner ======


// ====== Profile Listner ======
const newProfileBtn = document.getElementById("newProfile_btn");
newProfileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileForm.reset();
    Validation.resetCreateProfileForm();

    document.getElementById("createProfileTable").style.display = "table";
    document.getElementById("searchProfile_result").style.display = "none";
    document.getElementById("view_profile").style.display = "none";
});

// Add listener for create profile button
const createProfileForm = document.getElementById("createProfile_form");
createProfileForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    let checkValid = Validation.checkCreateProfileForm(createProfileForm);
    if (checkValid) {
        const admin = new AdminUI();
        await admin.createProfile(createProfileForm);
    }
});

const searchProfileForm = document.getElementById("searchProfile_form");
searchProfileForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("createProfileTable").style.display = "none";
    document.getElementById("searchProfile_result").style.display = "table";
    document.getElementById("view_profile").style.display = "none";

    const admin = new AdminUI();
    await admin.searchProfile(searchProfileForm, "all", "search");
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

        let validation = Validation.checkUpdateProfileForm(profileUpdateForm);
        if (validation) {
            // Search if profile exist
            let result = await admin.searchProfile(profileUpdateForm, "exact");
        
            if(profileUpdateForm.profileName.value.toLowerCase() === oldUserData.profileName.toLowerCase()) {
                document.getElementById("updateOut").innerHTML = "No change in profile name";
                proceed = false;
            }
            else if (result.length > 0) {
                document.getElementById("updateOut").innerHTML = "Profile name exist";
                proceed = false;
            }
            else {
                document.getElementById("updateOut").innerHTML = "";
            }
        } else {
            document.getElementById("updateOut").innerHTML = "";
            proceed = false;
        }


        if (proceed) { 
            await admin.updateProfile(profileUpdateForm, oldUserData.id);
            formMsg = "Profile name updated";
            formAction = true;
        };
    }

    if (formAction) {
        let searchResult = await admin.searchProfile(profileUpdateForm, "exact");
        // Update browser with updated details
        sessionStorage.setItem("currentViewUser", JSON.stringify((searchResult[0])));

        admin.displayProfile(searchResult[0]);
        document.getElementById("updateOut").innerHTML = formMsg;
    }
});
// ====== End of Profile Listner ======