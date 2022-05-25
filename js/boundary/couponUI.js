import { CreateCouponCtrl, SearchCouponCtrl, SuspendCouponCtrl, UpdateCouponCtrl } from "../controller/couponController.js";
import { GetMenuCatCtrl } from "../controller/menuController.js";



export class CouponUI {
    // Create coupon code
    async createCouponCode(form) {
        const couponController = new CreateCouponCtrl();
        let result = await couponController.doCreateCoupon(form.couponCode.value.toUpperCase(), form.discount.value, form.category.value);

        let sysMsg;
        if (result) {
            form.reset();
            sysMsg = "Coupon code created";
        }
        else {
            sysMsg = "Coupon code is taken";
        }

        document.getElementById("createCoupon_Out").innerHTML = sysMsg;
    }


    // Search coupon code
    async searchCouponCode(form, searchType) {
        const couponController = new SearchCouponCtrl();
        const searchResult = await couponController.doSearchCoupon(form.couponCode.value, searchType)

        if (searchType === "search") {
            this.displaySearchResult(searchResult);
        }
        else if (searchType === "exact") {
            return searchResult;
        }
    }


    // Update coupon code
    async updateCouponCode(form) {
        const currentViewCoupon = JSON.parse(sessionStorage.getItem("currentViewCoupon"));
        let checkSameCoupon = (currentViewCoupon.couponCode === form.couponCode.value.toUpperCase()) ? true : false;

        const couponController = new UpdateCouponCtrl();
        let sysMsg;
        if (checkSameCoupon) {
            await couponController.doUpdateCoupon(form.couponCode.value.toUpperCase(),
                form.discount.value, form.category.value, currentViewCoupon.id);
            sysMsg = "Coupon Code have been updated";
        }
        else {
            let searchResult = await this.searchCouponCode(form, "exact");
            
            if (searchResult.length == 0) {
                await couponController.doUpdateCoupon(form.couponCode.value.toUpperCase(),
                    form.discount.value, form.category.value, currentViewCoupon.id);
                
                searchResult = await this.searchCouponCode(form, "exact");
                sessionStorage.setItem("currentViewCoupon",  JSON.stringify(searchResult[0]));
                sysMsg = "Coupon Code have been updated";
            }
            else {
                sysMsg = "Coupon code have been taken";
            }
        }

        document.getElementById("coupon_updateOut").innerHTML = sysMsg;
    }


    // Suspend and Activate coupon code
    async suspendCouponCode(form) {
        const couponController = new SuspendCouponCtrl();
        

        let couponStatus = (form.status.value.toLowerCase() === "activated") ? true : false;
        let result = await couponController.doSuspendCoupon(form.couponCode.value.toUpperCase(), couponStatus);
        let sysMsg;
        if (result) {
            sysMsg = "Coupon code activated";
        }
        else {
            sysMsg = "Coupon code suspended";
        }

        const searchResult = await this.searchCouponCode(form, "exact");
        sessionStorage.setItem("currentViewCoupon", JSON.stringify(searchResult[0]));
        this.displayCouponCode(searchResult[0]);
        document.getElementById("coupon_updateOut").innerHTML = sysMsg;
    }


    // Display search result
    displaySearchResult(data) {
        // Clear coupon code data in view table
        const viewTbl = document.getElementById("view_coupon");
        viewTbl.innerHTML = "";

        // Clear search result data
        const tbl = document.getElementById("searchCoupon_result");
        tbl.innerHTML = "";

        // Add table header
        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "searchCoupon_header");
        th.setAttribute("class", "searchCoupon_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Search Result";
        trhead.appendChild(th);

        let tr = tbl.insertRow();
        tr.setAttribute("class", "tableHead");
        let tdCoupon = tr.insertCell();
        tdCoupon.appendChild(document.createTextNode("Coupon Code"));
        tdCoupon = tr.insertCell();
        tdCoupon.appendChild(document.createTextNode("Coupon Status"));

        // Add table row for each search result found
        data.forEach((row) => {
            tr = tbl.insertRow();
            tr.setAttribute("class", "viewCoupon_row");
            const tdCoupon = tr.insertCell();
            tdCoupon.setAttribute("class", "viewCoupon_row");
            tdCoupon.appendChild(document.createTextNode(row.couponCode));

            const tdStatus = tr.insertCell();
            let couponStatus = (row.couponStatus) ? "Activate" : "Suspended";
            tdStatus.setAttribute("class", "viewCoupon_row");
            tdStatus.appendChild(document.createTextNode(couponStatus));

            tr.addEventListener("click", () => {
                document.getElementById("searchCoupon_result").style.display = "none";
                document.getElementById("view_coupon").style.display = "table";

                sessionStorage.setItem("currentViewCoupon", JSON.stringify(row));
                this.displayCouponCode(row);
            })
        })
    }

