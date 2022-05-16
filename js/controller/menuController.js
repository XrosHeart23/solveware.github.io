import { MenuItem } from "../entity/menuItem.js";
import { MenuCategory } from "../entity/menuCategory.js";

// ========= Menu Item controller =========
// Get menu item controller
export class GetMenuItemCtrl {
    constructor() {
        this.menuItem = new MenuItem();
    }

    async doGetAllMenuItems() {
        return await this.menuItem.getAllMenuItems();
    }
}
// ========= End Menu Item controller =========


// ========= Menu Category controller =========
export class GetMenuCatCtrl {
    constructor() {
        this.menuCat = new MenuCategory();
    }

    async doGetAllCat() {
        return await this.menuCat.getAllCatName();
    }
}
// ========= End Menu Category controller =========


// ========= Manage Menu Item Controller ==========

// Create menu item controller
export class CreateMenuItemCtrl {
    constructor() {
        this.menuItem = new MenuItem()
    }

    async doCreateMenuItem(category, itemName, imageName, price) {
        let menuItemStatus = true; // Menu item status = True - Default setting when creating new menu item
        return await this.menuItem.addMenuItem(category, imageName, itemName, price, menuItemStatus);
    }
}

// Update menu item controller
export class UpdateMenuItemCtrl {
    constructor() {
        this.menuItem = new MenuItem();
    }

    async doUpdateMenuItem(category, imageName, itemName, price, menuItemID) {
        return await this.menuItem.updateMenuItem(category, imageName, itemName, price, menuItemID);
    }
}

export class SuspendMenuItemCtrl {
    constructor() {
        this.menuItem = new MenuItem();
    }

    async doSuspendMenuItem(menuItemID, status) {
        status = !status; // Toggle status boolean
        await this.menuItem.suspendMenuItem(menuItemID, status);

        return status;
    }
}

// Search menu item controller
export class SearchMenuItemCtrl {
    constructor() {
        this.menuItem = new MenuItem();
    }

    async doSearchMenuItem(name, searchData) {
        return await this.menuItem.searchMenuItem(name, searchData);
    }
}

/* Depecrated
export class MenuController {
    constructor() {
        this.menuItem = new MenuItem();
        this.menuCat = new MenuCategory();
    }

    async doGetAllMenuItems() {
        return await this.menuItem.getAllMenuItems();
    }

    async doGetAllCat() {
        return await this.menuCat.getAllCatName();
    }
}
*/