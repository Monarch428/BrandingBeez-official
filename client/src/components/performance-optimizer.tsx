import {
  usePerformanceOptimizations,
  useConsoleErrorTracker,
  usePerformanceMonitoring,
} from "./performance-hooks";

// Main performance component
export function PerformanceOptimizer() {
  usePerformanceOptimizations();
  useConsoleErrorTracker();
  usePerformanceMonitoring();
  return null;
}



// import { useEffect } from "react";

// // Performance optimization utilities
// export function usePerformanceOptimizations() {
//   useEffect(() => {
//     // Helper: safe runner so a single optimization failure never breaks render
//     const safeRun = (label: string, fn: () => void) => {
//       try {
//         fn();
//       } catch (err) {
//         // Keep this as warn so you see it, but it won't kill the app
//         console.warn(`[PerformanceOptimizer] ${label} failed`, err);
//       }
//     };

//     // Preload critical resources
//     const preloadCriticalResources = () => {
//       // ✅ COMMENTED: Preloading unused images can increase network work + slow first load.
//       // If you ever need this back, only preload images that are guaranteed to be used
//       // above-the-fold on the current route (usually home hero).
//       /*
//       const criticalImages = [
//         "/src/assets/Logo_1751475462352.jpg",
//         "/src/assets/BNI_logo_Red_PMS_Final_1751475594524.png",
//         "/src/assets/3_1751475773907.png",
//       ];

//       criticalImages.forEach((src) => {
//         // Avoid duplicating preloads
//         const existing = document.head.querySelector(
//           `link[rel="preload"][as="image"][href="${src}"]`,
//         );
//         if (existing) return;

//         const link = document.createElement("link");
//         link.rel = "preload";
//         link.as = "image";
//         link.href = src;

//         link.addEventListener(
//           "error",
//           () => console.warn(`[PerformanceOptimizer] preload failed: ${src}`),
//           { once: true },
//         );

//         document.head.appendChild(link);
//       });
//       */
//     };

//     // Optimize images with lazy loading (SAFE VERSION - will NOT cause blank page)
//     const optimizeImages = () => {
//       const images = Array.from(document.querySelectorAll("img[src]")) as HTMLImageElement[];

//       // If IntersectionObserver not supported, just skip safely
//       if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
//         return;
//       }

//       const imageObserver = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) return;

//           const img = entry.target as HTMLImageElement;

//           // Always unobserve early to avoid repeated work
//           imageObserver.unobserve(img);

//           // Apply transition (but DO NOT force opacity 0 unless safe)
//           img.style.transition = "opacity 0.3s ease-in-out";

//           const ensureVisible = () => {
//             img.style.opacity = "1";
//           };

//           // If image is already loaded (cached or super fast), do NOT hide it
//           if (img.complete) {
//             // If loaded successfully
//             if (img.naturalWidth > 0) {
//               ensureVisible();
//               return;
//             }

//             // If complete but failed, hide it
//             img.style.display = "none";
//             console.warn(`Failed to load image (complete but broken): ${img.src}`);
//             return;
//           }

//           // Not yet loaded => we can do a safe fade-in:
//           // Start hidden now, then reveal on load.
//           img.style.opacity = "0";

//           img.addEventListener(
//             "load",
//             () => {
//               ensureVisible();
//             },
//             { once: true },
//           );

//           img.addEventListener(
//             "error",
//             () => {
//               img.style.display = "none";
//               console.warn(`Failed to load image: ${img.src}`);
//             },
//             { once: true },
//           );
//         });
//       });

//       images.forEach((img) => {
//         // If already loaded, ensure it's visible immediately (prevents blank)
//         if (img.complete && img.naturalWidth > 0) {
//           img.style.opacity = "1";
//           return;
//         }
//         imageObserver.observe(img);
//       });
//     };

//     // Optimize third-party scripts
//     const optimizeThirdPartyScripts = () => {
//       // ✅ COMMENTED: Calendly is unused, so don’t load it.
//       // Loading it adds extra JS network + execution cost and can slow first paint.
//       /*
//       if ((window as any).Calendly) return;

//       const existing = document.querySelector(
//         'script[src="https://assets.calendly.com/assets/external/widget.js"]',
//       ) as HTMLScriptElement | null;
//       if (existing) return;

//       const script = document.createElement("script");
//       script.src = "https://assets.calendly.com/assets/external/widget.js";
//       script.async = true;
//       script.defer = true;

//       script.addEventListener(
//         "error",
//         () => {
//           console.warn(
//             "[PerformanceOptimizer] Calendly script failed to load (possibly CSP/network blocked).",
//           );
//         },
//         { once: true },
//       );

//       document.head.appendChild(script);
//       */
//     };

//     // Debounce resize events
//     const optimizeResizeHandlers = () => {
//       let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

//       const debouncedResize = () => {
//         if (resizeTimeout) window.clearTimeout(resizeTimeout);
//         resizeTimeout = window.setTimeout(() => {
//           // Trigger resize events
//           window.dispatchEvent(new Event("optimizedResize"));
//         }, 150);
//       };

//       window.addEventListener("resize", debouncedResize);

//       return () => {
//         window.removeEventListener("resize", debouncedResize);
//         if (resizeTimeout) window.clearTimeout(resizeTimeout);
//       };
//     };

//     // Optimize scroll performance
//     const optimizeScroll = () => {
//       let ticking = false;

//       const handleScroll = () => {
//         if (ticking) return;

//         ticking = true;
//         requestAnimationFrame(() => {
//           // Add scroll-based optimizations here
//           ticking = false;
//         });
//       };

//       window.addEventListener("scroll", handleScroll, { passive: true });

//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//       };
//     };

