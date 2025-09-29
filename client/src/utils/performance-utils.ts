// Performance utility functions
export const optimizeImage = (src: string): string => {
  // Add WebP format preference
  if (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png')) {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Check if WebP is supported
    const canvas = document.createElement('canvas');
    const hasWebPSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    return hasWebPSupport ? webpSrc : src;
  }
  return src;
};

export const lazyLoadImage = (img: HTMLImageElement): void => {
  if ('loading' in img) {
    img.loading = 'lazy';
  } else {
    // Fallback for browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy-loading');
          imageObserver.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(img);
  }
};

export const prefetchCriticalResources = (): void => {
  const criticalResources = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
    { href: '/src/main.tsx', as: 'script' },
    { href: '/src/index.css', as: 'style' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Check if reduced motion is preferred
export const respectsReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};