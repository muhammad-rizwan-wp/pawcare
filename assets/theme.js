/*==========================================================================
   PawCare Theme JavaScript
========================================================================== */

/* >>> Initializes mobile navigation header menu functionality <<< */

function initHeaderMenu() {
  const header = document.querySelector("header");

  if (!header || header.dataset.menuInitialized === "true") return;

  header.dataset.menuInitialized = "true";

  const toggle = header.querySelector(".header__toggle");
  const menu = header.querySelector("#PCMenu");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open Navigation Menu");
    menu.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Open Navigation Menu" : "Close Navigation Menu",
    );
    menu.classList.toggle("is-open", !isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}

// Run when the DOM content is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderMenu);
} else {
  initHeaderMenu();
}

// Re-initialize menu when section re-renders inside Shopify Theme Customizer
document.addEventListener("shopify:section:load", (event) => {
  const header = event.target.querySelector(
    ".pc-header, .site-header, .header",
  );
  if (header) {
    delete header.dataset.menuInitialized;
    initHeaderMenu();
  }
});
