import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeviceInfo } from "@/utils/mobile-detection";

interface MobilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobilePopup({ isOpen, onClose }: MobilePopupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deviceInfo = useMemo(() => getDeviceInfo(), []);

  const isDevelopment = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("replit"))
    );
  }, []);

  // const shouldRender = useMemo(() => {
  //   return deviceInfo.isMobileDevice || deviceInfo.isMobileViewport || isDevelopment;
  // }, [deviceInfo.isMobileDevice, deviceInfo.isMobileViewport, isDevelopment]);

  const shouldRender = useMemo(() => {
    return deviceInfo.isMobileViewport;
  }, [deviceInfo.isMobileViewport]);

  const leadCaptureMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "BrandingBeez Welcome Lead",
          email: data.email,
          company: "Unknown",
          service: data.interest,
          message: `Mobile popup submission - Selected Interest: ${data.interest} | Email: ${data.email} | Device: Mobile | Popup Type: Mobile Welcome Flow`,
          source: "mobile_popup",
          region: "US",
          inquiry_type: "mobile-popup-contact-form",
          preferred_contact: "email",
          topPriority: "mobile-popup-lead",
          contactFormType: "mobile-popup-contact-form",
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
      toast({
        title: "🎉 Welcome!",
        description: "Thanks for joining us! Enjoy exploring our services.",
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
    { id: "grow-agency", name: "Grow My Agency", icon: "📈" },
    { id: "white-label", name: "White-Label Solutions", icon: "🏷️" },
    { id: "seo-marketing", name: "SEO & Marketing", icon: "🎯" },
    { id: "web-dev", name: "Website Development", icon: "💻" },
    { id: "dedicated-team", name: "Hire Remote Team", icon: "👥" },
    { id: "ai-automation", name: "AI & Automation", icon: "🤖" },
  ];

  const handleSubmit = useCallback(() => {
    if (!email || !interest) return;
    leadCaptureMutation.mutate({ email, interest });
  }, [email, interest, leadCaptureMutation]);

  const resetPopup = useCallback(() => {
    setStep(1);
    setEmail("");
    setInterest("");
  }, []);

  const handleClose = useCallback(() => {
    resetPopup();
    onClose();
  }, [resetPopup, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;
    if (!document.body) return;

    const body = document.body;

    // save previous
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // avoid layout shift when scrollbar disappears (desktop mostly)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;

    const popupElement = document.querySelector(".mobile-popup-modal");
    if (popupElement) {
      const focusableElement = popupElement.querySelector(
        "button, input, [tabindex='0']"
      ) as HTMLElement | null;

      if (focusableElement) {
        setTimeout(() => focusableElement.focus(), 100);
      }
    }
  }, [isOpen, step]);

  if (!isOpen || !shouldRender) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ✅ Viewport centered wrapper */}
      <div
        className="mobile-popup-modal fixed inset-0 z-[10000] flex items-center justify-center px-2"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-popup-title"
        aria-describedby="mobile-popup-description"
      >
        <div
          className="relative w-full max-w-[480px]"
          style={{ maxHeight: "calc(100vh - 1rem)" }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-full overflow-y-auto scroll-smooth">
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 w-10 h-10 flex items-center justify-center rounded-full dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 active:bg-gray-200 dark:active:bg-gray-600 transition-all duration-200 z-20 touch-manipulation"
              aria-label="Close mobile popup"
              type="button"
              tabIndex={0}
            >
              <X size={18} className="drop-shadow-sm" />
            </button>

            {step === 1 && (
              <div className="p-4 sm:p-5">
                <div className="text-center mb-4">
                  <h2
                    id="mobile-popup-title"
                    className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight"
                  >
                    Welcome to BrandingBeez
                  </h2>
                  <p
                    id="mobile-popup-description"
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    Your white-label growth engine trusted by agencies worldwide
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
                  <div className="text-center p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg touch-manipulation">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      25+
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Agencies
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Trust Us
                    </p>
                  </div>
                  <div className="text-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg touch-manipulation">
                    <div className="text-2xl mb-1">📈</div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      3x
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Growth
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Average Client
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      White-label services under your brand
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Expert teams for hire in India
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Scale without hiring overhead
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 active:from-orange-700 active:to-yellow-700 text-white font-semibold text-sm py-3.5 mb-2 touch-manipulation transition-all duration-200 shadow-lg hover:shadow-xl"
                  type="button"
                >
                  Get Started <ArrowRight size={14} className="ml-2" />
                </Button>

                <button
                  onClick={handleClose}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 active:text-gray-800 dark:active:text-gray-100 block mx-auto py-2 px-4 touch-manipulation transition-colors duration-200"
                  type="button"
                >
                  Maybe later
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-4 sm:p-5">
                <div className="text-center mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                    What interests you most? 🎯
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Select your focus area
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  {interests.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setInterest(item.id)}
                      className={`p-2.5 sm:p-3 rounded-lg border-2 text-center transition-all duration-200 touch-manipulation ${interest === item.id
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-orange-300"
                        }`}
                    >
                      <div className="text-sm mb-1">{item.icon}</div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email for updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm py-3 px-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200 touch-manipulation"
                    autoComplete="email"
                    inputMode="email"
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={!email || !interest || leadCaptureMutation.isPending}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 active:from-orange-700 active:to-yellow-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm py-3.5 touch-manipulation transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                    type="button"
                  >
                    {leadCaptureMutation.isPending ? "Processing..." : "Get Started"}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
                    White-label solutions & agency growth tips
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-4 sm:p-5 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="text-white" size={24} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                  You're All Set! 🎉
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed px-2">
                  Check your email for agency growth tips and exclusive white-label resources
                </p>

                <Button
                  onClick={handleClose}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm py-3.5 touch-manipulation transition-all duration-200 shadow-lg hover:shadow-xl"
                  type="button"
                >
                  Start Exploring
                </Button>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-5 py-3">
              <div className="flex justify-center items-center space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? "bg-orange-500 shadow-sm" : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      aria-label={`Step ${i} ${i <= step ? "completed" : "pending"}`}
                    />
                    {i < 3 && (
                      <div
                        className={`w-4 h-0.5 mx-1 transition-colors duration-300 ${i < step ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-500"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Step {step} of 3
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>,
    (document.body || document.documentElement)
  );
}

export { MobilePopup as BrandingBeezPopup };
