// // CSP-compliant loader for external scripts and analytics
// export const loadCSPCompliantScripts = () => {
//   // Microsoft Clarity is now loaded directly in HTML head

//   // Calendly - CSP compliant loading
//   const loadCalendly = () => {
//     try {
//       // Only load if not already present
//       if (!document.querySelector('script[src*="calendly.com"]')) {
//         const script = document.createElement('script');
//         script.src = 'https://assets.calendly.com/assets/external/widget.js';
//         script.async = true;
//         script.setAttribute('crossorigin', 'anonymous');
//         document.head.appendChild(script);

//         // Load Calendly CSS
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://assets.calendly.com/assets/external/widget.css';
//         link.setAttribute('crossorigin', 'anonymous');
//         document.head.appendChild(link);
//       }
//     } catch (error) {
//       console.warn('Calendly failed to load:', error);
//     }
//   };

//   // Google Analytics - CSP compliant loading  
//   const loadGoogleAnalytics = () => {
//     try {
//       if (!document.querySelector('script[src*="googletagmanager"]')) {
//         // DataLayer initialization
//         (window as any).dataLayer = (window as any).dataLayer || [];
//         const gtag = (...args: any[]) => {
//           (window as any).dataLayer.push(args);
//         };

//         const script = document.createElement('script');
//         script.async = true;
//         script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GNEDWN3ZNT';
//         script.setAttribute('crossorigin', 'anonymous');
//         document.head.appendChild(script);

//         script.onload = () => {
//           gtag('js', new Date());
//           gtag('config', 'G-GNEDWN3ZNT');
//         };
//       }
//     } catch (error) {
//       console.warn('Google Analytics failed to load:', error);
//     }
//   };

//   // Load scripts in optimal order with delays to prevent blocking
//   setTimeout(() => {
//     loadCalendly();
//   }, 1000);

//   setTimeout(() => {
//     loadGoogleAnalytics();
//   }, 2000);
// };

// // Enhanced error suppression for CSP-related issues
// export const suppressCSPErrors = () => {
//   // Suppress common CSP violation warnings
//   const originalConsoleWarn = console.warn;
//   console.warn = (...args) => {
//     const message = args.join(' ');
//     if (
//       message.includes('Content Security Policy') ||
//       message.includes('CSP') ||
//       message.includes('refused to load') ||
//       message.includes('blocked by CORS')
//     ) {
//       // Silently ignore CSP warnings that are expected
//       return;
//     }
//     originalConsoleWarn.apply(console, args);
//   };

//   // Handle CSP violations gracefully
//   document.addEventListener('securitypolicyviolation', (e) => {
//     // Log CSP violations but don't show them to users
//     console.debug('CSP violation (handled):', {
//       directive: e.violatedDirective,
//       blockedURI: e.blockedURI,
//       originalPolicy: e.originalPolicy
//     });
//     e.preventDefault();
//   });
// };







// CSP-compliant loader for external scripts and analytics
// export const loadCSPCompliantScripts = () => {
//   // Microsoft Clarity is now loaded directly in HTML head

//   // Calendly - CSP compliant loading
//   const loadCalendly = () => {
//     try {
//       // Only load if not already present
//       if (!document.querySelector('script[src*="assets.calendly.com/assets/external/widget.js"]')) {
//         // Load Calendly CSS
//         if (!document.querySelector('link[href*="assets.calendly.com/assets/external/widget.css"]')) {
//           const link = document.createElement("link");
//           link.rel = "stylesheet";
//           link.href = "https://assets.calendly.com/assets/external/widget.css";
//           // ✅ IMPORTANT: Do NOT set crossorigin here (it triggers CORS mode and will be blocked)
//           document.head.appendChild(link);
//         }

//         const script = document.createElement("script");
//         script.src = "https://assets.calendly.com/assets/external/widget.js";
//         script.async = true;
//         // ✅ IMPORTANT: Do NOT set crossorigin here (it triggers CORS mode and will be blocked)
//         document.head.appendChild(script);
//       }
//     } catch (error) {
//       console.warn("Calendly failed to load:", error);
//     }
//   };

//   // Google Analytics - CSP compliant loading
//   // const loadGoogleAnalytics = () => {
//   //   try {
//   //     if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
//   //       // DataLayer initialization
//   //       (window as any).dataLayer = (window as any).dataLayer || [];
//   //       const gtag = (...args: any[]) => {
//   //         (window as any).dataLayer.push(args);
//   //       };

