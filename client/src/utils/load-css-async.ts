// Utility to load CSS files asynchronously to prevent render blocking
export function loadCSSAsync(href: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (id) link.id = id;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    
    document.head.appendChild(link);
  });
}

// Load font CSS with proper fallback
export function loadFontsAsync(): Promise<void> {
  return loadCSSAsync(
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    'google-fonts'
  );
}

// Apply font display swap fallback
export function optimizeFontDisplay(): void {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Poppins';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}