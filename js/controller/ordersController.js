import { Orders } from "../entity/orders.js";

// ========= Orders Controller =========
// Create new order
export class CreateOrdersCtrl {
    constructor() {
        this.orders = new Orders();
    }

    async doCreateOrder (phoneNumber, totalPrice) {
        let cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
        let visitDuration = timeSpent;
        let visitDate = new Date();
        let orderStatus = "received"; // New order status will always be "received"
        let orderTicketStatus = false; // New order ticket status will always be false

        return await this.orders.addOrder(phoneNumber, totalPrice, cartOrder, 
                visitDuration, visitDate, orderStatus, orderTicketStatus);
    }
}


// Search order
export class SearchOrdersCtrl {
    constructor() {
        this.orders = new Orders();
    }

    async doSearchOrder(orderDetail, type, searchOption = "") {
        let orderTicketStatus
        if (searchOption === "complete")
            orderTicketStatus = true;
        else if (searchOption === "incomplete")
            orderTicketStatus = false;
        else
            orderTicketStatus = "";

        return await this.orders.searchOrder(orderDetail, type, orderTicketStatus);
    }  
}


// Update order
export class UpdateOrdersCtrl {
    constructor() {
        this.orders = new Orders();
    }

    async doUpdateOrderStatus(status, orderId) {
        return await this.orders.updateOrderStatus(status, orderId);
    }
}


// Close order
export class CloseOrdersCtrl {
    constructor() {
        this.orders = new Orders();
    }

    async doCloseOrder(orderId) {
        await this.orders.closeOrderTicket(orderId);
    }
}
// ========= End Orders Controller =========

/* Depecrated
export class OrdersController {
    constructor() {
        this.orders = new Orders();
    }

    async doCreateOrder (phoneNumber, totalPrice) {
        let cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
        let visitDuration = timeSpent;
        let visitDate = new Date();
        let orderStatus = "received"; // New order status will always be "received"
        let orderTicketStatus = false; // New order ticket status will always be false

        return await this.orders.addOrder(phoneNumber, totalPrice, cartOrder, 
                visitDuration, visitDate, orderStatus, orderTicketStatus);
    }

    async doSearchOrder(orderDetail, type, searchOption = "") {
        let orderTicketStatus
        if (searchOption === "complete")
            orderTicketStatus = true;
        else if (searchOption === "incomplete")
            orderTicketStatus = false;
        else
            orderTicketStatus = "";

        return await this.orders.searchOrder(orderDetail, type, orderTicketStatus);
    }    

    async doUpdateOrderStatus(status, orderId) {
        // status = !status; // Toggle status boolean
        return await this.orders.updateOrderStatus(status, orderId);
    }

    async doCloseOrder(orderId) {
        await this.orders.closeOrderTicket(orderId);
    }
}
*/