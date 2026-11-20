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

function initTabs(container = document) {
  const tabContainers = container.querySelectorAll(".pc__tabs");

  tabContainers.forEach((tabWrapper) => {
    if (tabWrapper.dataset.tabsInitialized === "true") return;

    tabWrapper.dataset.tabsInitialized = "true";

    const tabsButtons = Array.from(
      tabWrapper.querySelectorAll('.tab-btn[role="tab"]'),
    );

    const tabsPanels = Array.from(
      tabWrapper.querySelectorAll('.tab-panel[role="tabpanel"]'),
    );

    if (!tabsButtons.length || !tabsPanels.length) return;

    const activateTab = (targetBtn) => {
      const targetPanelId = targetBtn.getAttribute("aria-controls");

      tabsButtons.forEach((btn) => {
        const isSelected = btn === targetBtn;
        btn.classList.toggle("active", isSelected);
        btn.setAttribute("aria-selected", String(isSelected));
      });

      tabsPanels.forEach((panel) => {
        const isMatch = panel.id === targetPanelId;
        panel.classList.toggle("active", isMatch);
        panel.hidden = !isMatch;
      });
    };

    tabsButtons.forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn));

      btn.addEventListener("keydown", (e) => {
        const currentIndex = tabsButtons.indexOf(btn);
        let nextIndex = null;

        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabsButtons.length;
        } else if (e.key === "ArrowLeft") {
          nextIndex =
            (currentIndex - 1 + tabsButtons.length) % tabsButtons.length;
        } else if (e.key === "Home") {
          nextIndex = 0;
        } else if (e.key === "End") {
          nextIndex = currentIndex + 1;
        }

        if (nextIndex !== null) {
          e.preventDefault();
          tabsButtons[nextIndex].focus();
          activateTab(tabsButtons[nextIndex]);
        }
      });
    });
  });
}

/*------------------------------------------*/
/* Initializer 
/*------------------------------------------*/

function initAllModules(container = document) {
  initHeaderMenu(container);
  initTabs(container);
}

// Run when the DOM content is ready
if (document.readyState === "loading") {
  // document.addEventListener("DOMContentLoaded", initHeaderMenu);
  document.addEventListener("DOMContentLoaded", () => initAllModules(document));
} else {
  // initHeaderMenu();
  initAllModules(document);
}

// Re-initialize menu when section re-renders inside Shopify Theme Customizer
document.addEventListener("shopify:section:load", (event) => {
  const header = event.target.querySelector(
    ".pc-header, .site-header, .header",
  );
  if (header) {
    delete header.dataset.menuInitialized;
    // initHeaderMenu();
  }
  event.target.querySelectorAll(".pc__tabs").forEach((tabsWrapper) => {
    delete tabsWrapper.dataset.tabsInitialized;
  });

  initAllModules(event.target);
});

// Auto-switch tab when clicking a block inside

document.addEventListener("shopify:block:select", (event) => {
  const targetTabBtn = event.target.matches('.tab-btn[role="tab"]')
    ? event.target
    : event.target.querySelector(`.tab-btn[role="tab"]`);

  if (targetTabBtn) {
    targetTabBtn.click();
  }
});
