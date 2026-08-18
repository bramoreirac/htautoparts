/* ==========================================================
   HTAutoParts
   app.js
   Global Website Functions
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeSearch();

    initializeScrollEffects();

    initializeProductCards();

});

/* =========================================================
   PRODUCT CARD CLICK HANDLING
========================================================== */

function initializeProductCards() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        const productLink = card.querySelector("a.btn-primary[href^='product.html?id=']");

        if (!productLink) return;

        card.addEventListener("click", event => {

            if (event.target.closest("a")) return;

            window.location.href = productLink.href;

        });

    });

}

/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

function initializeNavigation() {

    const currentPage = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

}

/* ==========================================================
   SEARCH BAR
========================================================== */

function initializeSearch() {

    const searchInput = document.querySelector(".nav-search input");

    const searchButton = document.querySelector(".nav-search button");

    if (!searchInput || !searchButton) return;

    function performSearch() {

        const value = searchInput.value.trim();

        if (value === "") return;

        // Future implementation

        console.log("Searching:", value);

    }

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keypress", e => {

        if (e.key === "Enter") {

            performSearch();

        }

    });

}

/* ==========================================================
   SCROLL ANIMATIONS
========================================================== */

function initializeScrollEffects() {

    const header = document.querySelector(".header");

    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        }

        else {

            header.classList.remove("scrolled");

        }

    });

}