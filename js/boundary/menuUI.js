import { GetMenuItemCtrl, GetMenuCatCtrl, CreateMenuItemCtrl, SearchMenuItemCtrl, UpdateMenuItemCtrl, SuspendMenuItemCtrl } from "../controller/menuController.js";

export class MenuUI {
    MAX_ORDER_QUANTITY = 10;

    async getMenuItems() {
        const menuController = new GetMenuItemCtrl();
        return await menuController.doGetAllMenuItems();
    }

    async getMenuCat() {
        const menuController = new GetMenuCatCtrl();
        return await menuController.doGetAllCat();
    }

    // Display menu table in index.html
    async displayMenu() {
        const menuTable = document.getElementById("menu_table");
        menuTable.innerHTML = "";
        
        let categories = await this.getMenuCat();
        let menuItems = await this.getMenuItems();
        sessionStorage.setItem("menuItem", JSON.stringify(menuItems))
    
        categories.forEach((cat) => {    
            const catHead = menuTable.insertRow();
            let th = document.createElement("th");
            th.setAttribute("class", "categoryTitle");
            th.setAttribute("colspan", 3);
            th.innerHTML = cat.catName;
            catHead.appendChild(th);
    
            let columnCount = 0;
            let tr;
            menuItems.forEach((items) => {
                if (cat.catID === items.itemCategory && items.itemStatus == true) {
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
                    itemTd.addEventListener("click", () => {
                        this.openOverlay(items);
                        const addToCartBtn = document.getElementById("overlay_addToCart");
                        addToCartBtn.addEventListener("click", function (e) {
                            e.preventDefault();
                            let cartOrder = (sessionStorage.getItem("cartOrder") != null) ? JSON.parse(sessionStorage.getItem("cartOrder")) : {};
                            let quantityOrdered = Number(document.getElementById("overlay_quantity").value);

                            if (items.id in cartOrder) {
                                if ((cartOrder[items.id] + quantityOrdered) > this.MAX_ORDER_QUANTITY)
                                    cartOrder[items.id] = this.MAX_ORDER_QUANTITY;
                                else
                                    cartOrder[items.id] = cartOrder[items.id] + quantityOrdered;
                            }
                            else {
                                cartOrder[items.id] = quantityOrdered;
                            }
    
                            sessionStorage.setItem("cartOrder", JSON.stringify(cartOrder));
                            document.getElementById("overlay_closeBtn").click();
                        }, {once : true});
                    });
                }
            });
        });
    }

    openOverlay(items) {
        document.getElementById("overlay_itemImage").innerHTML = items.itemImage;
        document.getElementById("overlay_itemName").innerHTML = items.itemName;
        document.getElementById("overlay_itemPrice").innerHTML = "$" + items.itemPrice.toFixed(2);
        document.getElementById("menuItem_overlay").style.height = "100%";
    }

    // ======= Plus and minus function to add quantity =======
    minus(quantityId) {
        let id = quantityId;
        let quantity = Number(document.getElementById(id).value) - 1;

        if (quantity < 1)
            quantity = 1;

        document.getElementById(id).value = quantity;
    }

    plus(quantityId) {
        let id = quantityId;
        let quantity = Number(document.getElementById(id).value) + 1;

        if (quantity > this.MAX_ORDER_QUANTITY)
            quantity = this.MAX_ORDER_QUANTITY;

        document.getElementById(id).value = quantity;
    }
    // =======================================================

    // =============== MANAGE MENU ITEMS =====================

    async createMenuItem(form) {
        const menuCtrl = new CreateMenuItemCtrl();

        let result = await menuCtrl.doCreateMenuItem(form.menuitemcategory.value, form.menuitemname.value,
            form.menuitemimagename.value, parseFloat(form.menuitemprice.value));

        let sysMsg;
        if (result) {
            form.reset();
            sysMsg = "Menu Item created";
        } else {
            sysMsg = "Menu Item name is taken";
        }

        document.getElementById("createMenuItem_out").innerHTML = sysMsg;
    }

    async updateMenuItem(form, menuItemID) {
        const menuCtrl = new UpdateMenuItemCtrl();

        return await menuCtrl.doUpdateMenuItem(form.itemCategory.value, form.imageName.value,
            form.itemName.value, parseFloat(form.itemPrice.value), menuItemID);
    }

    async suspendMenuItem(form, menuItemID) {
        const menuCtrl = new SuspendMenuItemCtrl();
        let acctStatus = (form.itemStatus.value.toLowerCase() === "activated") ? true : false;
        let result = await menuCtrl.doSuspendMenuItem(menuItemID, acctStatus);

        if (result) {
            return "Menu Item activated";
        } else {
            return "Menu Item suspended";
        }
    }    

