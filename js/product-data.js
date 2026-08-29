/* Shared product data loader. The records are maintained in products.json. */

const productsReady = fetch("products.json")
    .then(response => {
        if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
        return response.json();
    })
    .then(products => {
        window.PRODUCTS = products;
        return products;
    });

function getProductById(id) {
    return (window.PRODUCTS || []).find(product => product.id === id);
}

function getProductsByBrand(brand) {
    return (window.PRODUCTS || []).filter(product => product.brand === brand);
}

function getProductsByCategory(category) {
    return (window.PRODUCTS || []).filter(product => product.category === category);
}

function getFeaturedProducts(limit = 4) {
    return (window.PRODUCTS || []).slice(0, limit);
}
