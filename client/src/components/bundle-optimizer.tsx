import { useEffect } from 'react';

// Component to optimize bundle loading and eliminate render-blocking resources
export const BundleOptimizer = () => {
  useEffect(() => {
    // Eliminate render-blocking resources by loading CSS asynchronously
    const optimizeCSSLoading = () => {
      // Remove any blocking stylesheets that might exist
      const blockingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
      blockingStyles.forEach(link => {
        const linkElement = link as HTMLLinkElement;
        if (!linkElement.onload) {
          linkElement.media = 'print';
          linkElement.onload = () => {
            linkElement.media = 'all';
            linkElement.onload = null;
          };
        }
      });
    };

    // Preload next route's critical resources
    const preloadNextRoutes = () => {
      const routes = [
        { path: '/services', critical: ['/src/pages/services.tsx'] },
        { path: '/contact', critical: ['/src/pages/contact-optimized.tsx'] },
        { path: '/about', critical: ['/src/pages/about.tsx'] },
      ];

      routes.forEach(route => {
        route.critical.forEach(resource => {
          const link = document.createElement('link');
          link.rel = 'modulepreload';
          link.href = resource;
          document.head.appendChild(link);
        });
      });
    };

    // Immediate optimizations
    optimizeCSSLoading();

    // Deferred optimizations (after initial load)
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        preloadNextRoutes();
      }, { timeout: 2000 });
    });

    // Remove unused CSS (only for production)
    if (import.meta.env.PROD) {
      setTimeout(() => {
        // Remove unused font preloads after fonts are loaded
        const unusedPreloads = document.querySelectorAll('link[rel="preload"][as="font"]:not([crossorigin])');
        unusedPreloads.forEach(link => {
          if (document.fonts.check(`16px ${link.getAttribute('href')?.split('/').pop()?.split('.')[0]}`)) {
            link.remove();
          }
        });
      }, 3000);
    }

  }, []);

  return null;
};