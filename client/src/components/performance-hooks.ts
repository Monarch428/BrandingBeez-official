import { useEffect } from "react";

// Performance optimization utilities
export function usePerformanceOptimizations() {
    useEffect(() => {
        const safeRun = (label: string, fn: () => void) => {
            try {
                fn();
            } catch (err) {
                console.warn(`[PerformanceOptimizer] ${label} failed`, err);
            }
        };

        const preloadCriticalResources = () => {
            /*
            ...commented...
            */
        };

        const optimizeImages = () => {
            const images = Array.from(document.querySelectorAll("img[src]")) as HTMLImageElement[];

            if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
                return;
            }

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const img = entry.target as HTMLImageElement;
                    imageObserver.unobserve(img);

                    img.style.transition = "opacity 0.3s ease-in-out";

                    const ensureVisible = () => {
                        img.style.opacity = "1";
                    };

                    if (img.complete) {
                        if (img.naturalWidth > 0) {
                            ensureVisible();
                            return;
                        }
                        img.style.display = "none";
                        console.warn(`Failed to load image (complete but broken): ${img.src}`);
                        return;
                    }

                    img.style.opacity = "0";

                    img.addEventListener("load", () => ensureVisible(), { once: true });
                    img.addEventListener(
                        "error",
                        () => {
                            img.style.display = "none";
                            console.warn(`Failed to load image: ${img.src}`);
                        },
                        { once: true },
                    );
                });
            });

            images.forEach((img) => {
                if (img.complete && img.naturalWidth > 0) {
                    img.style.opacity = "1";
                    return;
                }
                imageObserver.observe(img);
            });
        };

        const optimizeThirdPartyScripts = () => {
            /*
            ...commented...
            */
        };

        const optimizeResizeHandlers = () => {
            let resizeTimeout: number | null = null;

            const debouncedResize = () => {
                if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);

                resizeTimeout = window.setTimeout(() => {
                    window.dispatchEvent(new Event("optimizedResize"));
                }, 150);
            };

            window.addEventListener("resize", debouncedResize);

            return () => {
                window.removeEventListener("resize", debouncedResize);
                if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
            };
        };

        const optimizeScroll = () => {
            let ticking = false;

            const handleScroll = () => {
                if (ticking) return;

                ticking = true;
                requestAnimationFrame(() => {
                    ticking = false;
                });
            };

            window.addEventListener("scroll", handleScroll, { passive: true });

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        };

        const init = () => {
            safeRun("preloadCriticalResources", preloadCriticalResources);
            safeRun("optimizeImages", optimizeImages);
            safeRun("optimizeThirdPartyScripts", optimizeThirdPartyScripts);
        };

        requestAnimationFrame(init);

        const cleanupResize = safeRunReturn(optimizeResizeHandlers);
        const cleanupScroll = safeRunReturn(optimizeScroll);

        function safeRunReturn<T extends (() => void) | undefined>(fn: () => T): T {
            try {
                return fn();
            } catch (err) {
                console.warn("[PerformanceOptimizer] cleanup initializer failed", err);
                return undefined as T;
            }
        }

        return () => {
            cleanupResize?.();
            cleanupScroll?.();
        };
    }, []);
}

// Console error tracker and fixer
export function useConsoleErrorTracker() {
    useEffect(() => {
        const originalError = console.error;
        const originalWarn = console.warn;

        const errorHandler = (message: any, ...args: any[]) => {
            const safeWarnings = [
                "browsers data (caniuse-lite) is",
                "Warning: validateDOMNesting",
                'Warning: Each child in a list should have a unique "key" prop',
            ];

            const messageStr = String(message);
            const isSafeWarning = safeWarnings.some((warning) => messageStr.includes(warning));

            if (!isSafeWarning) {
                originalError(message, ...args);
            }
        };

        const warnHandler = (message: any, ...args: any[]) => {
            if (process.env.NODE_ENV === "development") {
                const messageStr = String(message);
                const isDevelopmentWarning = ["browsers data (caniuse-lite)", "update-browserslist-db"].some((warning) =>
                    messageStr.includes(warning),
                );

                if (!isDevelopmentWarning) {
                    originalWarn(message, ...args);
                }
            } else {
                originalWarn(message, ...args);
            }
        };

        console.error = errorHandler;
        console.warn = warnHandler;

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            // ✅ Never preventDefault here — it can interfere with Vite HMR overlay / dev client
            // event.preventDefault();

            const safeRejections = [
                "Failed to fetch",
                "NetworkError",
                "TypeError: Failed to fetch",
                "Load failed",
                "AbortError",

                // ✅ Vite dev overlay / websocket noise (avoid blank/overlay crashes)
                "createErrorOverlay",
                "Cannot read properties of null (reading 'appendChild')",
                "WebSocket",
                "vite",
                "client:",
            ];

            const reasonStr = String(event.reason?.message || event.reason || "");
            const isSafeRejection = safeRejections.some((safe) => reasonStr.includes(safe));

            if (!isSafeRejection) {
                originalError("Unhandled promise rejection:", event.reason);
            } else {
                // keep it as a warn (optional) so it doesn't look like app crash
                originalWarn("Unhandled promise rejection (ignored):", event.reason);
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            console.error = originalError;
            console.warn = originalWarn;
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);
}

// Performance monitoring
export function usePerformanceMonitoring() {
    useEffect(() => {
        const observePerformance = () => {
            if ("PerformanceObserver" in window) {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    try {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        if (process.env.NODE_ENV === "development" && lastEntry?.startTime) {
                            console.log("LCP:", lastEntry.startTime);
                        }
                    } catch { }
                });

                lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

                const fidObserver = new PerformanceObserver((entryList) => {
                    try {
                        const entries = entryList.getEntries();
                        entries.forEach((entry) => {
                            if (process.env.NODE_ENV === "development") {
                                const fidEntry = entry as any;
                                const fid = fidEntry.processingStart ? fidEntry.processingStart - entry.startTime : entry.duration || 0;
                                if (typeof fid === "number" && !isNaN(fid)) console.log("FID:", fid);
                            }
                        });
                    } catch { }
                });

                fidObserver.observe({ entryTypes: ["first-input"] });

                const clsObserver = new PerformanceObserver((entryList) => {
                    try {
                        let clsValue = 0;
                        entryList.getEntries().forEach((entry) => {
                            const layoutEntry = entry as any;
                            if (!layoutEntry.hadRecentInput && typeof layoutEntry.value === "number") {
                                clsValue += layoutEntry.value;
                            }
                        });

                        if (process.env.NODE_ENV === "development" && !isNaN(clsValue)) {
                            console.log("CLS:", clsValue);
                        }
                    } catch { }
                });

                clsObserver.observe({ entryTypes: ["layout-shift"] });
            }
        };

        observePerformance();
    }, []);
}
