import { useState, useEffect, useCallback, useRef } from "react";
import { isMobileDeviceOrViewport } from "@/utils/mobile-detection";

interface PopupState {
  entryPopup: boolean;
  exitPopup: boolean;
  mobilePopup: boolean;
}

/**
 * ✅ Storage-safe helpers (prevents SecurityError white screen on first load)
 */
function safeGet(storage: Storage | undefined, key: string) {
  try {
    if (!storage) return null;
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage | undefined, key: string, value: string) {
  try {
    if (!storage) return;
    storage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeRemove(storage: Storage | undefined, key: string) {
  try {
    if (!storage) return;
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

function getLS(key: string) {
  if (typeof window === "undefined") return null;
  return safeGet(window.localStorage, key);
}
function setLS(key: string, value: string) {
  if (typeof window === "undefined") return;
  safeSet(window.localStorage, key, value);
}
function removeLS(key: string) {
  if (typeof window === "undefined") return;
  safeRemove(window.localStorage, key);
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

  /**
   * ✅ DOM-ready gate (prevents early portal/render edge cases)
   */
  const [domReady, setDomReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const markReady = () => setDomReady(true);

    // If already interactive/complete, mark immediately
    if (document.readyState === "interactive" || document.readyState === "complete") {
      markReady();
      return;
    }

    document.addEventListener("DOMContentLoaded", markReady, { once: true });
    return () => document.removeEventListener("DOMContentLoaded", markReady);
  }, []);

  /**
   * ✅ Prevent multiple timers stacking on first load (StrictMode/dev)
   */
  const entryTimerRef = useRef<number | null>(null);
  const mobileTimerRef = useRef<number | null>(null);
  const devExitTimerRef = useRef<number | null>(null);

  const clearTimer = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current != null && typeof window !== "undefined") {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  // ENTRY POPUP
  useEffect(() => {
    if (!domReady) return;

    const entryShown = getLS("brandingbeez_entry_shown");
    const entryDismissed = getLS("brandingbeez_entry_dismissed");

    const onHomePage =
      typeof window !== "undefined" && window.location?.pathname === "/";

    const somethingOpen = popupState.exitPopup || popupState.mobilePopup;

    // Clear any previous timer before scheduling a new one
    clearTimer(entryTimerRef);

    if (
      !entryShown &&
      !entryDismissed &&
      !hasShownEntry &&
      !somethingOpen &&
      onHomePage
    ) {
      entryTimerRef.current = window.setTimeout(() => {
        setPopupState((prev) => ({ ...prev, entryPopup: true }));
        setHasShownEntry(true);
        setLS("brandingbeez_entry_shown", "true");
      }, 1500);
    }

    return () => clearTimer(entryTimerRef);
  }, [domReady, hasShownEntry, popupState.exitPopup, popupState.mobilePopup]);

  // MOBILE POPUP — ONLY ≤768px
  useEffect(() => {
    if (!domReady) return;

    const popupShown = getLS("brandingbeez_mobile_popup_shown");
    const popupDismissed = getLS("brandingbeez_mobile_popup_dismissed");

    const isMobile = isMobileDeviceOrViewport();

    clearTimer(mobileTimerRef);

    if (!isMobile) return;

    if (!popupShown && !popupDismissed && !hasShownMobile) {
      mobileTimerRef.current = window.setTimeout(() => {
        if (!popupState.entryPopup && !popupState.exitPopup) {
          setPopupState((prev) => ({ ...prev, mobilePopup: true }));
          setHasShownMobile(true);
          setLS("brandingbeez_mobile_popup_shown", "true");
        }
      }, 1000);
    }

    return () => clearTimer(mobileTimerRef);
  }, [domReady, hasShownMobile, popupState.entryPopup, popupState.exitPopup]);

  // EXIT INTENT (desktop)
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

      if (
        (e.clientY <= 5 || e.movementY < -100) &&
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        setLS("brandingbeez_exit_shown", "true");
      }
    },
    [hasShownExit, popupState.entryPopup],
  );

  useEffect(() => {
    if (!domReady) return;

    const isMobile = isMobileDeviceOrViewport();
    if (isMobile) return;

    const handleDocumentMouseLeave = (e: MouseEvent) => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

      if (
        e.clientY <= 0 &&
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        setLS("brandingbeez_exit_shown", "true");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

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
        setLS("brandingbeez_exit_shown", "true");
      }
    };

    document.documentElement.addEventListener("mouseleave", handleDocumentMouseLeave);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.documentElement.removeEventListener("mouseleave", handleDocumentMouseLeave);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [domReady, hasShownExit, popupState.entryPopup, handleMouseLeave]);

  // EXIT INTENT (mobile)
  useEffect(() => {
    if (!domReady) return;

    const isMobile = isMobileDeviceOrViewport();
    if (!isMobile) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

      if (!exitShown && !exitDismissed && !hasShownExit) {
        // NOTE: avoid heavy logic here; don't block navigation aggressively
        e.preventDefault();
        setTimeout(() => {
          setPopupState((prev) => ({ ...prev, exitPopup: true }));
          setHasShownExit(true);
          setLS("brandingbeez_exit_shown", "true");
        }, 100);
      }
    };

    const handleVisibilityChange = () => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

      if (document.hidden && !exitShown && !exitDismissed && !hasShownExit) {
        setTimeout(() => {
          setPopupState((prev) => ({ ...prev, exitPopup: true }));
          setHasShownExit(true);
          setLS("brandingbeez_exit_shown", "true");
        }, 100);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [domReady, hasShownExit]);

  // Close handlers
  const closeEntryPopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, entryPopup: false }));
    setLS("brandingbeez_entry_dismissed", "true");
  }, []);

  const closeExitPopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, exitPopup: false }));
    setLS("brandingbeez_exit_dismissed", "true");
  }, []);

  const closeMobilePopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, mobilePopup: false }));
    setLS("brandingbeez_mobile_popup_dismissed", "true");
  }, []);

  // Reset functionality for testing
  const resetPopups = useCallback(() => {
    removeLS("brandingbeez_entry_shown");
    removeLS("brandingbeez_entry_dismissed");
    removeLS("brandingbeez_exit_shown");
    removeLS("brandingbeez_exit_dismissed");
    removeLS("brandingbeez_mobile_popup_shown");
    removeLS("brandingbeez_mobile_popup_dismissed");
    removeLS("brandingbeez_popup_shown");
    removeLS("brandingbeez_popup_dismissed");

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
      setLS("brandingbeez_exit_shown", "true");
    }
  }, [popupState.entryPopup]);

  const showMobilePopup = useCallback(() => {
    if (!popupState.entryPopup && !popupState.exitPopup) {
      setPopupState((prev) => ({ ...prev, mobilePopup: true }));
      setHasShownMobile(true);
      setLS("brandingbeez_mobile_popup_shown", "true");
    }
  }, [popupState.entryPopup, popupState.exitPopup]);

  // Dev fallback to surface exit popup after 15s
  useEffect(() => {
    if (!domReady) return;

    const isDev =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("replit"));

    if (!isDev) return;

    clearTimer(devExitTimerRef);

    devExitTimerRef.current = window.setTimeout(() => {
      const exitShown = getLS("brandingbeez_exit_shown");
      const exitDismissed = getLS("brandingbeez_exit_dismissed");

      if (
        !exitShown &&
        !exitDismissed &&
        !hasShownExit &&
        !popupState.entryPopup &&
        !popupState.mobilePopup
      ) {
        setPopupState((prev) => ({ ...prev, exitPopup: true }));
        setHasShownExit(true);
        setLS("brandingbeez_exit_shown", "true");
      }
    }, 15000);

    return () => clearTimer(devExitTimerRef);
  }, [domReady, hasShownExit, popupState.entryPopup, popupState.mobilePopup]);

  return {
    entryPopupOpen: popupState.entryPopup,
    exitPopupOpen: popupState.exitPopup,
    mobilePopupOpen: popupState.mobilePopup,
    closeEntryPopup,
    closeExitPopup,
    closeMobilePopup,
    resetPopups,
    showEntryPopup,
    showExitPopup,
    showMobilePopup,
  };
}
