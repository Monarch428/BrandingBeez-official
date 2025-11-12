// Aggressive non-blocking resource loading to eliminate all render-blocking requests
export function eliminateRenderBlocking(): void {
  // 1. Force all stylesheets to load non-blocking
  const allStylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([media="print"])');
  allStylesheets.forEach(link => {
    const styleLink = link as HTMLLinkElement;
    // Convert to non-blocking using media="print" trick
    if (!styleLink.onload) {
      const originalMedia = styleLink.media || 'all';
      styleLink.media = 'print';
      styleLink.onload = function() {
        styleLink.media = originalMedia;
        styleLink.onload = null;
      };
    }
  });

  // 2. Defer all non-critical CSS
  const deferredCSS = [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    'https://assets.calendly.com/assets/external/widget.css'
  ];

  deferredCSS.forEach(href => {
    const existingLink = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement;
    if (existingLink && existingLink.rel === 'stylesheet') {
      existingLink.media = 'print';
      existingLink.onload = function() {
        existingLink.media = 'all';
        existingLink.onload = null;
      };
    }
  });

  // 3. Ensure main CSS loads asynchronously
  const mainCSS = document.querySelector('link[href*="index.css"]') as HTMLLinkElement;
  if (mainCSS) {
    const loadCSS = () => {
      if (mainCSS.rel === 'preload') {
        mainCSS.rel = 'stylesheet';
        mainCSS.media = 'all';
      }
    };
    
    // Load after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadCSS);
    } else {
      setTimeout(loadCSS, 0);
    }
  }

  // 4. Aggressively defer all external scripts
  const externalScripts = document.querySelectorAll('script[src*="http"]');
  externalScripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    if (!scriptEl.defer && !scriptEl.async) {
      scriptEl.defer = true;
    }
  });

  // 5. Use requestIdleCallback for non-critical resources
  const loadNonCritical = () => {
    // Load Google Fonts
    const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]') as HTMLLinkElement;
    if (fontLink && fontLink.media === 'print') {
      fontLink.media = 'all';
    }

    // Load Calendly resources
    const calendlyCSS = document.querySelector('link[href*="calendly"][href*="css"]') as HTMLLinkElement;
    if (calendlyCSS && calendlyCSS.rel === 'preload') {
      calendlyCSS.rel = 'stylesheet';
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadNonCritical, { timeout: 2000 });
  } else {
    setTimeout(loadNonCritical, 100);
  }

  // 6. Performance monitoring
  if ('performance' in window && performance.mark) {
    performance.mark('render-blocking-eliminated');
    
    // Measure LCP improvement
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP after optimization:', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

// Execute immediately to prevent any render blocking
eliminateRenderBlocking();