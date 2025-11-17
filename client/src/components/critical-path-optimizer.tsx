import { useEffect } from 'react';

// Component to optimize critical rendering path
export const CriticalPathOptimizer = () => {
  useEffect(() => {
    // Preload critical resources immediately
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/enhanced-operational-efficiency.webp', as: 'image' },
        { href: '/ai-software-development.webp', as: 'image' },
        { href: '/chatbot-business-interface.webp', as: 'image' },
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    } else {
      preloadCriticalResources();
    }

    // Prefetch next likely pages
    const prefetchRoutes = () => {
      const routes = [
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
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Defer prefetching to not interfere with critical path
    window.addEventListener('load', () => {
      setTimeout(prefetchRoutes, 1000);
    });

  }, []);

  return null; // This component doesn't render anything
};