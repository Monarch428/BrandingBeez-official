import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Users, DollarSign } from "lucide-react";

interface ResourceSelection {
  type: string;
  skillLevel: 'junior' | 'mid' | 'senior';
  candidates: number;
}

interface PricingResult {
  resourceBreakdown: Array<{
    type: string;
    skillLevel: string;
    candidates: number;
    basePrice: number;
    discountedPrice: number;
    total: number;
  }>;
  subtotal: number;
  volumeDiscount: number;
  finalTotal: number;
  monthlyTotal: number;
}

export function DedicatedResourcePricing() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companyEmail: "",
    phone: ""
  });

  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [resourceConfigs, setResourceConfigs] = useState<{ [key: string]: ResourceSelection }>({});
  const [result, setResult] = useState<PricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Available dedicated resources (updated from pricing document)
  const availableResources = [
    'Graphic Designer',
    'Video Editor',
    'Content Writer',
    'SEO Specialist',
    'Google Ads Expert',
    'Social Media Manager',
    'WordPress Developer',
    'Full Stack Developer',
    'Marketing Strategist',
    'Project Manager (Digital)',
    'AI/Automation Specialist (N8N etc.)'
  ];

  // Base pricing structure per month (USD) - Updated from pricing document
  const basePricing = {
    'Graphic Designer': { junior: 800, mid: 1200, senior: 2000 },
    'Video Editor': { junior: 900, mid: 1400, senior: 2200 },
    'Content Writer': { junior: 850, mid: 1300, senior: 2100 },
    'SEO Specialist': { junior: 1000, mid: 1800, senior: 2800 },
    'Google Ads Expert': { junior: 1200, mid: 2000, senior: 3000 },
    'Social Media Manager': { junior: 900, mid: 1400, senior: 2200 },
    'WordPress Developer': { junior: 1000, mid: 1800, senior: 2800 },
    'Full Stack Developer': { junior: 1200, mid: 2000, senior: 3500 },
    'Marketing Strategist': { junior: 1300, mid: 2300, senior: 3500 },
    'Project Manager (Digital)': { junior: 1200, mid: 2000, senior: 3200 },
    'AI/Automation Specialist (N8N etc.)': { junior: 1400, mid: 2500, senior: 3800 }
  };

  const handleResourceToggle = (resource: string, checked: boolean) => {
    if (checked) {
      setSelectedResources(prev => [...prev, resource]);
      setResourceConfigs(prev => ({
        ...prev,
        [resource]: {
          type: resource,
          skillLevel: 'mid',
          candidates: 1
        }
      }));
    } else {
      setSelectedResources(prev => prev.filter(r => r !== resource));
      const newConfigs = { ...resourceConfigs };
      delete newConfigs[resource];
      setResourceConfigs(newConfigs);
    }
  };

  const updateResourceConfig = (resource: string, field: keyof ResourceSelection, value: any) => {
    setResourceConfigs(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [field]: value
      }
    }));
  };

  const calculatePricing = () => {
    if (!formData.fullName || !formData.companyEmail || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedResources.length === 0) {
      toast({
        title: "No Resources Selected",
        description: "Please select at least one type of dedicated resource.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Calculate total team size for team discount
    const totalTeamSize = selectedResources.reduce((sum, resource) => {
      return sum + resourceConfigs[resource].candidates;
    }, 0);

    // Calculate team discount based on updated pricing structure
    let teamDiscountRate = 0;
    if (totalTeamSize >= 8) teamDiscountRate = 0.20;
    else if (totalTeamSize >= 5) teamDiscountRate = 0.15;
    else if (totalTeamSize >= 3) teamDiscountRate = 0.10;
    else if (totalTeamSize >= 2) teamDiscountRate = 0.05;

    // Calculate pricing for each resource
    const resourceBreakdown = selectedResources.map(resource => {
      const config = resourceConfigs[resource];
      const basePrice = basePricing[resource][config.skillLevel];
      
      // Apply team discount to base price
      const discountedPrice = basePrice * (1 - teamDiscountRate);
      const total = discountedPrice * config.candidates;

      return {
        type: resource,
        skillLevel: config.skillLevel,
        candidates: config.candidates,
        basePrice,
        discountedPrice,
        total
      };
    });

    const subtotalWithoutDiscount = resourceBreakdown.reduce((sum, item) => sum + (item.basePrice * item.candidates), 0);
    const subtotalWithDiscount = resourceBreakdown.reduce((sum, item) => sum + item.total, 0);
    const volumeDiscount = subtotalWithoutDiscount - subtotalWithDiscount;

    const pricingResult: PricingResult = {
      resourceBreakdown,
      subtotal: subtotalWithoutDiscount,
      volumeDiscount,
      finalTotal: subtotalWithDiscount,
      monthlyTotal: subtotalWithDiscount
    };

    setTimeout(() => {
      setResult(pricingResult);
      setIsCalculating(false);
      toast({
        title: "Pricing Calculated!",
        description: `Your monthly cost: $${subtotalWithDiscount.toLocaleString()}`,
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePricing();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 lg:px-0">
      <Card>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-brand-purple">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
            Dedicated Resource Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyEmail: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter your company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Resource Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Type of Dedicated Resource Required *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableResources.map((resource) => (
                  <div key={resource} className="flex items-center space-x-2">
                    <Checkbox
                      id={resource}
                      checked={selectedResources.includes(resource)}
                      onCheckedChange={(checked) => handleResourceToggle(resource, !!checked)}
                    />
                    <Label htmlFor={resource} className="text-sm font-medium text-gray-700 cursor-pointer">
                      {resource}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Configuration */}
            {selectedResources.length > 0 && (
              <div className="space-y-6">
                <Label className="text-lg font-semibold text-gray-900">
                  Configure Your Selected Resources
                </Label>
                {selectedResources.map((resource) => (
                  <Card key={resource} className="bg-gray-50 border-brand-coral/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-brand-purple">{resource}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`skill-${resource}`}>Skill Level</Label>
                          <Select 
                            value={resourceConfigs[resource]?.skillLevel || 'mid'} 
                            onValueChange={(value: 'junior' | 'mid' | 'senior') => 
                              updateResourceConfig(resource, 'skillLevel', value)
                            }
                          >
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
                          <Label htmlFor={`candidates-${resource}`}>Number of Candidates</Label>
                          <Select 
                            value={resourceConfigs[resource]?.candidates?.toString() || '1'} 
                            onValueChange={(value) => 
                              updateResourceConfig(resource, 'candidates', parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'Candidate' : 'Candidates'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-600 font-medium">
                        Team discounts: 2+ people (5%), 3-4 people (10%), 5-7 people (15%), 8+ people (20%)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isCalculating}
              className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white text-sm sm:text-base md:text-lg py-2.5 sm:py-3"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Pricing'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pricing Results */}
      {result && (
        <Card className="bg-gradient-to-br from-brand-purple/5 to-brand-coral/5 border-brand-coral/20">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-brand-purple">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              Your Dedicated Resource Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
            {/* Resource Breakdown */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Resource Breakdown</h3>
              <div className="space-y-2 sm:space-y-3">
                {result.resourceBreakdown.map((item, index) => (
                  <div key={index} className="bg-white p-3 sm:p-4 rounded-lg border">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{item.type}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {item.skillLevel.charAt(0).toUpperCase() + item.skillLevel.slice(1)} Level • {item.candidates} {item.candidates === 1 ? 'Candidate' : 'Candidates'}
                        </div>
                        <div className="text-xs sm:text-sm text-blue-600 mt-1">
                          Team discount applied based on total team size
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        {result.volumeDiscount > 0 && (
                          <div className="text-xs sm:text-sm text-gray-500 line-through">
                            ${(item.basePrice * item.candidates).toLocaleString()}/month
                          </div>
                        )}
                        <div className="font-bold text-brand-coral text-sm sm:text-base">
                          ${item.total.toLocaleString()}/month
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-brand-coral/20">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-base sm:text-lg">
                  <span>Subtotal:</span>
                  <span>${result.subtotal.toLocaleString()}</span>
                </div>
                {result.volumeDiscount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Team size discount:</span>
                    <span>-${result.volumeDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between text-xl sm:text-2xl font-bold text-brand-purple">
                    <span>Monthly Total:</span>
                    <span>${result.monthlyTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-brand-coral hover:bg-brand-coral/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto text-sm sm:text-base"
                onClick={() => window.open('https://calendly.com/vignesh-velusamy/30min', '_blank')}
              >
                Schedule Consultation
              </Button>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2 sm:px-0">
                Book a free call to discuss your requirements and finalize the team setup
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}