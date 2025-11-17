import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Users, Target, Zap, Building, TrendingUp, Globe } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/header';
import { CustomQuoteModal } from '@/components/custom-quote-modal';

interface WizardStep {
  id: string;
  title: string;
  question: string;
  options: {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    value: string;
  }[];
}

interface ServiceRecommendation {
  service: string;
  confidence: number;
  reasons: string[];
  nextSteps: string[];
  pricing: string;
  timeline: string;
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<ServiceRecommendation | null>(null);

  const steps: WizardStep[] = [
    {
      id: 'business-type',
      title: 'Business Type',
      question: 'What type of business are you?',
      options: [
        {
          id: 'agency',
          label: 'Digital Marketing Agency',
          description: 'You provide marketing services to other businesses',
          icon: <Building className="w-6 h-6" />,
          value: 'agency'
        },
        {
          id: 'startup',
          label: 'Startup/Small Business',
          description: 'You need services to grow your own business',
          icon: <Zap className="w-6 h-6" />,
          value: 'startup'
        },
        {
          id: 'enterprise',
          label: 'Enterprise Company',
          description: 'Large company needing specialized teams',
          icon: <Globe className="w-6 h-6" />,
          value: 'enterprise'
        },
        {
          id: 'freelancer',
          label: 'Freelancer/Consultant',
          description: 'Individual professional needing support',
          icon: <Users className="w-6 h-6" />,
          value: 'freelancer'
        }
      ]
    },
    {
      id: 'primary-goal',
      title: 'Primary Goal',
      question: 'What is your main objective?',
      options: [
        {
          id: 'scale-team',
          label: 'Scale My Team',
          description: 'Add skilled professionals to handle more work',
          icon: <Users className="w-6 h-6" />,
          value: 'scale-team'
        },
        {
          id: 'improve-results',
          label: 'Improve Results',
          description: 'Get better outcomes from existing efforts',
          icon: <TrendingUp className="w-6 h-6" />,
          value: 'improve-results'
        },
        {
          id: 'launch-services',
          label: 'Launch New Services',
          description: 'Add new service offerings to my business',
          icon: <Target className="w-6 h-6" />,
          value: 'launch-services'
        },
        {
          id: 'reduce-costs',
          label: 'Reduce Costs',
          description: 'Get same quality work at lower costs',
          icon: <Zap className="w-6 h-6" />,
          value: 'reduce-costs'
        },
        {
          id: 'automate-processes',
          label: 'Automate Processes',
          description: 'Use AI and automation to streamline workflows',
          icon: <Target className="w-6 h-6" />,
          value: 'automate-processes'
        }
      ]
    },
    {
      id: 'current-challenges',
      title: 'Current Challenges',
      question: 'What is your biggest challenge right now?',
      options: [
        {
          id: 'finding-talent',
          label: 'Finding Skilled Talent',
          description: 'Hard to find qualified professionals',
          icon: <Users className="w-6 h-6" />,
          value: 'finding-talent'
        },
        {
          id: 'high-costs',
          label: 'High Operational Costs',
          description: 'Current solutions are too expensive',
          icon: <TrendingUp className="w-6 h-6" />,
          value: 'high-costs'
        },
        {
          id: 'inconsistent-quality',
          label: 'Inconsistent Quality',
          description: 'Results vary too much between projects',
          icon: <Target className="w-6 h-6" />,
          value: 'inconsistent-quality'
        },
        {
          id: 'capacity-limits',
          label: 'Capacity Limitations',
          description: 'Cannot take on more projects',
          icon: <Zap className="w-6 h-6" />,
          value: 'capacity-limits'
        }
      ]
    },
    {
      id: 'service-priority',
      title: 'Service Priority',
      question: 'Which service do you need most urgently?',
      options: [
        {
          id: 'web-development',
          label: 'Web Development',
          description: 'Websites, apps, and technical projects',
          icon: <Globe className="w-6 h-6" />,
          value: 'web-development'
        },
        {
          id: 'design-services',
          label: 'Design Services',
          description: 'Graphics, branding, and visual content',
          icon: <Target className="w-6 h-6" />,
          value: 'design-services'
        },
        {
          id: 'marketing-services',
          label: 'Digital Marketing',
          description: 'SEO, ads, and online promotion',
          icon: <TrendingUp className="w-6 h-6" />,
          value: 'marketing-services'
        },
        {
          id: 'dedicated-team',
          label: 'Dedicated Team',
          description: 'Full-time professionals for ongoing work',
          icon: <Users className="w-6 h-6" />,
          value: 'dedicated-team'
        },
        {
          id: 'ai-automation',
          label: 'AI Development',
          description: 'AI agents, chatbots, and process automation',
          icon: <Zap className="w-6 h-6" />,
          value: 'ai-automation'
        }
      ]
    },
    {
      id: 'budget-range',
      title: 'Budget Range',
      question: 'What is your monthly budget range?',
      options: [
        {
          id: 'under-1k',
          label: 'Under $1,000',
          description: 'Small projects or single services',
          icon: <Zap className="w-6 h-6" />,
          value: 'under-1k'
        },
        {
          id: '1k-5k',
          label: '$1,000 - $5,000',
          description: 'Multiple services or small team',
          icon: <Users className="w-6 h-6" />,
          value: '1k-5k'
        },
        {
          id: '5k-15k',
          label: '$5,000 - $15,000',
          description: 'Comprehensive services or medium team',
          icon: <TrendingUp className="w-6 h-6" />,
          value: '5k-15k'
        },
        {
          id: 'over-15k',
          label: '$15,000+',
          description: 'Enterprise solutions or large team',
          icon: <Building className="w-6 h-6" />,
          value: 'over-15k'
        }
      ]
    }
  ];

