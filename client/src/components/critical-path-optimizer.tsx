// import { useEffect } from 'react';

// // Component to optimize critical rendering path
// export const CriticalPathOptimizer = () => {
//   useEffect(() => {
//     // Preload critical resources immediately
//     const preloadCriticalResources = () => {
//       // const criticalResources = [
//       //   // ❌ Commented because these images are NOT used immediately on first paint
//       //   // ❌ Causing: "preloaded but not used within a few seconds" warning

//       //   // { href: '/enhanced-operational-efficiency.webp', as: 'image' },
//       //   // { href: '/ai-software-development.webp', as: 'image' },
//       //   // { href: '/chatbot-business-interface.webp', as: 'image' },

//       //   // ✅ Keep ONLY truly critical, above-the-fold images here
//       //   // Example:
//       //   // { href: '/hero-banner.webp', as: 'image' },
//       // ];

//       // criticalResources.forEach(resource => {
//       //   const link = document.createElement('link');
//       //   link.rel = 'preload';
//       //   link.href = resource.href;
//       //   link.as = resource.as;
//       //   link.crossOrigin = 'anonymous';
//       //   document.head.appendChild(link);
//       // });
//     };

//     // Run immediately if DOM is ready
//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', preloadCriticalResources);
//     } else {
//       preloadCriticalResources();
//     }

//     // Prefetch next likely pages
//     const prefetchRoutes = () => {
//       const routes = [
//         '/blog',
//         '/portfolio',
//         '/services',
//         '/contact',
//         '/about',
//         '/services/seo',
//         '/services/web-development',
//         '/services/google-ads',
//         '/services/ai-development',
//         '/services/dedicated-resources'
//       ];

//       routes.forEach(route => {
//         const link = document.createElement('link');
//         link.rel = 'prefetch';
//         link.href = route;
//         document.head.appendChild(link);
//       });
//     };

//     // Defer prefetching to not interfere with critical path
//     window.addEventListener('load', () => {
//       setTimeout(prefetchRoutes, 1000);
//     });

//   }, []);

//   return null; // This component doesn't render anything
// };



import { useEffect } from 'react';

// Component to optimize critical rendering path
export const CriticalPathOptimizer = () => {
  useEffect(() => {
    // Prefetch next likely pages (low priority, after load)
    const prefetchRoutes = () => {
      const routes = [
        '/blog',
        '/portfolio',
        '/services',
        '/contact',
        '/about',
        '/services/seo',
        '/services/web-development',
        '/services/google-ads',
        '/services/ai-development',
        '/services/dedicated-resources'
      ];

      routes.forEach(route => {
        // Avoid duplicating prefetch links
        if (!document.querySelector(`link[rel="prefetch"][href="${route}"]`)) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        }
      });
    };

    const onWindowLoad = () => {
      setTimeout(prefetchRoutes, 1000);
    };

    // Defer prefetching so it doesn't affect LCP / FCP
    window.addEventListener('load', onWindowLoad);

    // Cleanup
    return () => {
      window.removeEventListener('load', onWindowLoad);
    };
  }, []);

  return null; 
};
