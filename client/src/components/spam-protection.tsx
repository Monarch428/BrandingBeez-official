import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Bot,
  Lock,
  Eye,
  Zap
} from "lucide-react";

// Honeypot field for bot detection
export function HoneypotField() {
  return (
    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
      <Label htmlFor="website">Website (leave blank)</Label>
      <Input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

// Rate limiting hook
export function useRateLimit(maxAttempts: number = 3, timeWindow: number = 300000) { // 5 minutes
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const lastAttemptTime = useRef<number>(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Check if still blocked
    if (blockedUntil && now < blockedUntil) {
      return false;
    }

    // Reset attempts if time window has passed
    if (now - lastAttemptTime.current > timeWindow) {
      setAttempts(0);
      setBlockedUntil(null);
    }

    return attempts < maxAttempts;
  };

  const recordAttempt = () => {
    const now = Date.now();
    lastAttemptTime.current = now;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= maxAttempts) {
      setBlockedUntil(now + timeWindow);
    }
  };

  const getRemainingTime = (): number => {
    if (!blockedUntil) return 0;
    return Math.max(0, blockedUntil - Date.now());
  };

  return {
    canAttempt: checkRateLimit(),
    recordAttempt,
    remainingTime: getRemainingTime(),
    attemptsLeft: Math.max(0, maxAttempts - attempts)
  };
}

// Simple bot detection based on behavior
export function useBotDetection() {
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [formStartTime, setFormStartTime] = useState<number | null>(null);
  const mouseMovements = useRef(0);
  const keystrokes = useRef(0);

  useEffect(() => {
    const handleMouseMove = () => {
      mouseMovements.current += 1;
    };

    const handleKeyDown = () => {
      keystrokes.current += 1;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startFormSession = () => {
    setFormStartTime(Date.now());
    mouseMovements.current = 0;
    keystrokes.current = 0;
  };

  const validateFormSubmission = (): boolean => {
    if (!formStartTime) return false;

    const timeTaken = Date.now() - formStartTime;
    
    // Suspicious if:
    // - Submitted too quickly (< 3 seconds)
    // - No mouse movements
    // - No keystrokes
    // - Submitted too slowly (> 30 minutes)
    const suspicious = 
      timeTaken < 3000 || 
      mouseMovements.current === 0 || 
      keystrokes.current === 0 ||
      timeTaken > 1800000; // 30 minutes

    setSuspiciousActivity(suspicious);
    return !suspicious;
  };

  return {
    startFormSession,
    validateFormSubmission,
    suspiciousActivity,
    humanLike: mouseMovements.current > 5 && keystrokes.current > 3
  };
}

// Spam protection wrapper component
interface SpamProtectionProps {
  children: React.ReactNode;
  onValidSubmission: (data: any) => void;
  formData: any;
  maxAttempts?: number;
  requireHuman?: boolean;
}

export function SpamProtection({ 
  children, 
  onValidSubmission, 
  formData, 
  maxAttempts = 3,
  requireHuman = true 
}: SpamProtectionProps) {
  const rateLimit = useRateLimit(maxAttempts);
  const botDetection = useBotDetection();
  const [showProtection, setShowProtection] = useState(false);

  useEffect(() => {
    botDetection.startFormSession();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    if (!rateLimit.canAttempt) {
      setShowProtection(true);
      return;
    }

    // Check for honeypot
    if (formData.website && formData.website.trim() !== '') {
      console.log('Bot detected via honeypot');
      rateLimit.recordAttempt();
      return;
    }

    // Check bot detection
    if (requireHuman && !botDetection.validateFormSubmission()) {
      console.log('Suspicious activity detected');
      rateLimit.recordAttempt();
      setShowProtection(true);
      return;
    }

    // All checks passed
    onValidSubmission(formData);
  };

  if (showProtection) {
    return <SpamProtectionScreen rateLimit={rateLimit} onRetry={() => setShowProtection(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
      <HoneypotField />
      
      {/* Protection status indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>Protected by spam detection</span>
        </div>
        {botDetection.humanLike && (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Human verified
          </Badge>
        )}
      </div>
    </form>
  );
}

// Spam protection screen
function SpamProtectionScreen({ 
  rateLimit, 
  onRetry 
}: { 
  rateLimit: any; 
  onRetry: () => void; 
}) {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(rateLimit.remainingTime / 1000));

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Security Check Required
        </h3>
        <p className="text-gray-600">
          Our security system has detected unusual activity. Please wait before trying again.
        </p>
      </div>

      <Alert className="border-orange-200 bg-orange-50 mb-6">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          <strong>Rate limit exceeded.</strong> Too many attempts in a short time period.
          This helps protect against automated attacks.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">Time Remaining</span>
          </div>
          <div className="text-2xl font-bold text-brand-coral">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Shield className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xs text-gray-600">Bot Protection</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Lock className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs text-gray-600">Data Security</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xs text-gray-600">Rate Limiting</p>
          </div>
        </div>

        {timeLeft <= 0 && (
          <Button
            onClick={onRetry}
            className="w-full bg-brand-coral rand-coral-dark text-white"
          >
            Try Again
          </Button>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Why This Happened</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Multiple rapid form submissions</li>
          <li>• Suspicious browsing patterns detected</li>
          <li>• Automated bot-like behavior</li>
          <li>• Missing human interaction signals</li>
        </ul>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        If you continue to experience issues, please contact our support team at{" "}
        <a href="mailto:support@brandingbeez.com" className="text-brand-coral ">
          support@brandingbeez.com
        </a>
      </p>
    </div>
  );
}

// Enhanced form validation
export function validateFormSecurity(formData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for common spam patterns
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /\$\$\$|make money fast|get rich/i,
    /click here|limited time|act now/i,
    /\b[A-Z]{10,}\b/, // All caps words
    /(.)\1{4,}/, // Repeated characters
  ];

  const textFields = [formData.message, formData.name, formData.company].filter(Boolean);
  
  for (const field of textFields) {
    for (const pattern of spamPatterns) {
      if (pattern.test(field)) {
        errors.push('Content contains suspicious patterns');
        break;
      }
    }
  }

  // Check for valid email format
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Invalid email format');
    }

    // Check for disposable email domains
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      errors.push('Disposable email addresses are not allowed');
    }
  }

  // Check message length and quality
  if (formData.message) {
    if (formData.message.length < 10) {
      errors.push('Message too short');
    }
    if (formData.message.length > 2000) {
      errors.push('Message too long');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}