    async searchMenuItem(form, searchData, searchType) {
        let name = form.itemName.value.toLowerCase();

        const searchCtrl = new SearchMenuItemCtrl();
        let searchResult = await searchCtrl.doSearchMenuItem(name, searchData);

        if (searchType === "search") {
            const viewTbl = document.getElementById("view_menuItem");
            viewTbl.innerHTML = "";

            const tbl = document.getElementById("searchMenuItem_result");
            tbl.innerHTML = ""; // Clear table

            // Add table header
            const trhead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "searchMenuItemResult_header");
            th.setAttribute("class", "searchMenuItemResult_header");
            th.innerHTML = "Search Result";
            trhead.appendChild(th);

            // Add table row for each result found
            searchResult.forEach((row) => {
                const tr = tbl.insertRow();
                const tdUser = tr.insertCell();
                tdUser.appendChild(document.createTextNode(row.itemName))
                tdUser.setAttribute("class", "viewMenuItem_row");

                tdUser.addEventListener("click", () => {
                    document.getElementById("searchMenuItem_result").style.display = "none";
                    document.getElementById("createMenuItemtable").style.display = "none";
                    document.getElementById("view_menuItem").style.display = "table";

                    sessionStorage.setItem("currentViewMenuItem", JSON.stringify(row));
                    this.displayMenuItem(row);
                });
                
            });
        }
        else {
            return searchResult;
        }
    }

    // Display selected menu item information
    displayMenuItem(data) {
        const tbl = document.getElementById("view_menuItem");
        tbl.innerHTML = ""; // Clear table

        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "viewMenuItem_header");
        th.setAttribute("class", "viewMenuItem_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Update Menu Item";
        trhead.appendChild(th);
        
        // Menu Item Category
        let tr = tbl.insertRow();
        let tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Category"));

        let tdValue = tr.insertCell();
        let selectField = document.createElement("select");
        selectField.setAttribute("name", "itemCategory");
        selectField.setAttribute("id", "viewMenuItem_category");
        this.displayCategoryDropDown(selectField, data.itemCategory);
        tdValue.appendChild(selectField);
        //================================================
        
        // Menu Item Name
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Name"));

        tdValue = tr.insertCell();
        let inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "itemName");
        inputField.setAttribute("id", "viewMenuItem_name");    
        inputField.setAttribute("value", data.itemName);
        inputField.setAttribute("oninput", "javascript: if (!/^[a-zA-Z0-9\s]+$/.test(this.value)) this.value = this.value.slice(0, (this.value.length-1));")
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        let errorField = document.createElement("span");
        errorField.setAttribute("id", "updateMenuItemNameError");
        tdValue.appendChild(errorField);
        //================================================

        // Menu Item Image Name
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Image Name"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "imageName");
        inputField.setAttribute("id", "viewMenuItem_imageName");    
        inputField.setAttribute("value", data.itemImage);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updateMenuItemImageNameError");
        tdValue.appendChild(errorField);
        //================================================

        // Price
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Price"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "number");
        inputField.setAttribute("name", "itemPrice");
        inputField.setAttribute("id", "viewMenuItem_price");    
        inputField.setAttribute("value", data.itemPrice);
        tdValue.appendChild(inputField);

        // Error message row
        tr = tbl.insertRow();
        tr.setAttribute("class", "errorRow");
        tr.insertCell();
        
        tdValue = tr.insertCell();
        errorField = document.createElement("span");
        errorField.setAttribute("id", "updateMenuItemPriceError");
        tdValue.appendChild(errorField);
        //================================================

        // Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Status"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "itemStatus");
        inputField.setAttribute("id", "viewMenuItem_status");
        inputField.setAttribute("style", "border:0;outline:none;");
        let status = (data.itemStatus) ? "Activated" : "Suspended";
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
        btn.setAttribute("id", "update_menuItem");
        btn.innerHTML = "Update";
        tdLeft.appendChild(btn);
        //===============================================

        // Suspend button - Right side
        let tdRight = tr.insertCell();

        btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "suspend");
        btn.setAttribute("id", "suspend");
        status = (data.itemStatus) ? "Suspend" : "Activate";
        btn.innerHTML = status;
        tdRight.appendChild(btn);
        //===============================================

        // Output for form
        tr = tbl.insertRow();
        let tdOutput = tr.insertCell();
        tdOutput.setAttribute("colspan", 2);
        tdOutput.setAttribute("id", "updateMenuItemOut");
        tdOutput.setAttribute("class", "updateMenuItemOut");
    }

    // Display profile in dropdown selection
    async displayCategoryDropDown(dropdownID, menuItemCategory = "") {
        let category = await this.getMenuCat();
        dropdownID.innerHTML = "";

        category.forEach((row) => {
            const option = document.createElement("option");
            option.setAttribute("value", row.catID);
            option.innerHTML = row.catName.charAt(0).toUpperCase() + row.catName.slice(1);

            if (row.catID === menuItemCategory)
                option.setAttribute("selected", "selected");

            dropdownID.appendChild(option);
        });    
    }
}