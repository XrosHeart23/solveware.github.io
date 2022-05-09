import { Orders } from "../entity/orders.js";

export class OrdersController {
    constructor() {
        this.orders = new Orders();
    }

    async doCreateOrder (phoneNumber, totalPrice, cart, visitDuration, visitDate, orderStatus) {
        return await this.orders.addOrder(phoneNumber, totalPrice, cart, 
                visitDuration, visitDate, orderStatus);
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