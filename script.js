(function () {
  "use strict";

  const config = window.EFOIL_CONFIG || {};
  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const bookingForm = document.getElementById("booking-form");
  const durationSelect = document.getElementById("duration");
  const estimatePrice = document.getElementById("estimate-price");
  const requestDialog = document.getElementById("request-dialog");
  const requestPreview = document.getElementById("request-preview");
  const requestStatus = document.getElementById("request-status");
  const requestDialogIntro = document.getElementById("request-dialog-intro");
  const sendEmailLink = document.getElementById("send-email-link");
  const copyRequestButton = document.getElementById("copy-request");
  const mobileBookingCta = document.querySelector(".mobile-booking-cta");
  let currentRequest = "";

  const isMissing = (value) => {
    if (!value || typeof value !== "string") return true;
    const normalized = value.toLowerCase();
    return (
      normalized.includes("uzupełnij") ||
      normalized.includes("uzupelnij") ||
      normalized.includes("example.") ||
      normalized.includes("000 000") ||
      normalized === "#"
    );
  };

  const hasPhone = !isMissing(config.phone);
  const hasEmail = !isMissing(config.email);

  function configureContent() {
    const brandName = config.brandName || "eFoil Szczecin";
    document.querySelectorAll("[data-brand-name]").forEach((element) => {
      element.textContent = brandName;
    });

    document.querySelectorAll("[data-deposit]").forEach((element) => {
      element.textContent = config.deposit || "do potwierdzenia";
    });

    document.querySelectorAll("[data-pickup-note]").forEach((element) => {
      element.textContent =
        config.pickupNote ||
        "Szczecin — dokładne miejsce odbioru ustalamy przy rezerwacji";
    });

    document.querySelectorAll("[data-phone-text]").forEach((element) => {
      element.textContent = hasPhone ? config.phone : "Telefon do uzupełnienia";
    });

    document.querySelectorAll("[data-email-text]").forEach((element) => {
      element.textContent = hasEmail ? config.email : "E-mail do uzupełnienia";
    });

    document.querySelectorAll("[data-phone-link]").forEach((element) => {
      if (hasPhone) {
        element.href = `tel:${config.phone.replace(/[^\d+]/g, "")}`;
      } else {
        element.href = "#rezerwacja";
        element.classList.add("is-unconfigured");
        element.addEventListener("click", (event) => {
          event.preventDefault();
          document.getElementById("rezerwacja").scrollIntoView();
        });
      }
    });

    document.querySelectorAll("[data-email-link]").forEach((element) => {
      if (hasEmail) {
        element.href = `mailto:${config.email}`;
      } else {
        element.href = "#rezerwacja";
        element.classList.add("is-unconfigured");
        element.addEventListener("click", (event) => {
          event.preventDefault();
          document.getElementById("rezerwacja").scrollIntoView();
        });
      }
    });

    if (!hasPhone || !hasEmail) {
      const alert = document.getElementById("config-alert");
      alert.hidden = false;
      document.body.classList.add("has-config-alert");
    }
  }

  function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otwórz menu");
    mobileNav.hidden = true;
    header.classList.remove("is-menu-open");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Zamknij menu" : "Otwórz menu");
    mobileNav.hidden = !willOpen;
    header.classList.toggle("is-menu-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  }

  function configureNavigation() {
    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    menuToggle.addEventListener("click", toggleMenu);
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.hidden) closeMenu();
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".desktop-nav a")];

    if ("IntersectionObserver" in window) {
      const activeObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (!visible) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${visible.target.id}`
            );
          });
        },
        { rootMargin: "-25% 0px -62% 0px", threshold: [0, 0.1, 0.3] }
      );

      sections.forEach((section) => activeObserver.observe(section));
    }
  }

  function configureReveals() {
    const elements = document.querySelectorAll(".reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach((element) => revealObserver.observe(element));
  }

  function configureFaq() {
    const details = [...document.querySelectorAll(".faq-list details")];
    details.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        details.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  const formatPrice = (value) =>
    new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(value);

  function getPrice(duration) {
    const price = config.prices && config.prices[duration];
    if (!price || typeof price.from !== "number") return null;
    return price;
  }

  function updateEstimate() {
    const price = getPrice(durationSelect.value);
    estimatePrice.textContent = price
      ? `od ${formatPrice(price.from)} zł`
      : "wycena indywidualna";
  }

  function configurePricing() {
    durationSelect.addEventListener("change", updateEstimate);
    updateEstimate();

    document.querySelectorAll("[data-duration-choice]").forEach((link) => {
      link.addEventListener("click", () => {
        durationSelect.value = link.dataset.durationChoice;
        updateEstimate();
      });
    });
  }

  function setMinimumDate() {
    const dateInput = document.getElementById("booking-date");
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${year}-${month}-${day}`;
  }

  function buildRequest(formData) {
    const duration = formData.get("duration");
    const price = getPrice(duration);
    const priceLine = price
      ? `${formatPrice(price.from)}–${formatPrice(price.to)} zł`
      : "do indywidualnej wyceny";

    return [
      "Dzień dobry,",
      "",
      "proszę o sprawdzenie dostępności eFoila:",
      "",
      `Imię i nazwisko: ${formData.get("name")}`,
      `Kontakt: ${formData.get("contact")}`,
      `Preferowany termin: ${formData.get("date")}`,
      `Długość wynajmu: ${duration} ${duration === "1" ? "dzień" : "dni"}`,
      `Orientacyjna cena z cennika: ${priceLine}`,
      `Waga użytkownika: ${formData.get("weight")} kg`,
      `Doświadczenie: ${formData.get("experience")}`,
      `Planowane miejsce: ${formData.get("location")}`,
      `Dowóz: ${formData.get("delivery") ? "tak, proszę o wycenę" : "nie / do ustalenia"}`,
      `Dodatkowe informacje: ${formData.get("message") || "brak"}`,
      "",
      "Proszę o potwierdzenie terminu, ceny, kaucji i warunków odbioru.",
      "",
      "Pozdrawiam"
    ].join("\n");
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function configureDialogs() {
    document.querySelectorAll("[data-dialog-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = document.getElementById(button.dataset.dialogOpen);
        if (dialog) openDialog(dialog);
      });
    });

    document.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = button.closest("dialog");
        if (dialog) closeDialog(dialog);
      });
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });
  }

  async function copyRequest() {
    requestStatus.textContent = "";
    try {
      await navigator.clipboard.writeText(currentRequest);
      requestStatus.textContent = "Treść została skopiowana.";
      copyRequestButton.textContent = "Skopiowano ✓";
      window.setTimeout(() => {
        copyRequestButton.textContent = "Kopiuj treść";
      }, 1800);
    } catch (_error) {
      const helper = document.createElement("textarea");
      helper.value = currentRequest;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      requestStatus.textContent = copied
        ? "Treść została skopiowana."
        : "Nie udało się skopiować. Zaznacz treść powyżej ręcznie.";
    }
  }

  function configureBookingForm() {
    setMinimumDate();

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;

      const formData = new FormData(bookingForm);
      currentRequest = buildRequest(formData);
      requestPreview.textContent = currentRequest;
      requestStatus.textContent = "";

      if (hasEmail) {
        const subject = encodeURIComponent(
          `Zapytanie o eFoil — ${formData.get("date")}, ${formData.get("duration")} dni`
        );
        sendEmailLink.href = `mailto:${config.email}?subject=${subject}&body=${encodeURIComponent(currentRequest)}`;
        sendEmailLink.hidden = false;
        requestDialogIntro.textContent =
          "Sprawdź treść i otwórz swój program pocztowy albo skopiuj wiadomość.";
      } else {
        sendEmailLink.hidden = true;
        requestDialogIntro.textContent =
          "Dane kontaktowe właściciela nie są jeszcze skonfigurowane. Możesz skopiować gotową treść wiadomości.";
      }

      openDialog(requestDialog);
    });

    copyRequestButton.addEventListener("click", copyRequest);
  }

  function configureMobileCta() {
    if (!mobileBookingCta || !("IntersectionObserver" in window)) return;
    const bookingSection = document.getElementById("rezerwacja");
    const footer = document.querySelector(".site-footer");
    const observer = new IntersectionObserver(
      (entries) => {
        const shouldHide = entries.some((entry) => entry.isIntersecting);
        mobileBookingCta.classList.toggle("is-hidden", shouldHide);
      },
      { threshold: 0.08 }
    );
    observer.observe(bookingSection);
    observer.observe(footer);
  }

  configureContent();
  configureNavigation();
  configureReveals();
  configureFaq();
  configurePricing();
  configureDialogs();
  configureBookingForm();
  configureMobileCta();

  document.getElementById("current-year").textContent = new Date().getFullYear();
})();
