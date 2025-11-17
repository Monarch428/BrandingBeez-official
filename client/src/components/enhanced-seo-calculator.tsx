import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  DollarSign, 
  TrendingUp, 
  Check, 
  Target,
  Clock,
  Users,
  ChartBar,
  Download,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSEOResult {
  financialImpact: {
    monthlySavings: number;
    annualProfitIncrease: number;
    roiPercentage: number;
    paybackPeriod: number;
  };
  businessGrowth: {
    additionalClients: number;
    revenueIncreasePotential: number;
    timeSavedWeekly: number;
    efficiencyImprovement: number;
  };
  competitiveAdvantage: {
    fasterDelivery: string;
    higherQuality: string;
    expandedServices: string[];
  };
  industryBenchmarks: {
    averageClientRetainer: number;
    averageAcquisitionCost: number;
    averageProfitMargin: number;
    yourPosition: "below" | "average" | "above";
  };
  scenarios: {
    bestCase: { savings: number; clients: number; revenue: number };
    realistic: { savings: number; clients: number; revenue: number };
    worstCase: { savings: number; clients: number; revenue: number };
  };
  traditional: {
    monthly: number;
    annual: number;
    breakdown: {
      teamSalaries: number;
      tools: number;
      training: number;
      overhead: number;
    };
  };
  whiteLabel: {
    monthly: number;
    annual: number;
  };
}

