// Completely disable Vite error overlays and runtime error modals
export const disableViteOverlay = () => {
  // Remove existing overlays immediately
  const removeAllOverlays = () => {
    // Remove Vite error overlays
    const viteOverlays = document.querySelectorAll('vite-error-overlay');
    viteOverlays.forEach(overlay => overlay.remove());
    
    // Remove runtime error modals from Replit plugin
    const runtimeModals = document.querySelectorAll('[class*="runtime-error"], [class*="error-modal"]');
    runtimeModals.forEach(modal => modal.remove());
    
    // Remove any div with error-related content
    const errorDivs = document.querySelectorAll('div');
    errorDivs.forEach(div => {
      const text = div.textContent || '';
      if ((text.includes('Failed to fetch') || 
          text.includes('Cannot read properties') ||
          text.includes('reading \'frame\'') ||
          text.includes('runtime-error-plugin')) && 
          (div.style.position === 'fixed' || div.style.zIndex === '999999')) {
        div.remove();
      }
    });
    
    // Also remove any elements with specific Replit error overlay characteristics
    const replitOverlays = document.querySelectorAll('[style*="z-index: 999999"], [style*="position: fixed"]');
    replitOverlays.forEach(overlay => {
      const content = overlay.textContent || '';
      if (content.includes('frame') || content.includes('runtime-error') || content.includes('Cannot read properties')) {
        overlay.remove();
      }
    });
  };

  // Override document.createElement to prevent overlay creation
  const originalCreateElement = document.createElement.bind(document);
  (document as any).createElement = function(tagName: string, options?: ElementCreationOptions) {
    const element = originalCreateElement(tagName, options);
    
    // Block vite-error-overlay elements
    if (tagName.toLowerCase() === 'vite-error-overlay') {
      return originalCreateElement('div');  // Return empty div instead
    }
    
    return element;
  };

  // Block style injection that creates overlays
  const originalAppendChild = document.head.appendChild.bind(document.head);
  (document.head as any).appendChild = function(node: Node) {
    // Block styles that create error overlays
    if (node instanceof HTMLStyleElement && 
        (node.textContent?.includes('vite-error-overlay') || 
         node.textContent?.includes('runtime-error'))) {
      return node; // Don't actually append
    }
    return originalAppendChild(node);
  };

  // Set up continuous monitoring
  removeAllOverlays();
  
  // Monitor for new overlay creation every 100ms
  const cleanupInterval = setInterval(removeAllOverlays, 100);
  
  // Also use MutationObserver for immediate removal
  const observer = new MutationObserver(removeAllOverlays);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  return () => {
    clearInterval(cleanupInterval);
    observer.disconnect();
  };
};