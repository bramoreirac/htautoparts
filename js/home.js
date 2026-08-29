/* Featured product rendering for index.html. */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("featuredProducts");
    if (!container) return;

    try {
        await productsReady;
        container.innerHTML = getFeaturedProducts(4).map(product => `
            <article class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.brand} ${product.name}">
                </div>
                <div class="product-info">
                    <span class="product-brand">${product.brand}</span>
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-primary">View Details</a>
                </div>
            </article>
        `).join("");
    } catch (error) {
        console.error("Unable to load featured products:", error);
        container.innerHTML = "<p>Featured products could not be loaded.</p>";
    }
});
