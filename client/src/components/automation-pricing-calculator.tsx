import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, DollarSign, TrendingDown, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AutomationPricingResult {
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      manualLabor: number;
      tools: number;
      errors: number;
      oversight: number;
    };
  };
  automated: {
    monthly: number;
    annual: number;
    savings: {
      monthly: number;
      annual: number;
      percentage: number;
    };
  };
}

export function AutomationPricingCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    industry: "general" as "general" | "healthcare" | "finance" | "manufacturing" | "retail" | "services",
    businessSize: "small" as "small" | "medium" | "large",
    processComplexity: "standard" as "basic" | "standard" | "complex",
    manualHours: 40,
    teamSize: 3,
    currentErrorRate: 5
  });

  const [result, setResult] = useState<AutomationPricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Store calculator submission in admin panel
  const storePricingMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Results Saved!",
        description: "Your pricing analysis has been saved. Our team will contact you soon with a detailed proposal.",
      });
    },
    onError: () => {
      toast({
        title: "Error Saving",
        description: "Your calculation is complete, but we couldn't save your details. Please contact us directly.",
        variant: "destructive",
      });
    },
  });

  const calculatePricing = () => {
    setIsCalculating(true);

    // Calculate traditional manual process costs
    const industryMultipliers = {
      general: 1.0,
      healthcare: 1.3,
      finance: 1.4,
      manufacturing: 1.2,
      retail: 0.9,
      services: 1.1
    };

    const sizeMultipliers = {
      small: 1.0,
      medium: 1.2,
      large: 1.5
    };

    const complexityMultipliers = {
      basic: 0.8,
      standard: 1.0,
      complex: 1.4
    };

    const hourlyRate = 35; // Average hourly rate for manual work
    const errorCostPerHour = 25; // Cost of errors per hour
    const oversightCostPerHour = 15; // Management oversight cost

    const industryMultiplier = industryMultipliers[formData.industry];
    const sizeMultiplier = sizeMultipliers[formData.businessSize];
    const complexityMultiplier = complexityMultipliers[formData.processComplexity];

    const manualLaborCost = formData.manualHours * hourlyRate * 4.33 * formData.teamSize; // Monthly
    const errorCost = (formData.manualHours * (formData.currentErrorRate / 100) * errorCostPerHour * 4.33);
    const oversightCost = (formData.manualHours * 0.2 * oversightCostPerHour * 4.33);

    const traditionalMonthly = Math.round(
      (manualLaborCost + errorCost + oversightCost) * 
      industryMultiplier * sizeMultiplier * complexityMultiplier
    );

    // Calculate automated process costs (70-85% savings)
    const automatedMonthly = Math.round(traditionalMonthly * 0.2);

    const savings = traditionalMonthly - automatedMonthly;
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);

    const pricingResult: AutomationPricingResult = {
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          manualLabor: Math.round(manualLaborCost * industryMultiplier * sizeMultiplier * complexityMultiplier),
          tools: Math.round(500 * sizeMultiplier),
          errors: Math.round(errorCost * industryMultiplier * complexityMultiplier),
          oversight: Math.round(oversightCost * sizeMultiplier)
        }
      },
      automated: {
        monthly: automatedMonthly,
        annual: automatedMonthly * 12,
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

      // Build comprehensive message with automation analysis details
      let comprehensiveMessage = `Business Automation Pricing Analysis Completed`;

      comprehensiveMessage += `\n\n🔧 AUTOMATION ANALYSIS:`;
      comprehensiveMessage += `\n• Industry: ${formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)}`;
      comprehensiveMessage += `\n• Business Size: ${formData.businessSize.charAt(0).toUpperCase() + formData.businessSize.slice(1)} (${formData.businessSize === 'small' ? '1-50' : formData.businessSize === 'medium' ? '51-250' : '250+'} employees)`;
      comprehensiveMessage += `\n• Process Complexity: ${formData.processComplexity.charAt(0).toUpperCase() + formData.processComplexity.slice(1)}`;
      comprehensiveMessage += `\n• Manual Hours/Week: ${formData.manualHours}`;
      comprehensiveMessage += `\n• Team Size: ${formData.teamSize}`;
      comprehensiveMessage += `\n• Current Error Rate: ${formData.currentErrorRate}%`;

      comprehensiveMessage += `\n\n💰 COST ANALYSIS:`;
      comprehensiveMessage += `\n• Traditional Monthly Cost: $${traditionalMonthly.toLocaleString()}`;
      comprehensiveMessage += `\n• Automated Monthly Cost: $${automatedMonthly.toLocaleString()}`;
      comprehensiveMessage += `\n• Monthly Savings: $${savings.toLocaleString()}`;
      comprehensiveMessage += `\n• Annual Savings: $${(savings * 12).toLocaleString()}`;
      comprehensiveMessage += `\n• Savings Percentage: ${savingsPercentage}%`;

      comprehensiveMessage += `\n\n📊 COST BREAKDOWN:`;
      comprehensiveMessage += `\n• Manual Labor: $${pricingResult.traditional.breakdown.manualLabor.toLocaleString()}`;
      comprehensiveMessage += `\n• Tools & Software: $${pricingResult.traditional.breakdown.tools.toLocaleString()}`;
      comprehensiveMessage += `\n• Error Costs: $${pricingResult.traditional.breakdown.errors.toLocaleString()}`;
      comprehensiveMessage += `\n• Management Oversight: $${pricingResult.traditional.breakdown.oversight.toLocaleString()}`;

      // Store the pricing calculation and user details in admin panel
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        company: formData.companyName,
        inquiry_type: "automation-pricing",
        service: "automation-pricing",
        message: comprehensiveMessage,
        preferred_contact: "email",
        country: "US",
        topPriority: "automation-pricing",
        automationDetails: {
          industry: formData.industry,
          businessSize: formData.businessSize,
          processComplexity: formData.processComplexity,
          manualHours: formData.manualHours,
          teamSize: formData.teamSize,
          currentErrorRate: formData.currentErrorRate,
          calculatedSavings: {
            monthly: savings,
            annual: savings * 12,
            percentage: savingsPercentage,
            traditionalCost: traditionalMonthly,
            automatedCost: automatedMonthly
          },
          costBreakdown: pricingResult.traditional.breakdown
        }
      };

      storePricingMutation.mutate(submissionData);

      toast({
        title: "Automation Pricing Calculated!",
        description: `You could save $${savings.toLocaleString()} per month with business automation.`,
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty required fields
    const missingFields = [];
    if (!formData.name.trim()) missingFields.push("Name");
    if (!formData.email.trim()) missingFields.push("Email");
    if (!formData.companyName.trim()) missingFields.push("Company Name");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in the following required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });

      // Focus on the first missing field
      if (!formData.companyName.trim()) {
        document.getElementById('companyName')?.focus();
      } else if (!formData.name.trim()) {
        document.getElementById('name')?.focus();
      } else if (!formData.email.trim()) {
        document.getElementById('email')?.focus();
      }

      return;
    }

    calculatePricing();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Business Automation Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className={!formData.companyName.trim() ? "border-red-200 focus:border-red-500" : ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={!formData.name.trim() ? "border-red-200 focus:border-red-500" : ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={!formData.email.trim() ? "border-red-200 focus:border-red-500" : ""}
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
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value: "general" | "healthcare" | "finance" | "manufacturing" | "retail" | "services") => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Business</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessSize">Business Size</Label>
                <Select value={formData.businessSize} onValueChange={(value: "small" | "medium" | "large") => setFormData(prev => ({ ...prev, businessSize: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                    <SelectItem value="large">Large (250+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processComplexity">Process Complexity</Label>
                <Select value={formData.processComplexity} onValueChange={(value: "basic" | "standard" | "complex") => setFormData(prev => ({ ...prev, processComplexity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Processes</SelectItem>
                    <SelectItem value="standard">Standard Workflows</SelectItem>
                    <SelectItem value="complex">Complex Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size: {formData.teamSize}</Label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={formData.teamSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">1 - 20 team members</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manualHours">Manual Hours/Week: {formData.manualHours}</Label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={formData.manualHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, manualHours: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">5 - 80 hours per week</div>
              </div>

              <div>
                <Label htmlFor="currentErrorRate">Current Error Rate: {formData.currentErrorRate}%</Label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={formData.currentErrorRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentErrorRate: parseInt(e.target.value) }))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">0% - 25% error rate</div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-purple rand-purple/90"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate Automation Savings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isCalculating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Analyzing Your Automation Potential...</div>
              <Progress value={70} className="w-full" />
              <div className="text-sm text-gray-600">Calculating time savings and cost reductions</div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Traditional Manual Processes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">${result.traditional.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.traditional.annual.toLocaleString()}/year</div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Manual Labor</span>
                    <span>${result.traditional.breakdown.manualLabor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tools & Software</span>
                    <span>${result.traditional.breakdown.tools.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Costs</span>
                    <span>${result.traditional.breakdown.errors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Management Oversight</span>
                    <span>${result.traditional.breakdown.oversight.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">High error rates and inefficiency</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">Automated Business Processes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600">${result.automated.monthly.toLocaleString()}/month</div>
                <div className="text-lg text-gray-600">${result.automated.annual.toLocaleString()}/year</div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Your Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">${result.automated.savings.monthly.toLocaleString()}/month</div>
                  <div className="text-green-600">${result.automated.savings.annual.toLocaleString()}/year</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {result.automated.savings.percentage}% Cost Reduction
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">99.5% accuracy rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 automated processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Scalable workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Real-time monitoring</span>
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
              <h3 className="text-xl font-bold">Ready to Save ${result.automated.savings.monthly.toLocaleString()}/month?</h3>
              <p className="text-white/90">Transform your business with intelligent automation that reduces costs and eliminates errors.</p>
              <Button size="lg" className="bg-white text-brand-purple ray-100 rand-purple">
                Get Automation Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}