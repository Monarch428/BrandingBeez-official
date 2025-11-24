import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink, AlertTriangle } from "lucide-react";

interface LinkValidationResult {
  url: string;
  status: 'valid' | 'invalid' | 'warning' | 'external';
  element: HTMLAnchorElement;
  message?: string;
}

export function LinkValidator() {
  const [validationResults, setValidationResults] = useState<LinkValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateLinks = async () => {
    setIsValidating(true);
    const links = document.querySelectorAll('a[href]') as NodeListOf<HTMLAnchorElement>;
    const results: LinkValidationResult[] = [];

    for (const link of links) {
      const href = link.href;
      const originalHref = link.getAttribute('href') || '';
      
      // Skip javascript: and # links
      if (href.startsWith('javascript:') || originalHref.startsWith('#')) {
        continue;
      }

      let result: LinkValidationResult = {
        url: href,
        status: 'valid',
        element: link
      };

      try {
        // Check if it's an external link
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          result.status = 'external';
          result.message = 'External link';
        }
        // Check mailto links
        else if (href.startsWith('mailto:')) {
          const emailRegex = /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (emailRegex.test(href)) {
            result.status = 'valid';
            result.message = 'Email link';
          } else {
            result.status = 'invalid';
            result.message = 'Invalid email format';
          }
        }
        // Check tel links
        else if (href.startsWith('tel:')) {
          const phoneRegex = /^tel:\+?[1-9]\d{1,14}$/;
          if (phoneRegex.test(href)) {
            result.status = 'valid';
            result.message = 'Phone link';
          } else {
            result.status = 'invalid';
            result.message = 'Invalid phone format';
          }
        }
        // Check internal links
        else if (href.startsWith(window.location.origin)) {
          const path = href.replace(window.location.origin, '');
          
          // Define valid internal routes
          const validRoutes = [
            '/',
            '/services',
            '/services/seo',
            '/services/web-development',
            '/services/web-development/wordpress',
            '/services/google-ads',
            '/services/ai-development',
            '/services/dedicated-resources',
            '/services/ai-agents',
            '/industries/digital-marketing-agencies',
            '/industries/it-companies',
            '/industries/real-estate',
            '/industries/accounting-firms',
            '/industries/law-firms',
            '/industries/healthcare',
            '/case-studies',
            '/case-studies/seo',
            '/case-studies/web-development',
            '/case-studies/google-ads',
            '/case-studies/automation',
            '/seo-audit',
            '/admin',
            '/about',
            '/contact'
          ];
          
          if (validRoutes.includes(path) || path.startsWith('/contact?')) {
            result.status = 'valid';
            result.message = 'Internal link';
          } else {
            result.status = 'invalid';
            result.message = 'Route not found';
          }
        }
        // Check for placeholder links
        else if (href === '#' || href === 'javascript:void(0)') {
          result.status = 'warning';
          result.message = 'Placeholder link';
        }
        else {
          result.status = 'invalid';
          result.message = 'Invalid link format';
        }
      } catch (error) {
        result.status = 'invalid';
        result.message = 'Link validation error';
      }

      results.push(result);
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const getStatusIcon = (status: LinkValidationResult['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'external':
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: LinkValidationResult['status']) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'invalid':
        return <Badge className="bg-red-100 text-red-800">Invalid</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'external':
        return <Badge className="bg-blue-100 text-blue-800">External</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  useEffect(() => {
    validateLinks();
  }, []);

  const validCount = validationResults.filter(r => r.status === 'valid').length;
  const invalidCount = validationResults.filter(r => r.status === 'invalid').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const externalCount = validationResults.filter(r => r.status === 'external').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Link Validation Results
          <Button 
            onClick={validateLinks} 
            disabled={isValidating}
            size="sm"
            variant="outline"
          >
            {isValidating ? 'Validating...' : 'Refresh'}
          </Button>
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{validCount} Valid</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>{invalidCount} Invalid</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>{warningCount} Warnings</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink className="w-4 h-4 text-blue-500" />
            <span>{externalCount} External</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(result.status)}
                <span className="font-mono text-sm truncate flex-1">{result.url}</span>
                {getStatusBadge(result.status)}
              </div>
              {result.message && (
                <span className="text-sm text-gray-600">{result.message}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}