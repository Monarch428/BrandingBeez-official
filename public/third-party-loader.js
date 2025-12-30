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
    const run = () => {
      if (done) return;
      done = true;
      cleanup();
      cb();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", run, { passive: true });
      window.removeEventListener("pointerdown", run);
      window.removeEventListener("keydown", run);
      window.removeEventListener("touchstart", run, { passive: true });
    };

    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("pointerdown", run);
    window.addEventListener("keydown", run);
    window.addEventListener("touchstart", run, { passive: true });

    // fallback: still run eventually
    afterDelay(12000, run);
  }

  function loadScript(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
    return s;
  }

  // --- loaders ---
  function loadGTM() {
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
    window._linkedin_partner_id = "8407852";
    window._linkedin_data_partner_ids =
      window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);

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

  function loadClarity() {
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
  // Phase 1: GTM after first idle (keeps marketing tags working)
  onIdle(loadGTM, 2500);

  // Phase 2: LinkedIn a bit later (not critical for first paint)
  afterDelay(4000, function () {
    onIdle(loadLinkedInInsight, 4000);
  });

  // Phase 3: Heavy replay tools ONLY on user intent (or after 12s fallback)
  onceUserIntent(function () {
    // space them out to avoid a CPU spike
    onIdle(loadClarity, 5000);
    afterDelay(2000, function () {
      onIdle(loadHotjar, 6000);
    });
  });
})();
