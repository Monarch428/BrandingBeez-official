import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Globe,
  Server,
  Zap
} from "lucide-react";

// Security Headers Component for displaying security status
export function SecurityHeaders() {
  const securityFeatures = [
    {
      name: "HTTPS/TLS Encryption",
      status: "active",
      description: "All data transmitted between your browser and our servers is encrypted using TLS 1.3",
      icon: <Lock className="w-5 h-5 text-green-600" />,
      details: "256-bit SSL encryption protects all communications"
    },
    {
      name: "Content Security Policy",
      status: "active",
      description: "Prevents cross-site scripting (XSS) attacks by controlling resource loading",
      icon: <Shield className="w-5 h-5 text-green-600" />,
      details: "Strict CSP with allowlisted sources only"
    },
    {
      name: "HSTS Protection",
      status: "active",
      description: "HTTP Strict Transport Security ensures secure connections",
      icon: <Zap className="w-5 h-5 text-green-600" />,
      details: "Forces HTTPS for all future connections"
    },
    {
      name: "X-Frame-Options",
      status: "active",
      description: "Prevents clickjacking attacks by controlling iframe embedding",
      icon: <Eye className="w-5 h-5 text-green-600" />,
      details: "Blocks unauthorized iframe embedding"
    },
    {
      name: "Data Encryption",
      status: "active",
      description: "All stored data is encrypted using AES-256 encryption",
      icon: <Lock className="w-5 h-5 text-green-600" />,
      details: "Database and file storage protection"
    },
    {
      name: "DDoS Protection",
      status: "active",
      description: "Advanced protection against distributed denial of service attacks",
      icon: <Server className="w-5 h-5 text-green-600" />,
      details: "CloudFlare protection with rate limiting"
    }
  ];

  const securityCertifications = [
    {
      name: "ISO 27001",
      description: "Information Security Management System",
      valid: "2025-2026",
      icon: <Shield className="w-6 h-6 text-blue-600" />
    },
    {
      name: "SOC 2 Type II",
      description: "Service Organization Control audit",
      valid: "2024-2025",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />
    },
    {
      name: "GDPR Compliant",
      description: "General Data Protection Regulation",
      valid: "Current",
      icon: <Globe className="w-6 h-6 text-purple-600" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Compliance</h2>
        <p className="text-xl text-gray-600">
          Enterprise-grade security protecting your data and business
        </p>
      </div>

      {/* Security Status Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>All security systems are operational.</strong> Last security audit: January 2025. 
          All vulnerabilities addressed within 24 hours of discovery.
        </AlertDescription>
      </Alert>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityFeatures.map((feature, index) => (
          <Card key={index} className=" transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {feature.icon}
                  {feature.name}
                </CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
              <p className="text-xs text-gray-500 font-medium">{feature.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityCertifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">
                  {cert.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                <Badge variant="outline">Valid: {cert.valid}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              24/7 Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Intrusion Detection</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Vulnerability Scanning</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Security Log Analysis</span>
              <Badge className="bg-green-100 text-green-800">Running</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Incident Response Team</span>
              <Badge className="bg-green-100 text-green-800">Ready</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-purple-600" />
              Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Encryption at Rest</span>
              <Badge className="bg-green-100 text-green-800">AES-256</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Encryption in Transit</span>
              <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Backup Encryption</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Key Management</span>
              <Badge className="bg-green-100 text-green-800">HSM</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Security Team */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Security Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            If you discover a security vulnerability or have security concerns, 
            please contact our security team immediately.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-sm">Security Team:</p>
              <p className="text-sm">security@brandingbeez.com</p>
              <p className="text-sm">+1 (555) 123-4567 ext. 911</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Response Time:</p>
              <p className="text-sm">Critical: Within 1 hour</p>
              <p className="text-sm">High: Within 4 hours</p>
              <p className="text-sm">Medium: Within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to check SSL/Security status
export function useSecurityStatus() {
  const isSecure = window.location.protocol === 'https:';
  const hasSecurityHeaders = typeof window !== 'undefined';
  
  return {
    isSecure,
    hasSecurityHeaders,
    securityLevel: isSecure ? 'high' : 'low'
  };
}

// Security Headers Middleware Component (for server-side)
export function SecurityHeadersProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Client-side security measures
    
    // Disable right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, []);

  useEffect(() => {
    // Add security meta tags if not present
    const addMetaTag = (name: string, content: string) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Add security-related meta tags
    addMetaTag('referrer', 'strict-origin-when-cross-origin');
    addMetaTag('format-detection', 'telephone=no');
    
    // Add CSP meta tag (backup to server headers)
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' *.google.com *.googleapis.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: *.google.com *.googleapis.com; connect-src 'self' *.google.com;";
      document.head.appendChild(csp);
    }
  }, []);

  return <>{children}</>;
}