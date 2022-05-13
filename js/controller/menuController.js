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