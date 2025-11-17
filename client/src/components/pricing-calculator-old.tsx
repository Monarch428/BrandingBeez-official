import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingDown,
  Zap,
  Shield,
  HeadphonesIcon
} from "lucide-react";

const pricingCalculatorSchema = insertContactSchema.extend({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  hoursPerWeek: z.number().min(5, "Hours per week must be at least 5"),
  skillLevel: z.enum(["junior", "mid", "senior"]),
  projectType: z.enum(["development", "design", "marketing", "support"]),
  duration: z.number().min(1, "Duration must be at least 1 month")
});

type PricingCalculatorData = z.infer<typeof pricingCalculatorSchema>;

interface PricingResult {
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      salary: number;
      benefits: number;
      overhead: number;
      recruitment: number;
    };
  };
  dedicated: {
    monthly: number;
    annual: number;
    savings: {
      monthly: number;
      annual: number;
      percentage: number;
    };
  };
}

export function PricingCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    teamSize: 2,
    hoursPerWeek: 40,
    skillLevel: "mid" as "junior" | "mid" | "senior",
    projectType: "development" as "development" | "design" | "marketing" | "support",
    duration: 6
  });
  const [result, setResult] = useState<PricingResult | null>(null);
  const { toast } = useToast();

  const skillRates = {
    junior: { traditional: 4500, dedicated: 2800 },
    mid: { traditional: 7500, dedicated: 4500 },
    senior: { traditional: 12000, dedicated: 7200 }
  };

  const projectMultipliers = {
    development: 1.0,
    design: 0.9,
    marketing: 0.85,
    support: 0.75
  };

  const calculatePricing = () => {
    const baseRate = skillRates[formData.skillLevel];
    const multiplier = projectMultipliers[formData.projectType];
    const hoursMultiplier = formData.hoursPerWeek / 40;
    
    const traditionalMonthly = Math.round(baseRate.traditional * multiplier * hoursMultiplier * formData.teamSize);
    const dedicatedMonthly = Math.round(baseRate.dedicated * multiplier * hoursMultiplier * formData.teamSize);
    
    const savings = traditionalMonthly - dedicatedMonthly;
    const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);

    return {
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          salary: Math.round(traditionalMonthly * 0.6),
          benefits: Math.round(traditionalMonthly * 0.25),
          overhead: Math.round(traditionalMonthly * 0.1),
          recruitment: Math.round(traditionalMonthly * 0.05)
        }
      },
      dedicated: {
        monthly: dedicatedMonthly,
        annual: dedicatedMonthly * 12,
        savings: {
          monthly: savings,
          annual: savings * 12,
          percentage: savingsPercentage
        }
      }
    };
  };

  const mutation = useMutation({
    mutationFn: async (data: PricingCalculatorData) => {
      // Submit contact form
      await apiRequest("/api/contacts", "POST", data);
      
      // Get AI-powered pricing analysis
      const response = await apiRequest("/api/pricing-calculator", "POST", {
        teamSize: formData.teamSize,
        experience: formData.skillLevel,
        location: "US", // Default to US for now
        benefits: true,
        projectComplexity: formData.projectType
      });
      
      return response.pricing;
    },
    onSuccess: (result) => {
      setResult(result);
      toast({
        title: "Pricing Calculated!",
        description: "Your custom pricing comparison is ready. Check your email for the detailed report.",
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = pricingCalculatorSchema.parse(formData);
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
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Free Dedicated Resources Pricing Calculator
          </div>
          <h2 className="text-3xl font-bold text-brand-purple mb-4">
            Calculate Your Savings with Dedicated Resources
          </h2>
          <p className="text-xl text-gray-600">
            Compare the cost of hiring full-time employees vs our dedicated resources
          </p>
        </div>

        {!result ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-purple text-center">
                Project Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type *</Label>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-coral"
                      required
                    >
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="support">Support</option>
                    </select>
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
                      placeholder="john@company.com"
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
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Team Size: {formData.teamSize} people</Label>
                  <Slider
                    value={[formData.teamSize]}
                    onValueChange={(value) => setFormData({...formData, teamSize: value[0]})}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Hours per Week: {formData.hoursPerWeek} hours</Label>
                  <Slider
                    value={[formData.hoursPerWeek]}
                    onValueChange={(value) => setFormData({...formData, hoursPerWeek: value[0]})}
                    max={60}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Skill Level Required</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {Object.keys(skillRates).map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={level}
                          name="skillLevel"
                          value={level}
                          checked={formData.skillLevel === level}
                          onChange={(e) => setFormData({...formData, skillLevel: e.target.value as any})}
                        />
                        <label htmlFor={level} className="text-sm capitalize">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Project Duration: {formData.duration} months</Label>
                  <Slider
                    value={[formData.duration]}
                    onValueChange={(value) => setFormData({...formData, duration: value[0]})}
                    max={24}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-brand-coral rand-coral/90 text-white py-3"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Calculating..." : "Calculate Pricing & Savings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-300">
                <CardHeader className="text-center">
                  <Badge className="bg-red-100 text-red-800 mx-auto mb-2">
                    Traditional Hiring
                  </Badge>
                  <CardTitle className="text-xl text-gray-700">
                    Full-Time Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-700 mb-2">
                      ${result.traditional.monthly.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Salary</span>
                      <span className="font-medium">${result.traditional.breakdown.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Benefits & Insurance</span>
                      <span className="font-medium">${result.traditional.breakdown.benefits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Office & Overhead</span>
                      <span className="font-medium">${result.traditional.breakdown.overhead.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Recruitment Costs</span>
                      <span className="font-medium">${result.traditional.breakdown.recruitment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-gray-50 rounded text-center">
                    <div className="text-lg font-bold text-gray-700">
                      ${result.traditional.annual.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual Cost</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand-coral">
                <CardHeader className="text-center">
                  <Badge className="bg-green-100 text-green-800 mx-auto mb-2">
                    BrandingBeez Dedicated
                  </Badge>
                  <CardTitle className="text-xl text-brand-purple">
                    Dedicated Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-brand-coral mb-2">
                      ${result.dedicated.monthly.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">No recruitment costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">No office overhead</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">No benefits management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Instant scalability</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-green-50 rounded text-center">
                    <div className="text-lg font-bold text-green-700">
                      ${result.dedicated.annual.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual Cost</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-brand-coral to-brand-purple text-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Potential Savings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      ${result.dedicated.savings.monthly.toLocaleString()}
                    </div>
                    <div className="text-white/90">Monthly Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      ${result.dedicated.savings.annual.toLocaleString()}
                    </div>
                    <div className="text-white/90">Annual Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {result.dedicated.savings.percentage}%
                    </div>
                    <div className="text-white/90">Cost Reduction</div>
                  </div>
                </div>

                <Button className="bg-white text-brand-coral ray-100">
                  Get Started with Dedicated Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}