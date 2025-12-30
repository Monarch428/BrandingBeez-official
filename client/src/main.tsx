// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";

// // Initialize minimal error handling
// const setupBasicErrorHandling = () => {
//   // Minimal error suppression for critical path
//   window.addEventListener('error', (e) => {
//     if (e.message?.includes('Non-Error promise rejection captured')) {
//       e.preventDefault();
//     }
//   });

//   // Disable Vite overlay inline
//   window.addEventListener('vite:preloadError', (e) => {
//     e.preventDefault();
//     window.location.reload();
//   });
// };

// setupBasicErrorHandling();

// // Mount React app immediately 
// const rootElement = document.getElementById("root");
// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(<App />);

//   // Load non-critical optimizations after app is mounted
//   if (typeof window !== 'undefined') {
//     // Defer all optimization scripts until after initial render
//     window.addEventListener('load', () => {
//       // Use setTimeout to break out of the critical path
//       setTimeout(async () => {
//         try {
//           // Dynamically import and initialize optimizations
//           const [
//             { setupGlobalErrorHandling },
//             { disableViteOverlay },
//             { deferNonCriticalJS, optimizeImageLoading },
//             { initializeAnalytics },
//             { loadExternalScripts },
//             { optimizeFontDisplay }
//           ] = await Promise.all([
//             import("./lib/error-handler"),
//             import("./disable-vite-overlay"),
//             import("./utils/defer-non-critical"),
//             import("./utils/analytics"),
//             import("./utils/external-scripts"),
//             import("./utils/load-css-async")
//           ]);

//           // Initialize in optimal order
//           setupGlobalErrorHandling();
//           disableViteOverlay();
//           deferNonCriticalJS();
//           loadExternalScripts();
//           optimizeFontDisplay();

//           // Load CSP-compliant analytics
//           setTimeout(async () => {
//             const { loadCSPCompliantScripts, suppressCSPErrors } = await import("./utils/csp-compliant-loader");

//             // Initialize error suppression first
//             suppressCSPErrors();

//             // Then load analytics
//             initializeAnalytics();
//             optimizeImageLoading();

//             // Load external scripts in CSP-compliant way
//             loadCSPCompliantScripts();
//           }, 2000);

//         } catch (error) {
//           // Silently fail optimization loading
//           console.warn('Some optimizations failed to load');
//         }
//       }, 100);
//     });
//   }
// }


import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const setupBasicErrorHandling = () => {
  // Minimal suppression for noisy non-actionable errors
  window.addEventListener("error", (e) => {
    const msg = (e as ErrorEvent)?.message || "";
    if (msg.includes("Non-Error promise rejection captured")) {
      e.preventDefault();
    }
  });

  // Only auto-reload on Vite preload errors in DEV
  window.addEventListener("vite:preloadError", (e: Event) => {
    if (import.meta.env.DEV) {
      e.preventDefault();
      window.location.reload();
    }
  });
};

setupBasicErrorHandling();

// Mount React app immediately
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);

  // Load non-critical optimizations after app is mounted
  if (typeof window !== "undefined") {
    window.addEventListener(
      "load",
      () => {
        setTimeout(async () => {
          try {
            // DEV-only: disable Vite overlay (keep it OUT of prod bundles)
            if (import.meta.env.DEV) {
              const { disableViteOverlay } = await import("./disable-vite-overlay");
              disableViteOverlay();
            }

            const [
              { setupGlobalErrorHandling },
              { deferNonCriticalJS, optimizeImageLoading },
              { initializeAnalytics },
              { loadExternalScripts },
              { optimizeFontDisplay },
            ] = await Promise.all([
              import("./lib/error-handler"),
              import("./utils/defer-non-critical"),
              import("./utils/analytics"),
              import("./utils/external-scripts"),
              import("./utils/load-css-async"),
            ]);

            // Initialize in optimal order
            setupGlobalErrorHandling();

            deferNonCriticalJS();

            loadExternalScripts();

            optimizeFontDisplay();

            setTimeout(async () => {
              const { loadCSPCompliantScripts, suppressCSPErrors } = await import(
                "./utils/csp-compliant-loader"
              );

              suppressCSPErrors();

              initializeAnalytics();

              optimizeImageLoading();

              loadCSPCompliantScripts();
            }, 2000);
          } catch (_error) {
            if (import.meta.env.DEV) {
              console.warn("Some optimizations failed to load");
            }
          }
        }, 100);
      },
      { once: true }
    );
  }
}
