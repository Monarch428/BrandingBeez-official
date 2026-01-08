import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Star, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

// ✅ Turnstile widget (same as contact form)
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

interface EntryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENTRY_SUBMITTED_KEY = "entryPopup_submitted"; // localStorage
const ENTRY_CLOSED_KEY = "entryPopup_closed"; // sessionStorage

// ✅ Safe storage helpers (prevents SecurityError -> white screen)
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

function hasEntrySubmitted() {
  if (typeof window === "undefined") return false;
  return safeGet(window.localStorage, ENTRY_SUBMITTED_KEY) === "1";
}

function hasEntryClosedThisSession() {
  if (typeof window === "undefined") return false;
  return safeGet(window.sessionStorage, ENTRY_CLOSED_KEY) === "1";
}

export function EntryPopup({ isOpen, onClose }: EntryPopupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // ✅ NEW: 5s delay gate
  const [canShowAfterDelay, setCanShowAfterDelay] = useState(false);

  // ✅ Turnstile env + state
  const TURNSTILE_SITE_KEY = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError("");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification expired. Please verify again.");
  }, []);

  const handleTurnstileFail = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError("Verification failed. Please try again.");
  }, []);

  // ✅ Reset popup state when it closes
  const resetPopup = () => {
    setStep(1);
    setEmail("");
    setInterest("");
    setTurnstileToken("");
    setTurnstileError("");
  };

  useEffect(() => {
    if (!isOpen) {
      setCanShowAfterDelay(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCanShowAfterDelay(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // ✅ Reset captcha whenever step changes (fresh verification for Step 2 submit)
  useEffect(() => {
    setTurnstileToken("");
    setTurnstileError("");
  }, [step]);

  const leadCaptureMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Entry Popup Lead",
          email: data.email,
          company: "Unknown",
          service: data.interest,
          message: `Entry popup submission - Selected Interest: ${data.interest}`,
          region: "US",

          // ✅ include captcha token
          turnstileToken: data.turnstileToken,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to capture lead");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      setStep(3);

      // ✅ Submitted => persist forever (doesn't show again)
      if (typeof window !== "undefined") {
        safeSet(window.localStorage, ENTRY_SUBMITTED_KEY, "1");
        safeRemove(window.sessionStorage, ENTRY_CLOSED_KEY);
      }

      toast({
        title: "🎉 Welcome Aboard!",
        description: "You're all set! Enjoy exploring our services.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const interests = [
    { id: "development", name: "Web Development", icon: "💻" },
    { id: "scale-agency", name: "Scale My Agency", icon: "📈" },
    { id: "white-label", name: "White-Label PPC Services", icon: "🏷️" },
    { id: "seo-services", name: "SEO / AIO Services", icon: "🎯" },
    { id: "dedicated-team", name: "Dedicated Resources", icon: "👥" },
    { id: "ai-solutions", name: "App Development (AI Powered)", icon: "🤖" },
  ];

  const handleSubmit = () => {
    if (!email || !interest) return;

    // ✅ Turnstile required
    if (!TURNSTILE_SITE_KEY) {
      toast({
        title: "Captcha not configured",
        description: "Missing VITE_TURNSTILE_SITE_KEY.",
        variant: "destructive",
      });
      return;
    }
    if (!turnstileToken) {
      setTurnstileError("Please verify you are not a robot.");
      toast({
        title: "Captcha required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return;
    }

    leadCaptureMutation.mutate({ email, interest, turnstileToken });
  };

  const handleClose = () => {
    // ✅ Closed => only hide for this tab session
    if (typeof window !== "undefined") {
      safeSet(window.sessionStorage, ENTRY_CLOSED_KEY, "1");
    }

    resetPopup();
    onClose();
  };

  // ✅ Guard render
  if (!isOpen) return null;

  // ✅ NEW: wait 5s after open trigger
  if (!canShowAfterDelay) return null;

  if (hasEntrySubmitted()) return null;
  if (hasEntryClosedThisSession()) return null;

  // ✅ Portal target
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal shell (viewport centered) */}
      <div className="relative z-50 max-w-lg w-full mx-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-50"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>

          {/* Scrollable content area */}
          <div className="modal-content max-h-[90vh] overflow-auto">
            {/* Step 1 */}
            {step === 1 && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Star className="text-white" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to BrandingBeez
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your white-label growth engine trusted by agencies worldwide
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      25+ Agencies
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Trust Us
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      3x Growth
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Average Client
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      White-label services under your brand
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Expert teams for hire in India
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Scale without hiring overhead
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold"
                >
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>

                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-3 block mx-auto"
                >
                  Maybe later
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    What brings you here today? 🤔
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Help us personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {interests.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setInterest(item.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        interest === item.id
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-orange-300"
                      }`}
                    >
                      <div className="text-lg mb-1">{item.icon}</div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email for personalized recommendations"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />

                  {/* ✅ Turnstile captcha (same contact form vibe) */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Security Verification <span className="text-red-500">*</span>
                    </div>

                    {TURNSTILE_SITE_KEY ? (
                      <TurnstileWidget
                        siteKey={TURNSTILE_SITE_KEY}
                        onToken={handleTurnstileToken}
                        onExpire={handleTurnstileExpire}
                        onError={handleTurnstileFail}
                      />
                    ) : (
                      <p className="text-sm text-red-600">
                        Turnstile site key missing. Set{" "}
                        <b>VITE_TURNSTILE_SITE_KEY</b>.
                      </p>
                    )}

                    {turnstileError && (
                      <p className="text-xs text-red-600 font-medium">
                        {turnstileError}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !email ||
                      !interest ||
                      leadCaptureMutation.isPending ||
                      !turnstileToken
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                  >
                    {leadCaptureMutation.isPending
                      ? "Processing..."
                      : "Continue Exploring"}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Get tailored content and exclusive agency growth tips
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  You're All Set! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Explore our services and discover how we can help scale your
                  agency
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={() => {
                      handleClose();
                      setLocation("/pricing-calculator");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    View Pricing
                  </Button>
                  <Button
                    onClick={() => {
                      handleClose();
                      requestAnimationFrame(() => {
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Book a Call
                  </Button>
                </div>

                <Button onClick={handleClose} className="w-full">
                  Start Exploring
                </Button>
              </div>
            )}

            {/* Progress indicator */}
            <div className="bg-gray-100 dark:bg-gray-700 px-6 py-2">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= step
                        ? "bg-orange-500"
                        : "bg-gray-300 dark:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body || document.documentElement
  );
}
