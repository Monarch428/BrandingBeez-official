// import { useState, useEffect, useCallback } from "react";
// import { isMobileDeviceOrViewport } from "@/utils/mobile-detection";

// interface PopupState {
//   entryPopup: boolean;
//   exitPopup: boolean;
//   mobilePopup: boolean;
// }

// export function usePopupManager() {
//   const [popupState, setPopupState] = useState<PopupState>({
//     entryPopup: false,
//     exitPopup: false,
//     mobilePopup: false,
//   });
  
//   const [hasShownEntry, setHasShownEntry] = useState(false);
//   const [hasShownExit, setHasShownExit] = useState(false);
//   const [hasShownMobile, setHasShownMobile] = useState(false);

//   // Mobile-only popup - show only on mobile devices at the top of page content
//   useEffect(() => {
//     const popupShown = localStorage.getItem('brandingbeez_mobile_popup_shown');
//     const popupDismissed = localStorage.getItem('brandingbeez_mobile_popup_dismissed');
    
//     // Check if current device/viewport is mobile
//     const isMobile = isMobileDeviceOrViewport();
    
//     // For testing: also show on desktop if in development
//     const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('replit');
//     const shouldShow = isMobile || isDevelopment;
    
//     if (shouldShow && !popupShown && !popupDismissed && !hasShownMobile) {
//       // Show after page loads for mobile users (or desktop in development)
//       const timer = setTimeout(() => {
//         setPopupState(prev => ({ ...prev, mobilePopup: true }));
//         setHasShownMobile(true);
//         localStorage.setItem('brandingbeez_mobile_popup_shown', 'true');
//       }, 1000); // Show after 1 second for viewport stabilization

//       return () => clearTimeout(timer);
//     }
//   }, [hasShownMobile]);

//   // Disable entry popup - replaced by BrandingBeez popup for all devices
//   // useEffect(() => {
//   //   // Entry popup disabled in favor of unified BrandingBeez popup
//   // }, [hasShownEntry]);

//   // Exit intent detection
//   const handleMouseLeave = useCallback((e: MouseEvent) => {
//     const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//     const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
    
//     // Only trigger if mouse leaves from the top of the viewport or moves upward quickly
//     if ((e.clientY <= 5 || e.movementY < -100) && !exitShown && !exitDismissed && !hasShownExit && !popupState.entryPopup) {
//       setPopupState(prev => ({ ...prev, exitPopup: true }));
//       setHasShownExit(true);
//       localStorage.setItem('brandingbeez_exit_shown', 'true');
//     }
//   }, [hasShownExit, popupState.entryPopup]);

//   // Desktop exit intent detection - only for non-mobile devices
//   useEffect(() => {
//     const isMobile = isMobileDeviceOrViewport();
    
//     // Skip exit intent for mobile devices (they use different detection method)
//     if (isMobile) return;
    
//     const handleDocumentMouseLeave = (e: MouseEvent) => {
//       const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//       const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
      
//       // Check if mouse is leaving the document area from the top
//       if (e.clientY <= 0 && !exitShown && !exitDismissed && !hasShownExit && !popupState.entryPopup) {
//         setPopupState(prev => ({ ...prev, exitPopup: true }));
//         setHasShownExit(true);
//         localStorage.setItem('brandingbeez_exit_shown', 'true');
//       }
//     };

//     // Also detect rapid upward mouse movement
//     const handleMouseMove = (e: MouseEvent) => {
//       const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//       const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
      
//       // Detect rapid upward movement towards browser controls
//       if (e.clientY <= 10 && e.movementY < -50 && !exitShown && !exitDismissed && !hasShownExit && !popupState.entryPopup) {
//         setPopupState(prev => ({ ...prev, exitPopup: true }));
//         setHasShownExit(true);
//         localStorage.setItem('brandingbeez_exit_shown', 'true');
//       }
//     };

//     document.documentElement.addEventListener('mouseleave', handleDocumentMouseLeave);
//     document.addEventListener('mousemove', handleMouseMove);
    
//     return () => {
//       document.documentElement.removeEventListener('mouseleave', handleDocumentMouseLeave);
//       document.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [hasShownExit, popupState.entryPopup]);

//   // Mobile exit intent - detect when mobile user tries to leave page
//   useEffect(() => {
//     const isMobile = isMobileDeviceOrViewport();
    
