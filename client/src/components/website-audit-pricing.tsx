import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, DollarSign, TrendingDown, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityPricingResult {
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      tools: number;
      specialist: number;
      monitoring: number;
      compliance: number;
    };
  };
  whiteLabel: {
    monthly: number;
    annual: number;
    savings: {
      monthly: number;
      annual: number;
      percentage: number;
    };
  };
}

export function WebsiteAuditPricing() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    websiteCount: 3,
    complianceLevel: "basic" as "basic" | "standard" | "enterprise",
    industryType: "general" as "general" | "healthcare" | "finance" | "ecommerce",
    currentSecurityBudget: 1500
  });
  
  const [result, setResult] = useState<SecurityPricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculatePricing = () => {
    setIsCalculating(true);
    
    // Calculate traditional in-house costs
    const complianceMultipliers = {
      basic: 0.8,
      standard: 1.0,
      enterprise: 1.8
    };
    
    const industryMultipliers = {
      general: 1.0,
      healthcare: 1.5,
      finance: 1.8,
      ecommerce: 1.2
    };
    
    const baseSpecialistSalary = 6500; // Security specialist monthly salary
    const toolsCost = 800; // Security tools and monitoring
    const monitoringCost = 400; // 24/7 monitoring
    const complianceCost = 600; // Compliance audits and documentation
    
    const complianceMultiplier = complianceMultipliers[formData.complianceLevel];
    const industryMultiplier = industryMultipliers[formData.industryType];
    const websiteMultiplier = Math.max(1, formData.websiteCount / 5);
    
    const traditionalMonthly = Math.round(
      (baseSpecialistSalary * complianceMultiplier * industryMultiplier + 
       toolsCost * websiteMultiplier + 
       monitoringCost * websiteMultiplier + 
       complianceCost * complianceMultiplier)
    );
    
    // Calculate white-label costs (50-65% savings)
    const whiteLabelMonthly = Math.round(traditionalMonthly * 0.4);
    
    const savings = traditionalMonthly - whiteLabelMonthly;
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);
    
    const pricingResult: SecurityPricingResult = {
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          tools: Math.round(toolsCost * websiteMultiplier),
          specialist: Math.round(baseSpecialistSalary * complianceMultiplier * industryMultiplier),
          monitoring: Math.round(monitoringCost * websiteMultiplier),
          compliance: Math.round(complianceCost * complianceMultiplier)
        }
      },
      whiteLabel: {
        monthly: whiteLabelMonthly,
        annual: whiteLabelMonthly * 12,
        savings: {
          monthly: savings,
          annual: savings * 12,
          percentage: savingsPercentage
        }
      }
    };
    
    setTimeout(() => {
      setResult(pricingResult);
      setIsCalculating(false);
      toast({
        title: "Security Pricing Calculated!",
        description: `You could save $${savings.toLocaleString()} per month with white-label security services.`,
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    calculatePricing();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Website Security & Audit Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="websiteCount">Number of Websites: {formData.websiteCount}</Label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={formData.websiteCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteCount: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">1 - 20 websites</div>
              </div>
              
              <div>
                <Label htmlFor="complianceLevel">Compliance Level</Label>
                <Select value={formData.complianceLevel} onValueChange={(value: "basic" | "standard" | "enterprise") => setFormData(prev => ({ ...prev, complianceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Security</SelectItem>
                    <SelectItem value="standard">Standard Compliance</SelectItem>
                    <SelectItem value="enterprise">Enterprise Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industryType">Industry Type</Label>
                <Select value={formData.industryType} onValueChange={(value: "general" | "healthcare" | "finance" | "ecommerce") => setFormData(prev => ({ ...prev, industryType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Business</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="currentBudget">Current Security Budget: ${formData.currentSecurityBudget}/month</Label>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={formData.currentSecurityBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentSecurityBudget: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">$500 - $15,000/month</div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple rand-purple/90"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate Security Savings"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isCalculating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Analyzing Your Security Requirements...</div>
              <Progress value={75} className="w-full" />
              <div className="text-sm text-gray-600">Calculating compliance costs and potential savings</div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Traditional In-House Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">${result.traditional.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.traditional.annual.toLocaleString()}/year</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Security Specialist</span>
                    <span>${result.traditional.breakdown.specialist.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Tools</span>
                    <span>${result.traditional.breakdown.tools.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Monitoring</span>
                    <span>${result.traditional.breakdown.monitoring.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Audits</span>
                    <span>${result.traditional.breakdown.compliance.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">High risk of security gaps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">White-Label Security Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600">${result.whiteLabel.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.whiteLabel.annual.toLocaleString()}/year</div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Your Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">${result.whiteLabel.savings.monthly.toLocaleString()}/month</div>
                  <div className="text-green-600">${result.whiteLabel.savings.annual.toLocaleString()}/year</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {result.whiteLabel.savings.percentage}% Cost Reduction
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Expert security team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">All security tools included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 monitoring & response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Compliance reporting</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {result && (
        <Card className="bg-brand-purple text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Ready to Save ${result.whiteLabel.savings.monthly.toLocaleString()}/month?</h3>
              <p className="text-white/90">Get comprehensive security services under your brand with guaranteed compliance.</p>
              <Button size="lg" className="bg-white text-brand-purple ray-100 rand-purple">
                Get Security Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}