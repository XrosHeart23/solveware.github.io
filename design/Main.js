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

function openTab(tabName,elmnt) {
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
  var loginstatus = document.getElementById("LoginTab").innerHTML;

  if (loginstatus == "Logout"){
    document.getElementById("MngUsrAcctTab").style.display = "none";  
    document.getElementById("MngUsrPrfTab").style.display = "none";  
    document.getElementById("LoginTab").innerHTML = "Login";
    openTab("Menu", this);
    user = "nouser";
  }
  else {
    openTab("Login", this);
  }
}

function changeUser() {
  user = "admin";
}

function checkUser(){
  if (user == "admin"){
    document.getElementById("MngUsrAcctTab").style.display = "block";  
    document.getElementById("MngUsrPrfTab").style.display = "block";  
    document.getElementById("Menu").style.display = "block";
    document.getElementById("WelcomeDisplay").style.display = "block";
    document.getElementById("Login").style.display = "none";
    document.getElementById("LoginTab").innerHTML = "Logout";
  }
}

function hideTable(idtohide, idtoshow){
  document.getElementById(idtohide).style.display = "none";
  document.getElementById(idtoshow).style.display = "block";
}