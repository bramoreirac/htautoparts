/* ==========================================================
   HTAutoParts
   cart.js
   Shared Shopping Cart
========================================================== */

const CART_STORAGE_KEY = "htautoparts-cart";
const SHIPPING_COST = 15;
const TAX_RATE = 0.08;

function getCart(){

    try{

        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));

        return Array.isArray(storedCart) ? storedCart : [];

    }
    catch(error){

        return [];

    }

}

function saveCart(cart){

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

}

function addToCart(productId, quantity = 1){

    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);
    const amount = Math.max(1, Number.parseInt(quantity, 10) || 1);

    if(existingItem){

        existingItem.quantity += amount;

    }
    else{

        cart.push({ productId, quantity: amount });

    }

    saveCart(cart);
    updateCartCount();

}

function updateCartItem(productId, quantity){

    const cart = getCart();
    const item = cart.find(entry => entry.productId === productId);
    const amount = Number.parseInt(quantity, 10);

    if(!item) return;

    if(!Number.isFinite(amount) || amount < 1){

        removeFromCart(productId);
        return;

    }

    item.quantity = amount;
    saveCart(cart);
    renderCart();

}

function removeFromCart(productId){

    saveCart(getCart().filter(item => item.productId !== productId));
    renderCart();

}

function getCartDetails(){

    return getCart().map(item => ({

        ...item,
        product: getProductById(item.productId)

    })).filter(item => item.product);

}

function getCartTotals(){

    const items = getCartDetails();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const shipping = itemCount ? SHIPPING_COST : 0;
    const tax = subtotal * TAX_RATE;

    return {
        itemCount,
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax
    };

}

function formatCurrency(value){

    return `$${value.toFixed(2)}`;

}

function renderCart(){

    const container = document.getElementById("cartItems");

    if(!container) return;

    const items = getCartDetails();

    if(!items.length){

        container.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
        updateCartSummary();
        return;

    }

    container.innerHTML = items.map(({ product, quantity }) => `
        <tr>
            <td>
                <div class="cart-product">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.manufacturer}</p>
                        <small>SKU: ${product.sku}</small>
                    </div>
                </div>
            </td>
            <td>${formatCurrency(product.price)}</td>
            <td>
                <div class="quantity-box">
                    <input type="number" value="${quantity}" min="1" data-product-id="${product.id}">
                    <button type="button" data-action="increase" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
                    <button type="button" data-action="decrease" data-product-id="${product.id}" aria-label="Decrease quantity">−</button>
                </div>
            </td>
            <td>${formatCurrency(product.price * quantity)}</td>
            <td>
                <button type="button" class="remove-btn" data-action="remove" data-product-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");

    container.querySelectorAll("[data-action]").forEach(button => {

        button.addEventListener("click", () => {

            const productId = button.dataset.productId;
            const item = getCart().find(entry => entry.productId === productId);

            if(button.dataset.action === "remove"){

                removeFromCart(productId);
                return;

            }

            const nextQuantity = button.dataset.action === "increase"
                ? item.quantity + 1
                : item.quantity - 1;

            updateCartItem(productId, nextQuantity);

        });

    });

    container.querySelectorAll("input[data-product-id]").forEach(input => {

        input.addEventListener("change", () => {

            updateCartItem(input.dataset.productId, input.value);

        });

    });

    updateCartSummary();

}

function updateCartSummary(){

    const totals = getCartTotals();

    setElementText("itemCount", totals.itemCount);
    setElementText("subtotal", formatCurrency(totals.subtotal));
    setElementText("estimatedTax", formatCurrency(totals.tax));
    setElementText("grandTotal", formatCurrency(totals.total));

}

function setElementText(id, value){

    const element = document.getElementById(id);

    if(element) element.textContent = value;

}

function updateCartCount(){

    const count = getCartTotals().itemCount;
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');

    cartLinks.forEach(link => {

        link.setAttribute("aria-label", `Shopping cart, ${count} item${count === 1 ? "" : "s"}`);

    });

}

document.addEventListener("DOMContentLoaded", () => {

    productsReady.then(() => {
        renderCart();
        updateCartCount();
    }).catch(error => console.error("Unable to load cart products:", error));

});
