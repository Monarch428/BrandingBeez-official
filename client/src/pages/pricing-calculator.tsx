import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calculator, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight, Trophy, AlertCircle, Plus, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SEOHead } from '@/components/seo-head';
import { SchemaMarkup } from '@/components/schema-markup';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface PricingResult {
  service: string;
  monthlyPrice: number;
  setupFee: number;
  features: string[];
  teamDiscount?: number;
  savings?: number;
  isProjectBased?: boolean;
}

export default function PricingCalculator() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Contact form modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });
  
  const { toast } = useToast();
  
  // Helper function to extract domain from various URL formats
  const extractDomain = (url: string): string => {
    if (!url) return '';
    
    // Remove common prefixes and clean up the URL
    let cleanUrl = url.trim().toLowerCase();
    
    // Remove protocol if present
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    
    // Remove www. if present
    cleanUrl = cleanUrl.replace(/^www\./, '');
    
    // Remove trailing slash and paths
    cleanUrl = cleanUrl.split('/')[0];
    
    // Remove port numbers if present
    cleanUrl = cleanUrl.split(':')[0];
    
    return cleanUrl;
  };
  
  // Contact form submission mutation
  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Quote Request Submitted!",
        description: "Thank you for your interest. We'll contact you within 24 hours with a detailed proposal.",
        duration: 5000,
      });
      
      // Reset and close modal
      setContactForm({ name: '', email: '', phone: '', website: '' });
      setShowContactModal(false);
      
      // Redirect to Calendly after a brief delay
      setTimeout(() => {
        window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
      }, 1000);
    },
    onError: (error: any) => {
      console.error('Contact form error:', error);
      
      let errorMessage = "Please try again or contact us directly.";
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
  
  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Build comprehensive message with all pricing calculator details
    let comprehensiveMessage = `Pricing Calculator Quote Request for ${selectedService}`;
    
    if (pricing) {
      comprehensiveMessage += `\n\n📋 SERVICE DETAILS:`;
      comprehensiveMessage += `\n• Service: ${pricing.service}`;
      comprehensiveMessage += `\n• Monthly Price: $${pricing.monthlyPrice.toLocaleString()}`;
      if (pricing.setupFee > 0) {
        comprehensiveMessage += `\n• Setup Fee: $${pricing.setupFee.toLocaleString()}`;
      }
      if (pricing.teamDiscount) {
        comprehensiveMessage += `\n• Team Discount: ${pricing.teamDiscount}%`;
      }
      if (pricing.savings) {
        comprehensiveMessage += `\n• Annual Savings: $${pricing.savings.toLocaleString()}`;
      }
      
      if (pricing.features && pricing.features.length > 0) {
        comprehensiveMessage += `\n\n✨ INCLUDED FEATURES:`;
        pricing.features.forEach(feature => {
          comprehensiveMessage += `\n• ${feature}`;
        });
      }
    }
    
    // Add dedicated team selections if any
    if (Object.keys(selectedTeam).length > 0) {
      comprehensiveMessage += `\n\n👥 DEDICATED TEAM SELECTED:`;
      Object.entries(selectedTeam).forEach(([resource, levels]) => {
        Object.entries(levels).forEach(([level, count]) => {
          if (count > 0) {
            comprehensiveMessage += `\n• ${count}x ${resource.replace(/-/g, ' ')} (${level} level)`;
          }
        });
      });
    }
    
    // Add Google Ads client count if specified
    if (selectedService === 'google-ads' && clients.length > 0) {
      comprehensiveMessage += `\n\n🎯 GOOGLE ADS DETAILS:`;
      comprehensiveMessage += `\n• Number of client accounts: ${clients.length}`;
    }
    
    // Add SEO client count if specified
    if (selectedService === 'seo' && seoClients.length > 0) {
      comprehensiveMessage += `\n\n🔍 SEO DETAILS:`;
      comprehensiveMessage += `\n• Number of client websites: ${seoClients.length}`;
    }
    
    // Prepare detailed submission data with pricing calculator selections
    const submissionData = {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone || '',
      company: contactForm.website ? extractDomain(contactForm.website) : '',
      inquiry_type: 'pricing-calculator',
      message: comprehensiveMessage,
      preferred_contact: 'email',
      country: 'US',
      topPriority: selectedService,
      couponCode: null,
      service: selectedService,
      serviceDetails: {
        service: selectedService,
        pricing: pricing,
        dedicatedTeam: selectedTeam,
        googleAdsClients: clients,
        seoClients: seoClients,
        calculatorData: {
          totalMonthlyPrice: pricing?.monthlyPrice || 0,
          setupFee: pricing?.setupFee || 0,
          teamDiscount: pricing?.teamDiscount || 0,
          savings: pricing?.savings || 0,
          features: pricing?.features || []
        }
      }
    };
    
    contactMutation.mutate(submissionData);
  };
  
  // Dedicated Resources State - Multi-team builder
  const [selectedTeam, setSelectedTeam] = useState<Record<string, Record<string, number>>>({});
  const [activeResourceType, setActiveResourceType] = useState<string>('');
  
  // Google Ads State - Individual client management
  const [clients, setClients] = useState<Array<{
    id: string;
    name: string;
    website: string;
    monthlyAdSpend: number;
    campaigns: number;
    campaignTypes: string[];
    industry: string;
    customIndustry: string;
  }>>([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    monthlyAdSpend: 2000,
    campaigns: 1,
    campaignTypes: [] as string[],
    industry: '',
    customIndustry: ''
  });

  // SEO State - Individual client management
  const [seoClients, setSeoClients] = useState<Array<{
    id: string;
    name: string;
    website: string;
    targetKeywords: number;
    competitionLevel: string;
    industry: string;
    customIndustry: string;
    currentRanking: string;
    competitors: string[];
  }>>([]);
  const [showAddSeoClient, setShowAddSeoClient] = useState(false);
  const [newSeoClient, setNewSeoClient] = useState({
    name: '',
    website: '',
    targetKeywords: 10,
    competitionLevel: 'medium',
    industry: '',
    customIndustry: '',
    currentRanking: 'page-2-3',
    competitors: ['', '', '']
  });
  
  // SEO State
  const [websiteCount, setWebsiteCount] = useState<number>(1);
  const [businessType, setBusinessType] = useState<string>('');
  const [currentRankings, setCurrentRankings] = useState<string>('');
  const [targetKeywords, setTargetKeywords] = useState<number>(20);
  const [contentNeeds, setContentNeeds] = useState<string[]>([]);
  
  // Web Development State
  const [websiteType, setWebsiteType] = useState<string>('');
  const [websiteComplexity, setWebsiteComplexity] = useState<string>('');
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [designRequirements, setDesignRequirements] = useState<string>('');
  const [maintenanceNeeds, setMaintenanceNeeds] = useState<string>('');
  
  // E-commerce specific state
  const [ecommercePlatform, setEcommercePlatform] = useState<string>('');
  const [productCount, setProductCount] = useState<number>(50);
  const [productPageFeatures, setProductPageFeatures] = useState<string[]>([]);

  // AI Development State
  const [aiProjectType, setAiProjectType] = useState<string>('');
  const [aiComplexity, setAiComplexity] = useState<string>('');
  const [aiIntegrations, setAiIntegrations] = useState<string[]>([]);
  const [dataVolume, setDataVolume] = useState<string>('');
  const [customModels, setCustomModels] = useState<boolean>(false);
  const [maintenanceSupport, setMaintenanceSupport] = useState<string>('');

  // Available resource types from Google Doc pricing structure
  const resourceTypes = [
    'Graphic Designer',
    'Video Editor', 
    'SEO Specialist',
    'Google Ads Expert',
    'Web Developer',
    'Full Stack Developer',
    'Social Media Manager',
    'Data Entry Specialist',
    'Virtual Assistant'
  ];

  // Skill levels available for each resource type - all resources have all skill levels
  const getSkillLevelsForResource = (resourceType: string) => {
    return ['junior', 'mid', 'senior'];
  };

  // Pricing data matching Google Docs pricing structure
  const dedicatedResourcesPricing = {
    junior: {
      'Graphic Designer': 1000,
      'Video Editor': 1000,
      'SEO Specialist': 1000,
      'Google Ads Expert': 1200,
      'Web Developer': 1000,
      'Full Stack Developer': 1200,
      'Social Media Manager': 1000,
      'Data Entry Specialist': 800,
      'Virtual Assistant': 800
    },
    mid: {
      'Graphic Designer': 1200,
      'Video Editor': 1400,
      'SEO Specialist': 1800,
      'Google Ads Expert': 2000,
      'Web Developer': 1800,
      'Full Stack Developer': 2000,
      'Social Media Manager': 1400,
      'Data Entry Specialist': 1000,
      'Virtual Assistant': 1000
    },
    senior: {
      'Graphic Designer': 2000,
      'Video Editor': 2200,
      'SEO Specialist': 2800,
      'Google Ads Expert': 3000,
      'Web Developer': 2800,
      'Full Stack Developer': 3500,
      'Social Media Manager': 2200,
      'Data Entry Specialist': 1400,
      'Virtual Assistant': 1500
    }
  };

  const googleAdsPricing = {
    starter: { price: 399, minSpend: 1000, maxSpend: 3000 },
    growth: { price: 799, minSpend: 3000, maxSpend: 8000 },
    scale: { price: 1299, minSpend: 8000, maxSpend: 15000 }
  };

  const seoPricing = {
    starter: 400,
    growth: 650,
    pro: 1200
  };

  const webDevelopmentPricing = {
    'wordpress-starter': 600,
    'wordpress-business': 1200,
    'wordpress-ecommerce': 1500,
    'shopify-starter': 750,
    'shopify-business': 1499,
    'shopify-advanced': 2499,
    'bigcommerce-starter': 850,
    'bigcommerce-business': 1600,
    'bigcommerce-advanced': 2799,
    'full-stack-site': 999,
    'custom-business': 2499,
    'custom-advanced': 4999
  };

  // Team builder helper functions
  const addResourceToTeam = (resourceType: string, skillLevel: string, count: number) => {
    setSelectedTeam(prev => ({
      ...prev,
      [resourceType]: {
        ...prev[resourceType],
        [skillLevel]: (prev[resourceType]?.[skillLevel] || 0) + count
      }
    }));
  };

  const updateResourceCount = (resourceType: string, skillLevel: string, count: number) => {
    if (count <= 0) {
      removeResourceFromTeam(resourceType, skillLevel);
      return;
    }
    setSelectedTeam(prev => ({
      ...prev,
      [resourceType]: {
        ...prev[resourceType],
        [skillLevel]: count
      }
    }));
  };

  const removeResourceFromTeam = (resourceType: string, skillLevel: string) => {
    setSelectedTeam(prev => {
      const newTeam = { ...prev };
      if (newTeam[resourceType]) {
        delete newTeam[resourceType][skillLevel];
        if (Object.keys(newTeam[resourceType]).length === 0) {
          delete newTeam[resourceType];
        }
      }
      return newTeam;
    });
  };

  // Calculate total team size for discounts
  const getTotalTeamSize = (): number => {
    return Object.values(selectedTeam).reduce((total, skillLevels) => 
      total + Object.values(skillLevels).reduce((sum, count) => sum + count, 0), 0
    );
  };

  // Team discount calculation
  const getTeamDiscount = (size: number): number => {
    if (size >= 8) return 20;
    if (size >= 5) return 15;
    if (size >= 3) return 10;
    if (size >= 2) return 5;
    return 0;
  };

  // Client management functions
  const addClient = () => {
    if (!newClient.name.trim()) return;
    
    const client = {
      id: Date.now().toString(),
      name: newClient.name,
      website: newClient.website,
      monthlyAdSpend: newClient.monthlyAdSpend,
      campaigns: newClient.campaigns,
      campaignTypes: [...newClient.campaignTypes],
      industry: newClient.industry === 'other' ? newClient.customIndustry : newClient.industry,
      customIndustry: newClient.customIndustry
    };
    
    setClients(prev => [...prev, client]);
    setNewClient({
      name: '',
      website: '',
      monthlyAdSpend: 2000,
      campaigns: 1,
      campaignTypes: [],
      industry: '',
      customIndustry: ''
    });
    setShowAddClient(false);
  };

  const removeClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const updateClient = (clientId: string, updates: Partial<typeof newClient>) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, ...updates } : c
    ));
  };

  // Calculate price for individual client based on their specific needs
  const calculateClientPrice = (client: typeof clients[0]): number => {
    let basePrice = 0;
    if (client.monthlyAdSpend <= 3000) {
      basePrice = googleAdsPricing.starter.price;
    } else if (client.monthlyAdSpend <= 8000) {
      basePrice = googleAdsPricing.growth.price;
    } else {
      basePrice = googleAdsPricing.scale.price;
    }

    // Campaign scaling: Each additional campaign adds 15% of base price
    let scaledPrice = basePrice;
    if (client.campaigns > 1) {
      scaledPrice += (client.campaigns - 1) * (basePrice * 0.15);
    }

    // Complexity bonus for multiple campaign types
    if (client.campaignTypes.length > 3) {
      scaledPrice += scaledPrice * 0.1; // 10% bonus for high complexity
    }

    return Math.round(scaledPrice);
  };

  // SEO Client management functions
  const addSeoClient = () => {
    if (!newSeoClient.name.trim()) return;
    
    const client = {
      id: Date.now().toString(),
      name: newSeoClient.name,
      website: newSeoClient.website,
      targetKeywords: newSeoClient.targetKeywords,
      competitionLevel: newSeoClient.competitionLevel,
      industry: newSeoClient.industry === 'other' ? newSeoClient.customIndustry : newSeoClient.industry,
      customIndustry: newSeoClient.customIndustry,
      currentRanking: newSeoClient.currentRanking,
      competitors: newSeoClient.competitors.filter(c => c.trim() !== '')
    };
    
    setSeoClients(prev => [...prev, client]);
    setNewSeoClient({
      name: '',
      website: '',
      targetKeywords: 10,
      competitionLevel: 'medium',
      industry: '',
      customIndustry: '',
      currentRanking: 'page-2-3',
      competitors: ['', '', '']
    });
    setShowAddSeoClient(false);
  };

  const removeSeoClient = (clientId: string) => {
    setSeoClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Calculate price for individual SEO client based on their specific needs
  const calculateSeoClientPrice = (client: typeof seoClients[0]): number => {
    // Base pricing based on keyword count
    let basePrice = 0;
    if (client.targetKeywords <= 15) {
      basePrice = seoPricing.starter;
    } else if (client.targetKeywords <= 30) {
      basePrice = seoPricing.growth;
    } else {
      basePrice = seoPricing.pro;
    }

    // Competition level multiplier
    let competitionMultiplier = 1;
    if (client.competitionLevel === 'high') {
      competitionMultiplier = 1.3;
    } else if (client.competitionLevel === 'very-high') {
      competitionMultiplier = 1.5;
    } else if (client.competitionLevel === 'low') {
      competitionMultiplier = 0.8;
    }

    // Current ranking adjustment (easier to improve from page 1 = lower cost)
    let rankingMultiplier = 1;
    if (client.currentRanking === 'not-ranking') {
      rankingMultiplier = 1.2; // More work needed
    } else if (client.currentRanking === 'page-1') {
      rankingMultiplier = 0.9; // Already ranking well
    }

    return Math.round(basePrice * competitionMultiplier * rankingMultiplier);
  };

  const calculatePricing = (): PricingResult | null => {
    if (!selectedService) return null;

    let result: PricingResult = {
      service: selectedService,
      monthlyPrice: 0,
      setupFee: 0,
      features: [],
      teamDiscount: 0,
      savings: 0
    };

    switch (selectedService) {
      case 'dedicated-resources':
        if (Object.keys(selectedTeam).length === 0) return null;
        
        let totalPrice = 0;
        const features: string[] = [];
        const totalTeamSize = getTotalTeamSize();
        const discount = getTeamDiscount(totalTeamSize);
        
        // Calculate price for each resource type and skill level
        Object.entries(selectedTeam).forEach(([resourceType, skillLevels]) => {
          Object.entries(skillLevels).forEach(([skillLevel, count]) => {
            const price = dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior] || 1500;
            const discountedPrice = price * (1 - discount / 100);
            totalPrice += discountedPrice * count;
            
            features.push(`${count} ${skillLevel} ${resourceType}${count > 1 ? 's' : ''}`);
          });
        });
        
        // Check if dedicated manager is needed
        const needsDedicatedManager = totalPrice > 5000 || totalTeamSize > 6;
        const managerFeatures = needsDedicatedManager ? ['Dedicated account manager included'] : [];
        
        result = {
          service: 'Dedicated Resources Team',
          monthlyPrice: Math.round(totalPrice),
          setupFee: 0,
          features: [
            ...features,
            'Full-time dedicated resources',
            'Your agency branding',
            'Direct communication access',
            'Monthly performance reports',
            ...managerFeatures
          ],
          teamDiscount: discount,
          savings: discount > 0 ? Math.round(totalPrice * discount / (100 - discount)) : 0
        };
        break;

      case 'google-ads':
        if (clients.length === 0) return null;
        
        // Calculate total price across all clients
        const totalMonthlyPrice = clients.reduce((total, client) => {
          return total + calculateClientPrice(client);
        }, 0);
        
        const totalCampaigns = clients.reduce((total, client) => total + client.campaigns, 0);
        const totalAdSpend = clients.reduce((total, client) => total + client.monthlyAdSpend, 0);
        const allCampaignTypes = Array.from(new Set(clients.flatMap(c => c.campaignTypes)));
        const allIndustries = Array.from(new Set(clients.map(c => c.industry).filter(Boolean)));
        
        result = {
          service: 'Google Ads Management',
          monthlyPrice: totalMonthlyPrice,
          setupFee: 0,
          features: [
            `Managing ${clients.length} client${clients.length > 1 ? 's' : ''} with ${totalCampaigns} total campaigns`,
            `Total ad spend: $${totalAdSpend.toLocaleString()}/month across all clients`,
            `Campaign types: ${allCampaignTypes.join(', ') || 'Not specified'}`,
            `Industries: ${allIndustries.join(', ') || 'Not specified'}`,
            'Individual client optimization strategies',
            'Conversion tracking setup for each client',
            'Monthly performance reports per client',
            'Dedicated ads specialist',
            'Ongoing optimization & A/B testing'
          ],
          teamDiscount: 0,
          savings: 0
        };
        break;

      case 'seo':
        if (seoClients.length === 0) return null;
        
        // Calculate total price across all SEO clients
        const totalSeoPrice = seoClients.reduce((total, client) => {
          return total + calculateSeoClientPrice(client);
        }, 0);
        
        const totalKeywords = seoClients.reduce((total, client) => total + client.targetKeywords, 0);
        const allSeoIndustries = Array.from(new Set(seoClients.map(c => c.industry).filter(Boolean)));
        const competitionLevels = Array.from(new Set(seoClients.map(c => c.competitionLevel)));
        
        result = {
          service: 'SEO Services',
          monthlyPrice: totalSeoPrice,
          setupFee: 0,
          features: [
            `Managing ${seoClients.length} website${seoClients.length > 1 ? 's' : ''} with ${totalKeywords} total keywords`,
            `Industries: ${allSeoIndustries.join(', ') || 'Not specified'}`,
            `Competition levels: ${competitionLevels.join(', ')}`,
            'Individual website audit and optimization',
            'Custom keyword research per client',
            'Technical SEO fixes for each site',
            'Content strategy per client',
            'Monthly ranking reports per website',
            'Dedicated SEO specialist',
            'Link building campaigns'
          ],
          teamDiscount: 0,
          savings: 0
        };
        break;

      case 'web-development':
        if (!websiteType) return null;
        
        let webPrice = webDevelopmentPricing[websiteType as keyof typeof webDevelopmentPricing] || 600;
        let webFeatures: string[] = [];
        
        // E-commerce pricing and features
        if (websiteType === 'ecommerce-store' && ecommercePlatform) {
          // Base pricing by platform
          const platformPricing = {
            shopify: 1500,
            woocommerce: 1200,
            bigcommerce: 1800
          };
          webPrice = platformPricing[ecommercePlatform as keyof typeof platformPricing] || 1500;
          
          // Product setup cost (additional fee based on product count)
          const productSetupFee = Math.floor(productCount / 50) * 200; // $200 per 50 products
          webPrice += productSetupFee;
          
          // Feature complexity bonus
          const featureBonus = productPageFeatures.length * 100; // $100 per feature
          webPrice += featureBonus;
          
          // Integration complexity bonus
          const integrationBonus = integrations.length * 150; // $150 per integration
          webPrice += integrationBonus;
          
          webFeatures = [
            `${ecommercePlatform.charAt(0).toUpperCase() + ecommercePlatform.slice(1)} store setup`,
            `${productCount} products added and configured`,
            'Mobile-optimized checkout process',
            'Payment gateway integration',
            'Inventory management system',
            'Order management dashboard'
          ];
          
          // Add selected product page features
          if (productPageFeatures.length > 0) {
            webFeatures.push(`Product features: ${productPageFeatures.join(', ')}`);
          }
          
          // Add selected integrations
          if (integrations.length > 0) {
            webFeatures.push(`Integrations: ${integrations.join(', ')}`);
          }
          
          // Add design requirements pricing for e-commerce
          if (designRequirements) {
            const designMultiplier = {
              custom: 1.25,
              premium: 1.5,
              luxury: 2.0
            };
            const multiplier = designMultiplier[designRequirements as keyof typeof designMultiplier] || 1;
            if (multiplier > 1) {
              webPrice *= multiplier;
              webFeatures.push(`${designRequirements.charAt(0).toUpperCase() + designRequirements.slice(1)} design (+${Math.round((multiplier - 1) * 100)}%)`);
            }
          }
          
          // Add maintenance needs pricing for e-commerce
          if (maintenanceNeeds) {
            const maintenanceAddons = {
              none: { cost: 0, label: '' },
              basic: { cost: 300, label: 'Basic e-commerce maintenance - 6 months (+$300)' },
              standard: { cost: 600, label: 'Standard e-commerce maintenance - 6 months (+$600)' },
              premium: { cost: 1000, label: 'Premium e-commerce support - 6 months (+$1,000)' }
            };
            const addon = maintenanceAddons[maintenanceNeeds as keyof typeof maintenanceAddons];
            if (addon && addon.cost > 0) {
              webPrice += addon.cost;
              webFeatures.push(addon.label);
            }
          }
          
          webFeatures.push('Training and documentation');
          webFeatures.push('6 months support included');
          
        } else {
          // Non-e-commerce websites
          webFeatures = websiteType.includes('wordpress') ? [
            'Custom WordPress design',
            'Mobile-friendly responsive',
            'Basic SEO optimization',
            'Contact forms + social links',
            'Google Analytics setup',
            'Training included'
          ] : [
            'Custom development',
            'Modern tech stack',
            'Database integration',
            'API development',
            'Performance optimization',
            '6 months support'
          ];
          
          // Add complexity bonuses for non-e-commerce
          if (websiteComplexity) {
            const complexityMultiplier = {
              simple: 1,
              medium: 1.3,
              complex: 1.6
            };
            webPrice *= complexityMultiplier[websiteComplexity as keyof typeof complexityMultiplier] || 1;
          }
          
          // Add integration bonuses
          webPrice += integrations.length * 100;
          
          if (integrations.length > 0) {
            webFeatures.push(`Integrations: ${integrations.join(', ')}`);
          }
          
          // Add design requirements pricing
          if (designRequirements) {
            const designMultiplier = {
              custom: 1.25,
              premium: 1.5,
              luxury: 2.0
            };
            const multiplier = designMultiplier[designRequirements as keyof typeof designMultiplier] || 1;
            if (multiplier > 1) {
              webPrice *= multiplier;
              webFeatures.push(`${designRequirements.charAt(0).toUpperCase() + designRequirements.slice(1)} design (+${Math.round((multiplier - 1) * 100)}%)`);
            }
          }
          
          // Add maintenance needs pricing
          if (maintenanceNeeds) {
            const maintenanceAddons = {
              none: { cost: 0, label: '' },
              basic: { cost: 200, label: 'Basic maintenance - 6 months (+$200)' },
              standard: { cost: 500, label: 'Standard maintenance - 6 months (+$500)' },
              premium: { cost: 800, label: 'Premium maintenance - 6 months (+$800)' }
            };
            const addon = maintenanceAddons[maintenanceNeeds as keyof typeof maintenanceAddons];
            if (addon && addon.cost > 0) {
              webPrice += addon.cost;
              webFeatures.push(addon.label);
            }
          }
        }
        
        result = {
          service: websiteType === 'ecommerce-store' ? `${ecommercePlatform?.charAt(0).toUpperCase()}${ecommercePlatform?.slice(1)} E-commerce Store` : 'Web Development',
          monthlyPrice: Math.round(webPrice),
          setupFee: 0,
          features: webFeatures,
          teamDiscount: 0,
          savings: 0
        };
        break;

      case 'ai-development':
        if (!aiProjectType || !aiComplexity) return null;
        
        let aiPrice = 0;
        let aiFeatures: string[] = [];
        
        // Base pricing by project type
        const aiProjectPricing = {
          'ai-web-app': 7000,
          'ai-mobile-app': 9000,
          'chatbot': 3000,
          'ai-agent': 5000,
          'automation-workflow': 4000,
          'custom-ai-model': 8000,
          'data-analysis': 3500,
          'ai-integration': 2500
        };
        
        aiPrice = aiProjectPricing[aiProjectType as keyof typeof aiProjectPricing] || 3000;
        
        // Complexity multipliers
        const aiComplexityMultiplier = {
          simple: 1,
          medium: 1.5,
          complex: 2.2,
          enterprise: 3.0
        };
        
        aiPrice *= aiComplexityMultiplier[aiComplexity as keyof typeof aiComplexityMultiplier] || 1;
        
        // Add integration costs based on complexity
        if (aiIntegrations.length > 0) {
          const integrationMultiplier = {
            simple: 300,
            medium: 500,
            complex: 750,
            enterprise: 1000
          };
          
          const integrationCost = aiIntegrations.length * (integrationMultiplier[aiComplexity as keyof typeof integrationMultiplier] || 500);
          aiPrice += integrationCost;
          aiFeatures.push(`${aiIntegrations.length} Integrations: ${aiIntegrations.join(', ')} (+$${integrationCost.toLocaleString()})`);
        }
        
        // Data volume adjustments with complexity-aware multipliers
        if (dataVolume) {
          const dataVolumeMultipliers = {
            small: { multiplier: 1, cost: 0, label: 'Standard data processing' },
            medium: { multiplier: 1.15, cost: 500, label: 'Medium-scale data processing (+15% + $500)' },
            large: { multiplier: 1.3, cost: 1200, label: 'Large dataset optimization (+30% + $1,200)' },
            enterprise: { multiplier: 1.6, cost: 2500, label: 'Enterprise-scale infrastructure (+60% + $2,500)' }
          };
          
          const volumeConfig = dataVolumeMultipliers[dataVolume as keyof typeof dataVolumeMultipliers];
          if (volumeConfig && dataVolume !== 'small') {
            aiPrice *= volumeConfig.multiplier;
            aiPrice += volumeConfig.cost;
            aiFeatures.push(volumeConfig.label);
          }
        }
        
        // Custom models premium with project-type specific adjustments
        if (customModels) {
          const customModelMultiplier = {
            'ai-web-app': 1.3,
            'ai-mobile-app': 1.4,
            'chatbot': 1.5,
            'ai-agent': 1.4,
            'automation-workflow': 1.2,
            'custom-ai-model': 1.0, // Already includes custom model in base price
            'data-analysis': 1.6,
            'ai-integration': 1.3
          };
          
          const multiplier = customModelMultiplier[aiProjectType as keyof typeof customModelMultiplier] || 1.4;
          if (aiProjectType !== 'custom-ai-model') {
            aiPrice *= multiplier;
            aiFeatures.push(`Custom AI model training (+${Math.round((multiplier - 1) * 100)}%)`);
          }
        }
        
        // Base features
        aiFeatures.unshift(
          `${aiProjectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} development`,
          `${aiComplexity.charAt(0).toUpperCase() + aiComplexity.slice(1)} complexity implementation`,
          'AI testing and optimization',
          'Documentation and training',
          'Initial deployment support'
        );
        
        // Maintenance support pricing adjustments
        if (maintenanceSupport === 'ongoing') {
          aiPrice += Math.round(aiPrice * 0.15); // 15% for standard 6-month support
          aiFeatures.push('6 months ongoing support included (+15%)');
        } else if (maintenanceSupport === 'premium') {
          aiPrice += Math.round(aiPrice * 0.25) + 1000; // 25% + $1000 for premium 12-month support
          aiFeatures.push('12 months premium support + priority access (+25% + $1,000)');
        }
        
        result = {
          service: 'AI Development',
          monthlyPrice: Math.round(aiPrice),
          setupFee: 0,
          features: aiFeatures,
          teamDiscount: 0,
          savings: 0,
          isProjectBased: true
        };
        break;
    }

    return result;
  };

  const pricing = calculatePricing();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <SEOHead 
        title="Pricing Calculator | White-Label Services Cost Estimator | BrandingBeez"
        description="Calculate costs for white-label digital marketing services. Get instant pricing for SEO, Google Ads, web development, dedicated resources, and AI solutions. Free estimates with team discounts."
        keywords="white label pricing calculator, digital marketing cost estimator, SEO pricing, Google Ads cost, web development pricing, dedicated team cost calculator"
        canonicalUrl="https://brandingbeez.com/pricing-calculator"
        ogType="webapp"
      />
      <SchemaMarkup type="service" data={{
        name: "White-Label Services Pricing Calculator",
        description: "Interactive pricing calculator for white-label digital marketing services including SEO, Google Ads, web development, and dedicated resources.",
        serviceType: "Pricing Calculator Tool",
        hasOfferCatalog: {
          name: "Service Pricing Options",
          itemListElement: [
            {
              name: "SEO Services Pricing",
              description: "Custom SEO pricing based on keywords, competition, and scope"
            },
            {
              name: "Google Ads Management Pricing",
              description: "Performance-based Google Ads pricing with campaign complexity factors"
            },
            {
              name: "Dedicated Resources Pricing",
              description: "Professional team member pricing with skill level and team size discounts"
            }
          ]
        }
      }} />
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
        <div className="max-w-4xl mx-auto text-center p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Calculator className="w-10 h-10 sm:w-12 sm:h-12" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Pricing Calculator
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Get instant pricing for all our services. No hidden fees, transparent pricing based on your specific needs.
          </p>
          <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
            💰 Up to 20% team discounts available
          </Badge>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Configuration Panel */}
            <Card className="border-2 border-brand-coral/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-brand-coral" />
                  <h2>Configure Your Service</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Service</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dedicated-resources">Dedicated Resources</SelectItem>
                      <SelectItem value="google-ads">Google Ads Management</SelectItem>
                      <SelectItem value="seo">SEO Services</SelectItem>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="ai-development">AI Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Multi-Service Team Builder */}
                {selectedService === 'dedicated-resources' && (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900">Build Your Custom Team</h3>
                      <p className="text-sm text-blue-700">Choose any combination of professionals you need. Add multiple skill levels and quantities for each type.</p>
                    </div>

                    {/* Quick Examples */}
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">
                        <strong>Examples:</strong> 1 Graphic Designer + 2 Full Stack Developers | 1 SEO Specialist + 1 Social Media Manager + 1 Virtual Assistant | Any combination you need!
                      </p>
                    </div>

                    {/* Professional Selection Grid */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Choose Your Professionals:</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {resourceTypes.map((resourceType) => (
                          <div key={resourceType} className="p-3 sm:p-4 border rounded-lg hover:border-brand-coral transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                              <h5 className="font-medium text-gray-900 text-sm sm:text-base">{resourceType}</h5>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveResourceType(activeResourceType === resourceType ? '' : resourceType)}
                                className={`text-xs sm:text-sm touch-manipulation ${activeResourceType === resourceType ? 'border-brand-coral text-brand-coral' : ''}`}
                              >
                                {activeResourceType === resourceType ? 'Cancel' : 'Add to Team'}
                              </Button>
                            </div>
                            
                            {/* Show current team members for this type */}
                            {selectedTeam[resourceType] && (
                              <div className="space-y-1 mb-3">
                                {Object.entries(selectedTeam[resourceType]).map(([skillLevel, count]) => (
                                  <div key={skillLevel} className="flex items-center justify-between text-xs sm:text-sm bg-green-50 px-2 py-1 rounded">
                                    <span>{count} × {skillLevel} level</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeResourceFromTeam(resourceType, skillLevel)}
                                      className="h-6 px-2 text-red-600 hover:text-red-800 text-xs touch-manipulation"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Skill level selection for active resource */}
                            {activeResourceType === resourceType && (
                              <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded">
                                {getSkillLevelsForResource(resourceType).map((skillLevel) => (
                                  <div key={skillLevel} className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium capitalize">{skillLevel} Level</div>
                                      <div className="text-sm text-gray-600">
                                        ${dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior]?.toLocaleString()}/month
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const currentCount = selectedTeam[resourceType]?.[skillLevel] || 0;
                                          if (currentCount > 0) {
                                            updateResourceCount(resourceType, skillLevel, currentCount - 1);
                                          }
                                        }}
                                        className="w-8 h-8 p-0"
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center">{selectedTeam[resourceType]?.[skillLevel] || 0}</span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const currentCount = selectedTeam[resourceType]?.[skillLevel] || 0;
                                          updateResourceCount(resourceType, skillLevel, currentCount + 1);
                                        }}
                                        className="w-8 h-8 p-0"
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* Selected Team Summary */}
                    {Object.keys(selectedTeam).length > 0 && (
                      <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Your Multi-Professional Team ({getTotalTeamSize()} people total)
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(selectedTeam).map(([resourceType, skillLevels]) => (
                            <div key={resourceType} className="p-3 bg-white rounded-lg border border-green-200">
                              <div className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-brand-coral rounded-full"></div>
                                {resourceType}
                              </div>
                              <div className="space-y-1">
                                {Object.entries(skillLevels).map(([skillLevel, count]) => (
                                  <div key={`${resourceType}-${skillLevel}`} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">
                                      {count} × {skillLevel} level 
                                      <span className="text-green-600 font-medium ml-2">
                                        (${(dedicatedResourcesPricing[skillLevel as keyof typeof dedicatedResourcesPricing][resourceType as keyof typeof dedicatedResourcesPricing.junior] * count || 0).toLocaleString()}/month)
                                      </span>
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeResourceFromTeam(resourceType, skillLevel)}
                                      className="text-red-600 ed-800 h-6 px-2"
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {getTotalTeamSize() >= 2 && (
                          <div className="text-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-300">
                            <div className="text-lg font-bold text-green-700">
                              🎉 Team Discount: {getTeamDiscount(getTotalTeamSize())}% OFF
                            </div>
                            <div className="text-sm text-green-600">
                              Save on your multi-professional team!
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedTeam({})}
                          className="w-full text-red-600 ed-800 border-red-200 hover:border-red-300"
                        >
                          Clear Entire Team
                        </Button>
                      </div>
                    )}




                  </div>
                )}

                {/* Google Ads Options - Individual Client Management */}
                {selectedService === 'google-ads' && (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900">Individual Client Management</h3>
                      <p className="text-sm text-blue-700">Add each client with their specific budget, campaigns, and requirements for accurate pricing.</p>
                    </div>

                    {/* Client List */}
                    {clients.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Your Clients ({clients.length})</h4>
                        {clients.map((client) => (
                          <div key={client.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{client.name}</h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Ad Spend: ${client.monthlyAdSpend.toLocaleString()}/month</div>
                                  <div>Campaigns: {client.campaigns}</div>
                                  <div>Types: {client.campaignTypes.join(', ') || 'Not specified'}</div>
                                  <div>Industry: {client.industry || 'Not specified'}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="font-semibold text-green-600">
                                    ${calculateClientPrice(client).toLocaleString()}/month
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeClient(client.id)}
                                  className="text-red-600 ed-800"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Client */}
                    {!showAddClient ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddClient(true)}
                        className="w-full border-dashed border-2 border-gray-300 hover:border-brand-coral rand-coral"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                      </Button>
                    ) : (
                      <div className="p-4 border rounded-lg bg-white space-y-4">
                        <h4 className="font-medium text-gray-900">Add New Client</h4>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Client Name</label>
                          <input
                            type="text"
                            value={newClient.name}
                            onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter client name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Monthly Ad Spend: ${newClient.monthlyAdSpend.toLocaleString()}
                          </label>
                          <Slider
                            value={[newClient.monthlyAdSpend]}
                            onValueChange={(value) => setNewClient(prev => ({ ...prev, monthlyAdSpend: value[0] }))}
                            max={50000}
                            min={1000}
                            step={500}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Number of Campaigns: {newClient.campaigns}
                          </label>
                          <Slider
                            value={[newClient.campaigns]}
                            onValueChange={(value) => setNewClient(prev => ({ ...prev, campaigns: value[0] }))}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Campaign Types (select multiple)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['Search', 'Display', 'Shopping', 'Video', 'Performance Max', 'App'].map((type) => (
                              <Button
                                key={type}
                                type="button"
                                variant={newClient.campaignTypes.includes(type) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  if (newClient.campaignTypes.includes(type)) {
                                    setNewClient(prev => ({
                                      ...prev,
                                      campaignTypes: prev.campaignTypes.filter(t => t !== type)
                                    }));
                                  } else {
                                    setNewClient(prev => ({
                                      ...prev,
                                      campaignTypes: [...prev.campaignTypes, type]
                                    }));
                                  }
                                }}
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Industry</label>
                          <Select value={newClient.industry} onValueChange={(value) => setNewClient(prev => ({ ...prev, industry: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose industry..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="realestate">Real Estate</SelectItem>
                              <SelectItem value="saas">SaaS/Software</SelectItem>
                              <SelectItem value="local">Local Services</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="automotive">Automotive</SelectItem>
                              <SelectItem value="other">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Custom Industry Input for Google Ads */}
                        {newClient.industry === 'other' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Specify Industry</label>
                            <input
                              type="text"
                              value={newClient.customIndustry}
                              onChange={(e) => setNewClient(prev => ({ ...prev, customIndustry: e.target.value }))}
                              placeholder="Enter industry name..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
                            />
                          </div>
                        )}

                        {/* Website Field for Google Ads */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Client Website</label>
                          <input
                            type="text"
                            value={newClient.website}
                            onChange={(e) => setNewClient(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://clientwebsite.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-transparent"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={addClient}
                            className="flex-1 bg-brand-coral rand-coral-dark text-white"
                          >
                            Add Client
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddClient(false)}
                            className="px-4"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Options - Individual Client Management */}
                {selectedService === 'seo' && (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900">Individual Website Management</h3>
                      <p className="text-sm text-green-700">Add each website with their specific keywords, competition level, and current rankings for accurate SEO pricing.</p>
                    </div>

                    {/* SEO Client List */}
                    {seoClients.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Your SEO Clients ({seoClients.length})</h4>
                        {seoClients.map((client) => (
                          <div key={client.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{client.name}</h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Website: {client.website}</div>
                                  <div>Keywords: {client.targetKeywords}</div>
                                  <div>Competition: {client.competitionLevel}</div>
                                  <div>Current Ranking: {client.currentRanking.replace('-', ' ')}</div>
                                  <div>Industry: {client.industry || 'Not specified'}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="font-semibold text-green-600">
                                    ${calculateSeoClientPrice(client).toLocaleString()}/month
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSeoClient(client.id)}
                                  className="text-red-600 ed-800"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New SEO Client */}
                    {!showAddSeoClient ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddSeoClient(true)}
                        className="w-full border-dashed border-2 border-gray-300 hover:border-green-600 reen-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Website for SEO
                      </Button>
                    ) : (
                      <div className="p-4 border rounded-lg bg-white space-y-4">
                        <h4 className="font-medium text-gray-900">Add New SEO Client</h4>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Client/Business Name</label>
                          <input
                            type="text"
                            value={newSeoClient.name}
                            onChange={(e) => setNewSeoClient(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter client name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Website URL</label>
                          <input
                            type="text"
                            value={newSeoClient.website}
                            onChange={(e) => setNewSeoClient(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Target Keywords: {newSeoClient.targetKeywords}
                          </label>
                          <Slider
                            value={[newSeoClient.targetKeywords]}
                            onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, targetKeywords: value[0] }))}
                            max={100}
                            min={5}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Competition Level</label>
                          <Select value={newSeoClient.competitionLevel} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, competitionLevel: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose competition level..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Competition</SelectItem>
                              <SelectItem value="medium">Medium Competition</SelectItem>
                              <SelectItem value="high">High Competition</SelectItem>
                              <SelectItem value="very-high">Very High Competition</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Current Search Rankings</label>
                          <Select value={newSeoClient.currentRanking} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, currentRanking: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Current ranking status..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-ranking">Not ranking / New website</SelectItem>
                              <SelectItem value="page-2-3">Page 2-3 for main keywords</SelectItem>
                              <SelectItem value="page-1">Page 1 for some keywords</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Industry</label>
                          <Select value={newSeoClient.industry} onValueChange={(value) => setNewSeoClient(prev => ({ ...prev, industry: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose industry..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">Local Business</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="saas">SaaS/Software</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="realestate">Real Estate</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="automotive">Automotive</SelectItem>
                              <SelectItem value="other">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Custom Industry Input for SEO */}
                        {newSeoClient.industry === 'other' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Specify Industry</label>
                            <input
                              type="text"
                              value={newSeoClient.customIndustry}
                              onChange={(e) => setNewSeoClient(prev => ({ ...prev, customIndustry: e.target.value }))}
                              placeholder="Enter industry name..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        )}

                        {/* Competitor Upload Fields */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Top 3 Competitors (Optional)</label>
                          <div className="space-y-2">
                            {newSeoClient.competitors.map((competitor, index) => (
                              <input
                                key={index}
                                type="text"
                                value={competitor}
                                onChange={(e) => {
                                  const newCompetitors = [...newSeoClient.competitors];
                                  newCompetitors[index] = e.target.value;
                                  setNewSeoClient(prev => ({ ...prev, competitors: newCompetitors }));
                                }}
                                placeholder={`Competitor ${index + 1} website URL`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={addSeoClient}
                            className="flex-1 bg-green-600 reen-700 text-white"
                          >
                            Add Website
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddSeoClient(false)}
                            className="px-4"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Web Development Options */}
                {selectedService === 'web-development' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">1. What type of website do you need?</label>
                      <Select value={websiteType} onValueChange={setWebsiteType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose website type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wordpress-starter">WordPress Starter</SelectItem>
                          <SelectItem value="wordpress-business">WordPress Business</SelectItem>
                          <SelectItem value="ecommerce-store">E-commerce Store</SelectItem>
                          <SelectItem value="full-stack-site">Full Stack Site</SelectItem>
                          <SelectItem value="custom-advanced">Custom Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* E-commerce Platform Selection */}
                    {websiteType === 'ecommerce-store' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">2. Which e-commerce platform?</label>
                        <Select value={ecommercePlatform} onValueChange={setEcommercePlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose platform..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shopify">Shopify</SelectItem>
                            <SelectItem value="woocommerce">WooCommerce</SelectItem>
                            <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Product Count for E-commerce */}
                    {websiteType === 'ecommerce-store' && ecommercePlatform && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">3. How many products to add? ({productCount} products)</label>
                        <Slider
                          value={[productCount]}
                          onValueChange={(value) => setProductCount(value[0])}
                          max={500}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Product Page Features for E-commerce */}
                    {websiteType === 'ecommerce-store' && ecommercePlatform && productCount > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">4. Product page features (select multiple)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            'Image Zoom', 
                            'Product Videos', 
                            'Size Guide', 
                            'Related Products', 
                            'Quick View',
                            'Wishlist',
                            'Compare Products',
                            'Product Variants',
                            'Inventory Tracking'
                          ].map((feature) => (
                            <Button
                              key={feature}
                              variant={productPageFeatures.includes(feature) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (productPageFeatures.includes(feature)) {
                                  setProductPageFeatures(productPageFeatures.filter(f => f !== feature));
                                } else {
                                  setProductPageFeatures([...productPageFeatures, feature]);
                                }
                              }}
                            >
                              {feature}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website Complexity for non-ecommerce */}
                    {websiteType && websiteType !== 'ecommerce-store' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">2. Website complexity</label>
                        <Select value={websiteComplexity} onValueChange={setWebsiteComplexity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose complexity..." />
                          </SelectTrigger>
                          <SelectContent>
                            {websiteType === 'wordpress-starter' && (
                              <>
                                <SelectItem value="simple">Basic Business (5-7 pages, contact forms)</SelectItem>
                                <SelectItem value="medium">Professional (10-15 pages, blog, gallery)</SelectItem>
                                <SelectItem value="complex">Advanced (20+ pages, membership, custom features)</SelectItem>
                              </>
                            )}
                            {websiteType === 'wordpress-business' && (
                              <>
                                <SelectItem value="simple">Standard Business (10-15 pages, SEO optimized)</SelectItem>
                                <SelectItem value="medium">Multi-service (20-30 pages, booking system)</SelectItem>
                                <SelectItem value="complex">Enterprise (40+ pages, multi-language, advanced CMS)</SelectItem>
                              </>
                            )}
                            {websiteType === 'full-stack-site' && (
                              <>
                                <SelectItem value="simple">Basic Full Stack (React/Node.js, REST API)</SelectItem>
                                <SelectItem value="medium">Advanced Full Stack (Next.js, Database, Auth)</SelectItem>
                                <SelectItem value="complex">Enterprise Full Stack (Microservices, Cloud deployment)</SelectItem>
                              </>
                            )}
                            {websiteType === 'custom-basic' && (
                              <>
                                <SelectItem value="simple">Simple App (Landing page, basic functionality)</SelectItem>
                                <SelectItem value="medium">Web Application (User auth, database, API)</SelectItem>
                                <SelectItem value="complex">Complex Platform (Multi-user, advanced features)</SelectItem>
                              </>
                            )}
                            {websiteType === 'custom-advanced' && (
                              <>
                                <SelectItem value="simple">Advanced Web App (Real-time features, integrations)</SelectItem>
                                <SelectItem value="medium">Enterprise Platform (Scalable architecture, admin panels)</SelectItem>
                                <SelectItem value="complex">Custom Software (AI/ML, complex algorithms, microservices)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Integrations for E-commerce */}
                    {websiteType === 'ecommerce-store' && productPageFeatures.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">5. Required integrations (select multiple)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Google Analytics'].map((integration) => (
                            <Button
                              key={integration}
                              variant={integrations.includes(integration) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (integrations.includes(integration)) {
                                  setIntegrations(integrations.filter(i => i !== integration));
                                } else {
                                  setIntegrations([...integrations, integration]);
                                }
                              }}
                            >
                              {integration}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integrations for Non-E-commerce */}
                    {websiteType !== 'ecommerce-store' && websiteComplexity && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">3. Required integrations (select multiple)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Google Analytics'].map((integration) => (
                            <Button
                              key={integration}
                              variant={integrations.includes(integration) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (integrations.includes(integration)) {
                                  setIntegrations(integrations.filter(i => i !== integration));
                                } else {
                                  setIntegrations([...integrations, integration]);
                                }
                              }}
                            >
                              {integration}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Design Requirements */}
                    {websiteComplexity && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {websiteType === 'ecommerce-store' ? '6. Design requirements' : '4. Design requirements'}
                        </label>
                        <Select value={designRequirements} onValueChange={setDesignRequirements}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose design level..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">Custom design</SelectItem>
                            <SelectItem value="premium">Premium custom design</SelectItem>
                            <SelectItem value="luxury">Luxury design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Maintenance Needs */}
                    {websiteComplexity && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {websiteType === 'ecommerce-store' ? '7. Ongoing maintenance needs' : '5. Ongoing maintenance needs'}
                        </label>
                        <Select value={maintenanceNeeds} onValueChange={setMaintenanceNeeds}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose maintenance level..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No maintenance</SelectItem>
                            <SelectItem value="basic">Basic (6 months - Security updates only)</SelectItem>
                            <SelectItem value="standard">Standard (6 months - Updates + content)</SelectItem>
                            <SelectItem value="premium">Premium (6 months - Full management)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Development Options */}
                {selectedService === 'ai-development' && (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-900">Custom AI Product Development</h3>
                      <p className="text-sm text-purple-700">We build full-custom AI powered products for web & mobile platforms. Configure your project based on requirements and complexity.</p>
                    </div>

                    {/* Project Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">1. AI Project Type</label>
                      <Select value={aiProjectType} onValueChange={setAiProjectType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose project type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-web-app">AI-Powered Web Application</SelectItem>
                          <SelectItem value="ai-mobile-app">AI-Powered Mobile Application</SelectItem>
                          <SelectItem value="chatbot">AI Chatbot</SelectItem>
                          <SelectItem value="ai-agent">AI Agent/Assistant</SelectItem>
                          <SelectItem value="automation-workflow">Automation Workflow</SelectItem>
                          <SelectItem value="custom-ai-model">Custom AI Model</SelectItem>
                          <SelectItem value="data-analysis">Data Analysis & Insights</SelectItem>
                          <SelectItem value="ai-integration">AI API Integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Complexity Level */}
                    {aiProjectType && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">2. Project Complexity</label>
                        <Select value={aiComplexity} onValueChange={setAiComplexity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose complexity level..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple (Basic functionality, 1-2 features)</SelectItem>
                            <SelectItem value="medium">Medium (Advanced features, 3-5 integrations) +50%</SelectItem>
                            <SelectItem value="complex">Complex (Multi-system integration, custom logic) +120%</SelectItem>
                            <SelectItem value="enterprise">Enterprise (Custom architecture, scalability) +200%</SelectItem>
                          </SelectContent>
                        </Select>
                        {aiComplexity && (
                          <div className="text-xs text-gray-500 mt-1">
                            {aiComplexity === 'simple' && 'Perfect for MVP or proof-of-concept projects with core AI functionality.'}
                            {aiComplexity === 'medium' && 'Includes advanced AI features, multiple data sources, and third-party integrations.'}
                            {aiComplexity === 'complex' && 'Multi-system architecture with custom AI workflows and complex business logic.'}
                            {aiComplexity === 'enterprise' && 'Full-scale enterprise solution with high availability, security, and scalability.'}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Integrations */}
                    {aiComplexity && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">3. Required Integrations</label>
                        <p className="text-xs text-gray-500 mb-2">
                          Available integrations based on {aiComplexity} complexity level
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            let availableIntegrations = ['OpenAI API', 'Custom Database'];
                            
                            if (aiComplexity === 'medium' || aiComplexity === 'complex' || aiComplexity === 'enterprise') {
                              availableIntegrations.push('CRM System', 'Email Service', 'Payment Gateway', 'Analytics');
                            }
                            
                            if (aiComplexity === 'complex' || aiComplexity === 'enterprise') {
                              availableIntegrations.push('Web APIs', 'Mobile App', 'Third-party Services');
                            }
                            
                            if (aiComplexity === 'enterprise') {
                              availableIntegrations.push('Enterprise Systems', 'Advanced Security', 'Multi-tenant Architecture');
                            }
                            
                            return availableIntegrations;
                          })().map((integration) => (
                            <Button
                              key={integration}
                              variant={aiIntegrations.includes(integration) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (aiIntegrations.includes(integration)) {
                                  setAiIntegrations(aiIntegrations.filter(i => i !== integration));
                                } else {
                                  setAiIntegrations([...aiIntegrations, integration]);
                                }
                              }}
                            >
                              {integration}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Data Volume */}
                    {aiIntegrations.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">4. Expected Data Volume</label>
                        <Select value={dataVolume} onValueChange={setDataVolume}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose data volume..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (&lt; 10k records/month)</SelectItem>
                            <SelectItem value="medium">Medium (10k - 100k records/month)</SelectItem>
                            <SelectItem value="large">Large (100k - 1M records/month)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (&gt; 1M records/month)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Custom Models */}
                    {dataVolume && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customModels}
                            onChange={(e) => setCustomModels(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">5. Require custom AI model training</span>
                        </label>
                        <p className="text-xs text-gray-500">Custom models provide better accuracy but require additional development time and costs.</p>
                      </div>
                    )}

                    {/* Maintenance Support */}
                    {(dataVolume || customModels) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">6. Ongoing Support</label>
                        <Select value={maintenanceSupport} onValueChange={setMaintenanceSupport}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose support level..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (Documentation only)</SelectItem>
                            <SelectItem value="ongoing">Standard (6 months support)</SelectItem>
                            <SelectItem value="premium">Premium (12 months + priority support)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing Disclaimer */}
                {selectedService && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Pricing Disclaimer</h4>
                        <p className="text-sm text-blue-700">
                          Prices shown are estimates and not final. Actual pricing may vary based on specific requirements, 
                          project complexity, and additional services needed. Please contact us for a detailed quote.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Panel */}
            {pricing && (
              <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    Your Custom Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${pricing.monthlyPrice.toLocaleString()}
                      {(selectedService === 'web-development' || selectedService === 'ai-development') ? ' project' : (pricing.monthlyPrice > 0 ? '/month' : '')}
                    </div>
                    {pricing.setupFee > 0 && (
                      <div className="text-lg text-gray-600">
                        + ${pricing.setupFee.toLocaleString()} setup fee
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">{pricing.service}</div>
                  </div>

                  {(pricing.teamDiscount || 0) > 0 && (
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          Team Discount: {pricing.teamDiscount || 0}% off
                        </span>
                      </div>
                      <div className="text-sm text-green-700">
                        You save ${pricing.savings?.toLocaleString()} per month!
                      </div>
                    </div>
                  )}

                  {/* Google Ads Individual Client Pricing Breakdown */}
                  {selectedService === 'google-ads' && clients.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">Individual Client Pricing:</h4>
                      <div className="space-y-3">
                        {clients.map((client) => (
                          <div key={client.id} className="bg-white p-3 rounded border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-600">
                                  ${client.monthlyAdSpend.toLocaleString()}/month • {client.campaigns} campaigns
                                </div>
                              </div>
                              <div className="font-semibold text-blue-600">
                                ${calculateClientPrice(client).toLocaleString()}/month
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {client.campaignTypes.length > 0 && `Types: ${client.campaignTypes.join(', ')}`}
                              {client.campaignTypes.length > 3 && ' (+10% complexity bonus)'}
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-blue-300 pt-3 flex justify-between font-semibold text-blue-900">
                          <span>Total Monthly Price:</span>
                          <span>${pricing.monthlyPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEO Individual Client Pricing Breakdown */}
                  {selectedService === 'seo' && seoClients.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">Individual Website Pricing:</h4>
                      <div className="space-y-3">
                        {seoClients.map((client) => (
                          <div key={client.id} className="bg-white p-3 rounded border border-green-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-600">
                                  {client.targetKeywords} keywords • {client.competitionLevel} competition
                                </div>
                              </div>
                              <div className="font-semibold text-green-600">
                                ${calculateSeoClientPrice(client).toLocaleString()}/month
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Current ranking: {client.currentRanking.replace('-', ' ')}
                              {client.website && ` • ${client.website}`}
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-green-300 pt-3 flex justify-between font-semibold text-green-900">
                          <span>Total Monthly Price:</span>
                          <span>${pricing.monthlyPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">What's Included:</h4>
                    <ul className="space-y-2">
                      {pricing.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-gradient-to-r from-brand-coral to-pink-500 rand-coral/90 ink-500/90 text-white"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Get Quote</DialogTitle>
            <DialogDescription>
              Share your details to receive a personalized proposal based on your pricing calculator selections.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="text"
                  value={contactForm.website}
                  onChange={(e) => setContactForm(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Enter your website URL"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your domain (e.g., yoursite.com, www.yoursite.com, or https://yoursite.com)
                </p>
              </div>
            </div>
            
            {/* Quote Summary */}
            {pricing && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Your Quote Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{pricing.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Price:</span>
                    <span className="font-medium">${pricing.monthlyPrice.toLocaleString()}</span>
                  </div>
                  {pricing.setupFee > 0 && (
                    <div className="flex justify-between">
                      <span>Setup Fee:</span>
                      <span className="font-medium">${pricing.setupFee.toLocaleString()}</span>
                    </div>
                  )}
                  {pricing.teamDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Team Discount:</span>
                      <span className="font-medium">-{pricing.teamDiscount}%</span>
                    </div>
                  )}
                  {pricing.savings && (
                    <div className="flex justify-between text-green-600">
                      <span>Annual Savings:</span>
                      <span className="font-medium">${pricing.savings.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowContactModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={contactMutation.isPending}
                className="flex-1 bg-gradient-to-r from-brand-coral to-pink-500"
              >
                <Send className="w-4 h-4 mr-2" />
                {contactMutation.isPending ? "Sending..." : "Get Quote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
