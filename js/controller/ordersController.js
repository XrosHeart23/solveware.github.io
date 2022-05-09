import { Orders } from "../entity/orders.js";

export class OrdersController {
    constructor() {
        this.orders = new Orders();
    }

    async doCreateOrder (phoneNumber, totalPrice) {
        let cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
        let visitDuration = timeSpent;
        let visitDate = new Date();
        let orderStatus = "Received"; // New order status will always be "Received"
        let orderTicketStatus = false; // New order ticket status will always be false

        return await this.orders.addOrder(phoneNumber, totalPrice, cartOrder, 
                visitDuration, visitDate, orderStatus, orderTicketStatus);
    }

    async doSearchOrder(orderDetail, type) {
        return await this.orders.searchOrder(orderDetail, type);
    }    

    async doCompleteOrder(status, orderId) {
        status = !status; // Toggle status boolean
        await this.orders.completeOrder(status, orderId);

        return status;
    }
}