    // Display coupon code
    displayCouponCode(data) {
        // Clear coupon code view table
        const tbl = document.getElementById("view_coupon");
        tbl.innerHTML = "";

        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "viewCoupon_header");
        th.setAttribute("class", "viewCoupon_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Coupon Code Details";
        trhead.appendChild(th);

        // Coupon Code
        let tr = tbl.insertRow();
        let tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Coupon Code"));

        let tdValue = tr.insertCell();
        let inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "couponCode");
        inputField.setAttribute("id", "view_couponCode");
        inputField.setAttribute("oninput", "javascript: if (!/^[a-zA-Z0-9]+$/.test(this.value)) this.value = this.value.slice(0, (this.value.length-1));");
        inputField.setAttribute("value", data.couponCode);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.setAttribute("id", "updateCouponCodeErrorRow");
        tr.setAttribute("style", "display:none");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        let errorField = document.createElement("span");
        errorField.setAttribute("id", "updateCouponCodeError");
        tdValue.appendChild(errorField);
        //================================================

        // Category
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Category"));

        tdValue = tr.insertCell();
        inputField = document.createElement("select");
        inputField.setAttribute("name", "category");
        inputField.setAttribute("id", "view_category");
        tdValue.appendChild(inputField)
        this.displayCategoryDropdown("view_category", data.catID);
        
        // Discount
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Discount"));
        
        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "number");
        inputField.setAttribute("name", "discount");
        inputField.setAttribute("id", "view_discount");
        inputField.setAttribute("maxlength", 3);
        inputField.setAttribute("oninput", "javascript: if (this.value > 100) this.value = 100; if (this.value < 0) this.value = 0; if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);");
        inputField.setAttribute("value", data.discount*100);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.setAttribute("id", "updateDiscountErrorRow");
        tr.setAttribute("style", "display:none");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updateDiscountError");
        tdValue.appendChild(errorField);
        //================================================

        // Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Coupon Status"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "status");
        inputField.setAttribute("id", "view_status");
        let couponStatus = (data.couponStatus) ? "Activated" : "Suspended";
        inputField.setAttribute("value", couponStatus);
        inputField.readOnly = true;
        tdValue.appendChild(inputField);


        tr = tbl.insertRow();
        // Update button
        let tdUpdateBtn = tr.insertCell();
        inputField = document.createElement("button");
        inputField.setAttribute("type", "submit");
        inputField.setAttribute("name", "update");
        inputField.setAttribute("id", "updateCoupon_btn");
        inputField.setAttribute("class", "updateCouponBtn default");
        inputField.innerHTML = "Update";
        tdUpdateBtn.appendChild(inputField);

        // Suspend/Activate button
        let tdStatusBtn = tr.insertCell();
        inputField = document.createElement("button");
        inputField.setAttribute("type", "submit");
        inputField.setAttribute("name", "suspend");
        inputField.setAttribute("id", "updateStatus_btn");
        inputField.setAttribute("class", "updateCouponBtn default");
        couponStatus = (data.couponStatus) ? "Suspend" : "Activate";
        inputField.innerHTML = couponStatus;
        tdStatusBtn.appendChild(inputField);

        // Output for form
        tr = tbl.insertRow();
        let tdOutput = tr.insertCell();
        tdOutput.setAttribute("colspan", 2);
        tdOutput.setAttribute("id", "coupon_updateOut");
        tdOutput.setAttribute("class", "coupon_updateOut");
    }

    async displayCategoryDropdown(dropdownId, optionSelected = "") {
        const dropdown = document.getElementById(dropdownId);
        const menuController = new GetMenuCatCtrl();

        let allCat = await menuController.doGetAllCat();

        allCat.forEach((row) => {
            const option = document.createElement("option");
            option.setAttribute("value", row.catID);
            option.innerHTML = row.catName.charAt(0).toUpperCase() + row.catName.slice(1);

            if (row.catID === optionSelected) {
                option.setAttribute("selected", "selected");
            }

            dropdown.appendChild(option);
        });

        const option = document.createElement("option");
        option.setAttribute("value", "all");
        option.innerHTML = "All";
        dropdown.appendChild(option);
        if (optionSelected === "all") {
            option.setAttribute("selected", "selected");
        }

    }
}