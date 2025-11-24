// Image optimization utilities
export function optimizeImage(src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
} = {}) {
  const { width, height, quality = 85, format = 'webp' } = options;
  
  // For production, you would implement actual image optimization
  // For now, we'll add proper loading attributes
  return {
    src,
    srcSet: generateSrcSet(src, width),
    sizes: generateSizes(width),
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: {
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      maxWidth: '100%'
    }
  };
}

function generateSrcSet(src: string, width?: number): string {
  if (!width) return src;
  
  const densities = [1, 2, 3];
  return densities
    .map(density => `${src} ${width * density}w`)
    .join(', ');
}

function generateSizes(width?: number): string {
  if (!width) return '100vw';
  
  return `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, ${width}px`;
}

// Create optimized image component
export function createOptimizedImage(src: string, alt: string, options: {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
} = {}) {
  const { width, height, className = '', priority = false } = options;
  
  const imageProps = optimizeImage(src, { width, height });
  
  return {
    ...imageProps,
    alt,
    className,
    loading: priority ? 'eager' as const : 'lazy' as const
  };
}

// Preload critical images
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return;
  
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Convert images to WebP format check
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Lazy load images with intersection observer
export function lazyLoadImages(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          // Batch DOM changes to prevent forced reflow
          requestAnimationFrame(() => {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
          });
        }
        
        imageObserver.unobserve(img);
      }
    });
  }, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  });
  
  const images = document.querySelectorAll(selector);
  images.forEach(img => imageObserver.observe(img));
}