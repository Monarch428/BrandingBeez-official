(function () {
  const GTM_ID = "GTM-KP5XRG5D";

  /* ================================
     BOT GUARD (Analytics Clean)
  ================================= */
  const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
  if (isBot) return;

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

  function loadScriptOnce(id, src, onloadCb) {
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = src;

    s.onload = () => {
      if (typeof onloadCb === "function") onloadCb();
    };

    document.head.appendChild(s);
  }

  /* ================================
     CONFIG (GTM + FALLBACK DIRECT)
  ================================= */
  const USE_GTM = true;
  const LOAD_VENDORS_DIRECTLY = true;

  /* ================================
     LOADERS
  ================================= */

  function loadGTM() {
    if (window.google_tag_manager || window._gtm_loaded) return;

    window._gtm_loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    loadScriptOnce(
      "bb-gtm",
      "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID
    );
  }

  function loadClarity() {
    if (window.clarity || window._clarity_loaded) return;
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
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "umfi093rcx");
  }

  function loadHotjar() {
    if (window.hj || window._hj_loaded) return;

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
  }

  /* ================================
     STRATEGY (FINAL)
  ================================= */

  // 1) Always try GTM first
  if (USE_GTM) {
    onIdle(loadGTM, 500);
  }

  // 2) Fallback vendors if GTM does not load them
  if (LOAD_VENDORS_DIRECTLY) {
    afterDelay(3500, () => {
      if (typeof window.clarity === "undefined") {
        onIdle(loadClarity, 4000);
      }
    });

    onceUserIntent(() => {
      afterDelay(1500, () => {
        if (typeof window.hj === "undefined") {
          onIdle(loadHotjar, 5000);
        }
      });
    });
  }
})();
