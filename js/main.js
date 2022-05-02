import { LoginUI } from "./boundary/loginUI.js";
import { AdminUI } from "./boundary/adminUI.js";
import { MenuUI } from "./boundary/menuUI.js";
import { OrdersUI } from "./boundary/ordersUI.js";
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


// ========== Menu functions ==========
const menu = document.getElementById("defaultOpen");
menu.addEventListener("click", async function (e) {
    e.preventDefault();

    displayMenuTable();
});
// Run this by default when page load to display menu
document.getElementById("defaultOpen").click();

async function displayMenuTable() {
    const menuTable = document.getElementById("menu_table");

    const menu = new MenuUI();
    let categories = await menu.getMenuCat();
    let menuItems = await menu.getMenuItems();

    sessionStorage.setItem("menuItem", JSON.stringify(menuItems))

    categories.forEach((cat) => {
        // console.log(cat);

        const catHead = menuTable.insertRow();
        let th = document.createElement("th");
        th.setAttribute("class", "categoryTitle");
        th.setAttribute("colspan", 3);
        th.innerHTML = cat.catName;
        catHead.appendChild(th);

        let columnCount = 0;
        let tr;
        menuItems.forEach((items) => {
            if (cat.catID === items.itemCategory) {
                if (columnCount == 0) {
                    tr = menuTable.insertRow();
                }     
                const itemTd = tr.insertCell();
                
                // Add item image
                let menuImage = document.createElement("div");
                menuImage.setAttribute("class", "itemImage");
                menuImage.innerHTML = items.itemImage;
                itemTd.appendChild(menuImage);

                // Add item name
                let menuName = document.createElement("div");
                menuName.setAttribute("class", "itemName");
                menuName.innerHTML = items.itemName;
                itemTd.appendChild(menuName);

                // Add item price
                let menuPrice = document.createElement("div");
                menuPrice.setAttribute("class", "itemPrice");
                menuPrice.innerHTML = "$" + items.itemPrice.toFixed(2);
                itemTd.appendChild(menuPrice);

                columnCount += 1;
                if (columnCount == 3)
                    columnCount = 0;

                // Temporary listener to add item to cart
                itemTd.addEventListener("click", function (e) {
                    let cartOrder = (sessionStorage.getItem("cartOrder") != null) ? JSON.parse(sessionStorage.getItem("cartOrder")) : {};

                    cartOrder[items.id] = (items.id in cartOrder) ? cartOrder[items.id] + 1 : 1;
                    sessionStorage.setItem("cartOrder", JSON.stringify(cartOrder));
                });
            }
        });
    });
}

// ====== End of Menu functions =======


// ========== Cart functions ==========
// Display cart
const cartBtn = document.getElementById("cartTab");
cartBtn.addEventListener("click", async function(e) {
    e.preventDefault();

    displayCart();
});

const cartForm = document.getElementById("cart_form");
cartForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("cart").style.display = "none";
    document.getElementById("payment").style.display = "block";

    document.getElementById("payment_totalPrice").setAttribute("value", cartForm.totalPrice.value);
});

// Display cart function
function displayCart() {
    const cartTable = document.getElementById("viewCart_tbody");
    cartTable.innerHTML = "";
    const cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
    const menuItem = JSON.parse(sessionStorage.getItem("menuItem"));

    let totalPrice = 0;
    if (JSON.parse(sessionStorage.getItem("cartOrder")) != null) {
        for (const [key, value] of Object.entries(cartOrder)) {
            let item;
            for (const itm of menuItem) {
                if (itm.id === key) {
                    item = itm;
                    break;
                }
            }
            const itemRow = cartTable.insertRow();
            const nameTd = itemRow.insertCell();
            nameTd.setAttribute("class", "itemName");
            nameTd.innerHTML = item.itemName;
    
            const priceTd = itemRow.insertCell();
            priceTd.setAttribute("class", "itemPrice");
            priceTd.innerHTML = "$" + item.itemPrice.toFixed(2);
    
            const quantityTd = itemRow.insertCell();
            quantityTd.setAttribute("class", "itemQuantity");
            quantityTd.innerHTML = value;
    
            const removeTd = itemRow.insertCell();
            removeTd.setAttribute("class", "itemRemove");
            removeTd.setAttribute("id", item.id);
            removeTd.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    
            totalPrice += item.itemPrice * value;
        }
    
        const totalPriceRow = cartTable.insertRow();
        const priceLabel = totalPriceRow.insertCell();
        priceLabel.setAttribute("class", "itemTotalPriceLabel");
        priceLabel.innerHTML = "Total Price:";
    
        const totalPriceTd = totalPriceRow.insertCell();
        totalPriceTd.setAttribute("class", "totalPrice");
        totalPriceTd.innerHTML = "$" + totalPrice.toFixed(2);
        const totalPriceInput = document.createElement("input");
        totalPriceInput.setAttribute("name", "totalPrice");
        totalPriceInput.setAttribute("value", totalPrice.toFixed(2));
        totalPriceInput.setAttribute("style", "display:none");
        totalPriceTd.appendChild(totalPriceInput);
    
        // Remove item from cart
        const removeBtn = document.getElementsByClassName("itemRemove");
        Array.from(removeBtn).forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                delete cartOrder[btn.id];
                sessionStorage.setItem("cartOrder", JSON.stringify(cartOrder));
                displayCart();
            })
        });
    }
}

// ====== End of Cart functions =======


// ======== Payment functions =========
const paymentForm = document.getElementById("payment_form");
paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const order = new OrdersUI();
    const checkValid = Validation.checkPaymentForm(paymentForm);

    if (checkValid){
        await order.createOrder(paymentForm);
        sessionStorage.removeItem("cartOrder");
        document.location.href = "./index.html";
    }
        
    // TODO: Include a popup that say payment successful
});

// ===== End of Payment functions =====


// ====== Time tracking function ======
// !!!!DO NOT TOUCH!!!!
window.timeSpent = 0;
window.onload = function () {
    window.timer = setInterval(function () {
        timeSpent += 1;
    }, 1000)
}
// ==== End of trackiong functions ====