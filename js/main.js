import { LoginUI } from "./boundary/loginUI.js";
import { AdminUI } from "./boundary/adminUI.js";
import { MenuUI } from "./boundary/menuUI.js";
import { CartUI } from "./boundary/cartUI.js";
import { OrdersUI } from "./boundary/ordersUI.js";
import { CouponUI } from "./boundary/couponUI.js";
import { ReportUI } from "./boundary/reportUI.js";
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

// Add event listern for user profile tab (When user login they can view their profile details)
const viewUserDetails = document.getElementById("viewUserDetailsTab");
viewUserDetails.addEventListener("click", async function (e) {
    e.preventDefault();

    document.getElementById("userDetails_name").value = sessionStorage.getItem("username");
    document.getElementById("userDetails_password").value = sessionStorage.getItem("password");
    document.getElementById("userDetails_fname").value = sessionStorage.getItem("fname");
    document.getElementById("userDetails_lname").value = sessionStorage.getItem("lname");
    document.getElementById("userDetails_profile").value = sessionStorage.getItem("userProfile");
    document.getElementById("userDetails_status").value = (sessionStorage.getItem("acctStatus")) ? "Activated" : "Suspended"; 
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
const menuPage = document.getElementById("defaultOpen");
menuPage.addEventListener("click", async function (e) {
    e.preventDefault();
    const menu = new MenuUI();
    menu.displayMenu();
});
// Run this by default when page load to display menu
document.getElementById("defaultOpen").click();

// Close overlay
const closeOverlayBtn = document.getElementById("overlay_closeBtn");
closeOverlayBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("menuItem_overlay").style.height = "0%";
    document.getElementById("overlay_quantity").value = 1;
});

const overlayMinusBtn = document.getElementById("overlay_minus");
overlayMinusBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const menu = new MenuUI();
    menu.minus("overlay_quantity");
});

const overlayPlusBtn = document.getElementById("overlay_plus");
overlayPlusBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const menu = new MenuUI();
    menu.plus("overlay_quantity");
});
// ====== End of Menu functions =======


// ========== Cart functions ==========
// Display cart
const cartBtn = document.getElementById("cartTab");
cartBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    const cart = new CartUI();
    cart.displayCart();
});

const cartForm = document.getElementById("cart_form");
cartForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let cartOrder = (sessionStorage.getItem("cartOrder") == null) ? {} : JSON.parse(sessionStorage.getItem("cartOrder"));
    if (Object.keys(cartOrder).length > 0) {
        document.getElementById("cartErr").innerHTML = "";
        document.getElementById("cart").style.display = "none";
        document.getElementById("payment").style.display = "block";

        let totalPrice = Number(cartForm.totalPrice.value);
        document.getElementById("payment_totalPrice").setAttribute("value", totalPrice.toFixed(2));
    }
    else {
        document.getElementById("cartErr").innerHTML = "Please add item to cart before making payment"
    }
});

const couponApplyBtn = document.getElementById("cartCoupon_apply");
couponApplyBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const cart = new CartUI();
    await cart.applyCouponCode(cartForm);
});

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
        alert("Payment success");
    }
});

// ===== End of Payment functions =====


// ========== Manage Order functions ==========

const searchOrderForm = document.getElementById("searchOrder_form");
searchOrderForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("searchOrder_result").style.display = "table";
    document.getElementById("view_order").style.display = "none";
    document.getElementById("viewCart_Table").style.display = "none";


    const order = new OrdersUI();
    await order.searchOrder(searchOrderForm, "phoneNumber", "search");
});

const orderUpdateForm = document.getElementById("order_form");
orderUpdateForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let currentViewOrder = JSON.parse(sessionStorage.getItem("currentViewOrder"));

    const order = new OrdersUI();
    order.closeOrderTicket(currentViewOrder.id);
});

orderUpdateForm.addEventListener("change", async function (e) {
    let ticketButton = document.getElementById("close_ticket");
    let closeOption = document.getElementById("order_status");
    ticketButton.style.display = (closeOption.value === "completed") ? 'block' : 'none';
    let oldOrderData = JSON.parse(sessionStorage.getItem("currentViewOrder"));

    const order = new OrdersUI();
    await order.updateOrderStatus(orderUpdateForm, oldOrderData.id);
});    
// ====== End of Manage Order functions =======

// ====== Manage Menu Item functions ==========
// Add event listener for create new user button
const createMenuItemForm = document.getElementById("createMenuItem_form");
createMenuItemForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    let checkValid = Validation.checkCreateMenuItemForm(createMenuItemForm);
    if (checkValid) {
        const menu = new MenuUI();
        await menu.createMenuItem(createMenuItemForm);
    }
});

const createMenuItemDropdown = document.getElementById("createMenuItem_category");
const newMenuItemBtn = document.getElementById("newMenuItem_btn");
newMenuItemBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const menu = new MenuUI();

    createMenuItemForm.reset();
    menu.displayCategoryDropDown(createMenuItemDropdown); // Display profile dropdown in create user
    Validation.resetCreateMenuItemForm();

    document.getElementById("createMenuItemtable").style.display = "table";
    document.getElementById("searchMenuItem_result").style.display = "none";
    document.getElementById("view_menuItem").style.display = "none";
});

