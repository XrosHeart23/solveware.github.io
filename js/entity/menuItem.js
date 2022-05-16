import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";
import { MenuCategory } from "./menuCategory.js";

export class MenuItem {
    #menuTable = "menuItem";

    constructor() {
        this.menuCategory = new MenuCategory();
    }

    async getAllMenuItems() {
        const qry = query(collection(db, this.#menuTable),
                    orderBy("itemCategory"),
                    orderBy("itemName"));


        const result = await getDocs(qry);

        let items = []
        result.docs.forEach((doc) => {
            items.push({...doc.data(), id: doc.id})
        });

        // items.forEach(async (item) => {
        //     let catName = await this.menuCategory.getCatNameById(item.itemCategory);
        //     console.log(catName);
        //     item.itemCategory = catName;
        // });


        return items;
    }
    
    // Add menu item
    async addMenuItem(category, imageName, itemName, price, menuItemStatus) {
        const qry = query(collection(db, this.#menuTable),
                    where("itemName", "==", itemName));
        const result = await getDocs(qry);
        
        if (result.size == 0) {
            await addDoc(collection(db, this.#menuTable), {
                itemCategory: category,
                itemImage: imageName,
                itemName: itemName,
                itemPrice: price,
                itemStatus: menuItemStatus
            });
            return true;
        } else {
            return false;
        }
    }

    // Update menu item    
    async updateMenuItem(category, imageName, itemName, price, menuItemID) {              
        await updateDoc(doc(db, this.#menuTable, menuItemID), {
            itemCategory: category,
            itemImage: imageName,
            itemName: itemName,
            itemPrice: price
        });
    }

    // Suspend menu item
    async suspendMenuItem(menuItemID, status) {
        await updateDoc(doc(db, this.#menuTable, menuItemID), {
            itemStatus: status,
        });
    }    

    // Search for menu item(s)
    async searchMenuItem(name, searchData) {
        const qry = query(collection(db, this.#menuTable),
                    orderBy("itemCategory"),
                    orderBy("itemName"));
        const result = await getDocs(qry);

        let menuItems = [];
        result.docs.forEach((doc) => {
            menuItems.push({...doc.data(), id: doc.id})
        });
        
        let searchResult = []
        menuItems.forEach((item) => {
            if (item.itemName.toLowerCase().includes(name.toLowerCase()))
                searchResult.push(item);
        });

        return searchResult;
    }

}