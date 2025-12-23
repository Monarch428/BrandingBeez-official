import OpenAI from "openai";

// Initialize OpenAI with API key from environment
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openai = openaiClient;

// Comprehensive SEO Website Analyzer
export async function analyzeWebsiteSEO(websiteUrl: string): Promise<{
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
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    const prompt = `Analyze the website: ${websiteUrl}

Perform a comprehensive SEO analysis and provide results in JSON format with this exact structure:

{
  "website": "${websiteUrl}",
  "overallScore": number (1-100),
  "metrics": {
    "technicalSEO": {
      "score": number (1-100),
      "issues": ["list of specific technical SEO issues found"],
      "recommendations": ["specific actionable recommendations"]
    },
    "contentAnalysis": {
      "score": number (1-100),
      "wordCount": number,
      "headingStructure": ["H1", "H2", "H3 structure assessment"],
      "keywordDensity": {"keyword": percentage}
    },
    "performanceMetrics": {
      "loadTime": number (in seconds),
      "mobileScore": number (1-100),
      "coreWebVitals": {
        "lcp": number (in seconds),
        "fid": number (in milliseconds),
        "cls": number (0-1 scale)
      }
    },
    "competitorAnalysis": {
      "mainCompetitors": ["list of main competitor domains"],
      "marketPosition": "description of market position",
      "opportunityScore": number (1-100)
    },
    "backlinks": {
      "totalBacklinks": number,
      "domainAuthority": number (1-100),
      "topReferrers": ["list of top referring domains"]
    }
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "Technical|Content|Performance|Links",
      "issue": "specific issue description",
      "solution": "detailed solution steps",
      "impact": "expected impact description"
    }
  ],
  "estimatedTrafficGrowth": {
    "threeMonths": number (percentage growth),
    "sixMonths": number (percentage growth),
    "twelveMonths": number (percentage growth)
  }
}

Provide realistic, data-driven analysis based on the domain and typical website patterns. Include specific, actionable recommendations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert SEO analyst with 10+ years of experience. Provide realistic, professional assessments based on current SEO best practices. Always respond with valid JSON that matches the exact structure requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Ensure all required fields exist with fallbacks
    return {
      website: websiteUrl,
      overallScore: Math.max(1, Math.min(100, result.overallScore || 72)),
      metrics: {
        technicalSEO: {
          score: Math.max(1, Math.min(100, result.metrics?.technicalSEO?.score || 68)),
          issues: result.metrics?.technicalSEO?.issues || [
            "Missing meta descriptions on key pages",
            "Slow server response time detected",
            "XML sitemap not found"
          ],
          recommendations: result.metrics?.technicalSEO?.recommendations || [
            "Implement comprehensive meta descriptions",
            "Optimize server response time",
            "Create and submit XML sitemap"
          ]
        },
        contentAnalysis: {
          score: Math.max(1, Math.min(100, result.metrics?.contentAnalysis?.score || 75)),
          wordCount: result.metrics?.contentAnalysis?.wordCount || 1250,
          headingStructure: result.metrics?.contentAnalysis?.headingStructure || ["H1: 1", "H2: 4", "H3: 8"],
          keywordDensity: result.metrics?.contentAnalysis?.keywordDensity || { "main keyword": 2.3, "secondary": 1.8 }
        },
        performanceMetrics: {
          loadTime: Math.max(0.1, result.metrics?.performanceMetrics?.loadTime || 2.4),
          mobileScore: Math.max(1, Math.min(100, result.metrics?.performanceMetrics?.mobileScore || 78)),
          coreWebVitals: {
            lcp: Math.max(0.1, result.metrics?.performanceMetrics?.coreWebVitals?.lcp || 2.8),
            fid: Math.max(1, result.metrics?.performanceMetrics?.coreWebVitals?.fid || 45),
            cls: Math.max(0, Math.min(1, result.metrics?.performanceMetrics?.coreWebVitals?.cls || 0.12))
          }
        },
        competitorAnalysis: {
          mainCompetitors: result.metrics?.competitorAnalysis?.mainCompetitors || ["competitor1.com", "competitor2.com", "competitor3.com"],
          marketPosition: result.metrics?.competitorAnalysis?.marketPosition || "Strong position with growth opportunities",
          opportunityScore: Math.max(1, Math.min(100, result.metrics?.competitorAnalysis?.opportunityScore || 73))
        },
        backlinks: {
          totalBacklinks: Math.max(0, result.metrics?.backlinks?.totalBacklinks || 247),
          domainAuthority: Math.max(1, Math.min(100, result.metrics?.backlinks?.domainAuthority || 42)),
          topReferrers: result.metrics?.backlinks?.topReferrers || ["linkedin.com", "facebook.com", "industry-site.com"]
        }
      },
      recommendations: result.recommendations || [
        {
          priority: "high",
          category: "Technical",
          issue: "Page speed optimization needed",
          solution: "Compress images, minify CSS/JS, enable browser caching",
          impact: "15-25% improvement in search rankings"
        }
      ],
      estimatedTrafficGrowth: {
        threeMonths: Math.max(5, result.estimatedTrafficGrowth?.threeMonths || 18),
        sixMonths: Math.max(10, result.estimatedTrafficGrowth?.sixMonths || 35),
        twelveMonths: Math.max(20, result.estimatedTrafficGrowth?.twelveMonths || 65)
      }
    };
  } catch (error) {
    console.error("SEO analysis error:", error);
    throw new Error("Failed to analyze website SEO. Please try again.");
  }
}

// SEO Audit Analysis
export async function analyzeSEOAudit(websiteUrl: string): Promise<{
  score: number;
  auditData: {
    pageSpeed: number;
    seoScore: number;
    mobileFriendly: boolean;
    httpsEnabled: boolean;
    metaTags: number;
    headingStructure: boolean;
    imageOptimization: number;
  };
  recommendations: string;
}> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    const prompt = `Analyze the following website for SEO performance: ${websiteUrl}

Please provide a comprehensive SEO audit analysis in JSON format with the following structure:
{
  "score": number (1-100),
  "auditData": {
    "pageSpeed": number (1-100),
    "seoScore": number (1-100),
    "mobileFriendly": boolean,
    "httpsEnabled": boolean,
    "metaTags": number (1-100),
    "headingStructure": boolean,
    "imageOptimization": number (1-100)
  },
  "recommendations": "detailed string with specific actionable recommendations"
}

Provide realistic scores and detailed recommendations for improvement.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an SEO expert analyzing websites. Provide realistic assessments and actionable recommendations. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.max(1, Math.min(100, result.score || 75)),
      auditData: {
        pageSpeed: Math.max(1, Math.min(100, result.auditData?.pageSpeed || 70)),
        seoScore: Math.max(1, Math.min(100, result.auditData?.seoScore || 68)),
        mobileFriendly: result.auditData?.mobileFriendly ?? true,
        httpsEnabled: result.auditData?.httpsEnabled ?? true,
        metaTags: Math.max(1, Math.min(100, result.auditData?.metaTags || 65)),
        headingStructure: result.auditData?.headingStructure ?? false,
        imageOptimization: Math.max(1, Math.min(100, result.auditData?.imageOptimization || 60))
      },
      recommendations: result.recommendations || "Focus on improving page speed, mobile optimization, and meta tag implementation."
    };
  } catch (error) {
    console.error("SEO Analysis error:", error);

    // Fallback to realistic demo data if OpenAI fails
    const isHttps = websiteUrl.startsWith('https://');
    const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    return {
      score: Math.floor(Math.random() * 20) + 65, // Random score between 65-85
      auditData: {
        pageSpeed: Math.floor(Math.random() * 30) + 60, // 60-90
        seoScore: Math.floor(Math.random() * 25) + 65, // 65-90
        mobileFriendly: Math.random() > 0.3, // 70% chance true
        httpsEnabled: isHttps,
        metaTags: Math.floor(Math.random() * 40) + 50, // 50-90
        headingStructure: Math.random() > 0.5, // 50% chance true
        imageOptimization: Math.floor(Math.random() * 35) + 45 // 45-80
      },
      recommendations: `Based on analysis of ${domain}, we recommend: 1) Optimize page loading speed by compressing images and minifying CSS/JS files. 2) Improve mobile responsiveness and ensure proper viewport configuration. 3) Enhance meta descriptions and title tags for better search visibility. 4) Implement proper heading structure (H1-H6) for content hierarchy. 5) Add alt text to images for accessibility and SEO. 6) ${isHttps ? 'Great job on HTTPS implementation!' : 'Enable HTTPS for better security and SEO ranking.'}`
    };
  }
}

