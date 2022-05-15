// Use for adding external html into index.html
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }      
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
};

function openTab(tabName, elmnt) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(tabName).style.display = "block";
}

function loginLogout() {
    if (sessionStorage.getItem("loginStatus")) {
        sessionStorage.clear();
        document.location.href = "./index.html";
    }
    else {
        openTab("login", this);
    }
}

function checkUser() {
    let userDetailsTab = document.getElementById("viewUserDetailsTab");
    let manageUserAcctTab = document.getElementById("mngUsrAcctTab");
    let manageUserPrfTab = document.getElementById("mngUsrPrfTab");
    let manageOrderTab = document.getElementById("mngOrderTab");
    let couponCodeTab = document.getElementById("cpnCodeTab");
    let currentUserProfile = sessionStorage.getItem("userProfile");

    // Check login status
    if (sessionStorage.getItem("loginStatus")) {
        document.getElementById("loginTab").innerHTML = "Logout";
        
        // Set user details tab to be visible
        let name = document.createElement("span");
        name.style.textDecoration = "underline";
        name.innerHTML = sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname");
        userDetailsTab.innerHTML = "Welcome ";
        userDetailsTab.appendChild(name);
        userDetailsTab.style.display = "block";

        // Set login page to none
        // Make it unable to be viewed
        document.getElementById("login").style.display = "none";
    }
    else {
        document.getElementById("loginTab").innerHTML = "Login";
        userDetailsTab.innerHTML = "";
        userDetailsTab.style.display = "none";
    }

    // Check User Profile
    if (currentUserProfile === "admin") {
        // Toggling tabs between on/off
        // Only admin should see User Acct tab and User Profile tab
        manageUserAcctTab.style.display = "block";  
        manageUserPrfTab.style.display = "block";
    }
    else if (currentUserProfile === "staff") {
        // Toggling tabs between on/off
        // Only staff should see Order tab
        manageOrderTab.style.display = "block";  
    }
    else if (currentUserProfile === "manager") {
        // Toggling tabs between on/off
        // Only admin should see Manage menu item and coupon code tab
        couponCodeTab.style.display = "block";
    }
    else {
        manageUserAcctTab.style.display = "none";  
        manageUserPrfTab.style.display = "none";
        manageOrderTab.style.display = "none";
        couponCodeTab.style.display = "none";
    }
}