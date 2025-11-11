// import { useState, useEffect } from "react";
// import { X, Star, Users, TrendingUp, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useLocation } from "wouter";

// interface EntryPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function EntryPopup({ isOpen, onClose }: EntryPopupProps) {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [interest, setInterest] = useState("");
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [location, setLocation] = useLocation();

//   const leadCaptureMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const response = await fetch('/api/contacts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: 'Entry Popup Lead', // Assuming a default name or it needs to be captured
//           email: data.email,
//           company: 'Unknown', // Assuming a default company or it needs to be captured
//           service: data.interest, // Using the selected interest as the service
//           message: `Entry popup submission - Selected Interest: ${data.interest} | Email: ${data.email} | Popup Type: Entry Welcome Flow`,
//           source: 'entry_popup',
//           region: 'US',
//           inquiry_type: 'entry-popup-contact-form',
//           preferred_contact: 'email',
//           topPriority: 'entry-popup-lead',
//           contactFormType: 'entry-popup-contact-form'
//         })
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to capture lead');
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
//       setStep(3); // Success step
//       toast({
//         title: "🎉 Welcome Aboard!",
//         description: "You're all set! Enjoy exploring our services.",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const interests = [
//     { id: 'scale-agency', name: 'Scale My Agency', icon: '📈' },
//     { id: 'white-label', name: 'White-Label Services', icon: '🏷️' },
//     { id: 'seo-services', name: 'SEO & Marketing', icon: '🎯' },
//     { id: 'development', name: 'Web Development', icon: '💻' },
//     { id: 'dedicated-team', name: 'Dedicated Team', icon: '👥' },
//     { id: 'ai-solutions', name: 'AI Integration', icon: '🤖' },
//   ];

//   const handleSubmit = () => {
//     if (!email || !interest) return;

//     leadCaptureMutation.mutate({ email, interest });
//   };

//   const resetPopup = () => {
//     setStep(1);
//     setEmail("");
//     setInterest("");
//   };

//   const handleClose = () => {
//     resetPopup();
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
//       <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
//           aria-label="Close popup"
//         >
//           <X size={20} />
//         </button>

//         {/* Step 1: Welcome & Value Proposition */}
//         {step === 1 && (
//           <div className="p-6">
//             <div className="text-center mb-6">
//               <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                 <Star className="text-white" size={40} />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//                 Welcome to BrandingBeez
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Your white-label growth engine trusted by agencies worldwide
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                 <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900 dark:text-white">25+ Agencies</p>
//                 <p className="text-xs text-gray-600 dark:text-gray-300">Trust Us</p>
//               </div>
//               <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                 <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900 dark:text-white">3x Growth</p>
//                 <p className="text-xs text-gray-600 dark:text-gray-300">Average Client</p>
//               </div>
//             </div>

//             <div className="space-y-3 mb-6">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm text-gray-700 dark:text-gray-300">White-label services under your brand</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm text-gray-700 dark:text-gray-300">Expert teams for hire in India</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm text-gray-700 dark:text-gray-300">Scale without hiring overhead</span>
//               </div>
//             </div>

//             <Button
//               onClick={() => setStep(2)}
//               className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold"
//             >
//               Get Started <ArrowRight size={16} className="ml-2" />
//             </Button>

//             <button
//               onClick={handleClose}
//               className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-3 block mx-auto"
//             >
//               Maybe later
//             </button>
//           </div>
//         )}

//         {/* Step 2: Interest Selection & Email Capture */}
//         {step === 2 && (
//           <div className="p-6">
//             <div className="text-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                 What brings you here today? 🤔
//               </h2>
//               <p className="text-sm text-gray-600 dark:text-gray-300">
//                 Help us personalize your experience
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-6">
//               {interests.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setInterest(item.id)}
//                   className={`p-3 rounded-lg border-2 text-center transition-all ${
//                     interest === item.id
//                       ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
//                       : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
//                   }`}
//                 >
//                   <div className="text-lg mb-1">{item.icon}</div>
//                   <span className="text-xs font-medium text-gray-900 dark:text-white">
//                     {item.name}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-4">
//               <Input
//                 type="email"
//                 placeholder="Enter your email for personalized recommendations"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full"
//               />

//               <Button
//                 onClick={handleSubmit}
//                 disabled={!email || !interest || leadCaptureMutation.isPending}
//                 className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
//               >
//                 {leadCaptureMutation.isPending ? "Processing..." : "Continue Exploring"}
//               </Button>

//               <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                 Get tailored content and exclusive agency growth tips
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Success & Next Steps */}
//         {step === 3 && (
//           <div className="p-6 text-center">
//             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Star className="text-white" size={32} />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               You're All Set! 🎉
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               Explore our services and discover how we can help scale your agency
//             </p>

//             <div className="grid grid-cols-2 gap-3 mb-6">
//               <Button
//                 onClick={() => {
//                   handleClose();
//                   setLocation('/pricing-calculator');
//                 }}
//                 variant="outline"
//                 size="sm"
//               >
//                 View Pricing
//               </Button>
//               <Button
//                 onClick={() => {
//                   handleClose();
//                   // Use requestAnimationFrame to prevent forced reflow
//                   requestAnimationFrame(() => {
//                     window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
//                   });
//                 }}
//                 variant="outline"
//                 size="sm"
//               >
//                 Book a Call
//               </Button>
//             </div>

//             <Button onClick={handleClose} className="w-full">
//               Start Exploring
//             </Button>
//           </div>
//         )}

//         {/* Progress indicator */}
//         <div className="bg-gray-100 dark:bg-gray-700 px-6 py-2">
//           <div className="flex justify-center space-x-2">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className={`w-2 h-2 rounded-full ${
//                   i <= step ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-500'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useState } from "react";
import { X, Star, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface EntryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EntryPopup({ isOpen, onClose }: EntryPopupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

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
          message: `Entry popup submission - Selected Interest: ${data.interest} | Email: ${data.email} | Popup Type: Entry Welcome Flow`,
          source: "entry_popup",
          region: "US",
          inquiry_type: "entry-popup-contact-form",
          preferred_contact: "email",
          topPriority: "entry-popup-lead",
          contactFormType: "entry-popup-contact-form",
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
    { id: "scale-agency", name: "Scale My Agency", icon: "📈" },
    { id: "white-label", name: "White-Label Services", icon: "🏷️" },
    { id: "seo-services", name: "SEO & Marketing", icon: "🎯" },
    { id: "development", name: "Web Development", icon: "💻" },
    { id: "dedicated-team", name: "Dedicated Team", icon: "👥" },
    { id: "ai-solutions", name: "AI Integration", icon: "🤖" },
  ];

  const handleSubmit = () => {
    if (!email || !interest) return;
    leadCaptureMutation.mutate({ email, interest });
  };

  const resetPopup = () => {
    setStep(1);
    setEmail("");
    setInterest("");
  };

  const handleClose = () => {
    resetPopup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Step 1: Welcome & Value Proposition */}
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

        {/* Step 2: Interest Selection & Email Capture */}
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

              <Button
                onClick={handleSubmit}
                disabled={!email || !interest || leadCaptureMutation.isPending}
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

        {/* Step 3: Success & Next Steps */}
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
                  i <= step ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
