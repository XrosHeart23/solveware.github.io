import { OrdersController } from "../controller/ordersController.js";

export class OrdersUI {
    constructor () {
        this.ordersController = new OrdersController();
    }

    async createOrder (form) {
        return await this.ordersController.doCreateOrder(form.phoneNumber.value, form.totalPrice.value);
    }

    async searchOrder(form, searchData, searchType) {
        let searchResult;

        if (searchData === "phoneNumber"){
            let phoneNumber = (form != null) ? form.phoneNumber.value : "";
            searchResult = await this.ordersController.doSearchOrder(phoneNumber, searchData);
        }
        else if (searchData === "orderId"){
            let oldOrderData = JSON.parse(sessionStorage.getItem("currentViewOrder"));            
            searchResult = await this.ordersController.doSearchOrder(oldOrderData.id ,searchData);
        }

        if (searchType === "search") {
            const viewTbl = document.getElementById("view_order");
            viewTbl.innerHTML = "";

            const tbl = document.getElementById("searchOrder_result");
            tbl.innerHTML = ""; // Clear table

            // Add table header
            const trhead = tbl.insertRow();
            let th = document.createElement("th");
            th.setAttribute("id", "searchOrder_header");
            th.setAttribute("class", "searchOrder_header");
            th.innerHTML = "Search Result";
            trhead.appendChild(th);            
            
            let tr = tbl.insertRow();
            let tdUser = tr.insertCell();
            tdUser.appendChild(document.createTextNode("Phone Number"));
            
            tdUser = tr.insertCell();
            tdUser.appendChild(document.createTextNode("Order Status"));

            // Add table row for each result found
            searchResult.forEach((row) => {
                const tr = tbl.insertRow();
                const tdUser = tr.insertCell();
                tdUser.appendChild(document.createTextNode(row.phoneNumber));
                tdUser.setAttribute("class", "viewOrder_row");
                
                const tdStatus = tr.insertCell();
                let orderStatus = (row.orderStatus) ? "Completed" : "Incomplete";
                tdStatus.appendChild(document.createTextNode(orderStatus));
                tdStatus.setAttribute("class", "viewOrder_row");

                tr.addEventListener("click", () => {
                    document.getElementById("searchOrder_result").style.display = "none";
                    document.getElementById("view_order").style.display = "table";
                    document.getElementById("viewCart_Table").style.display = "table";

                    sessionStorage.setItem("currentViewOrder", JSON.stringify(row));
                    this.displayOrder(row);
                });
            });
        }
        else {
            return searchResult;
        }
    }    

    async completeOrder(form, orderId) {
        let status = (form.orderStatus.value.toLowerCase() === "completed") ? true : false;
        let result = await this.ordersController.doCompleteOrder(status, orderId);

        if (result) {
            return "Order completed";
        } else {
            return "Order Incomplete";
        }
    }    

    displayOrder (data){
        const tbl = document.getElementById("view_order");
        tbl.innerHTML = ""; // Clear table     
        
        const trhead = tbl.insertRow();
        let th = document.createElement("th");
        th.setAttribute("id", "view_header");
        th.setAttribute("class", "view_header");
        th.setAttribute("colspan", 2);
        th.innerHTML = "Order Details";
        trhead.appendChild(th);   
        
        // Phone Number
        let tr = tbl.insertRow();
        let tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Phone Number:"));

        let tdValue = tr.insertCell();
        let inputField = document.createElement("input");

        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "phoneNumber");
        inputField.setAttribute("id", "view_phoneNumber");    
        inputField.setAttribute("value", data.phoneNumber);
        tdValue.appendChild(inputField);    
        
        // Time of Visit
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Date of Visit:"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");

        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "order_date");
        inputField.setAttribute("id", "viewOrder_date");  
        inputField.setAttribute("value", data.visitDate.toDate().toDateString());
        tdValue.appendChild(inputField);
        
        // Time of Visit
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Time of Visit:"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");

        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "order_time");
        inputField.setAttribute("id", "viewOrder_time");  
        inputField.setAttribute("value", data.visitDate.toDate().toLocaleTimeString('en-US'));
        tdValue.appendChild(inputField);  
        
        // Order Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Order Status:"));

        tdValue = tr.insertCell();
        inputField = document.createElement("select");
        inputField.setAttribute("class", "order_status");
        inputField.setAttribute("name", "orderStatus");
        inputField.setAttribute("id", "order_status");
        let orderReceived = document.createElement("option");
        let orderInKitchen = document.createElement("option");
        let orderCompleted = document.createElement("option");

        orderReceived.setAttribute ('value', 1);
        orderInKitchen.setAttribute ('value', 1);
        orderCompleted.setAttribute ('value', 2);

        orderReceived.appendChild (document.createTextNode("Received"));
        orderInKitchen.appendChild (document.createTextNode("In Kitchen"));
        orderCompleted.appendChild (document.createTextNode("Completed"));

        inputField.appendChild(orderReceived);
        inputField.appendChild(orderInKitchen);
        inputField.appendChild(orderCompleted);

        orderReceived.setAttribute('selected', 'selected');

        tdValue.appendChild(inputField);    

        // Order Ticket
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Order Ticket:"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "orderTicket");
        inputField.setAttribute("id", "viewOrder_Ticket");
        inputField.setAttribute("style", "border:0;outline:none;");     
        inputField.setAttribute("value", "Open");   
        inputField.readOnly = true;
        tdValue.appendChild(inputField);    

        let tdButton = tr.insertCell();              
        
        let btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "closeTicket");
        btn.setAttribute("id", "close_ticket");
        btn.setAttribute("style", "display:none;");     
        btn.innerHTML = "Close Ticket";
        tdButton.appendChild(btn);    

        // Items Ordered
        const cartTable = document.getElementById("viewOrderCart_tbody");
        cartTable.innerHTML = "";        
        //const cartOrder = JSON.parse(data.orderInfo);
        const menuItem = JSON.parse(sessionStorage.getItem("menuItem"));

        let totalPrice = 0;
 
        for (const [key, value] of Object.entries(data.orderInfo)) {
            let item;
            let quantity;
            for (const itm of menuItem) {
                if (itm.id === key) {
                    item = itm;
                    quantity = value;
                    break;
                }
            }        

            const itemRow = cartTable.insertRow();
            const nameTd = itemRow.insertCell();
            nameTd.setAttribute("class", "itemName");
            nameTd.innerHTML = item.itemName;
    
            const priceTd = itemRow.insertCell();
            priceTd.setAttribute("class", "itemPrice");
            priceTd.innerHTML = "$" + item.itemPrice.toFixed(2);
    
            const quantityTd = itemRow.insertCell();
            quantityTd.setAttribute("class", "itemQuantity");
            quantityTd.innerHTML = quantity;

            totalPrice += item.itemPrice * quantity;
        }

        // Total Price
        const totalPriceRow = cartTable.insertRow();
        const priceLabel = totalPriceRow.insertCell();
        priceLabel.setAttribute("class", "itemTotalPriceLabel");
        priceLabel.innerHTML = "Total Price:";
    
        const totalPriceTd = totalPriceRow.insertCell();
        totalPriceTd.setAttribute("class", "totalPrice");
        totalPriceTd.innerHTML = "$" + totalPrice.toFixed(2);
        const totalPriceInput = document.createElement("input");
        totalPriceInput.setAttribute("name", "totalPrice");
        totalPriceInput.setAttribute("value", totalPrice.toFixed(2));
        totalPriceInput.setAttribute("style", "display:none");
        totalPriceTd.appendChild(totalPriceInput);

    }
}