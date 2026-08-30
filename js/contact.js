document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        status.textContent = "Thanks! Your message has been received. We'll get back to you soon.";
        form.reset();
    });
});
