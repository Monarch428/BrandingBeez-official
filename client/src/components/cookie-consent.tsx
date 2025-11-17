import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Target, 
  X,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    
    // Check if consent is older than 365 days (1 year)
    const isExpired = consentDate && 
      (Date.now() - new Date(consentDate).getTime()) > (365 * 24 * 60 * 60 * 1000);
    
    if (!consent || isExpired) {
      // Clear expired consent
      if (isExpired) {
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-date');
      }
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        applyConsentSettings(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-date');
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const applyConsentSettings = (prefs: CookiePreferences) => {
    // Apply Google Analytics based on consent
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }

    // Apply marketing cookies based on consent
    if (prefs.marketing && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted'
      });
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'denied'
      });
    }

    // Store preferences
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    applyConsentSettings(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(essentialOnly);
    applyConsentSettings(essentialOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    applyConsentSettings(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const cookieCategories = [
    {
      key: 'essential' as keyof CookiePreferences,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. These cannot be disabled.',
      icon: <Shield className="w-5 h-5 text-green-600" />,
      color: 'green',
      examples: ['Session management', 'Security tokens', 'Load balancing', 'CSRF protection'],
      always: true
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      examples: ['Google Analytics', 'Page view tracking', 'User behavior', 'Performance metrics'],
      always: false
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and track campaigns.',
      icon: <Target className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      examples: ['Retargeting ads', 'Conversion tracking', 'Social media', 'A/B testing'],
      always: false
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      icon: <Settings className="w-5 h-5 text-orange-600" />,
      color: 'orange',
      examples: ['User preferences', 'Chat widgets', 'Video players', 'Maps integration'],
      always: false
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-coral/10 rounded-full">
                    <Cookie className="w-6 h-6 text-brand-coral" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">We Use Cookies</h3>
                    <p className="text-sm text-gray-600">
                      We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                      You can customize your preferences or accept all cookies.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:min-w-fit">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-brand-coral rand-coral-dark text-white"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  By clicking "Accept All", you agree to our use of cookies. 
                  Learn more in our{" "}
                  <a href="/privacy-policy" className="text-brand-coral-darker hover:text-brand-coral-dark font-medium underline decoration-brand-coral-darker hover:decoration-brand-coral-dark">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/cookie-policy" className="text-brand-coral-darker hover:text-brand-coral-dark font-medium underline decoration-brand-coral-darker hover:decoration-brand-coral-dark">
                    Cookie Policy
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">About Cookies</h4>
                  <p className="text-sm text-blue-800">
                    Cookies are small text files stored on your device that help websites function 
                    and provide a better user experience. You can control which types of cookies 
                    you allow.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {cookieCategories.map((category) => (
                <Card key={category.key} className={`border-${category.color}-200`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {category.icon}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{category.title}</h4>
                            {category.always && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Always Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {category.description}
                          </p>
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
                            <div className="flex flex-wrap gap-1">
                              {category.examples.map((example, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {category.always ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Switch
                            checked={preferences[category.key]}
                            onCheckedChange={(value) => updatePreference(category.key, value)}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Choices</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• You can change these preferences at any time</p>
                <p>• Essential cookies cannot be disabled</p>
                <p>• Some features may not work if you disable certain cookies</p>
                <p>• Your preferences will be remembered for 1 year</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="bg-brand-coral rand-coral-dark text-white"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Cookie preferences management hook
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      const prefs = JSON.parse(consent);
      setPreferences(prefs);
      setHasConsent(true);
    }
  }, []);

  const updateConsent = (newPreferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(newPreferences);
    setHasConsent(true);
  };

  const canUseAnalytics = hasConsent && preferences.analytics;
  const canUseMarketing = hasConsent && preferences.marketing;
  const canUseFunctional = hasConsent && preferences.functional;

  return {
    hasConsent,
    preferences,
    updateConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional
  };
}