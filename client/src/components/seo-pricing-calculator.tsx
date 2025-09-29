import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, DollarSign, TrendingDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingResult {
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      tools: number;
      salary: number;
      training: number;
      overhead: number;
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

export function SEOPricingCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    websiteCount: 5,
    currentSEOBudget: 2000,
    serviceLevel: "standard" as "basic" | "standard" | "premium",
    teamSize: 1
  });
  
  const [result, setResult] = useState<PricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculatePricing = () => {
    setIsCalculating(true);
    
    // Calculate traditional in-house costs
    const serviceLevelMultipliers = {
      basic: 0.8,
      standard: 1.0,
      premium: 1.5
    };
    
    const baseMonthlyTraditional = 4500; // Base SEO specialist salary
    const toolsCost = 300; // Monthly SEO tools
    const trainingCost = 500; // Monthly training and certification
    const overheadCost = 800; // Office, equipment, benefits
    
    const multiplier = serviceLevelMultipliers[formData.serviceLevel];
    const websiteMultiplier = Math.max(1, formData.websiteCount / 10);
    
    const traditionalMonthly = Math.round(
      (baseMonthlyTraditional * multiplier + toolsCost + trainingCost + overheadCost) * 
      websiteMultiplier * formData.teamSize
    );
    
    // Calculate white-label costs (40-60% savings)
    const whiteLabelMonthly = Math.round(traditionalMonthly * 0.45);
    
    const savings = traditionalMonthly - whiteLabelMonthly;
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);
    
    const pricingResult: PricingResult = {
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          tools: Math.round(toolsCost * websiteMultiplier),
          salary: Math.round(baseMonthlyTraditional * multiplier * formData.teamSize),
          training: Math.round(trainingCost * websiteMultiplier),
          overhead: Math.round(overheadCost * formData.teamSize)
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
        title: "SEO Pricing Calculated!",
        description: `You could save $${savings.toLocaleString()} per month with white-label SEO services.`,
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
            <Calculator className="w-5 h-5" />
            SEO White-Label Pricing Calculator
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
                  max="50"
                  value={formData.websiteCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteCount: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">1 - 50 websites</div>
              </div>
              
              <div>
                <Label htmlFor="serviceLevel">Service Level</Label>
                <Select value={formData.serviceLevel} onValueChange={(value: "basic" | "standard" | "premium") => setFormData(prev => ({ ...prev, serviceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic SEO</SelectItem>
                    <SelectItem value="standard">Standard SEO</SelectItem>
                    <SelectItem value="premium">Premium SEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentBudget">Current SEO Budget: ${formData.currentSEOBudget}/month</Label>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={formData.currentSEOBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentSEOBudget: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">$500 - $20,000/month</div>
              </div>
              
              <div>
                <Label htmlFor="teamSize">Team Size: {formData.teamSize}</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.teamSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">1 - 10 team members</div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple rand-purple/90"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate SEO Savings"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isCalculating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Analyzing Your SEO Requirements...</div>
              <Progress value={66} className="w-full" />
              <div className="text-sm text-gray-600">Calculating potential savings and ROI</div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Traditional In-House SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">${result.traditional.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.traditional.annual.toLocaleString()}/year</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>SEO Specialist Salary</span>
                    <span>${result.traditional.breakdown.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEO Tools & Software</span>
                    <span>${result.traditional.breakdown.tools.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training & Certification</span>
                    <span>${result.traditional.breakdown.training.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overhead & Benefits</span>
                    <span>${result.traditional.breakdown.overhead.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">White-Label SEO Services</CardTitle>
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
                    <span className="text-sm">Expert SEO team included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">All tools and software included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 support and reporting</span>
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
              <p className="text-white/90">Get a personalized quote and start offering SEO services under your brand today.</p>
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