//     // Only apply mobile exit intent for mobile devices
//     if (!isMobile) return;
    
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//       const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
      
//       if (!exitShown && !exitDismissed && !hasShownExit) {
//         e.preventDefault();
//         // Note: Modern browsers don't allow custom messages
//         // but we can still trigger the exit popup
//         setTimeout(() => {
//           setPopupState(prev => ({ ...prev, exitPopup: true }));
//           setHasShownExit(true);
//           localStorage.setItem('brandingbeez_exit_shown', 'true');
//         }, 100);
//       }
//     };

//     // Additional mobile-specific exit intent detection
//     const handleVisibilityChange = () => {
//       const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//       const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
      
//       if (document.hidden && !exitShown && !exitDismissed && !hasShownExit) {
//         // User switched tabs/minimized on mobile
//         setTimeout(() => {
//           setPopupState(prev => ({ ...prev, exitPopup: true }));
//           setHasShownExit(true);
//           localStorage.setItem('brandingbeez_exit_shown', 'true');
//         }, 100);
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [hasShownExit]);

//   // Close handlers
//   const closeEntryPopup = useCallback(() => {
//     setPopupState(prev => ({ ...prev, entryPopup: false }));
//     localStorage.setItem('brandingbeez_entry_dismissed', 'true');
//   }, []);

//   const closeExitPopup = useCallback(() => {
//     setPopupState(prev => ({ ...prev, exitPopup: false }));
//     localStorage.setItem('brandingbeez_exit_dismissed', 'true');
//   }, []);

//   const closeMobilePopup = useCallback(() => {
//     setPopupState(prev => ({ ...prev, mobilePopup: false }));
//     localStorage.setItem('brandingbeez_mobile_popup_dismissed', 'true');
//   }, []);

//   // Reset functionality for testing
//   const resetPopups = useCallback(() => {
//     localStorage.removeItem('brandingbeez_entry_shown');
//     localStorage.removeItem('brandingbeez_entry_dismissed');
//     localStorage.removeItem('brandingbeez_exit_shown');
//     localStorage.removeItem('brandingbeez_exit_dismissed');
//     localStorage.removeItem('brandingbeez_mobile_popup_shown');
//     localStorage.removeItem('brandingbeez_mobile_popup_dismissed');
//     // Legacy keys for backwards compatibility
//     localStorage.removeItem('brandingbeez_popup_shown');
//     localStorage.removeItem('brandingbeez_popup_dismissed');
//     setHasShownEntry(false);
//     setHasShownExit(false);
//     setHasShownMobile(false);
//     setPopupState({ entryPopup: false, exitPopup: false, mobilePopup: false });
//   }, []);

//   // Force show popups (for testing)
//   const showEntryPopup = useCallback(() => {
//     if (!popupState.exitPopup) {
//       setPopupState(prev => ({ ...prev, entryPopup: true }));
//     }
//   }, [popupState.exitPopup]);

//   const showExitPopup = useCallback(() => {
//     if (!popupState.entryPopup) {
//       setPopupState(prev => ({ ...prev, exitPopup: true }));
//       setHasShownExit(true);
//       localStorage.setItem('brandingbeez_exit_shown', 'true');
//     }
//   }, [popupState.entryPopup]);

//   const showMobilePopup = useCallback(() => {
//     if (!popupState.entryPopup && !popupState.exitPopup) {
//       setPopupState(prev => ({ ...prev, mobilePopup: true }));
//       setHasShownMobile(true);
//       localStorage.setItem('brandingbeez_popup_shown', 'true');
//     }
//   }, [popupState.entryPopup, popupState.exitPopup]);

//   // Add a fallback timeout for testing exit popup (remove in production)
//   useEffect(() => {
//     if (window.location.hostname === 'localhost' || window.location.hostname.includes('replit')) {
//       const timer = setTimeout(() => {
//         const exitShown = localStorage.getItem('brandingbeez_exit_shown');
//         const exitDismissed = localStorage.getItem('brandingbeez_exit_dismissed');
        
//         if (!exitShown && !exitDismissed && !hasShownExit && !popupState.entryPopup && !popupState.mobilePopup) {
//           setPopupState(prev => ({ ...prev, exitPopup: true }));
//           setHasShownExit(true);
//           localStorage.setItem('brandingbeez_exit_shown', 'true');
//         }
//       }, 15000); // Show after 15 seconds for testing

