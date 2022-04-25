import { UserUI } from "./js/boundary/userUI.js";
import { AdminUI } from "./js/boundary/adminUI.js";


// Add event listener for login click button
const loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const userLogin = new UserUI(loginForm.username.value, loginForm.password.value);
    let result = await userLogin.loginUser();

    console.log(userLogin.getUserInfo);

    let span = document.getElementById("loginUser_Out");
    span.innerHTML = result;

    // Get user info
    if (userLogin.getLoginStatus) {

        // TODO: After login need to reload page to homepage (index.html)
        // Store user login info into browser session
        for (const [key, value] of Object.entries(userLogin.getUserInfo)) {
            sessionStorage.setItem(key, value);
        }
    }
});


// Add event listener for create new user button
const createUserForm = document.getElementById("createUser_form");

createUserForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();
    let result = await admin.createAcct(createUserForm);

    let span = document.getElementById("createUser_Out");
    span.innerHTML = result;
});


// Add event listener for suspend user button
const deleteForm = document.getElementById("delete_form");

deleteForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();
    let result = await admin.suspendAcct(deleteForm);

    let span = document.getElementById("delete_Out");
    span.innerHTML = result;
});


// Add event listener for search function
const searchForm = document.getElementById("search_form");
let searchResult;

searchForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    const admin = new AdminUI();
    searchResult = await admin.searchAcct(searchForm);

    //console.log(searchResult);

    const viewTbl = document.getElementById("view_user");
    viewTbl.innerHTML = "";

    const tbl = document.getElementById("search_result");
    tbl.innerHTML = ""; // Clear table
    searchResult.forEach((row) => {
        const tr = tbl.insertRow();
        const tdUser = tr.insertCell();
        tdUser.appendChild(document.createTextNode(row.fname + " " + row.lname))

        const tdView = tr.insertCell();
        const viewBtn = document.createElement("button");
        viewBtn.setAttribute("id", "viewUser_btn");
        viewBtn.setAttribute("type", "submit");
        viewBtn.setAttribute("value", row.id);
        viewBtn.innerHTML = "View User";
        tdView.appendChild(viewBtn);

        //viewBtn = document.getElementById("viewUser_btn");
        viewBtn.addEventListener("click", function (e) {
            displayUser(row);
        });
    });
});

// Display user information
function displayUser(data) {
    const tbl = document.getElementById("view_user");
    tbl.innerHTML = ""; // Clear table

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
    //================================================

    // User Profile
    tr = tbl.insertRow();
    tdKey = tr.insertCell();
    tdKey.appendChild(document.createTextNode("User Profile"));

    tdValue = tr.insertCell();
    let selectField = document.createElement("select");
    selectField.setAttribute("name", "profile");
    selectField.setAttribute("id", "viewUser_profile");
    displayProfile(selectField);
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
}

const updateForm = document.getElementById("update_form");
updateForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const admin = new AdminUI();
    let action = e.submitter.name;

    // Suspend or Activate account
    if (action === "suspend") {
        await admin.suspendAcct(updateForm);
    }
    // Update account
    else if (action === "update") {
        await admin.updateAcct(updateForm);
    }

    let searchResult = await admin.searchAcct(updateForm);
    // Update browser with updated details
    displayUser(searchResult[0]);
});


async function displayProfile(dropdownID) {
    const profileDropdown = dropdownID;
    const admin = new AdminUI();
    let searchProfile = await admin.searchProfile();

    searchProfile.forEach((row) => {
        const option = document.createElement("option");
        option.setAttribute("value", row.profileName);
        option.innerHTML = row.profileName.charAt(0).toUpperCase() + row.profileName.slice(1);

        profileDropdown.appendChild(option);
    });
}

const createDropdown = document.getElementById("createUser_profile");
createDropdown.addEventListener("load", displayProfile(createDropdown));