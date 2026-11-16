import { Component, lazy, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

// Keep the entry point small and always render a visible state.  Previously an
// exception while evaluating App.tsx happened before React mounted, which made
// the browser show a completely blank white page with no actionable feedback.
const App = lazy(() => import("./App"));

class StartupErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen grid place-items-center bg-slate-50 p-6 text-slate-900">
          <section className="max-w-lg rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold">The site could not start</h1>
            <p className="mt-2 text-sm text-slate-600">Refresh the page after checking the development-server console.</p>
            {import.meta.env.DEV && <pre className="mt-4 overflow-auto rounded bg-slate-950 p-3 text-xs text-rose-200">{this.state.error.message}</pre>}
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StartupErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<main className="min-h-screen grid place-items-center bg-white text-slate-700">Loading BrandingBeez…</main>}>
          <App />
        </Suspense>
      </HelmetProvider>
    </StartupErrorBoundary>
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
