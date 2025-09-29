// Navigation utility to ensure pages scroll to top
export const navigateToTop = (path: string) => {
  // Update the URL
  window.history.pushState(null, '', path);
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Trigger a popstate event to update the router
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// Hook to automatically scroll to top on route changes
export const useScrollToTop = () => {
  return (path: string) => {
    navigateToTop(path);
  };
};