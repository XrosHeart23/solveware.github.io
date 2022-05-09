export class CartUI {
    MAX_ORDER_QUANTITY = 10;

    // Display cart function
    displayCart() {
        const cartTable = document.getElementById("viewCart_tbody");
        cartTable.innerHTML = "";
        const cartOrder = JSON.parse(sessionStorage.getItem("cartOrder"));
        const menuItem = JSON.parse(sessionStorage.getItem("menuItem"));

        let totalPrice = 0;
        if (JSON.parse(sessionStorage.getItem("cartOrder")) != null) {
            for (const [key, value] of Object.entries(cartOrder)) {
                let item;
                for (const itm of menuItem) {
                    if (itm.id === key) {
                        item = itm;
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
                
                const minusDiv = document.createElement("span");
                minusDiv.setAttribute("class", "cartMinus");
                minusDiv.setAttribute("id", item.id);
                minusDiv.innerHTML = "&minus;";
                
                const quantityDiv = document.createElement("input");
                quantityDiv.setAttribute("class", "cartQuantity");
                quantityDiv.setAttribute("id", "cartQuantity" + item.id);
                quantityDiv.setAttribute("name", "cartQuantity");
                quantityDiv.setAttribute("value", value);
                quantityDiv.readOnly = true;

                const plusDiv = document.createElement("span");
                plusDiv.setAttribute("class", "cartPlus");
                plusDiv.setAttribute("id", item.id);
                plusDiv.innerHTML = "&#43;";
                
                quantityTd.appendChild(minusDiv);
                quantityTd.appendChild(quantityDiv);
                quantityTd.appendChild(plusDiv);
        
                const removeTd = itemRow.insertCell();
                removeTd.setAttribute("class", "itemRemove");
                removeTd.setAttribute("id", item.id);
                removeTd.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        
                totalPrice += item.itemPrice * value;
            }
        
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
        
            // Remove item from cart
            const removeBtn = document.getElementsByClassName("itemRemove");
            Array.from(removeBtn).forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    delete cartOrder[btn.id];
                    sessionStorage.setItem("cartOrder", JSON.stringify(cartOrder));
                    this.displayCart();
                });
            });
        }

        const cartMinusBtn = document.getElementsByClassName("cartMinus");
        Array.from(cartMinusBtn).forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.minus("cartQuantity", btn.id);
                this.updateCart(btn.id);
            });
        });

        const cartPlusBtn = document.getElementsByClassName("cartPlus");
        Array.from(cartPlusBtn).forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.plus("cartQuantity", btn.id);
                this.updateCart(btn.id);
            });
        });
    }

    // Update Cart whenever item quantity is changed
    updateCart(itemId) {
        let cart = JSON.parse(sessionStorage.getItem("cartOrder"));
        
        if (Number(document.getElementById("cartQuantity" + itemId).value) != 0) {
            cart[itemId] = Number(document.getElementById("cartQuantity" + itemId).value);
            sessionStorage.setItem("cartOrder", JSON.stringify(cart));
        }
    
        this.displayCart();
    }

    // ======= Plus and minus function to add quantity =======
    minus(quantityId, itemId = "") {
        let id = quantityId + itemId;
        let quantity = Number(document.getElementById(id).value) - 1;

        if (quantity == 0) {
            let cart = JSON.parse(sessionStorage.getItem("cartOrder"));
            delete cart[itemId];
            sessionStorage.setItem("cartOrder", JSON.stringify(cart));
        }
        document.getElementById(id).value = quantity;
    }

    plus(quantityId, itemId = "") {
        let id = quantityId + itemId;
        let quantity = Number(document.getElementById(id).value) + 1;

        if (quantity > this.MAX_ORDER_QUANTITY)
            quantity = this.MAX_ORDER_QUANTITY;

        document.getElementById(id).value = quantity;
    }
    // =======================================================
}