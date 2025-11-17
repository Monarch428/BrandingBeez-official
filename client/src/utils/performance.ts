// Performance optimization utilities
export const performanceUtils = {
  // Debounce function for performance optimization
  debounce: <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    }) as T;
  },

  // Throttle function for performance optimization
  throttle: <T extends (...args: any[]) => void>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Preload critical resources
  preloadResource: (href: string, as: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  },

  // Lazy load component
  lazyLoadComponent: (importFunc: () => Promise<any>) => {
    return React.lazy(importFunc);
  },

  // Measure performance
  measurePerformance: (name: string, fn: () => void) => {
    if (typeof window !== 'undefined' && window.performance) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
    } else {
      fn();
    }
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  // Optimize animations based on user preference
  optimizeAnimation: (animationClass: string) => {
    return performanceUtils.prefersReducedMotion() ? '' : animationClass;
  }
};

// React import for lazy loading
import React from 'react';

// Export individual utilities
export const { debounce, throttle, preloadResource, lazyLoadComponent, measurePerformance, prefersReducedMotion, optimizeAnimation } = performanceUtils;