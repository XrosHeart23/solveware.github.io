import { OrdersController } from "../controller/ordersController.js";

export class OrdersUI {
    constructor () {
        this.ordersController = new OrdersController();
    }

    async createOrder (form) {
        let cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
        let visitDuration = timeSpent;
        let visitDate = new Date();
        let orderStatus = false; // New order status is set to false, order not completed
        return await this.ordersController.doCreateOrder(form.phoneNumber.value, 
            form.totalPrice.value, cartOrder, visitDuration, visitDate, orderStatus);
    }
}