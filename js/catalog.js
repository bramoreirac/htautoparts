/* ==========================================================
   HTAutoParts
   catalog.js
   Catalog Brand Filtering
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeBrandFilter();

});

function initializeBrandFilter(){

    const brandFilters = document.querySelectorAll('input[name="brand"]');
    const productCards = document.querySelectorAll(".catalog-products .product-card");
    const productCount = document.getElementById("catalogProductCount");

    if(!brandFilters.length || !productCards.length) return;

    function applyBrandFilter(){

        const selectedBrand = document.querySelector('input[name="brand"]:checked')?.value || "all";
        let visibleCount = 0;

        productCards.forEach(card => {

            const isVisible = selectedBrand === "all" || card.dataset.brand === selectedBrand;

            card.hidden = !isVisible;

            if(isVisible) visibleCount++;

        });

        if(productCount){

            productCount.textContent = `Showing ${visibleCount} product${visibleCount === 1 ? "" : "s"}`;

        }

    }

    brandFilters.forEach(filter => {

        filter.addEventListener("change", applyBrandFilter);

    });

    applyBrandFilter();

}
