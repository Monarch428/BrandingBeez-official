import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Globe, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Download,
  BarChart3,
  Clock,
  Users,
  Smartphone,
  Shield,
  Zap,
  Target,
  ExternalLink
} from "lucide-react";

interface SEOAnalysisResult {
  website: string;
  overallScore: number;
  metrics: {
    technicalSEO: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    contentAnalysis: {
      score: number;
      wordCount: number;
      headingStructure: string[];
      keywordDensity: { [key: string]: number };
    };
    performanceMetrics: {
      loadTime: number;
      mobileScore: number;
      coreWebVitals: {
        lcp: number;
        fid: number;
        cls: number;
      };
    };
    competitorAnalysis: {
      mainCompetitors: string[];
      marketPosition: string;
      opportunityScore: number;
    };
    backlinks: {
      totalBacklinks: number;
      domainAuthority: number;
      topReferrers: string[];
    };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    issue: string;
    solution: string;
    impact: string;
  }[];
  estimatedTrafficGrowth: {
    threeMonths: number;
    sixMonths: number;
    twelveMonths: number;
  };
}

export function SEOAnalyzer() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('/api/seo-analyzer', {
        method: 'POST',
        body: JSON.stringify({ websiteUrl: url })
      });
      return response;
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete!",
        description: "Your SEO audit has been generated successfully.",
      });
    },
    onError: (error: any) => {
      // Extract user-friendly message from server response
      let errorMessage = "Unable to analyze the website. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Please check your website URL",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const downloadReportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/seo-analyzer/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, websiteUrl })
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-analysis-${websiteUrl.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Report Downloaded",
        description: "Your detailed SEO analysis report has been downloaded.",
      });
    }
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) {
      toast({
        title: "Website URL Required",
        description: "Please enter a valid website URL to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    // Add https if not present
    const formattedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    analysisMutation.mutate(formattedUrl);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Free SEO Website Analyzer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get a comprehensive analysis of your website's SEO performance. 
          Discover optimization opportunities and track your progress against competitors.
        </p>
      </div>

      {/* Analysis Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-coral" />
            Website Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="Enter your website URL (e.g., example.com)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
                className="text-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={analysisMutation.isPending}
              className="w-full bg-brand-coral rand-coral/90 text-white py-3"
              size="lg"
            >
              {analysisMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Website...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze Website SEO
                </>
              )}
            </Button>
            {!analysisMutation.isPending && (
              <p className="text-sm text-gray-500 text-center">
                Analysis typically takes 15-30 seconds
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-coral" />
                  Overall SEO Score for {analysis.website}
                </div>
                <Button
                  onClick={() => downloadReportMutation.mutate()}
                  disabled={downloadReportMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </div>
                <div className="flex-1">
                  <Progress value={analysis.overallScore} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">
                    {analysis.overallScore >= 80 && "Excellent SEO performance! Your website is well-optimized."}
                    {analysis.overallScore >= 60 && analysis.overallScore < 80 && "Good SEO foundation with room for improvement."}
                    {analysis.overallScore < 60 && "Significant optimization opportunities available."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Technical SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Technical SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Score</span>
                    <Badge variant={getScoreBadgeVariant(analysis.metrics.technicalSEO.score)}>
                      {analysis.metrics.technicalSEO.score}/100
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Issues:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.metrics.technicalSEO.issues.slice(0, 3).map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Load Time</span>
                    <span className="font-medium">{analysis.metrics.performanceMetrics.loadTime}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mobile Score</span>
                    <Badge variant={getScoreBadgeVariant(analysis.metrics.performanceMetrics.mobileScore)}>
                      {analysis.metrics.performanceMetrics.mobileScore}/100
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Core Web Vitals:</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>LCP:</span>
                        <span>{analysis.metrics.performanceMetrics.coreWebVitals.lcp}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FID:</span>
                        <span>{analysis.metrics.performanceMetrics.coreWebVitals.fid}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CLS:</span>
                        <span>{analysis.metrics.performanceMetrics.coreWebVitals.cls}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backlinks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                  Backlink Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Backlinks</span>
                    <span className="font-medium">{analysis.metrics.backlinks.totalBacklinks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Domain Authority</span>
                    <Badge variant={getScoreBadgeVariant(analysis.metrics.backlinks.domainAuthority)}>
                      {analysis.metrics.backlinks.domainAuthority}/100
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Top Referrers:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.metrics.backlinks.topReferrers.slice(0, 3).map((referrer, index) => (
                        <li key={index} className="truncate">{referrer}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Growth Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Estimated Traffic Growth Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{analysis.estimatedTrafficGrowth.threeMonths}%
                  </div>
                  <div className="text-sm text-gray-500">3 Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{analysis.estimatedTrafficGrowth.sixMonths}%
                  </div>
                  <div className="text-sm text-gray-500">6 Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{analysis.estimatedTrafficGrowth.twelveMonths}%
                  </div>
                  <div className="text-sm text-gray-500">12 Months</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Priority Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'default'}
                        >
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{rec.category}</span>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">{rec.issue}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.solution}</p>
                    <div className="text-xs text-green-600 font-medium">
                      Expected Impact: {rec.impact}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-brand-purple to-brand-coral text-white">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Website?</h3>
              <p className="text-lg mb-6 opacity-90">
                Get professional SEO services to implement these recommendations and grow your organic traffic.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-brand-purple hite/90"
                asChild
              >
                <a href="/contact">Get Professional SEO Help</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}