export function EnhancedSEOCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    // Current Situation
    monthlyRevenue: 25000,
    clientCount: 15,
    teamCost: 12000,
    weeklyHours: 40,
    avgRetainer: 1500,
    acquisitionCost: 800,
    // Business Goals
    targetGrowth: 50,
    desiredMargin: 30,
    expansionTimeline: 12,
    // Additional
    industry: "general" as "general" | "healthcare" | "finance" | "ecommerce" | "saas" | "legal",
    serviceType: "local" as "local" | "national" | "enterprise"
  });
  
  const [result, setResult] = useState<EnhancedSEOResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<"bestCase" | "realistic" | "worstCase">("realistic");
  const { toast } = useToast();

  // Real-time calculation whenever form data changes
  useEffect(() => {
    if (formData.monthlyRevenue && formData.clientCount && formData.teamCost) {
      calculatePricing();
    }
  }, [formData]);

  const industryBenchmarks = {
    general: { retainer: 1200, acquisition: 600, margin: 25 },
    healthcare: { retainer: 2500, acquisition: 1200, margin: 35 },
    finance: { retainer: 3000, acquisition: 1500, margin: 40 },
    ecommerce: { retainer: 1800, acquisition: 800, margin: 28 },
    saas: { retainer: 2200, acquisition: 1000, margin: 32 },
    legal: { retainer: 2800, acquisition: 1400, margin: 38 }
  };

  const calculatePricing = () => {
    const benchmark = industryBenchmarks[formData.industry];
    
    // Traditional costs calculation
    const traditionalMonthly = formData.teamCost + 
      (formData.clientCount * 150) + // Tools per client
      (formData.teamCost * 0.15) + // Training 15%
      (formData.teamCost * 0.25); // Overhead 25%

    // White-label costs (60% savings)
    const whiteLabelMonthly = Math.round(traditionalMonthly * 0.4);
    
    // Financial Impact
    const monthlySavings = traditionalMonthly - whiteLabelMonthly;
    const currentProfitMargin = ((formData.monthlyRevenue - formData.teamCost) / formData.monthlyRevenue) * 100;
    const newProfitMargin = ((formData.monthlyRevenue - whiteLabelMonthly) / formData.monthlyRevenue) * 100;
    const annualProfitIncrease = monthlySavings * 12;
    const roiPercentage = Math.round((annualProfitIncrease / (whiteLabelMonthly * 12)) * 100);
    const paybackPeriod = Math.round((whiteLabelMonthly * 3) / monthlySavings);

    // Business Growth
    const capacityIncrease = Math.round((formData.weeklyHours * 0.4) / (formData.weeklyHours / formData.clientCount));
    const additionalClients = Math.round(formData.clientCount * (formData.targetGrowth / 100));
    const revenueIncreasePotential = additionalClients * formData.avgRetainer;
    const timeSavedWeekly = Math.round(formData.weeklyHours * 0.35);
    const efficiencyImprovement = Math.round(((timeSavedWeekly / formData.weeklyHours) * 100));

    // Industry position
    const yourPosition = formData.avgRetainer > benchmark.retainer * 1.1 ? "above" : 
                        formData.avgRetainer < benchmark.retainer * 0.9 ? "below" : "average";

    // Scenarios
    const scenarios = {
      bestCase: {
        savings: Math.round(monthlySavings * 1.2),
        clients: Math.round(additionalClients * 1.3),
        revenue: Math.round(revenueIncreasePotential * 1.3)
      },
      realistic: {
        savings: monthlySavings,
        clients: additionalClients,
        revenue: revenueIncreasePotential
      },
      worstCase: {
        savings: Math.round(monthlySavings * 0.7),
        clients: Math.round(additionalClients * 0.6),
        revenue: Math.round(revenueIncreasePotential * 0.6)
      }
    };

    const calculationResult: EnhancedSEOResult = {
      financialImpact: {
        monthlySavings,
        annualProfitIncrease,
        roiPercentage,
        paybackPeriod
      },
      businessGrowth: {
        additionalClients,
        revenueIncreasePotential,
        timeSavedWeekly,
        efficiencyImprovement
      },
      competitiveAdvantage: {
        fasterDelivery: "50% faster project completion",
        higherQuality: "Expert-level SEO strategies",
        expandedServices: ["Technical SEO", "Local SEO", "E-commerce SEO", "Content Marketing"]
      },
      industryBenchmarks: {
        averageClientRetainer: benchmark.retainer,
        averageAcquisitionCost: benchmark.acquisition,
        averageProfitMargin: benchmark.margin,
        yourPosition
      },
      scenarios,
      traditional: {
        monthly: traditionalMonthly,
        annual: traditionalMonthly * 12,
        breakdown: {
          teamSalaries: formData.teamCost,
          tools: formData.clientCount * 150,
          training: Math.round(formData.teamCost * 0.15),
          overhead: Math.round(formData.teamCost * 0.25)
        }
      },
      whiteLabel: {
        monthly: whiteLabelMonthly,
        annual: whiteLabelMonthly * 12
      }
    };

    setResult(calculationResult);
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
    
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      toast({
        title: "SEO ROI Analysis Complete!",
        description: `Potential savings: $${result?.financialImpact.monthlySavings.toLocaleString()}/month`,
      });
    }, 2000);
  };

  const downloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Your comprehensive SEO ROI report is being prepared for download.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-brand-purple mb-4">Advanced SEO ROI Calculator</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive business analysis with real-time calculations, industry benchmarks, and scenario planning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Business Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-brand-purple">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-3">
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
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Situation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-brand-purple">Current Situation</h3>
                  
                  <div>
                    <Label htmlFor="monthlyRevenue">Monthly SEO Revenue: ${formData.monthlyRevenue.toLocaleString()}</Label>
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="1000"
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">$5,000 - $100,000/month</div>
                  </div>

                  <div>
                    <Label htmlFor="clientCount">Number of SEO Clients: {formData.clientCount}</Label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.clientCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientCount: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">1 - 100 clients</div>
                  </div>

                  <div>
                    <Label htmlFor="teamCost">In-house Team Cost: ${formData.teamCost.toLocaleString()}/month</Label>
                    <input
                      type="range"
                      min="3000"
                      max="50000"
                      step="500"
                      value={formData.teamCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, teamCost: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">$3,000 - $50,000/month</div>
                  </div>

                  <div>
                    <Label htmlFor="weeklyHours">Hours Spent on SEO Weekly: {formData.weeklyHours}</Label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={formData.weeklyHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">10 - 80 hours/week</div>
                  </div>

                  <div>
                    <Label htmlFor="avgRetainer">Average Client Retainer: ${formData.avgRetainer.toLocaleString()}</Label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={formData.avgRetainer}
                      onChange={(e) => setFormData(prev => ({ ...prev, avgRetainer: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">$500 - $5,000/month</div>
                  </div>

                  <div>
                    <Label htmlFor="acquisitionCost">Client Acquisition Cost: ${formData.acquisitionCost.toLocaleString()}</Label>
                    <input
                      type="range"
                      min="200"
                      max="3000"
                      step="50"
                      value={formData.acquisitionCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, acquisitionCost: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">$200 - $3,000 per client</div>
                  </div>
                </div>

                {/* Business Goals */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-brand-purple">Business Goals</h3>
                  
                  <div>
                    <Label htmlFor="targetGrowth">Target Client Growth: {formData.targetGrowth}%</Label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={formData.targetGrowth}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetGrowth: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">10% - 200% growth</div>
                  </div>

                  <div>
                    <Label htmlFor="desiredMargin">Desired Profit Margin: {formData.desiredMargin}%</Label>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={formData.desiredMargin}
                      onChange={(e) => setFormData(prev => ({ ...prev, desiredMargin: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">15% - 60% margin</div>
                  </div>

                  <div>
                    <Label htmlFor="expansionTimeline">Market Expansion Timeline: {formData.expansionTimeline} months</Label>
                    <input
                      type="range"
                      min="3"
                      max="36"
                      value={formData.expansionTimeline}
                      onChange={(e) => setFormData(prev => ({ ...prev, expansionTimeline: parseInt(e.target.value) }))}
                      className="w-full mt-2"
                    />
                    <div className="text-sm text-gray-500">3 - 36 months</div>
                  </div>
                </div>

                {/* Industry & Service Type */}
                <div className="grid grid-cols-1 gap-4">
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

                  <div>
                    <Label htmlFor="serviceType">Service Focus</Label>
                    <Select value={formData.serviceType} onValueChange={(value: "local" | "national" | "enterprise") => setFormData(prev => ({ ...prev, serviceType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local SEO</SelectItem>
                        <SelectItem value="national">National SEO</SelectItem>
                        <SelectItem value="enterprise">Enterprise SEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-brand-purple rand-purple/90"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Generating Report..." : "Generate ROI Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="financial" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="financial">💰 Financial</TabsTrigger>
                <TabsTrigger value="growth">📈 Growth</TabsTrigger>
                <TabsTrigger value="competitive">🎯 Advantage</TabsTrigger>
                <TabsTrigger value="scenarios">📊 Scenarios</TabsTrigger>
              </TabsList>

              {/* Financial Impact */}
              <TabsContent value="financial">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <DollarSign className="w-5 h-5" />
                        Financial Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${result.financialImpact.monthlySavings.toLocaleString()}
                          </div>
                          <div className="text-sm text-green-700">Monthly Savings</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${result.financialImpact.annualProfitIncrease.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700">Annual Profit Increase</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {result.financialImpact.roiPercentage}%
                          </div>
                          <div className="text-sm text-purple-700">ROI Percentage</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {result.financialImpact.paybackPeriod}
                          </div>
                          <div className="text-sm text-orange-700">Payback (months)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="font-medium">Traditional In-house</span>
                          <span className="text-xl font-bold text-red-600">
                            ${result.traditional.monthly.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">White-label SEO</span>
                          <span className="text-xl font-bold text-green-600">
                            ${result.whiteLabel.monthly.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="text-center">
                          <Badge className="bg-green-100 text-green-800">
                            {Math.round(((result.traditional.monthly - result.whiteLabel.monthly) / result.traditional.monthly) * 100)}% Savings
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Business Growth */}
              <TabsContent value="growth">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <TrendingUp className="w-5 h-5" />
                        Business Growth Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Additional Clients You Can Handle</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            +{result.businessGrowth.additionalClients}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Revenue Increase Potential</span>
                          <Badge className="bg-green-100 text-green-800">
                            ${result.businessGrowth.revenueIncreasePotential.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Time Saved Weekly</span>
                          <Badge className="bg-purple-100 text-purple-800">
                            {result.businessGrowth.timeSavedWeekly} hours
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Team Efficiency Improvement</span>
                          <Badge className="bg-orange-100 text-orange-800">
                            {result.businessGrowth.efficiencyImprovement}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Industry Benchmarks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Average Client Retainer</span>
                          <div className="flex items-center gap-2">
                            <span>${result.industryBenchmarks.averageClientRetainer.toLocaleString()}</span>
                            {formData.avgRetainer > result.industryBenchmarks.averageClientRetainer ? 
                              <ArrowUp className="w-4 h-4 text-green-600" /> : 
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            }
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Acquisition Cost</span>
                          <div className="flex items-center gap-2">
                            <span>${result.industryBenchmarks.averageAcquisitionCost.toLocaleString()}</span>
                            {formData.acquisitionCost < result.industryBenchmarks.averageAcquisitionCost ? 
                              <ArrowUp className="w-4 h-4 text-green-600" /> : 
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            }
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Profit Margin</span>
                          <span>{result.industryBenchmarks.averageProfitMargin}%</span>
                        </div>
                        <div className="text-center">
                          <Badge className={
                            result.industryBenchmarks.yourPosition === "above" ? "bg-green-100 text-green-800" :
                            result.industryBenchmarks.yourPosition === "below" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            Your Position: {result.industryBenchmarks.yourPosition} average
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Competitive Advantage */}
              <TabsContent value="competitive">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <Award className="w-5 h-5" />
                      Competitive Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold">Faster Delivery</span>
                          </div>
                          <p className="text-sm text-gray-600">{result.competitiveAdvantage.fasterDelivery}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">Higher Quality</span>
                          </div>
                          <p className="text-sm text-gray-600">{result.competitiveAdvantage.higherQuality}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Expanded Service Offerings</h4>
                        <div className="space-y-2">
                          {result.competitiveAdvantage.expandedServices.map((service, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scenarios */}
              <TabsContent value="scenarios">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Scenario Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                          <h4 className="font-semibold text-green-700 mb-2">Best Case</h4>
                          <div className="space-y-2 text-sm">
                            <div>Savings: ${result.scenarios.bestCase.savings.toLocaleString()}/mo</div>
                            <div>New Clients: +{result.scenarios.bestCase.clients}</div>
                            <div>Revenue: ${result.scenarios.bestCase.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                          <h4 className="font-semibold text-blue-700 mb-2">Realistic</h4>
                          <div className="space-y-2 text-sm">
                            <div>Savings: ${result.scenarios.realistic.savings.toLocaleString()}/mo</div>
                            <div>New Clients: +{result.scenarios.realistic.clients}</div>
                            <div>Revenue: ${result.scenarios.realistic.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                          <h4 className="font-semibold text-orange-700 mb-2">Conservative</h4>
                          <div className="space-y-2 text-sm">
                            <div>Savings: ${result.scenarios.worstCase.savings.toLocaleString()}/mo</div>
                            <div>New Clients: +{result.scenarios.worstCase.clients}</div>
                            <div>Revenue: ${result.scenarios.worstCase.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center pt-4">
                        <Button onClick={downloadReport} className="bg-brand-purple rand-purple/90">
                          <Download className="w-4 h-4 mr-2" />
                          Download Comprehensive Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-600">Enter Your Business Metrics</h3>
                  <p className="text-gray-500">
                    Fill in your current SEO business details to see real-time ROI calculations and growth projections.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {result && (
        <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Transform Your SEO Business?</h3>
              <p className="text-white/90 max-w-2xl mx-auto">
                Save ${result.financialImpact.monthlySavings.toLocaleString()}/month and grow {result.businessGrowth.additionalClients} additional clients 
                with our white-label SEO services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-white text-brand-purple ray-100 rand-purple">
                  Get Custom Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hite rand-purple">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}