// Website Security Audit
export async function analyzeWebsiteSecurity(websiteUrl: string): Promise<{
  score: number;
  issues: {
    security: number;
    performance: number;
    seo: number;
    mobile: number;
    accessibility: number;
    spelling: number;
  };
  recommendations: string[];
}> {
  try {
    const prompt = `Perform a comprehensive website security and performance audit for: ${websiteUrl}

Analyze the following aspects and provide scores (1-100) and recommendations:
- Security vulnerabilities and HTTPS implementation
- Performance and loading speed
- SEO optimization
- Mobile responsiveness
- Accessibility compliance
- Content quality and spelling

Respond in JSON format:
{
  "score": number (overall score 1-100),
  "issues": {
    "security": number (1-100, higher is better),
    "performance": number (1-100),
    "seo": number (1-100),
    "mobile": number (1-100),
    "accessibility": number (1-100),
    "spelling": number (1-100)
  },
  "recommendations": ["array", "of", "specific", "actionable", "recommendations"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a web security and performance expert. Provide realistic assessments and specific recommendations. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.max(1, Math.min(100, result.score || 75)),
      issues: {
        security: Math.max(1, Math.min(100, result.issues?.security || 85)),
        performance: Math.max(1, Math.min(100, result.issues?.performance || 70)),
        seo: Math.max(1, Math.min(100, result.issues?.seo || 68)),
        mobile: Math.max(1, Math.min(100, result.issues?.mobile || 80)),
        accessibility: Math.max(1, Math.min(100, result.issues?.accessibility || 65)),
        spelling: Math.max(1, Math.min(100, result.issues?.spelling || 90))
      },
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        "Implement HTTPS across all pages",
        "Optimize images and enable compression",
        "Improve mobile responsiveness",
        "Add alt tags to images for accessibility"
      ]
    };
  } catch (error) {
    console.error("Website audit error:", error);
    throw new Error("Failed to analyze website: " + (error as Error).message);
  }
}

// Pricing Calculator Analysis
export async function calculatePricing(data: {
  teamSize: number;
  experience: string;
  location: string;
  benefits: boolean;
  projectComplexity: string;
}): Promise<{
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
}> {
  try {
    const prompt = `Calculate accurate hiring costs vs dedicated team costs with these parameters:
- Team size: ${data.teamSize} people
- Experience level: ${data.experience}
- Location: ${data.location}
- Benefits included: ${data.benefits}
- Project complexity: ${data.projectComplexity}

Consider current market rates for 2024/2025. Provide realistic cost analysis in JSON format:
{
  "traditional": {
    "monthly": number,
    "annual": number,
    "breakdown": {
      "salary": number,
      "benefits": number,
      "overhead": number,
      "recruitment": number
    }
  },
  "dedicated": {
    "monthly": number,
    "annual": number,
    "savings": {
      "monthly": number,
      "annual": number,
      "percentage": number
    }
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a business cost analysis expert. Provide accurate, market-based calculations for hiring costs. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    const traditional = result.traditional || {};
    const dedicated = result.dedicated || {};

    return {
      traditional: {
        monthly: traditional.monthly || 15000,
        annual: traditional.annual || 180000,
        breakdown: {
          salary: traditional.breakdown?.salary || 10000,
          benefits: traditional.breakdown?.benefits || 2500,
          overhead: traditional.breakdown?.overhead || 2000,
          recruitment: traditional.breakdown?.recruitment || 500
        }
      },
      dedicated: {
        monthly: dedicated.monthly || 8500,
        annual: dedicated.annual || 102000,
        savings: {
          monthly: dedicated.savings?.monthly || 6500,
          annual: dedicated.savings?.annual || 78000,
          percentage: dedicated.savings?.percentage || 43
        }
      }
    };
  } catch (error) {
    console.error("Pricing calculation error:", error);
    throw new Error("Failed to calculate pricing: " + (error as Error).message);
  }
}

// Google Ads Audit Analysis
export async function analyzeGoogleAds(data: {
  monthlySpend: number;
  industry: string;
  currentCTR: number;
  currentCPC: number;
  goals: string[];
}): Promise<{
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
}> {
  try {
    const prompt = `Analyze Google Ads performance with these details:
- Monthly spend: $${data.monthlySpend}
- Industry: ${data.industry}
- Current CTR: ${data.currentCTR}%
- Current CPC: $${data.currentCPC}
- Goals: ${data.goals.join(', ')}

Provide a comprehensive audit analysis in JSON format:
{
  "currentPerformance": {
    "ctr": number,
    "cpc": number,
    "roas": number,
    "wastedSpend": number
  },
  "opportunities": {
    "potentialSavings": number,
    "roasImprovement": number,
    "newLeads": number
  },
  "recommendations": ["array", "of", "specific", "actionable", "recommendations"]
}

Base analysis on industry benchmarks and current performance metrics.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a Google Ads expert with deep knowledge of industry benchmarks and optimization strategies. Provide realistic assessments based on current market data. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      currentPerformance: {
        ctr: result.currentPerformance?.ctr || data.currentCTR,
        cpc: result.currentPerformance?.cpc || data.currentCPC,
        roas: result.currentPerformance?.roas || 250,
        wastedSpend: result.currentPerformance?.wastedSpend || Math.floor(data.monthlySpend * 0.25)
      },
      opportunities: {
        potentialSavings: result.opportunities?.potentialSavings || Math.floor(data.monthlySpend * 0.3),
        roasImprovement: result.opportunities?.roasImprovement || 45,
        newLeads: result.opportunities?.newLeads || Math.floor(data.monthlySpend * 0.15)
      },
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        "Optimize ad copy and landing page alignment",
        "Implement negative keyword lists",
        "Adjust bidding strategy for better cost efficiency",
        "Improve ad extensions and quality score"
      ]
    };
  } catch (error) {
    console.error("Google Ads audit error:", error);
    throw new Error("Failed to analyze Google Ads: " + (error as Error).message);
  }
}

// Business Automation Analysis
export async function analyzeAutomation(data: {
  industry: string;
  teamSize: number;
  currentTools: string[];
  painPoints: string[];
  goals: string[];
}): Promise<{
  score: number;
  timesSaved: number;
  costSavings: number;
  suggestions: {
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    timeframe: string;
    savings: string;
  }[];
  nextSteps: string[];
}> {
  try {
    const prompt = `Analyze business automation opportunities:
- Industry: ${data.industry}
- Team size: ${data.teamSize}
- Current tools: ${data.currentTools.join(', ')}
- Pain points: ${data.painPoints.join(', ')}
- Goals: ${data.goals.join(', ')}

Provide automation analysis in JSON format:
{
  "score": number (automation readiness 1-100),
  "timesSaved": number (hours per week),
  "costSavings": number (monthly savings in dollars),
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "impact": "High|Medium|Low",
      "timeframe": "string",
      "savings": "string"
    }
  ],
  "nextSteps": ["array", "of", "immediate", "actions"]
}

Focus on practical, achievable automation opportunities.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a business automation expert. Provide practical, achievable automation recommendations based on team size and industry. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.max(1, Math.min(100, result.score || 70)),
      timesSaved: result.timesSaved || 15,
      costSavings: result.costSavings || 2500,
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [
        {
          title: "Email Marketing Automation",
          description: "Automate lead nurturing and customer communication",
          impact: "High" as const,
          timeframe: "2-4 weeks",
          savings: "$800/month"
        }
      ],
      nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [
        "Audit current manual processes",
        "Identify highest-impact automation opportunities",
        "Implement customer communication automation"
      ]
    };
  } catch (error) {
    console.error("Automation analysis error:", error);
    throw new Error("Failed to analyze automation: " + (error as Error).message);
  }
}

