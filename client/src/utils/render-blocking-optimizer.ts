// Comprehensive render-blocking optimization
export function optimizeRenderBlocking(): void {
  // 1. Immediately optimize font loading
  const fontPreloadLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
  fontPreloadLinks.forEach(link => {
    const fontLink = link as HTMLLinkElement;
    if (fontLink.crossOrigin !== 'anonymous') {
      fontLink.crossOrigin = 'anonymous';
    }
  });

  // 2. Convert print media Google Fonts to all after load
  const googleFontLink = document.querySelector('link[href*="fonts.googleapis.com"][media="print"]') as HTMLLinkElement;
  if (googleFontLink && !googleFontLink.onload) {
    googleFontLink.onload = function() {
      googleFontLink.media = 'all';
      googleFontLink.onload = null;
    };
  }

  // 3. Ensure main CSS loads after critical path
  const mainCSSPreload = document.querySelector('link[href*="index.css"][rel="preload"]') as HTMLLinkElement;
  if (mainCSSPreload && !mainCSSPreload.onload) {
    mainCSSPreload.onload = function() {
      mainCSSPreload.rel = 'stylesheet';
      mainCSSPreload.onload = null;
    };
  }

  // 4. Add font-display: swap to all fonts
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);

  // 5. Optimize resource priorities
  const criticalResources = document.querySelectorAll('link[rel="preload"]');
  criticalResources.forEach((link, index) => {
    const linkEl = link as HTMLLinkElement;
    if (index < 3) { // First 3 resources are highest priority
      linkEl.setAttribute('fetchpriority', 'high');
    }
  });

  // 6. Monitor and log performance improvements
  if ('performance' in window && performance.mark) {
    performance.mark('render-blocking-optimized');
  }
}

// Run optimization as early as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeRenderBlocking);
} else {
  optimizeRenderBlocking();
}