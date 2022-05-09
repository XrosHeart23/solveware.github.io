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

    async searchOrder(orderDetail, type) {
        const qry = query(collection(db, this.#ordersTable));

        const result = await getDocs(qry);

        let order = [];

        if (type == "phoneNumber"){
            result.docs.forEach((doc) => {
                if (doc.data().phoneNumber.toString().includes(orderDetail))
                    order.push({...doc.data(), id: doc.id});
                else if (orderDetail === "")
                    order.push({...doc.data(), id: doc.id});
            });
        }
        else if (type == "orderId"){
            result.docs.forEach((doc) => {
                if (orderDetail === doc.id)
                    order.push({...doc.data(), id: doc.id});     
                });       
        }
        
        return order;
    }

    async completeOrder(status, orderId) {
        await updateDoc(doc(db, this.#ordersTable, orderId), {
            orderStatus: status,
        });
    }    
}