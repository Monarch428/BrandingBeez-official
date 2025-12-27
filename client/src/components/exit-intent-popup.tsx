import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Gift, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXIT_SUBMITTED_KEY = "exitPopup_submitted"; // localStorage
const EXIT_CLOSED_KEY = "exitPopup_closed"; // sessionStorage

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

function hasExitSubmitted() {
  if (typeof window === "undefined") return false;
  return safeGet(window.localStorage, EXIT_SUBMITTED_KEY) === "1";
}

function hasExitClosedThisSession() {
  if (typeof window === "undefined") return false;
  return safeGet(window.sessionStorage, EXIT_CLOSED_KEY) === "1";
}

export function ExitIntentPopup({ isOpen, onClose }: ExitIntentPopupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const leadCaptureMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to capture lead");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      setStep(4);

      if (typeof window !== "undefined") {
        safeSet(window.localStorage, EXIT_SUBMITTED_KEY, "1");
        safeRemove(window.sessionStorage, EXIT_CLOSED_KEY);
      }

      toast({
        title: "🎉 Offer Claimed!",
        description: "Check your email for the exclusive discount code.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const services = [
    { id: "web-dev", name: "Web Development", discount: "25%" },
    { id: "seo", name: "SEO Services", discount: "30%" },
    { id: "google-ads", name: "Google Ads Management", discount: "35%" },
    { id: "dedicated-team", name: "Dedicated Resources", discount: "20%" },
    { id: "ai-integration", name: "App Development (AI Powered)", discount: "40%" },
  ];

  const handleSubmit = () => {
    if (!email || !selectedService) return;

    const selectedServiceData = services.find((s) => s.id === selectedService);

    leadCaptureMutation.mutate({
      name: "Exit Intent Lead",
      email,
      company: "Unknown",
      phone: "",
      service: selectedServiceData?.name || "General Inquiry",
      message: `Exit intent popup submission - Selected Service: ${selectedServiceData?.name} | Discount Offered: ${selectedServiceData?.discount} | Email: ${email} | Popup Type: Exit Intent with Discount Offer`,
      source: "exit_intent_popup",
      region: "US",
      inquiry_type: "exit-popup-contact-form",
      preferred_contact: "email",
      country: "US",
      topPriority: "exit-popup-lead",
      contactFormType: "exit-popup-contact-form",
    });
  };

  const resetPopup = () => {
    setStep(1);
    setEmail("");
    setSelectedService("");
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      safeSet(window.sessionStorage, EXIT_CLOSED_KEY, "1");
    }

    resetPopup();
    onClose();
  };

  if (!isOpen) return null;
  if (hasExitSubmitted()) return null;
  if (hasExitClosedThisSession()) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-50 max-w-lg w-full mx-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-50"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>

          <div className="modal-content max-h-[80vh] overflow-auto">
            {step === 1 && (
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gift className="text-white" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Wait! Don&apos;t Miss Out 🎯
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We noticed you&apos;re about to leave. Before you go, we have an
                  exclusive offer just for you!
                </p>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                >
                  Show Me The Offer <ArrowRight size={16} className="ml-2" />
                </Button>
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-3 block mx-auto"
                >
                  No thanks, I&apos;ll leave
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-6">
                <div className="text-center mb-4">
                  <Clock className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Limited Time Offer! ⏰
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Choose your service to unlock exclusive savings
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${selectedService === service.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </span>
                        <span className="text-green-600 font-bold">
                          {service.discount} OFF
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedService}
                  className="w-full"
                >
                  Continue to Claim Offer
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="p-6">
                <div className="text-center mb-4">
                  <Gift className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Almost There! 🎁
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Enter your email to receive your exclusive discount code
                  </p>
                  {selectedService && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium">
                        🎯 {services.find((s) => s.id === selectedService)?.name}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {services.find((s) => s.id === selectedService)?.discount} OFF
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={!email || leadCaptureMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {leadCaptureMutation.isPending
                      ? "Claiming Offer..."
                      : "Claim My Discount Now!"}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    No spam, just your exclusive discount code and updates
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Offer Claimed! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Check your email for the exclusive discount code. Our team will
                  contact you shortly!
                </p>
                <Button onClick={handleClose} className="w-full">
                  Continue Browsing
                </Button>
              </div>
            )}

            <div className="bg-gray-100 dark:bg-gray-700 px-6 py-2">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= step ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    (document.body || document.documentElement)
  );
}
