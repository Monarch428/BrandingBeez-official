// External analytics loading with CSP compliance
export function initializeAnalytics() {
  // Initialize dataLayer but don't load GA immediately
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  
  // Microsoft Clarity is now loaded directly in HTML head
  
  // Load Google Analytics after initial page load
  function loadGoogleAnalytics() {
    if (!document.querySelector('script[src*="googletagmanager"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GNEDWN3ZNT';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      script.onload = function() {
        gtag('js', new Date());
        gtag('config', 'G-GNEDWN3ZNT');
      };
    }
  }
  
  // Load analytics after page is interactive
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadGoogleAnalytics();
      }, 2000);
    });
  } else {
    setTimeout(() => {
      loadGoogleAnalytics();
    }, 2000);
  }
}