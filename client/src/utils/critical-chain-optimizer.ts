// Critical request chain optimization to eliminate sequential loading
export function optimizeCriticalChain(): void {
  // 1. Preload critical JavaScript modules to break dependency chain
  const criticalModules = [
    '/src/App.tsx',
    '/src/pages/home.tsx',
    '/src/components/header.tsx',
    '/src/components/footer.tsx'
  ];

  criticalModules.forEach(module => {
    if (!document.querySelector(`link[rel="modulepreload"][href="${module}"]`)) {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = module;
      document.head.appendChild(link);
    }
  });

  // 2. Parallel load external resources instead of sequential
  const externalResources = [
    {
      href: 'https://assets.calendly.com/assets/external/widget.js',
      as: 'script',
      crossorigin: true
    },
    {
      href: 'https://assets.calendly.com/assets/external/widget.css', 
      as: 'style',
      crossorigin: true
    }
  ];

  externalResources.forEach(resource => {
    if (!document.querySelector(`link[href="${resource.href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  // 3. Optimize font loading to eliminate render blocking
  const fontOptimizations = [
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiJ2f.woff2',
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhiJ2f.woff2',
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhiJ2f.woff2'
  ];

  fontOptimizations.forEach(fontUrl => {
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  // 4. Set resource priorities to optimize loading order
  const allPreloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]');
  allPreloadLinks.forEach((link, index) => {
    const linkEl = link as HTMLLinkElement;
    if (index < 5) { // Top 5 resources get highest priority
      linkEl.setAttribute('fetchpriority', 'high');
    } else if (index < 10) { // Next 5 get auto priority  
      linkEl.setAttribute('fetchpriority', 'auto');
    } else { // Rest get low priority
      linkEl.setAttribute('fetchpriority', 'low');
    }
  });

  // 5. Performance measurement
  if ('performance' in window && performance.mark) {
    performance.mark('critical-chain-optimized');
  }
}

// Run immediately to break dependency chains
optimizeCriticalChain();