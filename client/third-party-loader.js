(function () {
  const DEBUG = true;
  const GTM_ID = "GTM-KP5XRG5D";

  const log = (...args) =>
    DEBUG && console.log("%c[BB-TRACKING]", "color:#10b981;font-weight:600", ...args);

  /* ================================
     BOT GUARD (Analytics Clean)
  ================================= */
  const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
  if (isBot) {
    log("🚫 Bot detected – tracking skipped");
    return;
  }

  log("🟢 Loader initialized");

  /* ================================
     HELPERS
  ================================= */
  function onIdle(cb, timeout = 3000) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(cb, { timeout });
    } else {
      setTimeout(cb, Math.min(timeout, 2000));
    }
  }

  function afterDelay(ms, cb) {
    setTimeout(cb, ms);
  }

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) {
      log(`⚠️ Script already exists: ${id}`);
      return;
    }

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = src;

    s.onload = () => {
      log(`🟢 Script loaded: ${id}`);
      // After GTM script loads, verify container boot
      if (id === "bb-gtm") verifyGTM();
    };

    s.onerror = () => log(`❌ Script failed: ${id}`);
    document.head.appendChild(s);
  }

  /* ================================
     CONFIG
  ================================= */
  const USE_GTM = true;
  const LOAD_VENDORS_DIRECTLY = false;

  log("Config →", { USE_GTM, LOAD_VENDORS_DIRECTLY });

  /* ================================
     VERIFY GTM (THIS IS WHAT YOU NEED)
  ================================= */
  function verifyGTM() {
    // 1) Check google_tag_manager object
    const hasGtmObj = !!window.google_tag_manager;
    const hasThisContainer =
      hasGtmObj && typeof window.google_tag_manager[GTM_ID] !== "undefined";

    log("🔎 GTM verify →", {
      has_google_tag_manager: hasGtmObj,
      has_container_id: hasThisContainer,
      container_key_present: hasThisContainer ? "YES" : "NO",
    });

    // 2) Push a debug event (shows in GTM preview + dataLayer)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "bb_debug_gtm_loaded",
      gtm_id: GTM_ID,
      ts: Date.now(),
    });
    log("📤 dataLayer event pushed: bb_debug_gtm_loaded");

    // 3) Confirm that dataLayer is receiving pushes
    try {
      const dlLen = window.dataLayer.length;
      log("📦 dataLayer length:", dlLen);
    } catch (e) {
      log("❌ dataLayer access failed", e);
    }

    // 4) If container didn't register yet, re-check a few times
    if (!hasThisContainer) {
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;

        const ok =
          window.google_tag_manager &&
          typeof window.google_tag_manager[GTM_ID] !== "undefined";

        if (ok) {
          clearInterval(timer);
          log(`🟢 GTM container detected after retry (${tries})`);
          window.dataLayer.push({
            event: "bb_debug_gtm_container_ready",
            gtm_id: GTM_ID,
            ts: Date.now(),
          });
          log("📤 dataLayer event pushed: bb_debug_gtm_container_ready");
        }

        if (tries >= 10) {
          clearInterval(timer);
          log("❌ GTM container NOT detected after retries (possible blocked/consent/CSP issue)");
        }
      }, 300);
    }
  }

  /* ================================
     LOADERS
  ================================= */
  function loadGTM() {
    if (window.google_tag_manager || window._gtm_loaded) {
      log("⚠️ GTM already loaded");
      return;
    }

    window._gtm_loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    loadScriptOnce("bb-gtm", "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID);
    log("🟢 GTM load triggered");
  }

  /* ================================
     STRATEGY
  ================================= */
  if (USE_GTM) {
    log("🚀 GTM mode active");
    onIdle(loadGTM, 500);
    return;
  }
})();
