(function () {
  // --- helpers ---
  function onIdle(cb, timeout) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(cb, { timeout: timeout || 3000 });
    } else {
      setTimeout(cb, Math.min(timeout || 3000, 2000));
    }
  }

  function afterDelay(ms, cb) {
    setTimeout(cb, ms);
  }

  function onceUserIntent(cb) {
    let done = false;

    // use a stable option so removeEventListener works reliably
    const optsPassive = { passive: true };
    const optsCapture = { capture: true };

    const run = () => {
      if (done) return;
      done = true;
      cleanup();
      cb();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", run, optsCapture);
      window.removeEventListener("pointerdown", run, optsCapture);
      window.removeEventListener("keydown", run, optsCapture);
      window.removeEventListener("touchstart", run, optsCapture);
    };

    // use capture so we catch early intent
    window.addEventListener("scroll", run, { ...optsPassive, ...optsCapture });
    window.addEventListener("pointerdown", run, optsCapture);
    window.addEventListener("keydown", run, optsCapture);
    window.addEventListener("touchstart", run, { ...optsPassive, ...optsCapture });

    // fallback: still run eventually
    afterDelay(12000, run);
  }

  // --- loaders ---
  function loadGTM() {
    // prevent duplicate GTM
    if (window.google_tag_manager || window._gtm_loaded) return;
    window._gtm_loaded = true;

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-KP5XRG5D");
  }

  function loadLinkedInInsight() {
    // prevent duplicate load (GTM may already load it)
    if (window._linkedin_loaded || window.lintrk) return;
    window._linkedin_loaded = true;

    window._linkedin_partner_id = "8407852";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    if (!window._linkedin_data_partner_ids.includes(window._linkedin_partner_id)) {
      window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    }

    (function () {
      if (!window.lintrk) {
        window.lintrk = function (a, b) {
          window.lintrk.q.push([a, b]);
        };
        window.lintrk.q = [];
      }
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";
      b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);
    })();
  }

  function loadMetaPixel() {
    if (window._meta_pixel_loaded || window.fbq) return;
    window._meta_pixel_loaded = true;

    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
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
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    // ✅ UPDATED META PIXEL ID
    window.fbq("init", "1914816149105645");
    window.fbq("track", "PageView");
  }


  function loadClarity() {
    if (window._clarity_loaded || window.clarity) return;
    window._clarity_loaded = true;

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () {
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
    if (window._hotjar_loaded || window.hj) return;
    window._hotjar_loaded = true;

    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 6498478, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }

  // --- strategy ---
  onIdle(loadGTM, 500);

  afterDelay(1500, function () {
    onIdle(loadMetaPixel, 3000);
  });

  afterDelay(4000, function () {
    onIdle(loadLinkedInInsight, 4000);
  });

  onceUserIntent(function () {
    onIdle(loadClarity, 5000);
    afterDelay(2000, function () {
      onIdle(loadHotjar, 6000);
    });
  });
})();
