import * as React from "react";

export function useIsMobile(breakpointPx: number = 480) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let mql: MediaQueryList | null = null;

    try {
      mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);

      const update = () => setIsMobile(!!mql && mql.matches);

      update();

      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", update);
        return () => mql?.removeEventListener("change", update);
      } else {
        // Safari fallback
        mql.addListener(update);
        return () => mql?.removeListener(update);
      }
    } catch {
      setIsMobile(false);
    }
  }, [breakpointPx]);

  // until resolved => false
  return isMobile === true;
}
