/* Catalog rendering, search, and filters. Product data lives in products.json. */

document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("productsGrid");
    const count = document.getElementById("catalogProductCount");
    if (!grid) return;

    try {
        const products = await productsReady;
        grid.innerHTML = products.map(product => `
            <article class="product-card" data-brand="${product.brand}" data-category="${product.category}" data-price="${product.price}">
                <div class="product-image"><img src="${product.image}" alt="${product.brand} ${product.name}"></div>
                <div class="product-info">
                    <span class="product-brand">${product.brand}</span>
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn btn-primary">View Details</a>
                </div>
            </article>
        `).join("");
        initializeCatalogFilters(products, grid, count);
    } catch (error) {
        console.error("Unable to load catalog products:", error);
        grid.innerHTML = '<p class="catalog-error">Products could not be loaded. Please try again later.</p>';
        if (count) count.textContent = "No products available";
    }
});

function initializeCatalogFilters(products, grid, count) {
    const searchInput = document.getElementById("catalogSearch");
    const searchButton = document.querySelector(".catalog-search button");
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    const categoryFilters = document.querySelectorAll('.filter-box input[type="checkbox"]');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const categoryNames = ["Engine Parts", "Brake System", "Suspension", "Filters", "Electrical", "Cooling System"];
    const priceRanges = [[0, 50], [50, 100], [100, 200], [200, Infinity]];

    categoryFilters.forEach((input, index) => input.dataset.category = categoryNames[index]);
    let priceRangeIndex = 0;
    priceFilters.forEach(input => {
        if (input.value === "none") return;
        input.dataset.min = priceRanges[priceRangeIndex][0];
        input.dataset.max = priceRanges[priceRangeIndex][1];
        priceRangeIndex++;
    });

    function applyFilters() {
        const term = (searchInput?.value || "").trim().toLowerCase();
        const brand = document.querySelector('input[name="brand"]:checked')?.value || "all";
        const categories = [...categoryFilters].filter(input => input.checked).map(input => input.dataset.category);
        const selectedPrice = [...priceFilters].find(input => input.checked && input.value !== "none");
        const min = selectedPrice ? Number(selectedPrice.dataset.min) : 0;
        const max = selectedPrice ? Number(selectedPrice.dataset.max) : Infinity;
        let visibleCount = 0;

        [...grid.children].forEach((card, index) => {
            const product = products[index];
            const searchable = `${product.name} ${product.brand} ${product.category} ${product.sku}`.toLowerCase();
            const visible = (brand === "all" || product.brand === brand)
                && (!categories.length || categories.includes(product.category))
                && product.price >= min && product.price <= max
                && (!term || searchable.includes(term));
            card.hidden = !visible;
            if (visible) visibleCount++;
        });
        if (count) count.textContent = `Showing ${visibleCount} product${visibleCount === 1 ? "" : "s"}`;
    }

    brandFilters.forEach(input => input.addEventListener("change", applyFilters));
    categoryFilters.forEach(input => input.addEventListener("change", applyFilters));
    priceFilters.forEach(input => input.addEventListener("change", applyFilters));
    searchButton?.addEventListener("click", applyFilters);
    searchInput?.addEventListener("input", applyFilters);
    searchInput?.addEventListener("keypress", event => {
        if (event.key === "Enter") applyFilters();
    });
    applyFilters();
}
