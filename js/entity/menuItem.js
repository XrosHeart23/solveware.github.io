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
}