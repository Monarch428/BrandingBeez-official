(function () {
  const DEBUG = true;
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

  function onceUserIntent(cb) {
    let done = false;

    const run = () => {
      if (done) return;
      done = true;
      cleanup();
      log("👆 User intent detected");
      cb();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", run, true);
      window.removeEventListener("pointerdown", run, true);
      window.removeEventListener("keydown", run, true);
      window.removeEventListener("touchstart", run, true);
    };

    ["scroll", "pointerdown", "keydown", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, run, { capture: true, passive: true })
    );

    afterDelay(12000, run);
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

    s.onload = () => log(`🟢 Script loaded: ${id}`);
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

    loadScriptOnce(
      "bb-gtm",
      "https://www.googletagmanager.com/gtm.js?id=GTM-KP5XRG5D"
    );

    log("🟢 GTM load triggered");
  }

  function loadClarity() {
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) {
      log("🟡 Clarity skipped (handled by GTM)");
      return;
    }

    if (window.clarity || window._clarity_loaded) {
      log("⚠️ Clarity already loaded");
      return;
    }

    window._clarity_loaded = true;

    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      t.onload = () => log("🟢 Clarity loaded");
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "umfi093rcx");

    log("🟢 Clarity load triggered");
  }

  function loadHotjar() {
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) {
      log("🟡 Hotjar skipped (handled by GTM)");
      return;
    }

    if (window.hj || window._hj_loaded) {
      log("⚠️ Hotjar already loaded");
      return;
    }

    window._hj_loaded = true;
    window._hjSettings = { hjid: 6498478, hjsv: 6 };

    window.hj =
      window.hj ||
      function () {
        (window.hj.q = window.hj.q || []).push(arguments);
      };

    loadScriptOnce(
      "bb-hotjar",
      "https://static.hotjar.com/c/hotjar-6498478.js?sv=6"
    );

    log("🟢 Hotjar load triggered");
  }

  /* ================================
     STRATEGY
  ================================= */

  if (USE_GTM) {
    log("🚀 GTM mode active");
    onIdle(loadGTM, 500);
    return;
  }

  afterDelay(1500, () => onIdle(loadClarity, 3000));

  onceUserIntent(() => {
    afterDelay(1000, () => onIdle(loadHotjar, 4000));
  });
})();
