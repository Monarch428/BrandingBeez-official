import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Target, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleAdsPricingResult {
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      specialist: number;
      tools: number;
      managementFee: number;
      training: number;
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
    projectedROI: number;
  };
}

export function GoogleAdsPricingCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    monthlyAdSpend: 5000,
    industry: "general" as "general" | "healthcare" | "finance" | "ecommerce" | "saas" | "legal",
    campaignGoal: "leads" as "leads" | "sales" | "awareness" | "traffic",
    currentROAS: 300,
    accountComplexity: "standard" as "basic" | "standard" | "complex"
  });
  
  const [result, setResult] = useState<GoogleAdsPricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculatePricing = () => {
    setIsCalculating(true);
    
    // Calculate traditional in-house costs
    const industryMultipliers = {
      general: 1.0,
      healthcare: 1.4,
      finance: 1.6,
      ecommerce: 1.2,
      saas: 1.3,
      legal: 1.5
    };
    
    const complexityMultipliers = {
      basic: 0.8,
      standard: 1.0,
      complex: 1.4
    };
    
    const baseSpecialistSalary = 5800; // Google Ads specialist monthly salary
    const toolsCost = 400; // Google Ads tools and analytics
    const managementFee = Math.max(800, formData.monthlyAdSpend * 0.15); // 15% management fee
    const trainingCost = 300; // Ongoing training and certification
    
    const industryMultiplier = industryMultipliers[formData.industry];
    const complexityMultiplier = complexityMultipliers[formData.accountComplexity];
    
    const traditionalMonthly = Math.round(
      baseSpecialistSalary * industryMultiplier * complexityMultiplier + 
      toolsCost + 
      managementFee + 
      trainingCost
    );
    
    // Calculate white-label costs (45-60% savings)
    const whiteLabelMonthly = Math.round(traditionalMonthly * 0.45);
    
    const savings = traditionalMonthly - whiteLabelMonthly;
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);
    
    // Calculate projected ROI improvement
    const currentROI = (formData.currentROAS / 100) * formData.monthlyAdSpend;
    const projectedROI = currentROI * 1.35; // 35% improvement with expert management
    
    const pricingResult: GoogleAdsPricingResult = {
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          specialist: Math.round(baseSpecialistSalary * industryMultiplier * complexityMultiplier),
          tools: toolsCost,
          managementFee: Math.round(managementFee),
          training: trainingCost
        }
      },
      whiteLabel: {
        monthly: whiteLabelMonthly,
        annual: whiteLabelMonthly * 12,
        savings: {
          monthly: savings,
          annual: savings * 12,
          percentage: savingsPercentage
        },
        projectedROI: Math.round(projectedROI)
      }
    };
    
    setTimeout(() => {
      setResult(pricingResult);
      setIsCalculating(false);
      toast({
        title: "Google Ads Pricing Calculated!",
        description: `You could save $${savings.toLocaleString()} per month with white-label Google Ads management.`,
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
            <TrendingUp className="w-5 h-5" />
            Google Ads White-Label Pricing Calculator
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
                <Label htmlFor="monthlyAdSpend">Monthly Ad Spend: ${formData.monthlyAdSpend.toLocaleString()}</Label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={formData.monthlyAdSpend}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyAdSpend: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">$1,000 - $50,000/month</div>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value: "general" | "healthcare" | "finance" | "ecommerce" | "saas" | "legal") => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Business</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignGoal">Primary Campaign Goal</Label>
                <Select value={formData.campaignGoal} onValueChange={(value: "leads" | "sales" | "awareness" | "traffic") => setFormData(prev => ({ ...prev, campaignGoal: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Direct Sales</SelectItem>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="accountComplexity">Account Complexity</Label>
                <Select value={formData.accountComplexity} onValueChange={(value: "basic" | "standard" | "complex") => setFormData(prev => ({ ...prev, accountComplexity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (1-5 campaigns)</SelectItem>
                    <SelectItem value="standard">Standard (6-20 campaigns)</SelectItem>
                    <SelectItem value="complex">Complex (20+ campaigns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="currentROAS">Current ROAS: {formData.currentROAS}%</Label>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={formData.currentROAS}
                onChange={(e) => setFormData(prev => ({ ...prev, currentROAS: parseInt(e.target.value) }))}
                className="w-full mt-2"
              />
              <div className="text-sm text-gray-500 mt-1">100% - 800% return on ad spend</div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple rand-purple/90"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate Google Ads Savings"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isCalculating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Analyzing Your Google Ads Requirements...</div>
              <Progress value={80} className="w-full" />
              <div className="text-sm text-gray-600">Calculating management costs and ROI potential</div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Traditional In-House Google Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">${result.traditional.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.traditional.annual.toLocaleString()}/year</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Google Ads Specialist</span>
                    <span>${result.traditional.breakdown.specialist.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tools & Analytics</span>
                    <span>${result.traditional.breakdown.tools.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Management Fee</span>
                    <span>${result.traditional.breakdown.managementFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training & Certification</span>
                    <span>${result.traditional.breakdown.training.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Single point of failure risk</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">White-Label Google Ads Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600">${result.whiteLabel.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.whiteLabel.annual.toLocaleString()}/year</div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Your Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">${result.whiteLabel.savings.monthly.toLocaleString()}/month</div>
                  <div className="text-green-600">${result.whiteLabel.savings.annual.toLocaleString()}/year</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {result.whiteLabel.savings.percentage}% Cost Reduction
                  </Badge>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-700">Projected ROI</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">${result.whiteLabel.projectedROI.toLocaleString()}/month</div>
                  <div className="text-blue-600">35% improvement expected</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Expert Google Ads team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">All tools and certifications included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 monitoring and optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">White-label reporting</span>
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
              <p className="text-white/90">Get expert Google Ads management under your brand with guaranteed performance improvement.</p>
              <Button size="lg" className="bg-white text-brand-purple ray-100 rand-purple">
                Get Custom Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}