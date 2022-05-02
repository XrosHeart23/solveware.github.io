import { MenuItem } from "../entity/menuItem.js";
import { MenuCategory } from "../entity/menuCategory.js";

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