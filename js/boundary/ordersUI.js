import { CreateOrdersCtrl, SearchOrdersCtrl, UpdateOrdersCtrl, CloseOrdersCtrl } from "../controller/ordersController.js";

export class OrdersUI {

    async createOrder (form) {
        const ordersController = new CreateOrdersCtrl();
        return await ordersController.doCreateOrder(form.phoneNumber.value, form.totalPrice.value);
    }

    async searchOrder(form, searchData, searchType) {
        const ordersController = new SearchOrdersCtrl();
        let searchResult;

        if (searchData === "phoneNumber") {
            let phoneNumber = (form != null) ? form.phoneNumber.value : "";
            searchResult = await ordersController.doSearchOrder(phoneNumber, searchData, form.searchStatus.value);
        }
        else if (searchData === "orderId") {            
            searchResult = await ordersController.doSearchOrder(form ,searchData);
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
            th.setAttribute("colspan", 2);
            th.innerHTML = "Search Result";
            trhead.appendChild(th);            
            
            let tr = tbl.insertRow();
            tr.setAttribute("class", "tableHead");          
            let tdUser = tr.insertCell();
            tdUser.appendChild(document.createTextNode("Phone Number"));
            
            tdUser = tr.insertCell();
            tdUser.appendChild(document.createTextNode("Order Status"));

            // Add table row for each result found
            searchResult.forEach((row) => {
                tr = tbl.insertRow();
                tr.setAttribute("class", "viewOrder_row");
                const tdUser = tr.insertCell();
                tdUser.appendChild(document.createTextNode(row.phoneNumber));
                tdUser.setAttribute("class", "viewOrder_row");
                
                const tdStatus = tr.insertCell();
                let orderStatus = (row.orderTicketStatus) ? "Completed" : "Incomplete";
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

    async updateOrderStatus(form, orderId) {
        const ordersController = new UpdateOrdersCtrl();
        await ordersController.doUpdateOrderStatus(form.orderStatus.value.toLowerCase(), orderId);

        document.getElementById("updateOut").innerHTML = "Order status updated";
    }

    async closeOrderTicket(orderId) {
        const ordersController = new CloseOrdersCtrl();
        const orderSearchController = new SearchOrdersCtrl();

        await ordersController.doCloseOrder(orderId);
        let searchResult = await orderSearchController.doSearchOrder(orderId, "orderId", "exact");
        // Update browser with updated details
        sessionStorage.setItem("currentViewOrder", JSON.stringify((searchResult[0])));
        this.displayOrder(searchResult[0]);

        document.getElementById("updateOut").innerHTML = "Order have been closed";
        document.getElementById("order_status").disabled = true;
        document.getElementById("close_ticket").style.display = "none";
    }



    displayOrder(data) {
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
        inputField.readOnly = true;
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
        inputField.readOnly = true;
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
        inputField.readOnly = true;
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
        if (data.orderTicketStatus)
            inputField.disabled = true;

        let orderReceived = document.createElement("option");
        let orderInKitchen = document.createElement("option");
        let orderCompleted = document.createElement("option");

        orderReceived.setAttribute ('value', "received");
        orderInKitchen.setAttribute ('value', "in kitchen");
        orderCompleted.setAttribute ('value', "completed");

        orderReceived.appendChild (document.createTextNode("Received"));
        orderInKitchen.appendChild (document.createTextNode("In Kitchen"));
        orderCompleted.appendChild (document.createTextNode("Completed"));

        inputField.appendChild(orderReceived);
        inputField.appendChild(orderInKitchen);
        inputField.appendChild(orderCompleted);

        if (data.orderStatus === "received")
            orderReceived.setAttribute("selected", "selected");
        else if (data.orderStatus === "in kitchen")
            orderInKitchen.setAttribute("selected", "selected");
        else
            orderCompleted.setAttribute("selected", "selected");

        tdValue.appendChild(inputField);

        // Order Ticket Status
        tr = tbl.insertRow();
        tdKey = tr.insertCell();
        tdKey.appendChild(document.createTextNode("Order Ticket:"));

        tdValue = tr.insertCell();
        inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "orderTicket");
        inputField.setAttribute("id", "viewOrder_Ticket");
        let orderTicketStatus = (data.orderTicketStatus) ? "Closed" : "Open";
        inputField.setAttribute("value", orderTicketStatus);  
        inputField.readOnly = true;
        tdValue.appendChild(inputField);    

        // Close Order Ticket Button
        tr = tbl.insertRow();
        let tdButton = tr.insertCell(); 
        tdButton.setAttribute("colspan", 2);

        let btn = document.createElement("button");
        btn.setAttribute("type", "submit");
        btn.setAttribute("name", "closeTicket");
        btn.setAttribute("id", "close_ticket");
        btn.setAttribute("style", "display:none;");     
        btn.innerHTML = "Close Ticket";
        tdButton.appendChild(btn);

        // Output for form
        tr = tbl.insertRow();
        let tdOutput = tr.insertCell();
        tdOutput.setAttribute("colspan", 2);
        tdOutput.setAttribute("id", "updateOut");
        tdOutput.setAttribute("class", "updateOut");

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