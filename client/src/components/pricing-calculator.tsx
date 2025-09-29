import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet"; // Add this import
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingDown, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const pricingCalculatorSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  teamSize: z.number().min(1).max(50),
  hoursPerWeek: z.number().min(10).max(60),
  skillLevel: z.enum(["junior", "mid", "senior"]),
  projectType: z.enum(["development", "design", "marketing", "support"]),
  duration: z.number().min(1).max(36)
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
  const [formData, setFormData] = useState<PricingCalculatorData>({
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

  const mutation = useMutation({
    mutationFn: async (data: PricingCalculatorData) => {
      // Submit contact information
      await apiRequest("/api/contacts", "POST", {
        name: data.name,
        email: data.email,
        company: data.companyName,
        phone: data.phone,
        message: `Pricing calculation request - ${data.teamSize} ${data.skillLevel} ${data.projectType} resources`,
        source: "pricing_calculator"
      });

      // Calculate pricing locally as fallback
      const skillRates = {
        junior: { traditional: 4500, dedicated: 1200 },
        mid: { traditional: 7500, dedicated: 2000 },
        senior: { traditional: 12000, dedicated: 3500 }
      };

      const projectMultipliers = {
        development: 1.0,
        design: 0.9,
        marketing: 0.85,
        support: 0.75
      };

      const baseRate = skillRates[data.skillLevel] || skillRates.mid;
      const multiplier = projectMultipliers[data.projectType] || 1.0;
      const hoursMultiplier = data.hoursPerWeek / 40;

      const traditionalMonthly = Math.round(baseRate.traditional * multiplier * hoursMultiplier * data.teamSize);
      const dedicatedMonthly = Math.round(baseRate.dedicated * multiplier * hoursMultiplier * data.teamSize);

      const savings = traditionalMonthly - dedicatedMonthly;
      const savingsPercentage = Math.round((savings / traditionalMonthly) * 100);

      return {
        traditional: {
          monthly: traditionalMonthly,
          annual: traditionalMonthly * 12,
          breakdown: {
            salary: Math.round(traditionalMonthly * 0.7),
            benefits: Math.round(traditionalMonthly * 0.15),
            overhead: Math.round(traditionalMonthly * 0.10),
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
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Pricing Calculated!",
        description: "Your custom pricing estimate is ready. Check your email for details.",
      });
    },
    onError: (error: any) => {
      // Extract user-friendly message from server response
      let errorMessage = "Failed to calculate pricing. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Please check your information",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = pricingCalculatorSchema.parse(formData);
      mutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const updateFormData = (field: keyof PricingCalculatorData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Add Helmet component with canonical tag */}
      <Helmet>
        <title>Pricing Calculator | White-Label Services Cost Estimator | BrandingBeez</title>
        <meta name="description" content="Calculate costs for white-label digital marketing services. Get instant pricing for SEO, Google Ads, web development, dedicated resources, and AI solutions. Free estimates with transparent pricing." />
        <link rel="canonical" href="https://brandingbeez.co.uk/pricing-calculator" />
        <meta name="robots" content="INDEX, FOLLOW" />
      </Helmet>

      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how much you can save with our dedicated resources compared to traditional hiring.
              Get instant estimates for your team requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Calculator Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Pricing Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.companyName}
                        onChange={(e) => updateFormData("companyName", e.target.value)}
                        placeholder="Enter your company name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Project Requirements */}
                  <div className="space-y-4">
                    <div>
                      <Label>Team Size: {formData.teamSize} {formData.teamSize === 1 ? 'person' : 'people'}</Label>
                      <Slider
                        value={[formData.teamSize]}
                        onValueChange={(value) => updateFormData("teamSize", value[0])}
                        max={20}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Hours per Week: {formData.hoursPerWeek} hours</Label>
                      <Slider
                        value={[formData.hoursPerWeek]}
                        onValueChange={(value) => updateFormData("hoursPerWeek", value[0])}
                        max={60}
                        min={10}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="skillLevel">Skill Level</Label>
                        <Select value={formData.skillLevel} onValueChange={(value) => updateFormData("skillLevel", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select value={formData.projectType} onValueChange={(value) => updateFormData("projectType", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Project Duration: {formData.duration} months</Label>
                      <Slider
                        value={[formData.duration]}
                        onValueChange={(value) => updateFormData("duration", value[0])}
                        max={36}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 urple-700 ink-600"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Calculating..." : "Calculate Pricing"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <TrendingDown className="h-5 w-5" />
                        Your Savings Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          ${result.dedicated.savings.monthly.toLocaleString()}/month
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {result.dedicated.savings.percentage}% savings
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                              ${result.traditional.monthly.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Traditional Hiring</div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              ${result.dedicated.monthly.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Dedicated Resources</div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Salary</span>
                          <span className="font-medium">${result.traditional.breakdown.salary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Benefits & Insurance</span>
                          <span className="font-medium">${result.traditional.breakdown.benefits.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Office & Overhead</span>
                          <span className="font-medium">${result.traditional.breakdown.overhead.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recruitment Costs</span>
                          <span className="font-medium">${result.traditional.breakdown.recruitment.toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                          <span>Annual Savings</span>
                          <span className="text-green-600">${result.dedicated.savings.annual.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Calculate?</h3>
                    <p className="text-gray-500">
                      Fill out the form to see your potential savings with dedicated resources.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}