import { MenuController } from "../controller/menuController.js";

export class MenuUI {
    constructor() {
        this.menuController = new MenuController();
    }

    async getMenuItems() {
        return await this.menuController.doGetAllMenuItems();
    }

    async getMenuCat() {
        return await this.menuController.doGetAllCat();
    }
}