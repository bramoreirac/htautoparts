document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const password = document.getElementById("loginPassword");
    const toggle = document.getElementById("togglePassword");
    const status = document.getElementById("loginStatus");

    toggle.addEventListener("click", () => {
        const isVisible = password.type === "text";
        password.type = isVisible ? "password" : "text";
        toggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
        toggle.setAttribute("aria-pressed", String(!isVisible));
        toggle.querySelector("i").className = isVisible ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        status.textContent = "Account sign-in is not available yet. You can continue shopping as a guest.";
        password.value = "";
    });
});
