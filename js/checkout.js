/* ==========================================================
   HTAutoParts
   checkout.js
   Checkout Summary and Form
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderCheckoutSummary();
    initializeCheckoutForm();

});

function renderCheckoutSummary(){

    const container = document.getElementById("checkoutProducts");

    if(!container) return;

    const items = getCartDetails();

    if(!items.length){

        container.innerHTML = "<p>Your cart is empty.</p>";
        setCheckoutText("checkoutItems", "0");
        setCheckoutText("checkoutSubtotal", "$0.00");
        setCheckoutText("checkoutTotal", "$0.00");
        return;

    }

    container.innerHTML = items.map(({ product, quantity }) => `
        <div class="summary-product">
            <div>
                <h4>${product.name}</h4>
                <small>Qty: ${quantity}</small>
            </div>
            <span>${formatCurrency(product.price * quantity)}</span>
        </div>
    `).join("");

    const totals = getCartTotals();

    setCheckoutText("checkoutItems", totals.itemCount);
    setCheckoutText("checkoutSubtotal", formatCurrency(totals.subtotal));
    setCheckoutText("checkoutTotal", formatCurrency(totals.total));

}

function setCheckoutText(id, value){

    const element = document.getElementById(id);

    if(element) element.textContent = value;

}

function initializeCheckoutForm(){

    const form = document.getElementById("checkoutForm");

    if(!form) return;

    form.addEventListener("submit", event => {

        event.preventDefault();

        if(!getCartDetails().length){

            alert("Your cart is empty.");
            return;

        }

        alert("Thank you for your purchase. Your order has been received.");
        localStorage.removeItem(CART_STORAGE_KEY);
        window.location.href = "index.html";

    });

}