//       return () => clearTimeout(timer);
//     }
//   }, [hasShownExit, popupState.entryPopup]);

//   return {
//     entryPopupOpen: popupState.entryPopup,
//     exitPopupOpen: popupState.exitPopup,
//     mobilePopupOpen: popupState.mobilePopup,
//     closeEntryPopup,
//     closeExitPopup,
//     closeMobilePopup,
//     resetPopups, // For development/testing
//     showEntryPopup, // For development/testing
//     showExitPopup, // For development/testing
//     showMobilePopup, // For development/testing
//   };
// }







import { useState, useEffect, useCallback } from "react";
import { isMobileDeviceOrViewport } from "@/utils/mobile-detection";

interface PopupState {
  entryPopup: boolean;
  exitPopup: boolean;
  mobilePopup: boolean;
}

export function usePopupManager() {
  const [popupState, setPopupState] = useState<PopupState>({
    entryPopup: false,
    exitPopup: false,
    mobilePopup: false,
  });

  const [hasShownEntry, setHasShownEntry] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);
  const [hasShownMobile, setHasShownMobile] = useState(false);

  // ENTRY POPUP (enabled)
  useEffect(() => {
    const entryShown = localStorage.getItem("brandingbeez_entry_shown");
    const entryDismissed = localStorage.getItem("brandingbeez_entry_dismissed");

    const onHomePage =
      typeof window !== "undefined" && window.location?.pathname === "/";

    const somethingOpen = popupState.exitPopup || popupState.mobilePopup;

    if (
      !entryShown &&
      !entryDismissed &&
      !hasShownEntry &&
      !somethingOpen &&
      onHomePage
    ) {
      const t = setTimeout(() => {
        setPopupState((prev) => ({ ...prev, entryPopup: true }));
        setHasShownEntry(true);
        localStorage.setItem("brandingbeez_entry_shown", "true");
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [hasShownEntry, popupState.exitPopup, popupState.mobilePopup]);

  // MOBILE POPUP
  useEffect(() => {
    const popupShown = localStorage.getItem("brandingbeez_mobile_popup_shown");
    const popupDismissed = localStorage.getItem(
      "brandingbeez_mobile_popup_dismissed",
    );

    const isMobile = isMobileDeviceOrViewport();

    const isDevelopment =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("replit"));

    const shouldShow = isMobile || isDevelopment;

    if (shouldShow && !popupShown && !popupDismissed && !hasShownMobile) {
      const timer = setTimeout(() => {
        if (!popupState.entryPopup && !popupState.exitPopup) {
          setPopupState((prev) => ({ ...prev, mobilePopup: true }));
          setHasShownMobile(true);
          localStorage.setItem("brandingbeez_mobile_popup_shown", "true");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasShownMobile, popupState.entryPopup, popupState.exitPopup]);

  // EXIT INTENT (desktop)
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      const exitShown = localStorage.getItem("brandingbeez_exit_shown");
      const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

      if (
        (e.clientY <= 5 || e.movementY < -100) &&
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        localStorage.setItem("brandingbeez_exit_shown", "true");
      }
    },
    [hasShownExit, popupState.entryPopup],
  );

  useEffect(() => {
    const isMobile = isMobileDeviceOrViewport();
    if (isMobile) return;

    const handleDocumentMouseLeave = (e: MouseEvent) => {
      const exitShown = localStorage.getItem("brandingbeez_exit_shown");
      const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

      if (
        e.clientY <= 0 &&
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        localStorage.setItem("brandingbeez_exit_shown", "true");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const exitShown = localStorage.getItem("brandingbeez_exit_shown");
      const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

      if (
        e.clientY <= 10 &&
        e.movementY < -50 &&
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        localStorage.setItem("brandingbeez_exit_shown", "true");
      }
    };

    document.documentElement.addEventListener(
      "mouseleave",
      handleDocumentMouseLeave,
    );
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleDocumentMouseLeave,
      );
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownExit, popupState.entryPopup, handleMouseLeave]);

  // EXIT INTENT (mobile)
  useEffect(() => {
    const isMobile = isMobileDeviceOrViewport();
    if (!isMobile) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const exitShown = localStorage.getItem("brandingbeez_exit_shown");
      const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

      if (!exitShown && !exitDismissed && !hasShownExit) {
        e.preventDefault();
        setTimeout(() => {
          setPopupState((prev) => ({ ...prev, exitPopup: true }));
          setHasShownExit(true);
          localStorage.setItem("brandingbeez_exit_shown", "true");
        }, 100);
      }
    };

    const handleVisibilityChange = () => {
      const exitShown = localStorage.getItem("brandingbeez_exit_shown");
      const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

      if (document.hidden && !exitShown && !exitDismissed && !hasShownExit) {
        setTimeout(() => {
          setPopupState((prev) => ({ ...prev, exitPopup: true }));
          setHasShownExit(true);
          localStorage.setItem("brandingbeez_exit_shown", "true");
        }, 100);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasShownExit]);

  // Close handlers
  const closeEntryPopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, entryPopup: false }));
    localStorage.setItem("brandingbeez_entry_dismissed", "true");
  }, []);

  const closeExitPopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, exitPopup: false }));
    localStorage.setItem("brandingbeez_exit_dismissed", "true");
  }, []);

  const closeMobilePopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, mobilePopup: false }));
    localStorage.setItem("brandingbeez_mobile_popup_dismissed", "true");
  }, []);

  // Reset functionality for testing
  const resetPopups = useCallback(() => {
    localStorage.removeItem("brandingbeez_entry_shown");
    localStorage.removeItem("brandingbeez_entry_dismissed");
    localStorage.removeItem("brandingbeez_exit_shown");
    localStorage.removeItem("brandingbeez_exit_dismissed");
    localStorage.removeItem("brandingbeez_mobile_popup_shown");
    localStorage.removeItem("brandingbeez_mobile_popup_dismissed");
    // Legacy keys for backwards compatibility
    localStorage.removeItem("brandingbeez_popup_shown");
    localStorage.removeItem("brandingbeez_popup_dismissed");
    setHasShownEntry(false);
    setHasShownExit(false);
    setHasShownMobile(false);
    setPopupState({ entryPopup: false, exitPopup: false, mobilePopup: false });
  }, []);

  // Force show popups (for testing)
  const showEntryPopup = useCallback(() => {
    if (!popupState.exitPopup && !popupState.mobilePopup) {
      setPopupState((prev) => ({ ...prev, entryPopup: true }));
    }
  }, [popupState.exitPopup, popupState.mobilePopup]);

  const showExitPopup = useCallback(() => {
    if (!popupState.entryPopup) {
      setPopupState((prev) => ({ ...prev, exitPopup: true }));
      setHasShownExit(true);
      localStorage.setItem("brandingbeez_exit_shown", "true");
    }
  }, [popupState.entryPopup]);

  const showMobilePopup = useCallback(() => {
    if (!popupState.entryPopup && !popupState.exitPopup) {
      setPopupState((prev) => ({ ...prev, mobilePopup: true }));
      setHasShownMobile(true);
      localStorage.setItem("brandingbeez_mobile_popup_shown", "true");
    }
  }, [popupState.entryPopup, popupState.exitPopup]);

  // Dev fallback to surface exit popup after 15s
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("replit"))
    ) {
      const timer = setTimeout(() => {
        const exitShown = localStorage.getItem("brandingbeez_exit_shown");
        const exitDismissed = localStorage.getItem("brandingbeez_exit_dismissed");

        if (
          !exitShown &&
          !exitDismissed &&
          !hasShownExit &&
          !popupState.entryPopup &&
          !popupState.mobilePopup
        ) {
          setPopupState((prev) => ({ ...prev, exitPopup: true }));
          setHasShownExit(true);
          localStorage.setItem("brandingbeez_exit_shown", "true");
        }
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [hasShownExit, popupState.entryPopup, popupState.mobilePopup]);

  return {
    entryPopupOpen: popupState.entryPopup,
    exitPopupOpen: popupState.exitPopup,
    mobilePopupOpen: popupState.mobilePopup,
    closeEntryPopup,
    closeExitPopup,
    closeMobilePopup,
    resetPopups, // For development/testing
    showEntryPopup, // For development/testing
    showExitPopup,  // For development/testing
    showMobilePopup // For development/testing
  };
}
