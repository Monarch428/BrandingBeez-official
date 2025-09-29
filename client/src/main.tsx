import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize minimal error handling
const setupBasicErrorHandling = () => {
  // Minimal error suppression for critical path
  window.addEventListener('error', (e) => {
    if (e.message?.includes('Non-Error promise rejection captured')) {
      e.preventDefault();
    }
  });
  
  // Disable Vite overlay inline
  window.addEventListener('vite:preloadError', (e) => {
    e.preventDefault();
    window.location.reload();
  });
};

setupBasicErrorHandling();

// Mount React app immediately 
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // Load non-critical optimizations after app is mounted
  if (typeof window !== 'undefined') {
    // Defer all optimization scripts until after initial render
    window.addEventListener('load', () => {
      // Use setTimeout to break out of the critical path
      setTimeout(async () => {
        try {
          // Dynamically import and initialize optimizations
          const [
            { setupGlobalErrorHandling },
            { disableViteOverlay },
            { deferNonCriticalJS, optimizeImageLoading },
            { initializeAnalytics },
            { loadExternalScripts },
            { optimizeFontDisplay }
          ] = await Promise.all([
            import("./lib/error-handler"),
            import("./disable-vite-overlay"),
            import("./utils/defer-non-critical"),
            import("./utils/analytics"),
            import("./utils/external-scripts"),
            import("./utils/load-css-async")
          ]);
          
          // Initialize in optimal order
          setupGlobalErrorHandling();
          disableViteOverlay();
          deferNonCriticalJS();
          loadExternalScripts();
          optimizeFontDisplay();
          
          // Load CSP-compliant analytics
          setTimeout(async () => {
            const { loadCSPCompliantScripts, suppressCSPErrors } = await import("./utils/csp-compliant-loader");
            
            // Initialize error suppression first
            suppressCSPErrors();
            
            // Then load analytics
            initializeAnalytics();
            optimizeImageLoading();
            
            // Load external scripts in CSP-compliant way
            loadCSPCompliantScripts();
          }, 2000);
          
        } catch (error) {
          // Silently fail optimization loading
          console.warn('Some optimizations failed to load');
        }
      }, 100);
    });
  }
}
