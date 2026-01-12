import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

// Optional: very light, non-DOM-heavy init
window.addEventListener(
  "load",
  () => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => {
      });
    }
  },
  { once: true }
);


// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { HelmetProvider } from "react-helmet-async";


// const setupBasicErrorHandling = () => {
//   // Minimal suppression for noisy non-actionable errors
//   window.addEventListener("error", (e) => {
//     const msg = (e as ErrorEvent)?.message || "";
//     if (msg.includes("Non-Error promise rejection captured")) {
//       e.preventDefault();
//     }
//   });

//   // Only auto-reload on Vite preload errors in DEV
//   window.addEventListener("vite:preloadError", (e: Event) => {
//     if (import.meta.env.DEV) {
//       e.preventDefault();
//       window.location.reload();
//     }
//   });
// };

// setupBasicErrorHandling();

// // Mount React app immediately
// const rootElement = document.getElementById("root");

// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(
//     <HelmetProvider>
//       <App />
//     </HelmetProvider>
//   );

//   // Load non-critical optimizations after app is mounted
//   if (typeof window !== "undefined") {
//     window.addEventListener(
//       "load",
//       () => {
//         setTimeout(async () => {
//           try {
//             // DEV-only: disable Vite overlay (keep it OUT of prod bundles)
//             if (import.meta.env.DEV) {
//               const { disableViteOverlay } = await import("./disable-vite-overlay");
//               disableViteOverlay();
//             }

//             const [
//               { setupGlobalErrorHandling },
//               { deferNonCriticalJS, optimizeImageLoading },
//               // { initializeAnalytics },
//               { loadExternalScripts },
//               { optimizeFontDisplay },
//             ] = await Promise.all([
//               import("./lib/error-handler"),
//               import("./utils/defer-non-critical"),
//               // import("./utils/analytics"),
//               import("./utils/external-scripts"),
//               import("./utils/load-css-async"),
//             ]);

//             // Initialize in optimal order
//             setupGlobalErrorHandling();

//             deferNonCriticalJS();

//             loadExternalScripts();

//             optimizeFontDisplay();

//             setTimeout(async () => {
//               const { suppressCSPErrors } = await import(
//                 "./utils/csp-compliant-loader"
//               ); //loadCSPCompliantScripts

//               suppressCSPErrors();

//               // initializeAnalytics();

//               optimizeImageLoading();

//               // loadCSPCompliantScripts();
//             }, 2000);
//           } catch (_error) {
//             if (import.meta.env.DEV) {
//               console.warn("Some optimizations failed to load");
//             }
//           }
//         }, 100);
//       },
//       { once: true }
//     );
//   }
// }
