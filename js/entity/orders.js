import { collection, query, where, orderBy, startAt, endAt,
    doc, getDoc, getDocs, addDoc, updateDoc
} from "firebase/firestore/lite";
//"https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { db } from "./database.js";

export class Orders {
    #ordersTable = "orders";
    // constructor() {

    // }

    async addOrder (phoneNumber, totalPrice, cart, visitDuration, visitDate, orderStatus, orderTicketStatus) {
        await addDoc(collection(db, this.#ordersTable), {
                        phoneNumber: Number(phoneNumber),
                        totalPrice: Number(totalPrice),
                        orderInfo: cart,
                        visitDurationInSec: Number(visitDuration),
                        visitDate: visitDate,
                        orderStatus: orderStatus,
                        orderTicketStatus: orderTicketStatus,
        });
    }

    async searchOrder(orderDetail = "", type = "", searchOption = "") {
        let qry;
        if (searchOption === "") {
            qry = query(collection(db, this.#ordersTable),
                    orderBy("phoneNumber"));
        }
        else {
            qry = query(collection(db, this.#ordersTable),
                    where("orderTicketStatus", "==", searchOption),
                    orderBy("phoneNumber"));
        }

        const result = await getDocs(qry);

        let order = [];

        if (type == "phoneNumber") {
            result.docs.forEach((doc) => {
                if (doc.data().phoneNumber.toString().includes(orderDetail))
                    order.push({...doc.data(), id: doc.id});
                else if (orderDetail === "")
                    order.push({...doc.data(), id: doc.id});
            });
        }
        else if (type == "orderId") {
            result.docs.forEach((doc) => {
                if (orderDetail === doc.id)
                    order.push({...doc.data(), id: doc.id});     
            });       
        }
        else {
            result.docs.forEach((doc) => {
                order.push({...doc.data(), id: doc.id});     
            });  
        }
        
        return order;
    }

    async searchOrderByDate(searchStartDate, searchEndDate) {
        const qry = query(collection(db, this.#ordersTable),
                    where("visitDate", ">", searchStartDate),
                    where("visitDate", "<", searchEndDate));

        const result = await getDocs(qry);

        let orders = [];
        result.docs.forEach((doc) => {
            orders.push({...doc.data(), id: doc.id});
        });
        return orders;
    }

    async updateOrderStatus(status, orderId) {
        await updateDoc(doc(db, this.#ordersTable, orderId), {
            orderStatus: status,
        });
    }

    async closeOrderTicket(orderId) {
        await updateDoc(doc(db, this.#ordersTable, orderId), {
            orderTicketStatus: true,
        });
    }
}