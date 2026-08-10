/* BuyerPilot GA4 analytics loader.
   Tracking stays disabled until ga4MeasurementId is set in config.js. */
(() => {
  const cfg = window.SOURCEPILOT_CONFIG || {};
  const measurementId = String(cfg.ga4MeasurementId || "").trim();

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(tag);

  const send = (name, params = {}) => {
    try { window.gtag("event", name, params); } catch (_) {}
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const checkout = link.getAttribute("data-checkout");
    const store = link.getAttribute("data-browser-store");

    if (checkout) {
      send("sourcepilot_cta_click", {
        cta_type: "checkout_or_trial",
        plan: checkout,
        link_url: link.href || href
      });
    }

    if (store || /chromewebstore\.google\.com|microsoftedge\.microsoft\.com\/addons|addons\.mozilla\.org/i.test(href)) {
      send("extension_store_click", {
        store: store || (
          /chromewebstore/i.test(href) ? "chrome" :
          /microsoftedge/i.test(href) ? "edge" : "firefox"
        ),
        link_url: link.href || href
      });
    }

    if (/^mailto:/i.test(href) || /wa\.me|t\.me/i.test(href)) {
      send("support_contact_click", {
        channel: /^mailto:/i.test(href) ? "email" : "telegram"
      });
    }
  });

  document.addEventListener("play", (event) => {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    const source = video.currentSrc || video.querySelector("source")?.src || "";
    send("tutorial_video_play", {
      video_file: source.split("/").pop() || "video"
    });
  }, true);
})();