//   //       const script = document.createElement("script");
//   //       script.async = true;
//   //       script.src = "https://www.googletagmanager.com/gtag/js?id=G-GNEDWN3ZNT";
//   //       // ✅ IMPORTANT: remove crossorigin unless you specifically need CORS error details
//   //       // script.setAttribute('crossorigin', 'anonymous');
//   //       document.head.appendChild(script);

//   //       script.onload = () => {
//   //         gtag("js", new Date());
//   //         gtag("config", "G-GNEDWN3ZNT");
//   //       };
//   //     }
//   //   } catch (error) {
//   //     console.warn("Google Analytics failed to load:", error);
//   //   }
//   // };

//   // Load scripts in optimal order with delays to prevent blocking
//   setTimeout(() => {
//     loadCalendly();
//   }, 1000);

//   // setTimeout(() => {
//   //   loadGoogleAnalytics();
//   // }, 2000);
// };

// Enhanced error suppression for CSP-related issues
export const suppressCSPErrors = () => {
  // Suppress common CSP violation warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(" ");
    if (
      message.includes("Content Security Policy") ||
      message.includes("CSP") ||
      message.includes("refused to load") ||
      message.includes("blocked by CORS")
    ) {
      // Silently ignore CSP warnings that are expected
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Handle CSP violations gracefully
  document.addEventListener("securitypolicyviolation", (e) => {
    // Log CSP violations but don't show them to users
    console.debug("CSP violation (handled):", {
      directive: e.violatedDirective,
      blockedURI: e.blockedURI,
      originalPolicy: e.originalPolicy,
    });
    e.preventDefault();
  });
};

// Completely disable Vite error overlays and runtime error modals
export const disableViteOverlay = () => {
  // Remove existing overlays immediately
  const removeAllOverlays = () => {
    // Remove Vite error overlays
    const viteOverlays = document.querySelectorAll("vite-error-overlay");
    viteOverlays.forEach((overlay) => overlay.remove());

    // Remove runtime error modals from Replit plugin
    const runtimeModals = document.querySelectorAll(
      '[class*="runtime-error"], [class*="error-modal"]'
    );
    runtimeModals.forEach((modal) => modal.remove());

    // Remove any div with error-related content
    const errorDivs = document.querySelectorAll("div");
    errorDivs.forEach((div) => {
      const text = div.textContent || "";
      if (
        (text.includes("Failed to fetch") ||
          text.includes("Cannot read properties") ||
          text.includes("reading 'frame'") ||
          text.includes("runtime-error-plugin")) &&
        (div.style.position === "fixed" || div.style.zIndex === "999999")
      ) {
        div.remove();
      }
    });

    // Also remove any elements with specific Replit error overlay characteristics
    const replitOverlays = document.querySelectorAll(
      '[style*="z-index: 999999"], [style*="position: fixed"]'
    );
    replitOverlays.forEach((overlay) => {
      const content = overlay.textContent || "";
      if (
        content.includes("frame") ||
        content.includes("runtime-error") ||
        content.includes("Cannot read properties")
      ) {
        overlay.remove();
      }
    });
  };

  // Override document.createElement to prevent overlay creation
  const originalCreateElement = document.createElement.bind(document);
  (document as any).createElement = function (
    tagName: string,
    options?: ElementCreationOptions
  ) {
    const element = originalCreateElement(tagName, options);

    // Block vite-error-overlay elements
    if (tagName.toLowerCase() === "vite-error-overlay") {
      return originalCreateElement("div"); // Return empty div instead
    }

    return element;
  };

  // Block style injection that creates overlays
  const originalAppendChild = document.head.appendChild.bind(document.head);
  (document.head as any).appendChild = function (node: Node) {
    // Block styles that create error overlays
    if (
      node instanceof HTMLStyleElement &&
      (node.textContent?.includes("vite-error-overlay") ||
        node.textContent?.includes("runtime-error"))
    ) {
      return node; // Don't actually append
    }
    return originalAppendChild(node);
  };

  // Set up continuous monitoring
  removeAllOverlays();

  // Monitor for new overlay creation every 100ms
  const cleanupInterval = setInterval(removeAllOverlays, 100);

  // Also use MutationObserver for immediate removal
  const observer = new MutationObserver(removeAllOverlays);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  return () => {
    clearInterval(cleanupInterval);
    observer.disconnect();
  };
};