// Add event listener for search function
const searchMenuItemForm = document.getElementById("search_menuItemForm");
searchMenuItemForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop page from changing
    document.getElementById("searchMenuItem_result").style.display = "table";
    document.getElementById("createMenuItemtable").style.display = "none";
    document.getElementById("view_menuItem").style.display = "none";

    const menu = new MenuUI();
    await menu.searchMenuItem(searchMenuItemForm, "name", "search");    
});

// Add event listener for update form
const updateMenuItemForm = document.getElementById("updateMenuItem_form");
updateMenuItemForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const menu = new MenuUI();
    let action = e.submitter.name;
    let formAction = false;
    let formMsg;
    let oldMenuItemData = JSON.parse(sessionStorage.getItem("currentViewMenuItem"));

    // Suspend or Activate account
    if (action === "suspend") {
        formMsg = await menu.suspendMenuItem(updateMenuItemForm, oldMenuItemData.id);
        formAction = true;
    }
    // Update account
    else if (action === "update") {
        // Check for update
        let validation = Validation.checkUpdateMenuItemForm(updateMenuItemForm, oldMenuItemData);
        let proceed = false;

        // Search if username exist
        if (validation == 1) {
            let searchResult = await menu.searchMenuItem(updateMenuItemForm, "username", "update");
            if (searchResult.length > 0) {
                document.getElementById("updateMenuItemOut").innerHTML = "Item name taken";
            } else {
                proceed = true;
                document.getElementById("updateMenuItemOut").innerHTML = "";
            }
        } else if (validation == 2){
            proceed = true;
        }
        
        if (proceed) { 
            await menu.updateMenuItem(updateMenuItemForm, oldMenuItemData.id);
            formMsg = "Menu Item updated";
            formAction = true;
        };
    }

    if (formAction) {
        let searchResult = await menu.searchMenuItem(updateMenuItemForm, "username", "update");
        // Update browser with updated details
        sessionStorage.setItem("currentViewMenuItem", JSON.stringify((searchResult[0])));
        
        menu.displayMenuItem(searchResult[0]);
        document.getElementById("updateMenuItemOut").innerHTML = formMsg;
    }
});
// ====== End Manage Menu Item functions ==========


// ====== Coupon Code functions ======
const couponCodeForm = document.getElementById("createCoupon_form");
couponCodeForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    let checkValid = Validation.checkNewCouponForm(couponCodeForm);
    if (checkValid) {
        const coupon = new CouponUI();
        await coupon.createCouponCode(couponCodeForm);
    }
});

const newCouponCodeBtn = document.getElementById("newCouponCode_btn");
newCouponCodeBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    //Display new coupon code form table
    document.getElementById("createCouponTable").style.display = "table";
    document.getElementById("searchCoupon_result").style.display = "none";
    document.getElementById("view_coupon").style.display = "none";
    couponCodeForm.reset(); // Form whenever new coupoon code button is clicked

    const coupon = new CouponUI();
    await coupon.displayCategoryDropdown("createCoupon_category");
});

const searchCouponForm = document.getElementById("searchCoupon_form");
searchCouponForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    document.getElementById("searchCoupon_result").style.display = "table";
    document.getElementById("view_coupon").style.display = "none";
    document.getElementById("createCouponTable").style.display = "none";

    const coupon = new CouponUI();
    await coupon.searchCouponCode(searchCouponForm, "search");
});

const updateCouponForm = document.getElementById("updateCoupon_form");
updateCouponForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const coupon = new CouponUI();
    let action = e.submitter.name;

    if (action === "update") {
        let checkValid = Validation.checkUpdateCouponForm(updateCouponForm);
        if (checkValid) {
            
            await coupon.updateCouponCode(updateCouponForm);
        }
    }
    else if (action === "suspend") {
        await coupon.suspendCouponCode(updateCouponForm);
    }
});
// ====== End of Coupon Code functions ======


// ====== Generate Report functions ======
const reportBtn = document.getElementById("reportTab");
reportBtn.addEventListener("click", async function(e) {
    e.preventDefault();

    document.getElementById("generateReportTable").style.display = "table";
    document.getElementById("generateReport_form").reset();
    document.getElementById("displayTableByOptions").innerHTML = "";
    document.getElementById("reportSubmitBtn").style.display = "none";
    document.getElementById("report_result").style.display = "none";
});

const reportTypeDropdown = document.getElementById("reportType");
reportTypeDropdown.addEventListener("change", async function(e) {
    e.preventDefault();
    
    const report = new ReportUI();
    await report.displayReportFormTable(reportTypeDropdown.value);
});

const reportForm = document.getElementById("generateReport_form");
reportForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const report = new ReportUI();
    await report.generateReport(reportForm);
});

// ====== End Generate Report functions ======










// ====== Time tracking function ======
// ALWAYS MAKE SURE ITS AT THE BOTTOM OF THE CODES
// !!!!DO NOT TOUCH!!!!
window.timeSpent = 0;
window.timer = setInterval(function () {
    timeSpent += 1;
    // console.log("Timespent : " + timeSpent);
}, 1000);
// ==== End of trackiong functions ====