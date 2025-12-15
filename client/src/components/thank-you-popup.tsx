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

//   //  FIX – Scroll directly to popup
//   useEffect(() => {
//     if (isOpen && popupRef.current) {
//       setTimeout(() => {
//         popupRef.current?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }, 300); 
//     }
//   }, [isOpen]);

//   // Auto-close after time
//   useEffect(() => {
//     if (isOpen) {
//       const timer = setTimeout(() => handleClose(), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   const handleClose = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsClosing(false);
//       onClose();
//     }, 300);
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       aria-modal="true"
//       role="dialog"
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
//         isClosing ? "opacity-0" : "opacity-100"
//       }`}
//     >
//       {/* Overlay background */}
//       <div
//         className="absolute inset-0 z-40 bg-black/40"
//         onClick={handleClose}
//         aria-hidden="true"
//       />

//       {/*  Popup Container with REF */}
//       <div
//         ref={popupRef}
//         className={`relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-300 transform ${
//           isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
//         }`}
//       >
//         {/* Close button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-50"
//           aria-label="Close popup"
//         >
//           <X size={20} />
//         </button>

//         {/* Success icon */}
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
//             <CheckCircle className="text-white" size={40} />
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
//           {title}
//         </h2>

//         {/* Message */}
//         <p className="text-center text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
//           {message}
//         </p>

//         {/* Next steps info */}
//         <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
//           <div className="flex items-start gap-3">
//             <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//             <div className="text-sm text-gray-700 dark:text-gray-300">
//               <p className="font-semibold text-gray-900 dark:text-white mb-1">
//                 What happens next?
//               </p>
//               <p>
//                 Our team will review your{" "}
//                 {formType === "strategy" ? "strategy request" : "submission"} and
//                 contact you shortly to discuss how we can help.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col gap-3">
//           <Button
//             onClick={() => {
//               handleClose();
//               setLocation("/");
//             }}
//             className="w-full bg-gradient-to-r from-brand-purple to-brand-coral hover:from-brand-purple/90 hover:to-brand-coral/90 text-white font-semibold"
//           >
//             Back to Home
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>

//           {formType === "strategy" && (
//             <Button
//               onClick={() => {
//                 handleClose();
//                 setLocation("/portfolio");
//               }}
//               variant="outline"
//               className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
//             >
//               View Our Portfolio
//             </Button>
//           )}

//           <button
//             onClick={handleClose}
//             className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
//           >
//             Close
//           </button>
//         </div>

//         {/* Auto-close hint */}
//         <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
//           This popup will close automatically in a few seconds
//         </p>
//       </div>
//     </div>
//   );
// }








import { useState, useEffect, useRef } from "react";
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
  const popupRef = useRef<HTMLDivElement | null>(null);

  //  FIX – Scroll directly to popup
  useEffect(() => {
    if (isOpen && popupRef.current) {
      setTimeout(() => {
        popupRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [isOpen]);

  // Auto-close after time
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => handleClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Overlay background */}
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/*  Popup Container with REF */}
      <div
        ref={popupRef}
        className={`relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-300 transform ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-50"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="text-white" size={40} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Next steps info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                What happens next?
              </p>
              <p>
                Our team will review your{" "}
                {formType === "strategy" ? "strategy request" : "submission"} and
                contact you shortly to discuss how we can help.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              handleClose();
              setLocation("/");
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
                setLocation("/portfolio");
              }}
              variant="outline"
              className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View Our Portfolio
            </Button>
          )}

          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
          >
            Close
          </button>
        </div>

        {/* Auto-close hint */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          This popup will close automatically in a few seconds
        </p>
      </div>
    </div>
  );
}
