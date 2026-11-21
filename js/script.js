
// =====================================
// MALKE FINISHING WORKS
// Main JavaScript
// =====================================


// Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});


// Close menu after clicking a navigation link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});


// Project Category Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate selected button
        button.classList.add("active");

        const selectedCategory = button.dataset.filter;

        projectCards.forEach(card => {

            const category = card.dataset.category;

            if (
                selectedCategory === "all" ||
                selectedCategory === category
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});


// Automatic Footer Year
document.getElementById("year").textContent =
    new Date().getFullYear();


// Contact Form
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const CFG = window.MALKE_CONFIG || {};

function setMsg(text, ok) {
    formMessage.textContent = text;
    formMessage.style.color = ok ? "#15803d" : "#dc2626";
}

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = new FormData(contactForm);
    if (data.get("_gotcha")) return; // spam bot

    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();
    const service = data.get("service");
    const message = (data.get("message") || "").trim();

    if (!name || !email || !service || !message) {
        setMsg("Please complete all fields.", false);
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg("Please enter a valid email address.", false);
        return;
    }

    // No endpoint set yet: demo mode
    if (!CFG.formEndpoint) {
        setMsg("Demo mode: form validated. Add formEndpoint in js/config.js to receive real inquiries.", true);
        contactForm.reset();
        return;
    }

    const btn = contactForm.querySelector("button[type=submit]");
    btn.disabled = true;
    setMsg("Sending...", true);

    try {
        const res = await fetch(CFG.formEndpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data
        });
        if (!res.ok) throw new Error("Request failed");
        setMsg("Thank you! We received your inquiry and will contact you soon.", true);
        contactForm.reset();
    } catch (err) {
        setMsg("Sorry, something went wrong. Please try again or contact us directly.", false);
    } finally {
        btn.disabled = false;
    }
});


// Contact details from config
(function applyConfig() {
    const show = (el, on) => { if (el) el.hidden = !on; };

    if (CFG.phone) {
        const tel = "tel:" + CFG.phone.replace(/[^+\d]/g, "");
        document.getElementById("phoneText").innerHTML =
            '<a href="' + tel + '">' + CFG.phone + "</a>";
        const call = document.getElementById("navCall");
        call.href = tel;
        call.querySelector("span").textContent = CFG.phone;
        show(call.parentElement, true);
    }

    if (CFG.email) {
        document.getElementById("emailText").innerHTML =
            '<a href="mailto:' + CFG.email + '">' + CFG.email + "</a>";
        show(document.getElementById("emailDetail"), true);
    }

    const quick = document.getElementById("quickLinks");
    const links = [];
    if (CFG.telegram) links.push('<a href="https://t.me/' + CFG.telegram + '" target="_blank" rel="noopener"><i class="fa-brands fa-telegram"></i> Telegram</a>');
    if (CFG.whatsapp) links.push('<a href="https://wa.me/' + CFG.whatsapp + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>');
    if (CFG.mapLink) links.push('<a href="' + CFG.mapLink + '" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> View on Map</a>');
    if (links.length) { quick.innerHTML = links.join(""); show(quick, true); }
})();


// =====================================
// PROJECT IMAGE PREVIEW
// =====================================

const lightbox = document.getElementById("projectLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const closeLightbox = document.getElementById("closeLightbox");

// Open project preview
let lastFocused = null;

projectCards.forEach(card => {

    const openCard = () => {
        lastFocused = card;

        const image = card.querySelector("img");
        const title = card.querySelector("h3");
        const category = card.querySelector(".project-info span");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = title.textContent;
        lightboxCategory.textContent = category.textContent;

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        closeLightbox.focus();
    };

    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCard();
        }
    });

});

// Close preview
function closeProjectPreview() {

    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();

}

closeLightbox.addEventListener("click", closeProjectPreview);

// Close when clicking outside the image
lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeProjectPreview();
    }

});

// Close with Escape key
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeProjectPreview();
    }

});


// =====================================
// ACTIVE NAV LINK ON SCROLL
// =====================================
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');
const sections = [...navAnchors]
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a =>
                    a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(sec => io.observe(sec));
}


// =====================================
// REVEAL ON SCROLL
// =====================================
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealEls = document.querySelectorAll(".service-card, .project-card, .process-step, .section-heading");
    revealEls.forEach(el => el.classList.add("reveal"));
    const ro = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
        });
    }, { threshold: .12 });
    revealEls.forEach(el => ro.observe(el));
}
