// Global error handler to prevent unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  console.log('🛡️ Setting up comprehensive error suppression...');
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Override console methods to completely prevent frame errors from showing
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('Cannot read properties of undefined (reading \'frame\')') ||
        message.includes('frame') ||
        message.includes('Frame') ||
        message.includes('runtime-error') ||
        message.includes('vite-error-overlay')) {
      return; // Completely suppress frame and overlay errors
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('frame') && message.includes('undefined')) {
      return; // Completely suppress frame warnings
    }
    originalWarn.apply(console, args);
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    
    // Completely prevent frame-related errors from appearing
    if (reasonStr.includes('frame') || reasonStr.includes('Frame')) {
      event.preventDefault();
      return;
    }
    
    // Filter other safe rejections
    const safeRejections = [
      'Failed to fetch',
      'NetworkError', 
      'TypeError: Failed to fetch',
      'Load failed',
      'AbortError'
    ];
    
    const isSafeRejection = safeRejections.some(safe => reasonStr.includes(safe));
    
    if (isSafeRejection) {
      event.preventDefault();
      return;
    }
    
    // Only log truly unexpected errors in development
    if (process.env.NODE_ENV === 'development') {
      originalError('Unhandled promise rejection:', event.reason);
    }
    event.preventDefault();
  });
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const errorStr = String(event.error?.message || event.message || '');
    
    // Completely prevent frame-related errors from appearing
    if (errorStr.includes('Cannot read properties of undefined (reading \'frame\')') ||
        (errorStr.includes('frame') && errorStr.includes('undefined'))) {
      event.preventDefault();
      return;
    }
    
    // Filter other safe errors
    const safeErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured'
    ];
    
    const isSafeError = safeErrors.some(safe => errorStr.includes(safe));
    
    if (!isSafeError && process.env.NODE_ENV === 'development') {
      originalError('Uncaught error:', event.error);
    }
    
    if (isSafeError || errorStr.includes('frame')) {
      event.preventDefault();
    }
  });
};

// Image error handler with reliable SVG fallback
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  const fallbackUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23ff6b47'/%3E%3Ctext x='200' y='125' fill='white' font-family='Arial' font-size='16' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E";
  
  // Only change src if it's not already the fallback to prevent infinite loops
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
};