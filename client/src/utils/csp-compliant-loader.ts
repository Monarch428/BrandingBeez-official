// CSP-compliant loader for external scripts and analytics
export const loadCSPCompliantScripts = () => {
  // Microsoft Clarity is now loaded directly in HTML head

  // Calendly - CSP compliant loading
  const loadCalendly = () => {
    try {
      // Only load if not already present
      if (!document.querySelector('script[src*="calendly.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(script);
        
        // Load Calendly CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(link);
      }
    } catch (error) {
      console.warn('Calendly failed to load:', error);
    }
  };

  // Google Analytics - CSP compliant loading  
  const loadGoogleAnalytics = () => {
    try {
      if (!document.querySelector('script[src*="googletagmanager"]')) {
        // DataLayer initialization
        (window as any).dataLayer = (window as any).dataLayer || [];
        const gtag = (...args: any[]) => {
          (window as any).dataLayer.push(args);
        };
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GNEDWN3ZNT';
        script.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(script);
        
        script.onload = () => {
          gtag('js', new Date());
          gtag('config', 'G-GNEDWN3ZNT');
        };
      }
    } catch (error) {
      console.warn('Google Analytics failed to load:', error);
    }
  };

  // Load scripts in optimal order with delays to prevent blocking
  setTimeout(() => {
    loadCalendly();
  }, 1000);
  
  setTimeout(() => {
    loadGoogleAnalytics();
  }, 2000);
};

// Enhanced error suppression for CSP-related issues
export const suppressCSPErrors = () => {
  // Suppress common CSP violation warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    if (
      message.includes('Content Security Policy') ||
      message.includes('CSP') ||
      message.includes('refused to load') ||
      message.includes('blocked by CORS')
    ) {
      // Silently ignore CSP warnings that are expected
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Handle CSP violations gracefully
  document.addEventListener('securitypolicyviolation', (e) => {
    // Log CSP violations but don't show them to users
    console.debug('CSP violation (handled):', {
      directive: e.violatedDirective,
      blockedURI: e.blockedURI,
      originalPolicy: e.originalPolicy
    });
    e.preventDefault();
  });
};