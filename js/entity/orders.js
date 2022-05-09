import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class Orders {
    #ordersTable = "orders";
    // constructor() {

    // }

    async addOrder (phoneNumber, totalPrice, cart, visitDuration, visitDate, orderStatus) {
        await addDoc(collection(db, this.#ordersTable), {
                        phoneNumber: Number(phoneNumber),
                        totalPrice: Number(totalPrice),
                        orderInfo: cart,
                        visitDurationInSec: Number(visitDuration),
                        visitDate: visitDate,
                        orderStatus: orderStatus,
        });
    }
}