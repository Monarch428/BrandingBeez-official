// Defer non-critical JavaScript to improve page load performance

export function deferNonCriticalJS() {
  // Defer Google Tag Manager and other non-critical scripts
  const deferScript = (src: string, id?: string) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (id) script.id = id;
    document.head.appendChild(script);
  };

  // Use requestIdleCallback to defer non-critical tasks and break up long tasks
  const scheduleWork = (work: () => void, priority: 'low' | 'normal' | 'high' = 'normal') => {
    if ('requestIdleCallback' in window) {
      const timeout = priority === 'high' ? 50 : priority === 'normal' ? 1000 : 5000;
      requestIdleCallback(work, { timeout });
    } else {
      const delay = priority === 'high' ? 0 : priority === 'normal' ? 1 : 10;
      setTimeout(work, delay);
    }
  };

  // Break up long tasks into smaller chunks to avoid blocking main thread
  const processInChunks = async <T>(
    items: T[],
    processor: (item: T) => void,
    chunkSize = 5
  ) => {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      chunk.forEach(processor);
      
      // Yield to main thread after each chunk
      await new Promise(resolve => {
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          (window as any).scheduler.postTask(resolve, { priority: 'user-blocking' });
        } else {
          setTimeout(resolve, 0);
        }
      });
    }
  };

  // Defer non-critical CSS with high priority for UI components
  scheduleWork(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/non-critical.css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }, 'high');

  // Optimize component initialization to prevent main thread blocking
  scheduleWork(() => {
    // Initialize components in chunks to prevent long tasks
    const initializeComponents = async () => {
      const componentInits = [
        () => { /* Modal components */ },
        () => { /* Form validations */ },
        () => { /* Animation setups */ },
        () => { /* Event listeners */ }
      ];
      
      await processInChunks(componentInits, (init) => init(), 2);
    };
    
    initializeComponents();
  }, 'normal');
}

export function optimizeImageLoading() {
  // Use Intersection Observer for better lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            // Batch DOM changes to prevent forced reflow
            requestAnimationFrame(() => {
              img.src = img.dataset.src!;
              img.classList.add('loaded');
            });
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Tree-shake unused dependencies in development
export function removeUnusedFeatures() {
  // Remove unused console methods in production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
}