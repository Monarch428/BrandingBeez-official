import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  Eye, 
  Download, 
  Trash2, 
  Edit,
  MapPin,
  Clock,
  Mail,
  AlertTriangle
} from "lucide-react";

export function GDPRCompliance() {
  const [userLocation, setUserLocation] = useState<string>('');
  const [showEUNotice, setShowEUNotice] = useState(false);

  useEffect(() => {
    // Detect user location for GDPR compliance
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        setUserLocation(data.country_code);
        // Show EU notice for EU countries
        const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
        if (euCountries.includes(data.country_code)) {
          setShowEUNotice(true);
        }
      })
      .catch(() => {
        // Default to showing EU notice if location detection fails
        setShowEUNotice(true);
      });
  }, []);

  const gdprRights = [
    {
      title: "Right to Information",
      description: "Know what personal data we collect and how we use it",
      icon: <Eye className="w-5 h-5 text-blue-600" />,
      action: "View Privacy Policy",
      available: true
    },
    {
      title: "Right of Access",
      description: "Request a copy of your personal data we hold",
      icon: <Download className="w-5 h-5 text-green-600" />,
      action: "Request Data Export",
      available: true
    },
    {
      title: "Right to Rectification",
      description: "Correct inaccurate or incomplete personal data",
      icon: <Edit className="w-5 h-5 text-orange-600" />,
      action: "Update Information",
      available: true
    },
    {
      title: "Right to Erasure",
      description: "Request deletion of your personal data",
      icon: <Trash2 className="w-5 h-5 text-red-600" />,
      action: "Delete My Data",
      available: true
    }
  ];

  const dataProcessingBasis = [
    {
      basis: "Consent",
      description: "Marketing communications and analytics (with your explicit consent)",
      examples: ["Email newsletters", "Marketing cookies", "Personalized ads"]
    },
    {
      basis: "Contract",
      description: "Service delivery and customer support",
      examples: ["Project management", "Billing", "Technical support"]
    },
    {
      basis: "Legitimate Interest",
      description: "Business operations and service improvement",
      examples: ["Website analytics", "Security monitoring", "Service optimization"]
    }
  ];

  return (
    <div className="space-y-6">
      {showEUNotice && (
        <Alert className="border-blue-200 bg-blue-50">
          <MapPin className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>EU Visitor Detected:</strong> This website complies with GDPR regulations. 
            Your privacy rights are protected under European Union law. 
            <Button variant="link" className="p-0 h-auto text-blue-600 ml-2">
              Learn more about your rights
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">GDPR Compliance</h2>
        <p className="text-xl text-gray-600">
          Your privacy rights are protected under EU law
        </p>
      </div>

      {/* GDPR Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Your Privacy Rights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gdprRights.map((right, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {right.icon}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{right.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{right.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={!right.available}
                    >
                      {right.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Basis for Processing */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Basis for Data Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataProcessingBasis.map((item, index) => (
            <div key={index} className="border-l-4 border-brand-coral pl-4">
              <h4 className="font-semibold text-lg mb-2">{item.basis}</h4>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.examples.map((example, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Processing Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Response Timeframes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Data Access Requests</span>
              <Badge className="bg-green-100 text-green-800">Within 30 days</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Data Correction Requests</span>
              <Badge className="bg-blue-100 text-blue-800">Within 30 days</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Data Deletion Requests</span>
              <Badge className="bg-orange-100 text-orange-800">Within 30 days</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Data Breach Notification</span>
              <Badge className="bg-red-100 text-red-800">Within 72 hours</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-brand-coral text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="w-5 h-5" />
            Data Protection Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">Data Protection Officer</p>
              <p className="text-brand-coral-light">privacy@brandingbeez.com</p>
            </div>
            <div>
              <p className="font-semibold">EU Representative</p>
              <p className="text-brand-coral-light">eu-privacy@brandingbeez.com</p>
            </div>
            <div>
              <p className="font-semibold">Supervisory Authority</p>
              <p className="text-brand-coral-light">Contact your local data protection authority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Transfers */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>International Data Transfers:</strong> Your data may be processed in countries 
          outside the EU. We ensure adequate protection through Standard Contractual Clauses (SCCs) 
          and other appropriate safeguards as approved by the European Commission.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// GDPR Consent Manager Hook
export function useGDPRConsent() {
  const [hasConsent, setHasConsent] = useState(false);
  const [consentDate, setConsentDate] = useState<Date | null>(null);
  const [isEUUser, setIsEUUser] = useState(false);

  useEffect(() => {
    // Check existing consent
    const consent = localStorage.getItem('gdpr-consent');
    const consentTimestamp = localStorage.getItem('gdpr-consent-date');
    
    if (consent === 'granted' && consentTimestamp) {
      setHasConsent(true);
      setConsentDate(new Date(consentTimestamp));
    }

    // Detect EU user
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
        setIsEUUser(euCountries.includes(data.country_code));
      })
      .catch(() => {
        // Default to EU for privacy protection
        setIsEUUser(true);
      });
  }, []);

  const grantConsent = () => {
    const now = new Date();
    localStorage.setItem('gdpr-consent', 'granted');
    localStorage.setItem('gdpr-consent-date', now.toISOString());
    setHasConsent(true);
    setConsentDate(now);
  };

  const withdrawConsent = () => {
    localStorage.removeItem('gdpr-consent');
    localStorage.removeItem('gdpr-consent-date');
    setHasConsent(false);
    setConsentDate(null);
  };

  const needsConsent = isEUUser && !hasConsent;

  return {
    hasConsent,
    consentDate,
    isEUUser,
    needsConsent,
    grantConsent,
    withdrawConsent
  };
}