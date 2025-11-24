// External script loading to avoid CSP violations
export function loadExternalScripts() {
  // Load Calendly script on demand
  function loadCalendly() {
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }
  
  // Load Replit dev banner only in development
  function loadReplitBanner() {
    if (window.location.hostname.includes('replit.dev') || window.location.hostname.includes('replit.co')) {
      const script = document.createElement('script');
      script.src = 'https://replit.com/public/js/replit-dev-banner.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }
  
  // Load Calendly CSS
  function loadCalendlyCSS() {
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
  }
  
  // Load main CSS non-blocking
  function loadMainCSS() {
    if (!document.querySelector('link[href*="index.css"][rel="stylesheet"]')) {
      const preloadLink = document.querySelector('link[href*="index.css"][rel="preload"]') as HTMLLinkElement;
      if (preloadLink) {
        preloadLink.onload = null;
        preloadLink.rel = 'stylesheet';
      }
    }
  }
  
  // Load non-critical scripts after initial page load
  window.addEventListener('load', function() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function() {
        loadCalendlyCSS();
        loadCalendly();
        loadReplitBanner();
      });
    } else {
      setTimeout(function() {
        loadCalendlyCSS();
        loadCalendly();
        loadReplitBanner();
      }, 100);
    }
  });
}