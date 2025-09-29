import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRegion } from "@/hooks/use-region";
import { Calendar, ArrowRight, Phone, Mail, Download, Zap, Star, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface OptimizedCTAButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  type?: "calendly" | "contact" | "download" | "phone" | "email";
  urgency?: "low" | "medium" | "high";
  showTrustSignals?: boolean;
  showUrgency?: boolean;
  showOffer?: boolean;
  customText?: string;
  customSubtext?: string;
  className?: string;
  onClick?: () => void;
}

export function OptimizedCTAButton({
  variant = "primary",
  size = "lg",
  type = "calendly",
  urgency = "medium",
  showTrustSignals = true,
  showUrgency = true,
  showOffer = true,
  customText,
  customSubtext,
  className,
  onClick
}: OptimizedCTAButtonProps) {
  const { regionConfig } = useRegion();

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: regionConfig.calendlyUrl
      });
    } else {
      // Fallback to direct link
      window.open(regionConfig.calendlyUrl, '_blank');
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === "calendly") {
      window.open('https://zcmp.in/JzHy', '_blank');
    } else if (type === "phone") {
      window.open(`tel:${regionConfig.phone}`, '_self');
    } else if (type === "email") {
      window.open(`mailto:${regionConfig.email}`, '_self');
    }
  };

  const getButtonContent = () => {
    if (customText) {
      return {
        text: customText,
        subtext: customSubtext || "",
        icon: <ArrowRight className="w-4 h-4 ml-2" />
      };
    }

    switch (type) {
      case "calendly":
        return {
          text: "Subscribe Free",
          subtext: urgency === "high" ? "Join our newsletter today" : 
                  urgency === "medium" ? "Get exclusive insights" : 
                  "Stay updated with latest trends",
          icon: <ArrowRight className="w-4 h-4 ml-2" />
        };
      case "contact":
        return {
          text: "Get Quote",
          subtext: "Response within 4 hours",
          icon: <Mail className="w-4 h-4 ml-2" />
        };
      case "download":
        return {
          text: "Download Free Guide",
          subtext: "Instant access, no spam",
          icon: <Download className="w-4 h-4 ml-2" />
        };
      case "phone":
        return {
          text: "Call Now",
          subtext: "Speak with an expert",
          icon: <Phone className="w-4 h-4 ml-2" />
        };
      case "email":
        return {
          text: "Email Us",
          subtext: "Quick response guaranteed",
          icon: <Mail className="w-4 h-4 ml-2" />
        };
      default:
        return {
          text: "Get Started",
          subtext: "",
          icon: <ArrowRight className="w-4 h-4 ml-2" />
        };
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "font-semibold shadow-lg";
    
    switch (variant) {
      case "primary":
        return `${baseStyles} bg-gradient-to-r from-brand-coral to-pink-500 text-white border-0`;
      case "secondary":
        return `${baseStyles} bg-gradient-to-r from-brand-purple to-purple-600 text-white border-0`;
      case "outline":
        return `${baseStyles} border-2 border-brand-coral text-brand-coral bg-transparent`;
      case "ghost":
        return `${baseStyles} text-brand-purple bg-transparent border-0`;
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm h-9";
      case "md":
        return "px-6 py-3 text-base h-10";
      case "lg":
        return "px-8 py-4 text-lg h-12";
      case "xl":
        return "px-10 py-5 text-xl h-14";
      default:
        return "px-8 py-4 text-lg h-12";
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="text-center">
      {showOffer && (
        <div className="mb-3">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Star className="w-3 h-3 mr-1" />
            Limited Time: 15% Off First Project
          </Badge>
        </div>
      )}
      
      <Button
        onClick={handleClick}
        className={cn(
          getButtonStyles(),
          getSizeStyles(),
          "rounded-full relative overflow-hidden",
          className
        )}
      >
        {/* Static background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-center">
          <span className="truncate">{buttonContent.text}</span>
          {buttonContent.icon}
        </div>
      </Button>

      {showUrgency && buttonContent.subtext && (
        <div className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          {buttonContent.subtext}
        </div>
      )}

      {showTrustSignals && (
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>Instant Setup</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset CTA components for common use cases
export function PrimaryCTAButton(props: Partial<OptimizedCTAButtonProps>) {
  return (
    <OptimizedCTAButton
      variant="primary"
      size="xl"
      type="calendly"
      urgency="high"
      showTrustSignals={true}
      showUrgency={true}
      showOffer={true}
      {...props}
    />
  );
}

export function SecondaryCTAButton(props: Partial<OptimizedCTAButtonProps>) {
  return (
    <OptimizedCTAButton
      variant="secondary"
      size="lg"
      type="contact"
      urgency="medium"
      showTrustSignals={true}
      showUrgency={true}
      showOffer={false}
      {...props}
    />
  );
}

export function MiniCTAButton(props: Partial<OptimizedCTAButtonProps>) {
  return (
    <OptimizedCTAButton
      variant="outline"
      size="sm"
      type="calendly"
      urgency="low"
      showTrustSignals={false}
      showUrgency={false}
      showOffer={false}
      {...props}
    />
  );
}