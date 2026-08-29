/* ==========================================================
   HTAutoParts
   product.js
   Product Details Page
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {
        await productsReady;
        loadProduct();
    } catch (error) {
        console.error("Unable to load product data:", error);
    }

});

/* ==========================================================
   GET PRODUCT ID FROM URL
========================================================== */

function getProductId(){

    const params = new URLSearchParams(window.location.search);

    return params.get("id");

}

/* ==========================================================
   LOAD PRODUCT
========================================================== */

function loadProduct(){

    const id = getProductId();

    if(!id){

        console.error("No product ID found.");

        return;

    }

    const product = getProductById(id);

    if(!product){

        console.error("Product not found.");

        return;

    }

    renderProduct(product);

    initializeAddToCart(product);

}

function initializeAddToCart(product){

    const button = document.getElementById("addToCart");

    if(!button) return;

    button.addEventListener("click", () => {

        const amount = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);

        addToCart(product.id, amount);

        button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';

        setTimeout(() => {

            button.innerHTML = '<i class="fas fa-cart-shopping"></i> Add to Cart';

        }, 1400);

    });

}

/* ==========================================================
   RENDER PRODUCT
========================================================== */

function renderProduct(product){

    setText("productName", product.name);

    setText("productBrand", product.brand);

    setText("productPrice", `$${product.price.toFixed(2)}`);

    setText("productDescription", product.description);

    updateCompatibility(product.compatibility);

    updateImage(product.image, product.name);

    updateBreadcrumb(product);

    setText("manufacturer", product.manufacturer);

    setText("category", product.category);

    setText("material", product.material);

    setText("compatibility", product.compatibility.join(" • "));

    setText("warranty", product.warranty);

}

/* ==========================================================
   HELPERS
========================================================== */

function setText(id, value){

    const element = document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}

function updateImage(src, name){

    const image = document.getElementById("productImage");

    if(image){

        image.src = src;

        image.alt = name ? `${name} image` : image.alt;

    }

}

/* ==========================================================
   COMPATIBILITY LIST
========================================================== */

function updateCompatibility(list){

    const ul = document.getElementById("compatibilityList");

    if(!ul) return;

    ul.innerHTML = "";

    list.forEach(vehicle=>{

        const li = document.createElement("li");

        li.textContent = vehicle;

        ul.appendChild(li);

    });

}

/* ==========================================================
   BREADCRUMB UPDATE
========================================================== */

function updateBreadcrumb(product){

    const breadcrumb=document.getElementById("breadcrumbProduct");

    if(breadcrumb){

        breadcrumb.textContent=product.name;

    }

}

/* ==========================================================
   QUANTITY
========================================================== */

let quantity = 1;

const quantityInput = document.getElementById("quantity");

const increase = document.getElementById("increaseQty");

const decrease = document.getElementById("decreaseQty");

if(increase){

    increase.addEventListener("click",()=>{

        quantity++;

        quantityInput.value=quantity;

    });

}

if(decrease){

    decrease.addEventListener("click",()=>{

        if(quantity>1){

            quantity--;

            quantityInput.value=quantity;

        }

    });

}
