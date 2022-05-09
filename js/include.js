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
        document.location.href="./index.html";
    }
    else {
        openTab("login", this);
    }
}

function checkUser() {
    // Check login status
    if (sessionStorage.getItem("loginStatus"))
        document.getElementById("loginTab").innerHTML = "Logout";
    else
        document.getElementById("loginTab").innerHTML = "Login";

    // Check User Profile
    if (sessionStorage.getItem("userProfile") === "admin"){
        // Toggling tabs between on/off/
        // Only admin should see User Acct tab and User Profile tab
        document.getElementById("mngUsrAcctTab").style.display = "block";  
        document.getElementById("mngUsrPrfTab").style.display = "block";  

        // Set login page to none
        // Make it unable to be viewed
        document.getElementById("login").style.display = "none";
    }
    else if (sessionStorage.getItem("userProfile") === "staff"){
        // Toggling tabs between on/off/
        // Only admin should see User Acct tab and User Profile tab
        document.getElementById("mngOrderTab").style.display = "block";  

        // Set login page to none
        // Make it unable to be viewed
        document.getElementById("login").style.display = "none";        
    }
    else {
        document.getElementById("mngUsrAcctTab").style.display = "none";  
        document.getElementById("mngUsrPrfTab").style.display = "none";
        document.getElementById("mngOrderTab").style.display = "none";  
    }
}