//     // Initialize optimizations (defer slightly so we never block first paint)
//     // This is important for "white screen first render" issues.
//     const init = () => {
//       safeRun("preloadCriticalResources", preloadCriticalResources);
//       safeRun("optimizeImages", optimizeImages);
//       safeRun("optimizeThirdPartyScripts", optimizeThirdPartyScripts);
//     };

//     // Run after first paint
//     requestAnimationFrame(init);

//     const cleanupResize = safeRunReturn(optimizeResizeHandlers);
//     const cleanupScroll = safeRunReturn(optimizeScroll);

//     function safeRunReturn<T extends (() => void) | undefined>(fn: () => T): T {
//       try {
//         return fn();
//       } catch (err) {
//         console.warn("[PerformanceOptimizer] cleanup initializer failed", err);
//         return undefined as T;
//       }
//     }

//     // Cleanup
//     return () => {
//       cleanupResize?.();
//       cleanupScroll?.();
//     };
//   }, []);
// }

// // Console error tracker and fixer
// export function useConsoleErrorTracker() {
//   useEffect(() => {
//     // Track and fix console errors
//     const originalError = console.error;
//     const originalWarn = console.warn;

//     const errorHandler = (message: any, ...args: any[]) => {
//       // Filter out known safe warnings
//       const safeWarnings = [
//         "browsers data (caniuse-lite) is",
//         "Warning: validateDOMNesting",
//         'Warning: Each child in a list should have a unique "key" prop',
//       ];

//       const messageStr = String(message);
//       const isSafeWarning = safeWarnings.some((warning) => messageStr.includes(warning));

//       if (!isSafeWarning) {
//         originalError(message, ...args);
//       }
//     };

//     const warnHandler = (message: any, ...args: any[]) => {
//       // Filter out development-only warnings
//       if (process.env.NODE_ENV === "development") {
//         const messageStr = String(message);
//         const isDevelopmentWarning = ["browsers data (caniuse-lite)", "update-browserslist-db"].some(
//           (warning) => messageStr.includes(warning),
//         );

//         if (!isDevelopmentWarning) {
//           originalWarn(message, ...args);
//         }
//       } else {
//         originalWarn(message, ...args);
//       }
//     };

//     // Replace console methods
//     console.error = errorHandler;
//     console.warn = warnHandler;

//     // Handle unhandled promise rejections
//     const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
//       // Filter out common safe rejection errors
//       const safeRejections = [
//         "Failed to fetch",
//         "NetworkError",
//         "TypeError: Failed to fetch",
//         "Load failed",
//         "AbortError",
//       ];

//       const reasonStr = String(event.reason?.message || event.reason || "");
//       const isSafeRejection = safeRejections.some((safe) => reasonStr.includes(safe));

//       if (!isSafeRejection) {
//         originalError("Unhandled promise rejection:", event.reason);
//       }

//       // Only prevent default for known safe ones
//       if (isSafeRejection) {
//         event.preventDefault();
//       }
//     };

//     window.addEventListener("unhandledrejection", handleUnhandledRejection);

//     // Cleanup
//     return () => {
//       console.error = originalError;
//       console.warn = originalWarn;
//       window.removeEventListener("unhandledrejection", handleUnhandledRejection);
//     };
//   }, []);
// }

// // Performance monitoring
// export function usePerformanceMonitoring() {
//   useEffect(() => {
//     // Monitor Core Web Vitals
//     const observePerformance = () => {
//       if ("PerformanceObserver" in window) {
//         // Largest Contentful Paint (LCP)
//         const lcpObserver = new PerformanceObserver((entryList) => {
//           try {
//             const entries = entryList.getEntries();
//             const lastEntry = entries[entries.length - 1];

//             // Log LCP for debugging (remove in production)
//             if (process.env.NODE_ENV === "development" && lastEntry?.startTime) {
//               console.log("LCP:", lastEntry.startTime);
//             }
//           } catch (error) {
//             // Silently ignore performance monitoring errors
//           }
//         });

//         lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

//         // First Input Delay (FID)
//         const fidObserver = new PerformanceObserver((entryList) => {
//           try {
//             const entries = entryList.getEntries();
//             entries.forEach((entry) => {
//               if (process.env.NODE_ENV === "development") {
//                 const fidEntry = entry as any;
//                 const fid = fidEntry.processingStart
//                   ? fidEntry.processingStart - entry.startTime
//                   : entry.duration || 0;
//                 if (typeof fid === "number" && !isNaN(fid)) {
//                   console.log("FID:", fid);
//                 }
//               }
//             });
//           } catch (error) {
//             // Silently ignore performance monitoring errors
//           }
//         });

//         fidObserver.observe({ entryTypes: ["first-input"] });

//         // Cumulative Layout Shift (CLS)
//         const clsObserver = new PerformanceObserver((entryList) => {
//           try {
//             let clsValue = 0;
//             entryList.getEntries().forEach((entry) => {
//               const layoutEntry = entry as any;
//               if (!layoutEntry.hadRecentInput && typeof layoutEntry.value === "number") {
//                 clsValue += layoutEntry.value;
//               }
//             });

//             if (process.env.NODE_ENV === "development" && typeof clsValue === "number" && !isNaN(clsValue)) {
//               console.log("CLS:", clsValue);
//             }
//           } catch (error) {
//             // Silently ignore performance monitoring errors
//           }
//         });

//         clsObserver.observe({ entryTypes: ["layout-shift"] });
//       }
//     };

//     observePerformance();
//   }, []);
// }

// // Main performance component
// export function PerformanceOptimizer() {
//   usePerformanceOptimizations();
//   useConsoleErrorTracker();
//   usePerformanceMonitoring();

//   return null; // This component doesn't render anything
// }
