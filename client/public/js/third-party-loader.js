(function () {
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

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  /* ================================
     CONFIG (IMPORTANT)
     - If you load GTM, DO NOT also load vendors here.
     - Put Meta/Clarity/Hotjar/LinkedIn tags INSIDE GTM.
  ================================= */
  const USE_GTM = true;
  const LOAD_VENDORS_DIRECTLY = false;

  /* ================================
     LOADERS (DUPLICATE SAFE)
  ================================= */

  function loadGTM() {
    if (window.google_tag_manager || window._gtm_loaded) return;
    window._gtm_loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    loadScriptOnce("bb-gtm", "https://www.googletagmanager.com/gtm.js?id=GTM-KP5XRG5D");
  }

  function loadMetaPixel() {
    // If GTM is handling, skip
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) return;

    if (window.fbq || window._meta_loaded) return;
    window._meta_loaded = true;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", "1914816149105645");
    window.fbq("track", "PageView");
  }

  function loadLinkedIn() {
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) return;

    if (window.lintrk || window._li_loaded) return;
    window._li_loaded = true;

    window._linkedin_partner_id = "8407852";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push("8407852");

    loadScriptOnce("bb-linkedin", "https://snap.licdn.com/li.lms-analytics/insight.min.js");
  }

  function loadClarity() {
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) return;

    if (window.clarity || window._clarity_loaded) return;
    window._clarity_loaded = true;

    // ✅ Official-style stub to avoid undefined/partial states
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
    if (USE_GTM && !LOAD_VENDORS_DIRECTLY) return;

    if (window.hj || window._hj_loaded) return;
    window._hj_loaded = true;

    // ✅ REQUIRED to prevent: "_hjSettings is not defined"
    window._hjSettings = { hjid: 6498478, hjsv: 6 };

    window.hj =
      window.hj ||
      function () {
        (window.hj.q = window.hj.q || []).push(arguments);
      };

    loadScriptOnce("bb-hotjar", "https://static.hotjar.com/c/hotjar-6498478.js?sv=6");
  }

  /* ================================
     STRATEGY
  ================================= */

  if (USE_GTM) {
    onIdle(loadGTM, 500);
    return;
  }

  // If you ever set USE_GTM = false, this becomes your direct-loader strategy:
  afterDelay(1500, () => onIdle(loadMetaPixel, 3000));
  afterDelay(4000, () => onIdle(loadLinkedIn, 3000));

  onceUserIntent(() => {
    onIdle(loadClarity, 4000);
    afterDelay(2000, () => onIdle(loadHotjar, 5000));
  });
})();
