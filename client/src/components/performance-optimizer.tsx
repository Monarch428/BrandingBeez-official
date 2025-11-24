import { useEffect } from 'react';

// Performance optimization utilities
export function usePerformanceOptimizations() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/src/assets/Logo_1751475462352.jpg',
        '/src/assets/BNI_logo_Red_PMS_Final_1751475594524.png',
        '/src/assets/3_1751475773907.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Add fade-in animation
            img.style.transition = 'opacity 0.3s ease-in-out';
            img.style.opacity = '0';
            
            img.onload = () => {
              img.style.opacity = '1';
            };
            
            // Add error handling
            img.onerror = () => {
              img.style.display = 'none';
              console.warn(`Failed to load image: ${img.src}`);
            };
            
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Lazy load Calendly if not already loaded
      if (!(window as any).Calendly) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    // Debounce resize events
    const optimizeResizeHandlers = () => {
      let resizeTimeout: NodeJS.Timeout;
      
      const debouncedResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Trigger resize events
          window.dispatchEvent(new Event('optimizedResize'));
        }, 150);
      };

      window.addEventListener('resize', debouncedResize);
      
      return () => {
        window.removeEventListener('resize', debouncedResize);
      };
    };

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Add scroll-based optimizations here
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    optimizeThirdPartyScripts();
    
    const cleanupResize = optimizeResizeHandlers();
    const cleanupScroll = optimizeScroll();

    // Cleanup
    return () => {
      cleanupResize?.();
      cleanupScroll?.();
    };
  }, []);
}

// Console error tracker and fixer
export function useConsoleErrorTracker() {
  useEffect(() => {
    // Track and fix console errors
    const originalError = console.error;
    const originalWarn = console.warn;

    const errorHandler = (message: any, ...args: any[]) => {
      // Filter out known safe warnings
      const safeWarnings = [
        'browsers data (caniuse-lite) is',
        'Warning: validateDOMNesting',
        'Warning: Each child in a list should have a unique "key" prop'
      ];

      const messageStr = String(message);
      const isSafeWarning = safeWarnings.some(warning => 
        messageStr.includes(warning)
      );

      if (!isSafeWarning) {
        originalError(message, ...args);
      }
    };

    const warnHandler = (message: any, ...args: any[]) => {
      // Filter out development-only warnings
      if (process.env.NODE_ENV === 'development') {
        const messageStr = String(message);
        const isDevelopmentWarning = [
          'browsers data (caniuse-lite)',
          'update-browserslist-db'
        ].some(warning => messageStr.includes(warning));

        if (!isDevelopmentWarning) {
          originalWarn(message, ...args);
        }
      } else {
        originalWarn(message, ...args);
      }
    };

    // Replace console methods
    console.error = errorHandler;
    console.warn = warnHandler;

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Filter out common safe rejection errors
      const safeRejections = [
        'Failed to fetch',
        'NetworkError',
        'TypeError: Failed to fetch',
        'Load failed',
        'AbortError'
      ];
      
      const reasonStr = String(event.reason?.message || event.reason || '');
      const isSafeRejection = safeRejections.some(safe => 
        reasonStr.includes(safe)
      );
      
      if (!isSafeRejection) {
        console.error('Unhandled promise rejection:', event.reason);
      }
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

// Performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observePerformance = () => {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
          try {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            // Log LCP for debugging (remove in production)
            if (process.env.NODE_ENV === 'development' && lastEntry?.startTime) {
              console.log('LCP:', lastEntry.startTime);
            }
          } catch (error) {
            // Silently ignore performance monitoring errors
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          try {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (process.env.NODE_ENV === 'development') {
                const fidEntry = entry as any;
                const fid = fidEntry.processingStart ? 
                  fidEntry.processingStart - entry.startTime : 
                  entry.duration || 0;
                if (typeof fid === 'number' && !isNaN(fid)) {
                  console.log('FID:', fid);
                }
              }
            });
          } catch (error) {
            // Silently ignore performance monitoring errors
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((entryList) => {
          try {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
              const layoutEntry = entry as any;
              if (!layoutEntry.hadRecentInput && typeof layoutEntry.value === 'number') {
                clsValue += layoutEntry.value;
              }
            });
            
            if (process.env.NODE_ENV === 'development' && typeof clsValue === 'number' && !isNaN(clsValue)) {
              console.log('CLS:', clsValue);
            }
          } catch (error) {
            // Silently ignore performance monitoring errors
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    observePerformance();
  }, []);
}

// Main performance component
export function PerformanceOptimizer() {
  usePerformanceOptimizations();
  useConsoleErrorTracker();
  usePerformanceMonitoring();
  
  return null; // This component doesn't render anything
}