  const generateRecommendations = () => {
    const businessType = answers['business-type'];
    const primaryGoal = answers['primary-goal'];
    const challenge = answers['current-challenges'];
    const servicePriority = answers['service-priority'];
    const budget = answers['budget-range'];

    const recs: ServiceRecommendation[] = [];

    // First, ALWAYS generate the user's selected service with high priority
    if (servicePriority) {
      switch (servicePriority) {
        case 'web-development':
          recs.push({
            service: 'Web Development',
            confidence: 95,
            reasons: ['You selected this as your priority service', 'Professional websites drive business growth'],
            nextSteps: [
              'Define your website requirements',
              'Choose between WordPress or custom development',
              'Plan your content and design preferences'
            ],
            pricing: budget === 'under-1k' ? '$600-1,200 for starter websites' : 
                     budget === 'over-15k' ? '$8,000+ for enterprise solutions' : 
                     '$1,500-8,000 per project',
            timeline: '2-8 weeks depending on complexity'
          });
          break;
        case 'design-services':
          recs.push({
            service: 'Design Services',
            confidence: 95,
            reasons: ['You selected this as your priority service', 'Professional design elevates your brand'],
            nextSteps: [
              'Define your design requirements',
              'Choose between branding, graphics, or UI/UX design',
              'Review portfolios and select design direction'
            ],
            pricing: budget === 'under-1k' ? '$300-800 for basic design packages' : 
                     budget === 'over-15k' ? '$3,000+ for comprehensive branding' : 
                     '$800-3,000 per project',
            timeline: '1-4 weeks depending on scope'
          });
          break;
        case 'marketing-services':
          recs.push({
            service: 'SEO Services',
            confidence: 95,
            reasons: ['You selected this as your priority service', 'Digital marketing is crucial for growth'],
            nextSteps: [
              'Get a free SEO audit of your website',
              'Choose between Local, Growth, or Pro SEO',
              'See results in 3-6 months'
            ],
            pricing: budget === 'under-1k' ? '$400-650/month' : 
                     budget === 'over-15k' ? '$1,200+/month with advanced strategies' : 
                     '$400-1,200/month',
            timeline: '2-3 weeks to start, 3-6 months for results'
          });
          break;
        case 'dedicated-team':
          recs.push({
            service: 'Dedicated Resources',
            confidence: 95,
            reasons: ['You selected this as your priority service', 'You need to scale your team capabilities'],
            nextSteps: [
              'Use our team builder to select professionals',
              'Choose skill levels that match your needs',
              'Start with a small team and scale up'
            ],
            pricing: budget === 'under-1k' ? '$700-900/month' : 
                     budget === 'over-15k' ? '$15,000+/month' : 
                     '$1,000-15,000/month',
            timeline: '1-2 weeks to start'
          });
          break;
        case 'ai-automation':
          recs.push({
            service: 'AI Development',
            confidence: 95,
            reasons: ['You selected this as your priority service', 'AI and automation can dramatically improve efficiency'],
            nextSteps: [
              'Identify processes that can be automated',
              'Choose between AI agents, chatbots, or workflow automation',
              'Start with a pilot project to test results'
            ],
            pricing: budget === 'under-1k' ? '$1,000-2,500 for simple AI integrations' : 
                     budget === 'over-15k' ? '$12,000+ for complex AI systems' : 
                     '$2,000-12,000 per project',
            timeline: budget === 'under-1k' ? '1-3 weeks for basic automation' :
                      budget === 'over-15k' ? '6-12 weeks for enterprise solutions' : 
                      '2-6 weeks for implementation'
          });
          break;
      }
    }

    // Dedicated Resources Logic (skip if already added as priority)
    if ((primaryGoal === 'scale-team' || challenge === 'finding-talent' || servicePriority === 'dedicated-team') && servicePriority !== 'dedicated-team') {
      let confidence = 90;
      const reasons = ['You need to scale your team capabilities'];
      
      if (challenge === 'finding-talent') {
        reasons.push('Difficulty finding skilled professionals');
        confidence += 5;
      }
      
      if (businessType === 'agency') {
        reasons.push('Agencies benefit most from dedicated teams');
        confidence += 5;
      }

      let pricing = '$1,000-15,000/month';
      let timeline = '1-2 weeks to start';
      
      if (budget === 'under-1k') {
        pricing = '$700-900/month';
        reasons.push('Budget-friendly virtual assistant or data entry options');
      } else if (budget === 'over-15k') {
        pricing = '$15,000+/month';
        reasons.push('Premium senior-level team members available');
      }

      recs.push({
        service: 'Dedicated Resources',
        confidence: Math.min(confidence, 100),
        reasons,
        nextSteps: [
          'Use our team builder to select professionals',
          'Choose skill levels that match your needs',
          'Start with a small team and scale up'
        ],
        pricing,
        timeline
      });
    }

    // SEO Services Logic (skip if already added as priority)
    if ((servicePriority === 'marketing-services' || primaryGoal === 'improve-results') && servicePriority !== 'marketing-services') {
      let confidence = 85;
      const reasons = ['Digital marketing is crucial for growth'];
      
      if (businessType === 'startup') {
        reasons.push('Startups need strong online presence');
        confidence += 10;
      }
      
      if (challenge === 'inconsistent-quality') {
        reasons.push('Professional SEO delivers consistent results');
        confidence += 5;
      }

      let pricing = '$400-1,200/month';
      if (budget === 'under-1k') {
        pricing = '$400-650/month';
      } else if (budget === 'over-15k') {
        pricing = '$1,200+/month with advanced strategies';
      }

      recs.push({
        service: 'SEO Services',
        confidence: Math.min(confidence, 100),
        reasons,
        nextSteps: [
          'Get a free SEO audit of your website',
          'Choose between Local, Growth, or Pro SEO',
          'See results in 3-6 months'
        ],
        pricing,
        timeline: '2-3 weeks to start, 3-6 months for results'
      });
    }

    // Web Development Logic (skip if already added as priority)
    if ((servicePriority === 'web-development' || primaryGoal === 'launch-services') && servicePriority !== 'web-development') {
      let confidence = 80;
      const reasons = ['Professional websites drive business growth'];
      
      if (businessType === 'startup') {
        reasons.push('Startups need professional online presence');
        confidence += 10;
      }
      
      if (challenge === 'capacity-limits') {
        reasons.push('Outsourcing development frees up your time');
        confidence += 5;
      }

      let pricing = '$1,500-8,000 per project';
      if (budget === 'under-1k') {
        pricing = '$600-1,200 for starter websites';
      } else if (budget === 'over-15k') {
        pricing = '$8,000+ for enterprise solutions';
      }

      recs.push({
        service: 'Web Development',
        confidence: Math.min(confidence, 100),
        reasons,
        nextSteps: [
          'Define your website requirements',
          'Choose between WordPress or custom development',
          'Plan your content and design preferences'
        ],
        pricing,
        timeline: '2-8 weeks depending on complexity'
      });
    }

    // Google Ads Logic
    if ((servicePriority === 'marketing-services' && budget !== 'under-1k') || primaryGoal === 'improve-results') {
      let confidence = 75;
      const reasons = ['Paid advertising delivers fast results'];
      
      if (businessType === 'enterprise') {
        reasons.push('Enterprise companies benefit from professional ad management');
        confidence += 10;
      }
      
      if (challenge === 'high-costs') {
        reasons.push('Professional management reduces ad waste');
        confidence += 10;
      }

      let pricing = '$399-1,299/month + ad spend';
      if (budget === '1k-5k') {
        pricing = '$399-799/month + ad spend';
      } else if (budget === 'over-15k') {
        pricing = '$1,299+/month + higher ad spend';
      }

      recs.push({
        service: 'Google Ads',
        confidence: Math.min(confidence, 100),
        reasons,
        nextSteps: [
          'Analyze your current advertising performance',
          'Set up conversion tracking',
          'Start with a test campaign'
        ],
        pricing,
        timeline: '1 week to launch, 2-4 weeks to optimize'
      });
    }

    // AI Development Logic (skip if already added as priority)
    if ((servicePriority === 'ai-automation' || primaryGoal === 'automate-processes' || challenge === 'capacity-limits') && servicePriority !== 'ai-automation') {
      let confidence = 85;
      const reasons = ['AI and automation can dramatically improve efficiency'];
      
      if (businessType === 'enterprise') {
        reasons.push('Enterprise companies benefit most from AI automation');
        confidence += 10;
      }
      
      if (businessType === 'agency') {
        reasons.push('Agencies can scale services with AI tools');
        confidence += 5;
      }
      
      if (challenge === 'capacity-limits') {
        reasons.push('AI automation frees up team for high-value work');
        confidence += 10;
      }
      
      if (primaryGoal === 'automate-processes') {
        reasons.push('Perfect match for process automation goals');
        confidence += 15;
      }

      let pricing = '$2,000-12,000 per project';
      let timeline = '2-6 weeks for implementation';
      
      if (budget === 'under-1k') {
        pricing = '$1,000-2,500 for simple AI integrations';
        timeline = '1-3 weeks for basic automation';
      } else if (budget === 'over-15k') {
        pricing = '$12,000+ for complex AI systems';
        timeline = '6-12 weeks for enterprise solutions';
        reasons.push('Budget allows for sophisticated AI implementations');
      }

      recs.push({
        service: 'AI Development',
        confidence: Math.min(confidence, 100),
        reasons,
        nextSteps: [
          'Identify processes that can be automated',
          'Choose between AI agents, chatbots, or workflow automation',
          'Start with a pilot project to test results'
        ],
        pricing,
        timeline
      });
    }

    // Create service mapping from user selection to service names
    const servicePriorityMapping: { [key: string]: string } = {
      'web-development': 'Web Development',
      'design-services': 'Design Services', 
      'marketing-services': 'SEO Services',
      'dedicated-team': 'Dedicated Resources',
      'ai-automation': 'AI Development'
    };

    const selectedService = servicePriorityMapping[servicePriority];

    // Sort: User's selected service ALWAYS first, regardless of confidence
    recs.sort((a, b) => {
      // If 'a' is the user's selected service, put it first
      if (selectedService && a.service === selectedService) return -1;
      // If 'b' is the user's selected service, put it first
      if (selectedService && b.service === selectedService) return 1;
      // For all other services, sort by confidence
      return b.confidence - a.confidence;
    });
    
    setRecommendations(recs);
  };

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: value });
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
  };

  const progress = (currentStep / steps.length) * 100;

  if (recommendations.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="py-6 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">Based on your answers, here are the best services for your needs</p>
          </div>

          <div className="space-y-6 px-2 sm:px-0">
            {recommendations.map((rec, index) => (
              <Card key={index} className={`border-2 ${index === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {index === 0 && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />}
                      <span className={`text-lg sm:text-xl ${index === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                        {rec.service}
                      </span>
                      {index === 0 && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          Best Match
                        </span>
                      )}
                    </CardTitle>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-500">Confidence</div>
                      <div className={`text-lg sm:text-xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {rec.confidence}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Why this is perfect for you:</h4>
                    <ul className="space-y-1">
                      {rec.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Pricing</h4>
                      <p className="text-gray-600 text-sm">{rec.pricing}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Timeline</h4>
                      <p className="text-gray-600 text-sm">{rec.timeline}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                    <ol className="space-y-1">
                      {rec.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setSelectedRecommendation(rec);
                        setQuoteModalOpen(true);
                      }}
                      className="w-full bg-gradient-to-r from-brand-coral to-pink-500 hover:from-brand-coral/90 hover:to-pink-500/90 text-sm"
                    >
                      Get Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 space-y-3 sm:space-y-4 px-4">
            <Button onClick={resetWizard} variant="outline" className="w-full sm:w-auto">
              Start Over
            </Button>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Need help deciding? <Link href="/contact" className="text-brand-coral underline">Contact our experts</Link> for a free consultation.
            </p>
          </div>
        </div>
        </div>

        {/* Custom Quote Modal */}
        {selectedRecommendation && (
          <CustomQuoteModal
            isOpen={quoteModalOpen}
            onClose={() => {
              setQuoteModalOpen(false);
              setSelectedRecommendation(null);
            }}
            recommendedService={selectedRecommendation.service}
            confidence={selectedRecommendation.confidence}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      <div className="py-6 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-4">Find Your Perfect Service</h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Answer a few quick questions to get personalized recommendations</p>
        </div>

        <div className="mb-4 sm:mb-6 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs sm:text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-2 border-gray-200 shadow-lg mx-2 sm:mx-0">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl text-gray-900">
              <h2>{steps[currentStep].title}</h2>
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600">
              {steps[currentStep].question}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            {steps[currentStep].options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-brand-coral hover:bg-brand-coral/5 transition-colors text-left"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-brand-coral flex-shrink-0 mt-0.5">
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{option.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 sm:mt-6 px-2 sm:px-0">
          <Button
            onClick={goBack}
            variant="outline"
            disabled={currentStep === 0}
            className="flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Link href="/" className="order-1 sm:order-2">
            <Button variant="outline" className="w-full sm:w-auto">
              Skip Wizard
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}