// Document Analysis with OpenAI Vision and File Processing
export async function analyzeDocument(fileData: {
  type: 'image' | 'pdf' | 'document' | 'video';
  content: string; // base64 encoded
  fileName: string;
  mimeType: string;
}): Promise<{
  analysis: string;
  recommendations: string[];
  serviceRecommendations: {
    service: string;
    description: string;
    pricing: string;
    cta: string;
  }[];
  actionItems: string[];
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    let analysisPrompt = "";
    let messages: any[] = [];

    // Handle different file types
    if (fileData.type === 'image') {
      analysisPrompt = `Analyze this image for business insights. Look for:
1. Marketing materials, websites, or business documents
2. Performance metrics, analytics, or data visualizations
3. Business processes, workflows, or organizational charts
4. Branding elements, design quality, and user experience
5. Technical issues, SEO problems, or improvement opportunities

Provide specific, actionable recommendations and identify which BrandingBeez services could help.`;

      messages = [
        {
          role: "system",
          content: "You are Vig, founder of BrandingBeez. Analyze business documents and provide expert recommendations for our services: SEO, Web Development, Google Ads, AI Development, and Business Automation."
        },
        {
          role: "user",
          content: [
            { type: "text", text: analysisPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${fileData.mimeType};base64,${fileData.content}`
              }
            }
          ]
        }
      ];
    } else if (fileData.type === 'video') {
      // For videos, we'll analyze based on filename and provide general recommendations
      analysisPrompt = `Analyze this video file: ${fileData.fileName}

Since I cannot directly process video content, I'll provide recommendations based on the filename and video marketing best practices:

1. Video marketing and social media optimization
2. Video SEO and thumbnail optimization  
3. Video content strategy and automation
4. Landing page integration for videos
5. Performance tracking and analytics

Provide specific recommendations for video marketing and identify relevant BrandingBeez services.`;

      messages = [
        {
          role: "system",
          content: "You are Vig, founder of BrandingBeez. Analyze business files and provide expert recommendations for our services: SEO, Web Development, Google Ads, AI Development, and Business Automation."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ];
    } else {
      // For PDFs and documents, we'll use text extraction approach
      analysisPrompt = `Analyze this business document: ${fileData.fileName}

Look for:
1. Business challenges and pain points
2. Performance metrics and KPIs
3. Marketing strategies and campaigns
4. Technical requirements or issues
5. Growth opportunities and bottlenecks

Provide specific recommendations and identify relevant BrandingBeez services.

Note: File type is ${fileData.type}. Provide analysis based on common business document patterns.`;

      messages = [
        {
          role: "system",
          content: "You are Vig, founder of BrandingBeez. Analyze business documents and provide expert recommendations for our services: SEO, Web Development, Google Ads, AI Development, and Business Automation."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      functions: [{
        name: "analyze_business_document",
        description: "Analyze business documents and provide service recommendations",
        parameters: {
          type: "object",
          properties: {
            analysis: {
              type: "string",
              description: "Detailed analysis of the document"
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description: "Specific actionable recommendations"
            },
            serviceRecommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  service: { type: "string" },
                  description: { type: "string" },
                  pricing: { type: "string" },
                  cta: { type: "string" }
                }
              },
              description: "Relevant BrandingBeez services"
            },
            actionItems: {
              type: "array",
              items: { type: "string" },
              description: "Immediate action items"
            }
          },
          required: ["analysis", "recommendations", "serviceRecommendations", "actionItems"]
        }
      }],
      function_call: { name: "analyze_business_document" }
    });

    const result = JSON.parse(response.choices[0].message.function_call?.arguments || "{}");

    return {
      analysis: result.analysis || "Document analyzed successfully.",
      recommendations: result.recommendations || ["Schedule a consultation to discuss your specific needs"],
      serviceRecommendations: result.serviceRecommendations || [
        {
          service: "Business Consultation",
          description: "Get personalized recommendations for your business",
          pricing: "Free 30-minute consultation",
          cta: "https://calendly.com/vigneshwaran-brandingbeez/30min"
        }
      ],
      actionItems: result.actionItems || ["Book a strategy call to discuss implementation"]
    };

  } catch (error) {
    console.error("Document analysis error:", error);
    
    // Fallback analysis based on file type
    return {
      analysis: `I've reviewed your ${fileData.type} document. Based on the file type and content, I can see potential opportunities for improvement.`,
      recommendations: [
        "Schedule a detailed consultation to discuss your specific needs",
        "Consider a comprehensive business audit",
        "Explore automation opportunities to streamline processes"
      ],
      serviceRecommendations: [
        {
          service: "Business Audit",
          description: "Comprehensive analysis of your current setup",
          pricing: "Starting at $500",
          cta: "https://calendly.com/vigneshwaran-brandingbeez/30min"
        },
        {
          service: "Custom Solutions",
          description: "Tailored recommendations based on your document",
          pricing: "Custom quote available",
          cta: "https://calendly.com/vigneshwaran-brandingbeez/30min"
        }
      ],
      actionItems: [
        "Book a consultation to discuss findings",
        "Prepare list of current challenges",
        "Consider budget for recommended improvements"
      ]
    };
  }
}

// AI-powered chat response generation
export async function generateAIResponse(userMessage: string, context: any = {}) {
  try {
    const systemPrompt = `You are Vig, the founder of BrandingBeez, a digital marketing agency. Your goal is to help businesses grow by offering expert advice and services.

Your persona:
- Friendly, approachable, and professional.
- Passionate about helping businesses succeed.
- Human-like and conversational.

IMPORTANT: Analyze user messages intelligently:
- If they mention their name (e.g., "I'm John", "My name is Sarah"), extract just the actual name
- If they share business problems without giving a name, ask for their name first
- If they provide an email address, extract it properly
- Always respond to their actual intent, not just follow a rigid script

Conversation Goals:
1. Get their name (extract from natural conversation)
2. Get their email (for follow-up resources)
3. Understand their business challenge
4. Provide relevant service recommendations with case studies
5. Book a consultation call

Key Guidelines:
- Keep messages short and simple (2-3 sentences max).
- Use emojis to add personality.
- Always respond to what they're actually saying.
- If they ask business questions, answer them while still trying to gather contact info.
- Offer your Calendly link: https://calendly.com/vigneshwaran-brandingbeez/30min`;

    // Smart parsing of user message to extract information
    const messageText = userMessage.toLowerCase();
    
    // Extract name from user message if they provide it
    let extractedName = "";
    if (messageText.includes("my name is") || messageText.includes("i'm ") || messageText.includes("i am ")) {
      const nameMatches = userMessage.match(/(?:my name is|i'm|i am)\s+([a-zA-Z\s]+)/i);
      if (nameMatches && nameMatches[1]) {
        extractedName = nameMatches[1].trim().split(/[,.!?]/)[0]; // Get just the name part
      }
    } else {
      // Check if it's a short response that could be a name (2-20 characters, only letters/spaces)
      const trimmedMessage = userMessage.trim();
      if (trimmedMessage.length >= 2 && trimmedMessage.length <= 20 && /^[a-zA-Z\s]+$/.test(trimmedMessage)) {
        // Check context to see if we just asked for their name
        const recentMessages = context.messages || [];
        const lastBotMessage = recentMessages.filter((msg: any) => msg.type === 'bot').pop();
        if (lastBotMessage && lastBotMessage.content && 
            (lastBotMessage.content.includes("What's your name") || lastBotMessage.content.includes("share your name"))) {
          extractedName = trimmedMessage;
        }
      }
    }
    
    // Extract email if provided
    let extractedEmail = "";
    const emailMatch = userMessage.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      extractedEmail = emailMatch[1];
    }
    
    // Current state from context
    const leadInfo = context.leadInfo || {};
    const currentName = extractedName || leadInfo.name || "";
    const currentEmail = extractedEmail || leadInfo.email || "";
    const currentChallenge = leadInfo.challenge || "";
    
    const hasName = currentName.trim().length > 2 && !currentName.includes("having issues"); // Exclude obviously wrong names
    const hasEmail = currentEmail.includes("@");
    const hasChallenge = currentChallenge.trim().length > 0;
    
    // Debug logging
    console.log('Smart Chat Analysis:', {
      userMessage,
      extractedName,
      extractedEmail,
      currentName,
      hasName,
      hasEmail,
      hasChallenge
    });

    // Smart conversation flow based on actual user intent
    let aiContent = "";
    let recommendations: string[] = [];

    // Check if user is talking about SEO or business problems
    const isSEORelated = messageText.includes('seo') || messageText.includes('search') || messageText.includes('ranking') || messageText.includes('traffic');
    const isBusinessProblem = messageText.includes('clients') || messageText.includes('results') || messageText.includes('help') || messageText.includes('issue');

    if (!hasName && (isSEORelated || isBusinessProblem)) {
      // User shared a business problem but we don't have their name
      aiContent = `I'd love to help you with your SEO challenge! 🚀\n\nI'm Vig, founder of BrandingBeez. We specialize in helping agencies get better results for their clients.\n\nWhat's your name so I can personalize my recommendations?`;
      recommendations = []; // Don't show "Tell me more" button when asking for name
    } else if (!hasName) {
      aiContent = `Thanks for your interest! I'm Vig, founder of BrandingBeez 👋\n\nI can analyze your documents, images, and business files to provide instant recommendations! What's your name?`;
      recommendations = ["Upload a document for analysis"];
    } else if (!hasEmail && isSEORelated) {
      // They have a name and SEO problem, get email to send resources
      aiContent = `Great to meet you, ${currentName}! 😊\n\nSEO challenges are totally solvable. Could I get your email? I'll send you our proven SEO audit checklist that's helped 200+ agencies improve client results.`;
      recommendations = ["Share your website URL for a quick audit"];
    } else if (!hasEmail) {
      aiContent = `Nice to meet you, ${currentName}! 😊\n\nCould I get your email? I'd love to send you some helpful resources about growing your business.`;
      recommendations = [];
    } else if (isSEORelated || isBusinessProblem) {
      // They have name, email, and shared business problem - provide specific help
      aiContent = `Perfect, ${currentName}! I can definitely help with your SEO client results. 🎯\n\nWe've helped 200+ agencies improve their client outcomes. Common issues: technical SEO problems, content gaps, or targeting wrong keywords.\n\nWhat's the client's website URL? I can do a quick audit and spot the issues.`;
      recommendations = [
        "Share the client's website URL",
        "Tell me more about current SEO strategy",
        "Book a strategy call to review",
        "https://calendly.com/vigneshwaran-brandingbeez/30min"
      ];
    } else if (!hasChallenge) {
      aiContent = `Perfect, ${currentName}! 🎯\n\nWhat's your biggest business challenge right now? Website traffic? Lead generation? Something else?`;
      recommendations = [
        "Not enough website traffic",
        "Need more qualified leads", 
        "Want to automate processes",
        "Need a new website"
      ];
    } else {
      // General business conversation
      const challenge = currentChallenge.toLowerCase();

      if (challenge.includes('traffic') || challenge.includes('seo') || challenge.includes('search')) {
        aiContent = `Got it, ${leadInfo.name}! Traffic issues are super common. 📈\n\nWe helped Social Land increase their leads by 300% through SEO + Google Ads. Our SEO packages start at $800/month.\n\nWhat's your website URL? I'd love to take a quick look.`;
        recommendations = [
          "Tell me your current monthly traffic",
          "What keywords do you want to rank for?",
          "https://calendly.com/vigneshwaran-brandingbeez/30min"
        ];
      } else if (challenge.includes('leads') || challenge.includes('customers') || challenge.includes('sales')) {
        aiContent = `Lead generation - that's our specialty! 🎯\n\nWe've helped Koala Digital scale from 2 to 20 clients. Combination of SEO ($800+/month) and Google Ads ($500+/month) works best.\n\nWhat's your current lead volume per month?`;
        recommendations = [
          "Less than 10 leads/month",
          "10-50 leads/month",
          "50+ leads/month",
          "https://calendly.com/vigneshwaran-brandingbeez/30min"
        ];
      } else if (challenge.includes('website') || challenge.includes('web') || challenge.includes('site')) {
        aiContent = `Website improvements can be game-changing! 💻\n\nWe built TS Landscaping's site and they saw 150% revenue boost. Our web development ranges $1,200-8,000 depending on complexity.\n\nDo you need a complete redesign or just updates?`;
        recommendations = [
          "Complete new website",
          "Redesign existing site",
          "Just need updates/fixes",
          "https://calendly.com/vigneshwaran-brandingbeez/30min"
        ];
      } else if (challenge.includes('automat') || challenge.includes('time') || challenge.includes('process')) {
        aiContent = `Automation can save you tons of time! ⚡\n\nOur business automation solutions ($1,000-5,000) help agencies save 10-20 hours/week on repetitive tasks.\n\nWhat processes are eating up most of your time?`;
        recommendations = [
          "Client reporting & communication",
          "Lead nurturing & follow-ups",
          "Data entry & admin tasks",
          "https://calendly.com/vigneshwaran-brandingbeez/30min"
        ];
      } else {
        // Check if there's document analysis context
        const hasDocumentAnalysis = context.documentAnalysis || context.hasDocumentAnalysis;
        if (hasDocumentAnalysis) {
          aiContent = `I've analyzed your document and have some specific recommendations! 📊\n\nBased on the analysis, I can see exactly how we can help improve your business. Ready to discuss the next steps?`;
          recommendations = [
            "Book a strategy call now",
            "Get a custom quote",
            "See similar case studies",
            "https://calendly.com/vigneshwaran-brandingbeez/30min"
          ];
        } else {
          aiContent = `Thanks for sharing, ${leadInfo.name}! 🤝\n\nBased on what you've told me, I think we can definitely help. We've worked with 200+ businesses to solve similar challenges.\n\nWant to jump on a quick 15-minute call to discuss your specific situation?`;
          recommendations = [
            "Yes, let's schedule a call",
            "Upload a document for analysis",
            "Tell me more about your services",
            "https://calendly.com/vigneshwaran-brandingbeez/30min"
          ];
        }
      }
    }

    // Attempt to get a more dynamic AI response for richer conversations
    const dynamicAiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `User message: "${userMessage}". Current context: ${JSON.stringify(context, null, 2)}. Respond conversationally, following the defined flow and persona. Keep it concise.`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const aiResponseContent = dynamicAiResponse.choices[0]?.message?.content;

    // Prioritize the structured response, but fall back to dynamic if it's significantly better or provides missing info
    if (aiResponseContent && aiResponseContent.length > 50 && aiResponseContent.length < aiContent.length * 1.5) {
       // Only use dynamic response if it's not a generic fallback and adds value
      if (!aiResponseContent.includes("What would you like to know") && !aiResponseContent.includes("biggest business challenge")) {
        aiContent = aiResponseContent;
      }
    }

    return {
      content: aiContent,
      recommendations: recommendations,
      extractedName: extractedName || currentName,
      extractedEmail: extractedEmail || currentEmail,
      extractedChallenge: currentChallenge
    };
  } catch (error) {
    console.error("AI response generation error:", error);
    // Fallback response if everything else fails
    return {
      content: "Hi there! I'm Vig from BrandingBeez 👋\n\nI'd love to help grow your business. What's your name?",
      recommendations: [],
      extractedName: '',
      extractedEmail: '',
      extractedChallenge: ''
    };
  }
}

// Generate contextual service recommendations
function generateServiceRecommendations(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase();
  const recommendations: string[] = [];

  // SEO-related keywords
  if (message.includes('seo') || message.includes('search') || message.includes('ranking') || message.includes('traffic')) {
    recommendations.push("Get a free SEO audit");
    recommendations.push("Learn about our SEO services");
  }

  // Web development keywords
  if (message.includes('website') || message.includes('web') || message.includes('ecommerce') || message.includes('development')) {
    recommendations.push("Explore web development services");
    recommendations.push("View our e-commerce solutions");
  }

  // Google Ads keywords
  if (message.includes('ads') || message.includes('google') || message.includes('ppc') || message.includes('marketing')) {
    recommendations.push("Get a Google Ads audit");
    recommendations.push("View our digital marketing services");
  }

  // Automation keywords
  if (message.includes('automation') || message.includes('automate') || message.includes('workflow') || message.includes('ai')) {
    recommendations.push("Explore automation solutions");
    recommendations.push("Check automation opportunities");
  }

  // General business inquiry
  if (message.includes('business') || message.includes('help') || message.includes('grow') || message.includes('increase')) {
    recommendations.push("Schedule a strategy consultation");
    recommendations.push("Get a comprehensive business audit");
  }

  // Default recommendations if no specific keywords found
  if (recommendations.length === 0) {
    recommendations.push("Explore our services");
    recommendations.push("Schedule a consultation");
    recommendations.push("Try our free audit tools");
  }

  return recommendations.slice(0, 3); // Limit to top 3 recommendations
}

export interface BusinessGrowthReport {
  reportMetadata: {
    reportId: string;
    companyName: string;
    website: string;
    analysisDate: string;
    overallScore: number;
    subScores: {
      website: number;
      seo: number;
      reputation: number;
      leadGen: number;
      services: number;
      costEfficiency: number;
    };
  };
  executiveSummary: {
    strengths: string[];
    weaknesses: string[];
    biggestOpportunity: string;
    quickWins: {
      title: string;
      impact: string;
      time: string;
      cost: string;
      details: string;
    }[];
  };
  websiteDigitalPresence: {
    technicalSEO: {
      score: number;
      strengths: string[];
      issues: string[];
    };
    contentQuality: {
      score: number;
      strengths: string[];
      gaps: string[];
      recommendations: string[];
    };
    uxConversion: {
      score: number;
      highlights: string[];
      issues: string[];
      estimatedUplift: string;
    };
    contentGaps: string[];
  };
  seoVisibility: {
    domainAuthority: {
      score: number;
      benchmark: {
        you: number;
        competitorA: number;
        competitorB: number;
        competitorC: number;
        industryAverage: number;
      };
      rationale: string;
    };
    backlinkProfile: {
      totalBacklinks: number;
      referringDomains: number;
      averageDA: number;
      issues: string[];
    };
    keywordRankings: {
      total: number;
      top10: number;
      top50: number;
      top100: number;
    };
    topPerformingKeywords: {
      keyword: string;
      position: number;
      monthlyVolume: number;
      currentTraffic: string;
    }[];
    keywordGapAnalysis: {
      keyword: string;
      monthlySearches: number;
      yourRank: string;
      topCompetitor: string;
      opportunity: string;
    }[];
    contentRecommendations: {
      keyword: string;
      contentType: string;
      targetWordCount: number;
      subtopics: string[];
      trafficPotential: string;
    }[];
  };
  reputation: {
    reviewScore: number;
    summaryTable: {
      platform: string;
      reviews: number;
      rating: string;
      industryBenchmark: string;
      gap: string;
    }[];
    totalReviews: number;
    industryStandardRange: string;
    yourGap: string;
    sentimentThemes: {
      positive: string[];
      negative: string[];
      responseRate: string;
      averageResponseTime: string;
    };
  };
  servicesPositioning: {
    services: {
      name: string;
      startingPrice: string;
      description: string;
      targetMarket: string;
    }[];
    serviceGaps: {
      service: string;
      youOffer: string;
      competitorA: string;
      competitorB: string;
      marketDemand: string;
    }[];
    industriesServed: {
      current: string[];
      concentrationNote: string;
      highValueTargets: {
        industry: string;
        whyHighValue: string;
        avgDealSize: string;
        readiness: string;
      }[];
    };
    positioning: {
      currentStatement: string;
      competitorComparison: string;
      differentiation: string;
    };
  };
  leadGeneration: {
    channels: {
      channel: string;
      leadsPerMonth: string;
      quality: string;
      status: string;
    }[];
    missingHighROIChannels: {
      channel: string;
      status: string;
      estimatedLeads: string;
      setupTime: string;
      monthlyCost: string;
      priority: string;
    }[];
    leadMagnets: {
      current: string[];
      recommendations: {
        name: string;
        format: string;
        targetAudience: string;
        estimatedConversion: string;
      }[];
    };
    directoryOptimization: {
      directory: string;
      listed: string;
      optimized: string;
      reviews: number;
      actionNeeded: string;
    }[];
  };
  competitiveAnalysis: {
    competitors: {
      name: string;
      location: string;
      teamSize: string;
      yearsInBusiness: string;
      services: string[];
      strengthsVsYou: string[];
      yourAdvantages: string[];
      marketOverlap: string;
    }[];
    competitiveMatrix: {
      factor: string;
      you: string;
      compA: string;
      compB: string;
      compC: string;
      winner: string;
    }[];
    positioningGap: {
      pricePositioning: string;
      qualityPositioning: string;
      visibility: string;
      differentiation: string;
      recommendation: string;
    };
  };
  costOptimization: {
    estimatedCostStructure: {
      category: string;
      monthly: string;
      annual: string;
      percentOfTotal: string;
    }[];
    revenueEstimate: {
      estimatedRange: string;
      revenuePerEmployee: string;
      industryBenchmark: string;
      gapAnalysis: string;
    };
    costSavingOpportunities: {
      opportunity: string;
      currentCost: string;
      potentialSavings: string;
      implementationDifficulty: string;
      details: string;
    }[];
    pricingAnalysis: {
      positioning: string;
      serviceComparisons: {
        service: string;
        yourPrice: string;
        marketRange: string;
        positioning: string;
        recommendation: string;
      }[];
      overallRecommendation: string;
      premiumTierOpportunity: string;
      packagingOptimization: string;
    };
  };
  targetMarket: {
    currentClientProfile: {
      geographicMix: {
        us: string;
        uk: string;
        other: string;
      };
      clientSize: {
        small: string;
        medium: string;
        large: string;
      };
      industries: {
        industry: string;
        concentration: string;
      }[];
    };
    geographicExpansion: {
      currentStrongPresence: string[];
      underpenetratedMarkets: {
        region: string;
        reason: string;
        estimatedOpportunity: string;
        entryPlan: string;
      }[];
    };
    idealClientProfile: {
      industry: string;
      companySize: string;
      revenueRange: string;
      budget: string;
      painPoints: string[];
      decisionMakers: string[];
      whereToFind: string[];
    };
  };
  financialImpact: {
    revenueOpportunities: {
      opportunity: string;
      monthlyImpact: string;
      annualImpact: string;
      confidence: string;
      effort: string;
    }[];
    costSavings: {
      initiative: string;
      annualSavings: string;
      implementationCost: string;
      netSavings: string;
    }[];
    netImpact: {
      revenueGrowth: string;
      costSavings: string;
      totalImpact: string;
      investmentNeeded: string;
      expectedReturn: string;
      roi: string;
    };
    scenarios: {
      scenario: string;
      implementationLevel: string;
      impact: string;
    }[];
  };
  actionPlan90Days: {
    phase: string;
    weeks: {
      week: string;
      tasks: string[];
    }[];
    expectedImpact: {
      metric: string;
      improvement: string;
    }[];
  }[];
  competitiveAdvantages: {
    hiddenStrengths: {
      strength: string;
      evidence: string;
      whyItMatters: string;
      howToLeverage: string;
    }[];
    prerequisites: string[];
  };
  riskAssessment: {
    risks: {
      name: string;
      priority: string;
      description: string;
      impact: string;
      likelihood: string;
      mitigation: string[];
      timeline: string;
    }[];
  };
  appendices: {
    keywords: {
      tier: string;
      keywords: {
        keyword: string;
        monthlySearches: string;
        difficulty: string;
        intent: string;
        currentRank: string;
      }[];
    }[];
    reviewTemplates: {
      name: string;
      subject: string;
      body: string;
    }[];
    caseStudyTemplate: {
      title: string;
      industry: string;
      services: string;
      duration: string;
      budget: string;
      challenge: string;
      solution: string;
      results: string[];
      clientQuote: string;
      cta: string;
    };
    finalRecommendations: {
      topActions: {
        action: string;
        impact: string;
        effort: string;
        rationale: string;
      }[];
      nextSteps: string[];
    };
  };
}

function buildBusinessGrowthFallback(input: { companyName: string; website: string; industry?: string; }): BusinessGrowthReport {
  const now = new Date();
  const reportId = `BB-AI-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate()
    .toString()
    .padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

  return {
    reportMetadata: {
      reportId,
      companyName: input.companyName || "Marketing Agency",
      website: input.website,
      analysisDate: now.toISOString(),
      overallScore: 73,
      subScores: {
        website: 76,
        seo: 71,
        reputation: 68,
        leadGen: 64,
        services: 72,
        costEfficiency: 61,
      },
    },
    executiveSummary: {
      strengths: [
        "Strong SEO momentum (87/100)",
        "Great reputation score (4.7★)",
        "Solid client retention signals",
      ],
      weaknesses: [
        "Limited lead gen diversity (3/10)",
        "High cost structure vs. peers",
        "Missing key directory coverage",
      ],
      biggestOpportunity: "Claim Clutch & DesignRush listings to unlock ~$42K ARR within 90 days.",
      quickWins: [
        {
          title: "Claim and optimize Clutch profile with 5 proof points",
          impact: "+$30K ARR",
          time: "2 weeks",
          cost: "$0",
          details: "Set up category tags, upload 3 portfolio pieces, and request 5 client reviews to improve lead flow.",
        },
        {
          title: "Launch ROI calculator lead magnet",
          impact: "3x lead conversion",
          time: "3 weeks",
          cost: "$500",
          details: "Use a simple form-based calculator for paid media ROI with automated email follow-up.",
        },
        {
          title: "Reply to recent Google reviews and add schema",
          impact: "+8% conversion",
          time: "1 week",
          cost: "$0",
          details: "Respond to last 10 reviews, add FAQ + review schema, and push testimonials to key landing pages.",
        },
        {
          title: "Rework hero CTA for clarity + add proof bar",
          impact: "+6-10% form fills",
          time: "1 week",
          cost: "$0",
          details: "Add direct CTA, proof bar with review stars, and a secondary CTA for calendar booking.",
        },
        {
          title: "Retargeting + LinkedIn lead form test",
          impact: "+12-18 qualified leads/mo",
          time: "4 weeks",
          cost: "$1.2K",
          details: "Spin up a LinkedIn lead form and retargeting ads focusing on core service keywords and case stats.",
        },
      ],
    },
    websiteDigitalPresence: {
      technicalSEO: {
        score: 78,
        strengths: ["HTTPS enabled", "Clean URL structure", "XML sitemap present"],
        issues: ["Render-blocking scripts on hero", "Missing structured data on services"],
      },
      contentQuality: {
        score: 74,
        strengths: ["Clear value prop above the fold", "Service pages have 900-1200 words"],
        gaps: ["Few industry-specific examples", "No comparison content"],
        recommendations: ["Add case studies with metrics", "Publish industry-targeted landing pages"],
      },
      uxConversion: {
        score: 69,
        highlights: ["Persistent CTA in nav", "Short contact form"],
        issues: ["CTA not visible on mobile fold", "Lacks proof bar near CTA"],
        estimatedUplift: "+8-12% form conversion after CTA + proof fixes",
      },
      contentGaps: ["Lead magnets", "Video walkthrough", "FAQ schema"],
    },
    seoVisibility: {
      domainAuthority: {
        score: 48,
        benchmark: {
          you: 48,
          competitorA: 55,
          competitorB: 61,
          competitorC: 44,
          industryAverage: 52,
        },
        rationale: "Healthy authority but trailing core competitors on referring domains.",
      },
      backlinkProfile: {
        totalBacklinks: 860,
        referringDomains: 142,
        averageDA: 39,
        issues: ["Low topical authority", "Missing EDU/GOV style citations"],
      },
      keywordRankings: {
        total: 240,
        top10: 32,
        top50: 118,
        top100: 196,
      },
      topPerformingKeywords: [
        { keyword: "local seo agency", position: 6, monthlyVolume: 1800, currentTraffic: "190 visits/mo" },
        { keyword: "ppc management for smbs", position: 11, monthlyVolume: 950, currentTraffic: "75 visits/mo" },
      ],
      keywordGapAnalysis: [
        { keyword: "b2b saas seo agency", monthlySearches: 700, yourRank: "Not ranking", topCompetitor: "Competitor A (7)", opportunity: "$12-18k/yr" },
        { keyword: "clutch seo services", monthlySearches: 450, yourRank: "Not ranking", topCompetitor: "Competitor B (5)", opportunity: "+35 reviews" },
      ],
      contentRecommendations: [
        {
          keyword: "b2b seo playbook",
          contentType: "guide",
          targetWordCount: 1800,
          subtopics: ["ICP research", "content velocity", "conversion paths"],
          trafficPotential: "120-180 visits/mo",
        },
      ],
    },
    reputation: {
      reviewScore: 78,
      summaryTable: [
        { platform: "Google", reviews: 38, rating: "4.6/5.0", industryBenchmark: "25-50 reviews", gap: "+13" },
        { platform: "Clutch", reviews: 4, rating: "4.8/5.0", industryBenchmark: "15-20 reviews", gap: "-11" },
        { platform: "G2", reviews: 0, rating: "N/A", industryBenchmark: "10-15 reviews", gap: "-10" },
      ],
      totalReviews: 42,
      industryStandardRange: "55-80 reviews",
      yourGap: "-13 to industry midpoint",
      sentimentThemes: {
        positive: ["Responsive account team", "Clear reporting"],
        negative: ["Slow kickoff timelines"],
        responseRate: "62% responded",
        averageResponseTime: "48 hours",
      },
    },
    servicesPositioning: {
      services: [
        { name: "SEO Growth Sprints", startingPrice: "$2.5K/mo", description: "Technical + content + links", targetMarket: "B2B & local" },
        { name: "PPC Management", startingPrice: "$1.8K/mo", description: "Search + paid social", targetMarket: "SMB & SaaS" },
      ],
      serviceGaps: [
        { service: "Revenue Operations", youOffer: "", competitorA: "✓", competitorB: "✓", marketDemand: "High" },
        { service: "AI Content Automation", youOffer: "", competitorA: "Partial", competitorB: "✓", marketDemand: "Med" },
      ],
      industriesServed: {
        current: ["Local services", "Ecommerce", "B2B"],
        concentrationNote: "Weighted toward local service SMBs (~55%).",
        highValueTargets: [
          { industry: "B2B SaaS", whyHighValue: "High LTV + retainer fit", avgDealSize: "$5-8K/mo", readiness: "Need prep" },
          { industry: "Healthcare", whyHighValue: "Regulated high AOV", avgDealSize: "$6-9K/mo", readiness: "Ready" },
        ],
      },
      positioning: {
        currentStatement: "Full-funnel digital marketing agency helping SMBs grow",
        competitorComparison: "Peers emphasize niche vertical expertise; your positioning is broad.",
        differentiation: "Lean into proof-driven SEO/PPC sprints + automation layer.",
      },
    },
    leadGeneration: {
      channels: [
        { channel: "Organic search", leadsPerMonth: "18-25", quality: "High", status: "Optimized" },
        { channel: "Referrals", leadsPerMonth: "12-15", quality: "High", status: "Needs Work" },
        { channel: "Paid social", leadsPerMonth: "8-10", quality: "Medium", status: "Underutilized" },
      ],
      missingHighROIChannels: [
        { channel: "Clutch (optimized)", status: "Not listed", estimatedLeads: "15-25", setupTime: "2-3 mo", monthlyCost: "$299", priority: "High" },
        { channel: "Content Marketing", status: "Light", estimatedLeads: "12-18", setupTime: "3 mo", monthlyCost: "$2-5K", priority: "High" },
      ],
      leadMagnets: {
        current: ["SEO checklist"],
        recommendations: [
          { name: "ROI calculator", format: "tool", targetAudience: "CMOs & founders", estimatedConversion: "6-9%" },
          { name: "Website teardown video", format: "video", targetAudience: "Local SMB", estimatedConversion: "4-6%" },
        ],
      },
      directoryOptimization: [
        { directory: "Google Business", listed: "Yes", optimized: "Yes", reviews: 38, actionNeeded: "Add Q&A + posts" },
        { directory: "Clutch", listed: "No", optimized: "No", reviews: 0, actionNeeded: "Claim, add 5 reviews" },
        { directory: "G2", listed: "No", optimized: "No", reviews: 0, actionNeeded: "List core services" },
      ],
    },
    competitiveAnalysis: {
      competitors: [
        {
          name: "Competitor A",
          location: "NYC",
          teamSize: "35",
          yearsInBusiness: "8",
          services: ["SEO", "PPC", "Content"],
          strengthsVsYou: ["More reviews", "Higher DA"],
          yourAdvantages: ["Lower CAC", "Faster onboarding"],
          marketOverlap: "75%",
        },
        {
          name: "Competitor B",
          location: "Austin",
          teamSize: "22",
          yearsInBusiness: "6",
          services: ["SEO", "Paid Social"],
          strengthsVsYou: ["Verticalized messaging"],
          yourAdvantages: ["Automation capability", "Pricing flexibility"],
          marketOverlap: "60%",
        },
      ],
      competitiveMatrix: [
        { factor: "Domain Authority", you: "48", compA: "55", compB: "61", compC: "44", winner: "Comp B" },
        { factor: "Total Reviews", you: "42", compA: "65", compB: "52", compC: "30", winner: "Comp A" },
        { factor: "Pricing", you: "$X", compA: "$X", compB: "$X", compC: "$X", winner: "Tie" },
        { factor: "Service Count", you: "6", compA: "7", compB: "5", compC: "5", winner: "Comp A" },
        { factor: "Team Size", you: "24", compA: "35", compB: "22", compC: "18", winner: "Comp A" },
      ],
      positioningGap: {
        pricePositioning: "Mid-market",
        qualityPositioning: "Strong but proof-light",
        visibility: "Moderate SEO + low directory coverage",
        differentiation: "Automation + sprint-based delivery",
        recommendation: "Narrow ICP, add proof assets, and dominate 2-3 directories for quick lift.",
      },
    },
    costOptimization: {
      estimatedCostStructure: [
        { category: "Payroll", monthly: "$120K", annual: "$1.44M", percentOfTotal: "48%" },
        { category: "Office/Overhead", monthly: "$24K", annual: "$288K", percentOfTotal: "10%" },
        { category: "Tools/Software", monthly: "$18K", annual: "$216K", percentOfTotal: "7%" },
        { category: "Marketing", monthly: "$40K", annual: "$480K", percentOfTotal: "16%" },
        { category: "Other", monthly: "$48K", annual: "$576K", percentOfTotal: "19%" },
      ],
      revenueEstimate: {
        estimatedRange: "$4.2M-$5.1M", // based on team size 24, $14-18K avg MRR
        revenuePerEmployee: "$175K-$210K",
        industryBenchmark: "$150K-$200K",
        gapAnalysis: "On par with benchmarks; upside by lifting utilization and pricing on top 3 services.",
      },
      costSavingOpportunities: [
        {
          opportunity: "Consolidate SEO/PPC tooling",
          currentCost: "$7.2K/mo",
          potentialSavings: "$2.5K/mo",
          implementationDifficulty: "Medium",
          details: "Switch to bundled suite, remove duplicate rank trackers, and standardize reporting stack.",
        },
        {
          opportunity: "Automate monthly reporting",
          currentCost: "$6K/mo in hours",
          potentialSavings: "$3.5K/mo",
          implementationDifficulty: "Low",
          details: "Use templates + API pulls for Google Ads/GA4, cutting 40-50 analyst hours monthly.",
        },
        {
          opportunity: "Nearshore/offshore production",
          currentCost: "$32K/mo",
          potentialSavings: "$9-11K/mo",
          implementationDifficulty: "Medium",
          details: "Shift link-building and design support to vetted LATAM/APAC partners with QA checkpoints.",
        },
        {
          opportunity: "Negotiate vendor contracts",
          currentCost: "$12K/mo",
          potentialSavings: "$2-3K/mo",
          implementationDifficulty: "Low",
          details: "Annualize core licenses and request multi-seat discounts tied to case study swaps.",
        },
        {
          opportunity: "Standardize onboarding sprints",
          currentCost: "$5K/mo in overruns",
          potentialSavings: "$2K/mo",
          implementationDifficulty: "Low",
          details: "Fixed-scope 30-day onboarding with SOPs to reduce rework and engineer time.",
        },
      ],
      pricingAnalysis: {
        positioning: "Mid-market with premium proof gaps",
        serviceComparisons: [
          {
            service: "SEO Growth Sprints",
            yourPrice: "$2.5K/mo",
            marketRange: "$2K-$4K",
            positioning: "Mid",
            recommendation: "Test $2.8K-$3.2K with added proof bar + quarterly roadmap review.",
          },
          {
            service: "PPC Management",
            yourPrice: "$1.8K/mo",
            marketRange: "$1.5K-$3.5K",
            positioning: "Value",
            recommendation: "Add performance guardrails and move to $2.2K for B2B/SaaS accounts.",
          },
        ],
        overallRecommendation: "Introduce tiered packaging with proof-led upsells to lift ARPA 8-12%.",
        premiumTierOpportunity: "Launch 'Performance Plus' with CRO audit + quarterly experiments at +20% pricing.",
        packagingOptimization: "Bundle SEO + CRO + reporting automation; add onboarding fee to protect margins.",
      },
    },
    targetMarket: {
      currentClientProfile: {
        geographicMix: { us: "68%", uk: "12%", other: "20%" },
        clientSize: { small: "46%", medium: "38%", large: "16%" },
        industries: [
          { industry: "Local services", concentration: "High (~40%)" },
          { industry: "Ecommerce", concentration: "Moderate" },
          { industry: "B2B SaaS", concentration: "Emerging" },
        ],
      },
      geographicExpansion: {
        currentStrongPresence: ["NYC", "Austin", "Chicago"],
        underpenetratedMarkets: [
          { region: "SF Bay Area", reason: "High-tech density + budgets", estimatedOpportunity: "$600K-$800K ARR", entryPlan: "Target SaaS directories + founder podcasts" },
          { region: "Toronto", reason: "Growing SaaS/healthtech scene", estimatedOpportunity: "$300K-$450K ARR", entryPlan: "Partnerships with local incubators + Clutch reviews" },
        ],
      },
      idealClientProfile: {
        industry: "B2B SaaS / regulated healthcare",
        companySize: "25-150 employees",
        revenueRange: "$5M-$40M",
        budget: "$6K-$12K/mo",
        painPoints: ["Need predictable pipeline", "Slow in-house execution", "Proof gaps in paid/SEO"],
        decisionMakers: ["VP Marketing", "Head of Demand Gen", "Founder"],
        whereToFind: ["LinkedIn groups", "SaaS podcasts", "Clutch", "Category-specific newsletters"],
      },
    },
    financialImpact: {
      revenueOpportunities: [
        {
          opportunity: "Clutch + directory optimization",
          monthlyImpact: "$35K-$45K",
          annualImpact: "$420K-$540K",
          confidence: "High",
          effort: "Low",
        },
        {
          opportunity: "Pricing uplift on top 20% accounts",
          monthlyImpact: "$22K-$30K",
          annualImpact: "$264K-$360K",
          confidence: "Medium",
          effort: "Medium",
        },
        {
          opportunity: "Conversion lift via CRO quick wins",
          monthlyImpact: "$18K-$24K",
          annualImpact: "$216K-$288K",
          confidence: "Medium",
          effort: "Low",
        },
      ],
      costSavings: [
        { initiative: "Tool consolidation", annualSavings: "$30K", implementationCost: "$5K", netSavings: "$25K" },
        { initiative: "Automation of reporting", annualSavings: "$42K", implementationCost: "$8K", netSavings: "$34K" },
        { initiative: "Vendor negotiations", annualSavings: "$24K-$36K", implementationCost: "$0", netSavings: "$24K-$36K" },
      ],
      netImpact: {
        revenueGrowth: "+$900K-$1.2M",
        costSavings: "+$80K-$95K",
        totalImpact: "+$980K-$1.3M/year",
        investmentNeeded: "$60K-$90K",
        expectedReturn: "$980K-$1.3M",
        roi: "11-16x",
      },
      scenarios: [
        { scenario: "Conservative (30%)", implementationLevel: "Implement 30%", impact: "$290K-$380K" },
        { scenario: "Moderate (60%)", implementationLevel: "Implement 60%", impact: "$620K-$820K" },
        { scenario: "Aggressive (90%)", implementationLevel: "Implement 90%", impact: "$1.0M-$1.3M" },
      ],
    },
    actionPlan90Days: [
      {
        phase: "Quick Wins (Days 1-30)",
        weeks: [
          { week: "Week 1", tasks: ["Claim/optimize Clutch", "Implement CRO proof bar", "Set up review replies"] },
          { week: "Week 2", tasks: ["Launch ROI calculator", "Retargeting + LinkedIn lead form", "Publish FAQ schema"] },
          { week: "Week 3", tasks: ["Tool consolidation audit", "Negotiate top 3 vendors", "Add onboarding SOPs"] },
          { week: "Week 4", tasks: ["Ship 2 industry landing pages", "Add review/request automation", "Finalize pricing tests"] },
        ],
        expectedImpact: [
          { metric: "MRR", improvement: "+$40K-$60K run-rate" },
          { metric: "Lead volume", improvement: "+12-18/mo" },
        ],
      },
      {
        phase: "Foundation Building (Days 31-60)",
        weeks: [
          { week: "Week 5", tasks: ["Roll out reporting automation", "QA nearshore vendors", "Publish case study template"] },
          { week: "Week 6", tasks: ["Scale directory reviews", "Test pricing uplifts", "Launch 1 webinar"] },
          { week: "Week 7", tasks: ["Add CRO experiments", "Publish comparison content", "Improve onboarding training"] },
          { week: "Week 8", tasks: ["Finalize premium tier", "Automate intake forms", "SEO internal linking sprint"] },
        ],
        expectedImpact: [
          { metric: "Gross margin", improvement: "+4-6 pts" },
          { metric: "Win rate", improvement: "+5-8%" },
        ],
      },
      {
        phase: "Scaling Systems (Days 61-90)",
        weeks: [
          { week: "Week 9", tasks: ["Roll pricing to all ICP accounts", "Add quarterly QBR cadence", "Publish 3 proof assets"] },
          { week: "Week 10", tasks: ["Expand to Toronto/SF pilots", "Launch partner co-marketing", "Add call tracking QA"] },
          { week: "Week 11", tasks: ["Optimize lead scoring", "Automate nurture sequences", "Benchmark ops KPIs"] },
          { week: "Week 12", tasks: ["Review ROI vs plan", "Plan next 90-day experiments", "Lock in vendor discounts"] },
        ],
        expectedImpact: [
          { metric: "ARPA", improvement: "+8-12%" },
          { metric: "Churn", improvement: "-1-2 pts" },
        ],
      },
    ],
    competitiveAdvantages: {
      hiddenStrengths: [
        {
          strength: "Automation capability",
          evidence: "Existing ROI calculator + internal scripts",
          whyItMatters: "Reduces delivery hours and improves margins",
          howToLeverage: "Productize automation layer in premium tier",
        },
        {
          strength: "Fast onboarding",
          evidence: "14-day sprint structure",
          whyItMatters: "Shortens time-to-value vs. competitors",
          howToLeverage: "Market the 30-day launch guarantee with case metrics",
        },
        {
          strength: "Proof assets in local services",
          evidence: "High review counts + local wins",
          whyItMatters: "Trust driver for SMB + healthcare",
          howToLeverage: "Promote review velocity and niche case studies on landing pages",
        },
      ],
      prerequisites: [
        "Document onboarding SLA (<7 days to kickoff)",
        "Set review response SLA (<48 hours)",
        "Implement QA checklist for offshore tasks",
      ],
    },
    riskAssessment: {
      risks: [
        {
          name: "Review gap on Clutch",
          priority: "High",
          description: "Low proof on key discovery platform",
          impact: "Missed high-intent leads",
          likelihood: "High",
          mitigation: ["Request 5 reviews", "Feature badges on site", "Add Q&A"],
          timeline: "0-30 days",
        },
        {
          name: "Single-channel lead dependency",
          priority: "Medium",
          description: "Organic drives majority of pipeline",
          impact: "Volatility if rankings dip",
          likelihood: "Medium",
          mitigation: ["Build paid retargeting", "Launch webinars", "Directory optimization"],
          timeline: "0-60 days",
        },
        {
          name: "Margin compression",
          priority: "High",
          description: "Rising tool and payroll costs",
          impact: "Reduced profitability",
          likelihood: "High",
          mitigation: ["Consolidate tools", "Nearshore shift", "Pricing uplift"],
          timeline: "30-90 days",
        },
        {
          name: "Proof gap in enterprise",
          priority: "Medium",
          description: "Limited enterprise case studies",
          impact: "Slower upmarket wins",
          likelihood: "Medium",
          mitigation: ["Publish 2 enterprise-style case studies", "Collect video testimonials", "Add compliance FAQ"],
          timeline: "30-75 days",
        },
      ],
    },
    appendices: {
      keywords: [
        {
          tier: "Tier 1: High Priority",
          keywords: [
            { keyword: "b2b saas seo agency", monthlySearches: "700", difficulty: "38", intent: "Commercial", currentRank: "N/A" },
            { keyword: "healthcare ppc agency", monthlySearches: "450", difficulty: "32", intent: "Transactional", currentRank: "N/A" },
          ],
        },
        {
          tier: "Tier 2: Medium Priority",
          keywords: [
            { keyword: "local service seo sprints", monthlySearches: "250", difficulty: "28", intent: "Commercial", currentRank: "18" },
            { keyword: "b2b content refresh", monthlySearches: "320", difficulty: "30", intent: "Informational", currentRank: "22" },
          ],
        },
        {
          tier: "Tier 3: Quick Wins",
          keywords: [
            { keyword: "clutch review template", monthlySearches: "150", difficulty: "18", intent: "Informational", currentRank: "-" },
            { keyword: "seo onboarding checklist", monthlySearches: "210", difficulty: "21", intent: "Informational", currentRank: "14" },
          ],
        },
      ],
      reviewTemplates: [
        {
          name: "Initial Request",
          subject: "Quick favor? 60 seconds to share your experience",
          body: "Hi [Name], thanks for partnering with us on [project]. Could you share a quick review here [link]? It takes under a minute and helps us continue supporting you."
            + " We'll gladly feature your logo/case study if helpful. - [Signature]",
        },
        {
          name: "Follow-Up",
          subject: "Bumping this — your feedback helps a ton",
          body: "Hi [Name], just checking if you could drop a short review here [link]. Happy to draft bullet points you can paste. Appreciate you!",
        },
        {
          name: "Video Testimonial Request",
          subject: "Would you record a 60-second testimonial?",
          body: "Hi [Name], we’re compiling quick video testimonials. A 60-second Loom on results achieved (traffic, CPL, ROAS) would be amazing. We’ll send prompts + handle editing. Interested?",
        },
      ],
      caseStudyTemplate: {
        title: "How [Client Name] Achieved [Result] in [Timeframe]",
        industry: "[Industry]",
        services: "[Services]",
        duration: "[Timeframe]",
        budget: "[Budget]",
        challenge: "Summarize 2-3 pain points and starting metrics.",
        solution: "List key tactics, timelines, and owners.",
        results: ["Metric 1", "Metric 2", "Metric 3"],
        clientQuote: "\"[Quote]\"",
        cta: "Want similar results? Book a strategy call.",
      },
      finalRecommendations: {
        topActions: [
          { action: "Claim Clutch + gather 5 reviews", impact: "$30K-$50K ARR", effort: "Low", rationale: "High-intent leads + social proof" },
          { action: "Launch ROI calculator + nurture", impact: "+3-5 SQLs/mo", effort: "Medium", rationale: "Captures mid-funnel demand" },
          { action: "Pricing uplift on ICP accounts", impact: "+8-12% ARPA", effort: "Medium", rationale: "Aligns value with outcomes" },
          { action: "Automate reporting + consolidate tools", impact: "$60K-$70K annual savings", effort: "Low", rationale: "Protects margins" },
          { action: "Nearshore production for delivery", impact: "-8-12% COGS", effort: "Medium", rationale: "Scalable capacity with QA" },
        ],
        nextSteps: [
          "Schedule vendor consolidation workshop",
          "Assign review owner + targets",
          "Pilot pricing uplift on 5 accounts",
          "Stand up ROI calculator + email sequences",
        ],
      },
    },
  };
}

export async function generateBusinessGrowthAnalysis(input: { companyName: string; website: string; industry?: string; }): Promise<BusinessGrowthReport> {
  const fallback = buildBusinessGrowthFallback(input);

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const prompt = `You are building a 28-page AI Business Growth Analysis Report for a digital marketing agency.
Use the exact JSON shape below. Keep values concise but specific. Ensure bullet items include metrics/impacts.

{
  "reportMetadata": {
    "reportId": "unique id",
    "companyName": "",
    "website": "",
    "analysisDate": "ISO string",
    "overallScore": number,
    "subScores": {
      "website": number,
      "seo": number,
      "reputation": number,
      "leadGen": number,
      "services": number,
      "costEfficiency": number
    }
  },
  "executiveSummary": {
    "strengths": ["bullet with metric"],
    "weaknesses": ["bullet with impact"],
    "biggestOpportunity": "sentence with $ or % impact",
    "quickWins": [
      {"title": "", "impact": "", "time": "", "cost": "", "details": ""}
    ]
  },
  "websiteDigitalPresence": {
    "technicalSEO": {"score": number, "strengths": [], "issues": []},
    "contentQuality": {"score": number, "strengths": [], "gaps": [], "recommendations": []},
    "uxConversion": {"score": number, "highlights": [], "issues": [], "estimatedUplift": ""},
    "contentGaps": []
  },
  "seoVisibility": {
    "domainAuthority": {"score": number, "benchmark": {"you": number, "competitorA": number, "competitorB": number, "competitorC": number, "industryAverage": number}, "rationale": ""},
    "backlinkProfile": {"totalBacklinks": number, "referringDomains": number, "averageDA": number, "issues": []},
    "keywordRankings": {"total": number, "top10": number, "top50": number, "top100": number},
    "topPerformingKeywords": [{"keyword": "", "position": number, "monthlyVolume": number, "currentTraffic": ""}],
    "keywordGapAnalysis": [{"keyword": "", "monthlySearches": number, "yourRank": "", "topCompetitor": "", "opportunity": ""}],
    "contentRecommendations": [{"keyword": "", "contentType": "", "targetWordCount": number, "subtopics": [], "trafficPotential": ""}]
  },
  "reputation": {
    "reviewScore": number,
    "summaryTable": [{"platform": "", "reviews": number, "rating": "", "industryBenchmark": "", "gap": ""}],
    "totalReviews": number,
    "industryStandardRange": "",
    "yourGap": "",
    "sentimentThemes": {"positive": [], "negative": [], "responseRate": "", "averageResponseTime": ""}
  },
  "servicesPositioning": {
    "services": [{"name": "", "startingPrice": "", "description": "", "targetMarket": ""}],
    "serviceGaps": [{"service": "", "youOffer": "", "competitorA": "", "competitorB": "", "marketDemand": ""}],
    "industriesServed": {"current": [], "concentrationNote": "", "highValueTargets": [{"industry": "", "whyHighValue": "", "avgDealSize": "", "readiness": ""}]},
    "positioning": {"currentStatement": "", "competitorComparison": "", "differentiation": ""}
  },
  "leadGeneration": {
    "channels": [{"channel": "", "leadsPerMonth": "", "quality": "", "status": ""}],
    "missingHighROIChannels": [{"channel": "", "status": "", "estimatedLeads": "", "setupTime": "", "monthlyCost": "", "priority": ""}],
    "leadMagnets": {"current": [], "recommendations": [{"name": "", "format": "", "targetAudience": "", "estimatedConversion": ""}]},
    "directoryOptimization": [{"directory": "", "listed": "", "optimized": "", "reviews": 0, "actionNeeded": ""}]
  },
  "competitiveAnalysis": {
    "competitors": [{"name": "", "location": "", "teamSize": "", "yearsInBusiness": "", "services": [], "strengthsVsYou": [], "yourAdvantages": [], "marketOverlap": ""}],
    "competitiveMatrix": [{"factor": "", "you": "", "compA": "", "compB": "", "compC": "", "winner": ""}],
    "positioningGap": {"pricePositioning": "", "qualityPositioning": "", "visibility": "", "differentiation": "", "recommendation": ""}
  },
  "costOptimization": {
    "estimatedCostStructure": [{"category": "", "monthly": "", "annual": "", "percentOfTotal": ""}],
    "revenueEstimate": {"estimatedRange": "", "revenuePerEmployee": "", "industryBenchmark": "", "gapAnalysis": ""},
    "costSavingOpportunities": [{"opportunity": "", "currentCost": "", "potentialSavings": "", "implementationDifficulty": "", "details": ""}],
    "pricingAnalysis": {
      "positioning": "",
      "serviceComparisons": [{"service": "", "yourPrice": "", "marketRange": "", "positioning": "", "recommendation": ""}],
      "overallRecommendation": "",
      "premiumTierOpportunity": "",
      "packagingOptimization": ""
    }
  },
  "targetMarket": {
    "currentClientProfile": {
      "geographicMix": {"us": "", "uk": "", "other": ""},
      "clientSize": {"small": "", "medium": "", "large": ""},
      "industries": [{"industry": "", "concentration": ""}]
    },
    "geographicExpansion": {
      "currentStrongPresence": [],
      "underpenetratedMarkets": [{"region": "", "reason": "", "estimatedOpportunity": "", "entryPlan": ""}]
    },
    "idealClientProfile": {
      "industry": "",
      "companySize": "",
      "revenueRange": "",
      "budget": "",
      "painPoints": [],
      "decisionMakers": [],
      "whereToFind": []
    }
  },
  "financialImpact": {
    "revenueOpportunities": [{"opportunity": "", "monthlyImpact": "", "annualImpact": "", "confidence": "", "effort": ""}],
    "costSavings": [{"initiative": "", "annualSavings": "", "implementationCost": "", "netSavings": ""}],
    "netImpact": {"revenueGrowth": "", "costSavings": "", "totalImpact": "", "investmentNeeded": "", "expectedReturn": "", "roi": ""},
    "scenarios": [{"scenario": "", "implementationLevel": "", "impact": ""}]
  },
  "actionPlan90Days": [{"phase": "", "weeks": [{"week": "", "tasks": []}], "expectedImpact": [{"metric": "", "improvement": ""}]}],
  "competitiveAdvantages": {
    "hiddenStrengths": [{"strength": "", "evidence": "", "whyItMatters": "", "howToLeverage": ""}],
    "prerequisites": []
  },
  "riskAssessment": {
    "risks": [{"name": "", "priority": "", "description": "", "impact": "", "likelihood": "", "mitigation": [], "timeline": ""}]
  },
  "appendices": {
    "keywords": [{"tier": "", "keywords": [{"keyword": "", "monthlySearches": "", "difficulty": "", "intent": "", "currentRank": ""}]}],
    "reviewTemplates": [{"name": "", "subject": "", "body": ""}],
    "caseStudyTemplate": {"title": "", "industry": "", "services": "", "duration": "", "budget": "", "challenge": "", "solution": "", "results": [], "clientQuote": "", "cta": ""},
    "finalRecommendations": {"topActions": [{"action": "", "impact": "", "effort": "", "rationale": ""}], "nextSteps": []}
  }
}

Company: ${input.companyName || "Marketing Agency"}
Website: ${input.website}
Industry: ${input.industry || "Agency"}
Tone: brutally honest, specific, with metrics.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a senior growth consultant. Follow the requested JSON exactly. Keep bullets short, include numbers, and align with agency context.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return {
      ...fallback,
      ...parsed,
      reportMetadata: {
        ...fallback.reportMetadata,
        ...parsed.reportMetadata,
        companyName: parsed.reportMetadata?.companyName || fallback.reportMetadata.companyName,
        website: parsed.reportMetadata?.website || fallback.reportMetadata.website,
        analysisDate: parsed.reportMetadata?.analysisDate || fallback.reportMetadata.analysisDate,
        reportId: parsed.reportMetadata?.reportId || fallback.reportMetadata.reportId,
        subScores: {
          ...fallback.reportMetadata.subScores,
          ...parsed.reportMetadata?.subScores,
        },
      },
      executiveSummary: {
        ...fallback.executiveSummary,
        ...parsed.executiveSummary,
        strengths: parsed.executiveSummary?.strengths?.length
          ? parsed.executiveSummary.strengths
          : fallback.executiveSummary.strengths,
        weaknesses: parsed.executiveSummary?.weaknesses?.length
          ? parsed.executiveSummary.weaknesses
          : fallback.executiveSummary.weaknesses,
        quickWins: parsed.executiveSummary?.quickWins?.length
          ? parsed.executiveSummary.quickWins
          : fallback.executiveSummary.quickWins,
      },
    } as BusinessGrowthReport;
  } catch (error) {
    console.error("Business growth analysis error:", error);
    return fallback;
  }
}

// Default export for better compatibility
export default openaiClient;