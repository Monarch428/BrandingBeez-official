import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Zap,
  Upload,
  Link as LinkIcon
} from "lucide-react";

const googleAdsAuditSchema = insertContactSchema.extend({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  currentAdSpend: z.string().min(1, "Please enter your monthly ad spend"),
  adsAccountAccess: z.enum(["connect", "upload", "provide_access"]),
  goals: z.string().min(10, "Please describe your advertising goals")
});

type GoogleAdsAuditData = z.infer<typeof googleAdsAuditSchema>;

interface AuditResult {
  currentPerformance: {
    ctr: number;
    cpc: number;
    roas: number;
    wastedSpend: number;
  };
  opportunities: {
    potentialSavings: number;
    roasImprovement: number;
    newLeads: number;
  };
  recommendations: string[];
}

export function GoogleAdsAudit() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    currentAdSpend: "",
    adsAccountAccess: "connect" as "connect" | "upload" | "provide_access",
    goals: ""
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: GoogleAdsAuditData) => {
      // Submit contact form
      await apiRequest("/api/contacts", "POST", data);
      
      // Get AI-powered Google Ads audit analysis
      const adSpend = parseInt(data.currentAdSpend.replace(/[^0-9]/g, '')) || 5000;
      const response = await apiRequest("/api/google-ads-audit", "POST", {
        monthlySpend: adSpend,
        industry: data.industry,
        currentCTR: parseFloat(data.currentCTR) || 2.5,
        currentCPC: parseFloat(data.currentCPC) || 3.5,
        goals: data.goals || []
      });
      
      return response.audit;
    },
    onSuccess: (result) => {
      setAuditResult(result);
      toast({
        title: "Google Ads Audit Complete!",
        description: "We've analyzed your account performance. Check your email for the detailed report.",
      });
    },
    onError: (error) => {
      toast({
        title: "Audit Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = googleAdsAuditSchema.parse(formData);
      mutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            Free Google Ads Performance Audit
          </div>
          <h2 className="text-3xl font-bold text-brand-purple mb-4">
            Discover How Much You're Wasting on Google Ads
          </h2>
          <p className="text-xl text-gray-600">
            Upload your Google Analytics report or connect your ads account for instant insights
          </p>
        </div>

        {!auditResult ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-purple text-center">
                Google Ads Audit Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentAdSpend">Monthly Ad Spend *</Label>
                    <Input
                      id="currentAdSpend"
                      placeholder="$5,000"
                      value={formData.currentAdSpend}
                      onChange={(e) => setFormData({...formData, currentAdSpend: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label>How would you like to share your Google Ads data?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="connect"
                        name="adsAccountAccess"
                        value="connect"
                        checked={formData.adsAccountAccess === "connect"}
                        onChange={(e) => setFormData({...formData, adsAccountAccess: e.target.value as any})}
                      />
                      <label htmlFor="connect" className="text-sm">
                        Connect Google Ads Account
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="upload"
                        name="adsAccountAccess"
                        value="upload"
                        checked={formData.adsAccountAccess === "upload"}
                        onChange={(e) => setFormData({...formData, adsAccountAccess: e.target.value as any})}
                      />
                      <label htmlFor="upload" className="text-sm">
                        Upload Analytics Report
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="provide_access"
                        name="adsAccountAccess"
                        value="provide_access"
                        checked={formData.adsAccountAccess === "provide_access"}
                        onChange={(e) => setFormData({...formData, adsAccountAccess: e.target.value as any})}
                      />
                      <label htmlFor="provide_access" className="text-sm">
                        Provide Access Later
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="goals">Advertising Goals *</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are you trying to achieve with Google Ads? (More leads, sales, brand awareness, etc.)"
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-brand-coral rand-coral/90 text-white py-3"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Analyzing Account..." : "Start Free Google Ads Audit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-brand-coral">
              <CardHeader className="text-center">
                <Badge className="bg-red-100 text-red-800 mx-auto mb-4">
                  Account Analysis Complete
                </Badge>
                <CardTitle className="text-2xl text-brand-purple">
                  Your Google Ads Performance Audit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-brand-purple mb-4">Current Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Click-Through Rate</span>
                        <span className="font-bold">{auditResult.currentPerformance.ctr.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Cost Per Click</span>
                        <span className="font-bold">${auditResult.currentPerformance.cpc.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Return on Ad Spend</span>
                        <span className="font-bold">{auditResult.currentPerformance.roas.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="text-gray-600">Wasted Spend (Monthly)</span>
                        <span className="font-bold text-red-600">${auditResult.currentPerformance.wastedSpend.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-purple mb-4">Optimization Opportunities</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="text-gray-600">Potential Monthly Savings</span>
                        <span className="font-bold text-green-600">${auditResult.opportunities.potentialSavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="text-gray-600">ROAS Improvement</span>
                        <span className="font-bold text-green-600">+{auditResult.opportunities.roasImprovement.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="text-gray-600">Additional Monthly Leads</span>
                        <span className="font-bold text-green-600">+{auditResult.opportunities.newLeads}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="text-gray-600">Annual Savings Potential</span>
                        <span className="font-bold text-blue-600">${(auditResult.opportunities.potentialSavings * 12).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-purple text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Priority Optimization Recommendations
                  </h3>
                  <div className="space-y-2">
                    {auditResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-brand-coral mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-4">
                    Ready to optimize your Google Ads campaigns? Let's discuss your strategy.
                  </p>
                  <Button 
                    className="bg-brand-coral rand-coral/90 text-white"
                    onClick={() => window.open('https://calendly.com/vignesh-velusamy/30min', '_blank')}
                  >
                    Book Strategy Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}