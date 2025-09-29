// Enhanced mobile detection utility with performance optimizations
import { useState, useEffect, useCallback } from 'react';

// Cache results to avoid repeated calculations
let mobileDeviceCache: boolean | null = null;
let viewportCache: { width: number; isMobile: boolean } | null = null;

export function isMobileDevice(): boolean {
  // Return cached result if available
  if (mobileDeviceCache !== null) {
    return mobileDeviceCache;
  }
  
  // Check user agent for mobile indicators with enhanced regex
  if (typeof window === 'undefined') {
    mobileDeviceCache = false;
    return false;
  }
  
  const userAgent = window.navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;
  
  // Cache the result
  mobileDeviceCache = mobileRegex.test(userAgent);
  return mobileDeviceCache;
}

export function isMobileViewport(): boolean {
  // Check viewport width for mobile sizing with caching
  if (typeof window === 'undefined') return false;
  
  const currentWidth = window.innerWidth;
  
  // Use cached result if viewport hasn't changed significantly
  if (viewportCache && Math.abs(viewportCache.width - currentWidth) < 50) {
    return viewportCache.isMobile;
  }
  
  const isMobile = currentWidth <= 768; // Mobile breakpoint
  
  // Cache the result
  viewportCache = { width: currentWidth, isMobile };
  return isMobile;
}

export function isMobileDeviceOrViewport(): boolean {
  // Combined mobile detection - either device OR viewport
  return isMobileDevice() || isMobileViewport();
}

export function useMobileDetection() {
  // React hook for mobile detection with optimized resize listener
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with current state to prevent hydration issues
    return isMobileDeviceOrViewport();
  });
  
  // Debounced resize handler for better performance
  const checkMobile = useCallback(() => {
    const newIsMobile = isMobileDeviceOrViewport();
    setIsMobile(prev => prev !== newIsMobile ? newIsMobile : prev);
  }, []);
  
  useEffect(() => {
    // Initial check
    checkMobile();
    
    // Debounced resize listener
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150); // 150ms debounce
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [checkMobile]);
  
  return isMobile;
}

// Clear cache function for testing or dynamic scenarios
export function clearMobileDetectionCache(): void {
  mobileDeviceCache = null;
  viewportCache = null;
}

// Advanced mobile detection with touch support
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

// Comprehensive mobile detection
export function getDeviceInfo() {
  return {
    isMobileDevice: isMobileDevice(),
    isMobileViewport: isMobileViewport(),
    isTouchDevice: isTouchDevice(),
    isFullyMobile: isMobileDeviceOrViewport() && isTouchDevice(),
    viewport: typeof window !== 'undefined' ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : null
  };
}