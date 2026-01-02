// src/components/ThankYouPopup.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  formType?: "strategy" | "contact" | "inquiry" | "newsletter";
}

export function ThankYouPopup({
  isOpen,
  onClose,
  title = "Thank You for Submitting!",
  message = "We've received your submission and will get back to you within 24 hours.",
  formType = "contact",
}: ThankYouPopupProps) {
  const [, setLocation] = useLocation();
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Ensure portal mount (prevents SSR issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Lock background scroll while modal is open (no page movement)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    // ✅ Smooth close animation (fade + scale down)
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  if (!isOpen || !mounted) return null;
  if (typeof document === "undefined") return null;

  const content = (
    <div
      aria-modal="true"
      role="dialog"
      className={[
        "fixed inset-0 z-[99999] flex items-center justify-center",
        "transition-opacity duration-300",
        isClosing ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      {/* Overlay background (smooth fade) */}
      <div
        className={[
          "absolute inset-0 bg-black/40",
          "transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100",
        ].join(" ")}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ✅ Always centered in CURRENT viewport */}
      <div className="relative z-10 w-full px-4 sm:px-4 flex items-center justify-center">
        <div
          className={[
            // ✅ Smaller responsive width
            "relative w-full max-w-[92vw] sm:max-w-sm md:max-w-md lg:max-w-[500px]",
            // ✅ Smaller height overall
            "max-h-[90vh]",
            "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl",
            "overflow-hidden",
            "transform transition-all duration-300 ease-out",
            isClosing
              ? "scale-[0.97] opacity-0 translate-y-2"
              : "scale-100 opacity-100 translate-y-0",
          ].join(" ")}
          style={{
            paddingLeft: "max(0.9rem, env(safe-area-inset-left))",
            paddingRight: "max(0.9rem, env(safe-area-inset-right))",
            paddingTop: "max(1rem, env(safe-area-inset-top))",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          {/* ✅ Reduced inner padding */}
          <div className="p-4 sm:p-5 md:p-6">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-50 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close popup"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            {/* ✅ Smaller Success icon */}
            <div className="flex justify-center mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={30} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 leading-snug">
              {title}
            </h2>

            {/* ✅ Message (ONLY this section scrollable for book appointment) */}
            {formType === "strategy" ? (
              <div className="mb-4 sm:mb-5">
                <div
                  className="
                    text-sm sm:text-base text-gray-600 dark:text-gray-300
                    leading-relaxed text-left
                    max-h-[110px] sm:max-h-[170px]
                    overflow-y-auto
                    pr-2
                    overscroll-contain
                    [-webkit-overflow-scrolling:touch] scrollbar-thin
                  "
                >
                  <div className="space-y-2.5">
                    {String(message || "")
                      .split("\n")
                      .filter((line) => line.trim().length > 0)
                      .map((line, idx) => {
                        const trimmed = line.trim();
                        const isLink = /^https?:\/\/\S+/i.test(trimmed);

                        return (
                          <p
                            key={idx}
                            className={
                              idx === 0
                                ? "text-gray-800 dark:text-gray-200 font-medium"
                                : ""
                            }
                          >
                            {isLink ? (
                              <a
                                href={trimmed}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline break-all"
                              >
                                {trimmed}
                              </a>
                            ) : (
                              trimmed
                            )}
                          </p>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 leading-relaxed">
                {message}
              </p>
            )}

            {/* Next steps info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 sm:mb-5 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    What happens next?
                  </p>
                  <p>
                    {formType === "strategy"
                      ? "Our team will reach out before the meeting for more questions about you over call or email."
                      : "Our team will review your submission and contact you shortly to discuss how we can help."}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-3">
              <Button
                onClick={() => {
                  handleClose();
                  setTimeout(() => setLocation("/"), 260);
                }}
                className="w-full bg-gradient-to-r from-brand-purple to-brand-coral hover:from-brand-purple/90 hover:to-brand-coral/90 text-white font-semibold"
              >
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {formType === "strategy" && (
                <Button
                  onClick={() => {
                    handleClose();
                    setTimeout(() => setLocation("/portfolio"), 260);
                  }}
                  variant="outline"
                  className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View Our Portfolio
                </Button>
              )}
            </div>

            {/* <div className="flex items-center justify-center mt-4">
              <button
                onClick={handleClose}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                type="button"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}






// // src/components/ThankYouPopup.tsx
// import { useState, useEffect, useRef } from "react";
// import { X, CheckCircle, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useLocation } from "wouter";

// interface ThankYouPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   message?: string;
//   formType?: "strategy" | "contact" | "inquiry" | "newsletter";
// }

// export function ThankYouPopup({
//   isOpen,
//   onClose,
//   title = "Thank You for Submitting!",
//   message = "We've received your submission and will get back to you within 24 hours.",
//   formType = "contact",
// }: ThankYouPopupProps) {
//   const [, setLocation] = useLocation();
//   const [isClosing, setIsClosing] = useState(false);
//   const popupRef = useRef<HTMLDivElement | null>(null);

//   // ✅ Scroll popup into view (safe)
//   useEffect(() => {
//     if (isOpen && popupRef.current) {
//       popupRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   }, [isOpen]);

//   const handleClose = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsClosing(false);
//       onClose();
//     }, 250);
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       aria-modal="true"
//       role="dialog"
//       className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"
//         }`}
//     >
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={handleClose}
//         aria-hidden="true"
//       />

//       {/* Centered wrapper (NO scrolling here) */}
//       <div className="relative z-50 w-full px-4 sm:px-6 flex items-center justify-center">
//         {/* Popup container */}
//         <div
//           ref={popupRef}
//           className={`relative w-full max-w-[92vw] sm:max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 transform ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
//             } overflow-hidden`}
//           style={{
//             paddingLeft: "max(1rem, env(safe-area-inset-left))",
//             paddingRight: "max(1rem, env(safe-area-inset-right))",
//             paddingTop: "max(1.25rem, env(safe-area-inset-top))",
//             // paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
//           }}
//         >
//           {/* Inner padding */}
//           <div className="p-5 sm:p-7 md:p-8">
//             {/* Close button */}
//             <button
//               onClick={handleClose}
//               className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-50 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
//               aria-label="Close popup"
//               type="button"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             {/* Success icon */}
//             <div className="flex justify-center mb-5 sm:mb-6">
//               <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
//                 <CheckCircle className="text-white" size={36} />
//               </div>
//             </div>

//             {/* Title */}
//             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2 sm:mb-3 leading-snug">
//               {title}
//             </h2>

//             {/* MESSAGE (scrollable ONLY for strategy) */}
//             {formType === "strategy" ? (
//               <div className="mb-5 sm:mb-6">
//                 <div
//                   className="
//                     text-sm sm:text-base text-gray-600 dark:text-gray-300
//                     leading-relaxed text-left
//                     max-h-[180px] sm:max-h-[220px]
//                     overflow-y-auto
//                     pr-2
//                     overscroll-contain
//                     [-webkit-overflow-scrolling:touch]
//                   "
//                 >
//                   <div className="space-y-3">
//                     {String(message || "")
//                       .split("\n")
//                       .filter((line) => line.trim().length > 0)
//                       .map((line, idx) => {
//                         const trimmed = line.trim();
//                         const isLink = /^https?:\/\/\S+/i.test(trimmed);

//                         return (
//                           <p
//                             key={idx}
//                             className={
//                               idx === 0
//                                 ? "text-gray-800 dark:text-gray-200 font-medium"
//                                 : ""
//                             }
//                           >
//                             {isLink ? (
//                               <a
//                                 href={trimmed}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline break-all"
//                               >
//                                 {trimmed}
//                               </a>
//                             ) : (
//                               trimmed
//                             )}
//                           </p>
//                         );
//                       })}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 sm:mb-6 leading-relaxed">
//                 {message}
//               </p>
//             )}

//             {/* Next steps */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mb-5 sm:mb-6 border border-blue-200 dark:border-blue-800">
//               <div className="flex items-start gap-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
//                 <div className="text-sm text-gray-700 dark:text-gray-300">
//                   <p className="font-semibold text-gray-900 dark:text-white mb-1">
//                     What happens next?
//                   </p>
//                   <p>
//                     {formType === "strategy"
//                       ? "Our team will reach out before the meeting for more questions about you over call or email."
//                       : "Our team will review your submission and contact you shortly to discuss how we can help."}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* CTA buttons */}
//             <div className="flex flex-row gap-3">
//               <Button
//                 onClick={() => {
//                   handleClose();
//                   setLocation("/");
//                 }}
//                 className="w-full bg-gradient-to-r from-brand-purple to-brand-coral hover:from-brand-purple/90 hover:to-brand-coral/90 text-white font-semibold"
//               >
//                 Back to Home
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>

//               {formType === "strategy" && (
//                 <Button
//                   onClick={() => {
//                     handleClose();
//                     setLocation("/portfolio");
//                   }}
//                   variant="outline"
//                   className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   View Our Portfolio
//                 </Button>
//               )}
//             </div>

//             <div className="flex items-center justify-center mt-4">
//               <button
//                 onClick={handleClose}
//                 className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
//                 type="button"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
