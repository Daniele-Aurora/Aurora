
(() => {
  "use strict";

  const MEASUREMENT_ID = "G-S5JT06CFXZ";
  const STORAGE_KEY = "aurora_analytics_consent";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Se il browser blocca il salvataggio,
      // la scelta sarà richiesta nuovamente.
    }
  }

  function startAnalytics() {
    if (window.auroraAnalyticsStarted) return;
    window.auroraAnalyticsStarted = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(MEASUREMENT_ID);

    document.head.appendChild(script);
  }

  function showConsentBanner() {
    if (document.getElementById("aurora-consent")) return;

    const banner = document.createElement("div");
    banner.id = "aurora-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Preferenze statistiche");

    Object.assign(banner.style, {
      position: "fixed",
      bottom: "16px",
      left: "16px",
      right: "16px",
      maxWidth: "520px",
      margin: "auto",
      padding: "20px",
      background: "#102b40",
      color: "#ffffff",
      border: "1px solid #829aaa",
      borderRadius: "12px",
      boxShadow: "0 8px 30px #0005",
      zIndex: "99999",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.5"
    });

    const title = document.createElement("strong");
    title.textContent = "Privacy e statistiche Aurora";

    const message = document.createElement("p");
    message.textContent =
      "Aurora utilizza Google Analytics, solo con il tuo " +
      "consenso, per conoscere le visite al sito. " +
      "Puoi accettare o rifiutare senza limitazioni " +
      "alla navigazione.";

const privacyLink = document.createElement("a");
privacyLink.href = "privacy.html";
privacyLink.textContent = "Leggi l'informativa privacy";

Object.assign(privacyLink.style, {
  display: "block",
  color: "#ffffff",
  textDecoration: "underline",
  marginBottom: "14px"
});

    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.gap = "12px";
    buttons.style.flexWrap = "wrap";

    function makeButton(label, value) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;

      Object.assign(button.style, {
        padding: "10px 18px",
        borderRadius: "8px",
        border: "1px solid #ffffff",
        background: value === "accepted" ? "#ffffff" : "transparent",
        color: value === "accepted" ? "#102b40" : "#ffffff",
        cursor: "pointer",
        fontSize: "15px"
      });

      button.addEventListener("click", () => {
        saveConsent(value);
        banner.remove();

        if (value === "accepted") {
          startAnalytics();
        }
      });

      return button;
    }

    buttons.appendChild(makeButton("Rifiuta", "rejected"));
    buttons.appendChild(makeButton("Accetta", "accepted"));

   
banner.appendChild(title);
banner.appendChild(message);
banner.appendChild(privacyLink);
banner.appendChild(buttons);

    document.body.appendChild(banner);
  }

  function init() {
    const consent = getConsent();

    if (consent === "accepted") {
      startAnalytics();
    } else if (consent !== "rejected") {
      showConsentBanner();
    }

    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.textContent = "Preferenze privacy";

    Object.assign(settingsButton.style, {
      position: "fixed",
      bottom: "8px",
      right: "8px",
      zIndex: "99998",
      padding: "6px 10px",
      fontSize: "12px",
      borderRadius: "6px",
      border: "1px solid #888",
      background: "#ffffff",
      color: "#102b40",
      cursor: "pointer"
    });

   
settingsButton.addEventListener("click", () => {
  const choice = getConsent();

  if (choice === "accepted") {
    const revoke = window.confirm(
      "Vuoi revocare il consenso alle statistiche di Aurora?"
    );

    if (revoke) {
      saveConsent("rejected");
      window.location.reload();
    }
  } else {
    showConsentBanner();
  }
});

    document.body.appendChild(settingsButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
