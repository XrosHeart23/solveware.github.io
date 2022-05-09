import { MenuController } from "../controller/menuController.js";

export class MenuUI {
    MAX_ORDER_QUANTITY = 10;

    constructor() {
        this.menuController = new MenuController();
    }

    async getMenuItems() {
        return await this.menuController.doGetAllMenuItems();
    }

    async getMenuCat() {
        return await this.menuController.doGetAllCat();
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
}