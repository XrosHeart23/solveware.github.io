import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class MenuCategory {
    #catTable = "menuCategory";

    async getCatNameById(catID) {
        const qry = query(collection(db, this.#catTable),
                    where("catID" , "==", catID));

        const result = await getDocs(qry);

        let categories = []
        result.docs.forEach((doc) => {
            categories.push({...doc.data(), id: doc.id})
        });

        return categories[0];
    }

    async getAllCatName() {
        const qry = query(collection(db, this.#catTable),
                    orderBy("catID"));

        const result = await getDocs(qry);

        let categories = []
        result.docs.forEach((doc) => {
            categories.push({...doc.data(), id: doc.id})
        });

        return categories;
    }
}