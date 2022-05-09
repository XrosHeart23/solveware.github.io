import { Orders } from "../entity/orders.js";

export class OrdersController {
    constructor() {
        this.orders = new Orders();
    }

    async doCreateOrder (phoneNumber, totalPrice, cart, visitDuration, visitDate, orderStatus) {
        return await this.orders.addOrder(phoneNumber, totalPrice, cart, 
                visitDuration, visitDate, orderStatus);
    }
}