import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeaturedClientsManager } from "@/components/admin/featured-clients-manager";
import { CaseStudiesManager } from "@/components/admin/case-studies-manager";
import { PricingPackagesManager } from "@/components/admin/pricing-packages-manager";
import { ServicePagesManager } from "@/components/admin/service-pages-manager";
import { ContactsManager } from "@/components/admin/contacts-manager";
import { NewsletterSubscribersManager } from "@/components/admin/newsletter-subscribers-manager";
import { BlogPostsManager } from "@/components/admin/blog-posts-manager";
import { PortfolioItemsManager } from "@/components/admin/portfolio-items-manager";
import { useQuery } from "@tanstack/react-query";
import { 
  Settings, 
  Users, 
  FileText, 
  DollarSign, 
  Star,
  BarChart3,
  Target,
  Briefcase,
  MessageCircle,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  PenTool,
  ImageIcon
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Mock state setters for data fetching, these would typically be managed by useQuery or useState directly
  const [contacts, setContacts] = useState<any[]>([]);
  const [featuredClients, setFeaturedClients] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [pricingPackages, setPricingPackages] = useState<any[]>([]);
  const [servicePages, setServicePages] = useState<any[]>([]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          setUserInfo(data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        localStorage.removeItem('adminToken');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fetch data only when authenticated - moved to conditional hooks section
  const featuredClientsQuery = useQuery({
    queryKey: ["/api/admin/featured-clients"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/featured-clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch featured clients');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const caseStudiesQuery = useQuery({
    queryKey: ["/api/admin/case-studies"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/case-studies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch case studies');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const pricingPackagesQuery = useQuery({
    queryKey: ["/api/admin/pricing-packages"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/pricing-packages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch pricing packages');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const servicePagesQuery = useQuery({
    queryKey: ["/api/admin/service-pages"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/service-pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch service pages');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const contactsQuery = useQuery({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const newsletterSubscribersQuery = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/newsletter/subscribers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch newsletter subscribers');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const portfolioItemsQuery = useQuery({
    queryKey: ["/api/admin/portfolio-items"],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/portfolio-items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch portfolio items');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setUserInfo(data.user);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
    setLoggingIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUserInfo(null);
    setLoginData({ email: '', password: '' });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
        <Header />

        <main className="pt-16 pb-16">
          <div className="max-w-md mx-auto px-4">
            <Card className="p-8">
              <div className="w-16 h-16 bg-brand-purple rounded-lg flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-brand-purple mb-4 text-center">Admin Login</h1>
              <p className="text-gray-600 mb-6 text-center">
                Please enter your credentials to access the admin panel.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter admin email"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter admin password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{loginError}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-brand-purple hover:bg-brand-purple/90"
                  disabled={loggingIn}
                >
                  {loggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Secure Access</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  This admin panel is protected and only accessible to authorized users.
                </p>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Get data with proper fallbacks
  const stats = [
    {
      title: "Featured Clients",
      value: featuredClientsQuery.data?.length || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Case Studies", 
      value: caseStudiesQuery.data?.length || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pricing Packages",
      value: pricingPackagesQuery.data?.length || 0,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Service Pages",
      value: servicePagesQuery.data?.length || 0,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Contact Submissions",
      value: contactsQuery.data?.length || 0,
      icon: MessageCircle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Newsletter Subscribers",
      value: newsletterSubscribersQuery.data?.length || 0,
      icon: Mail,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Portfolio Items",
      value: portfolioItemsQuery.data?.length || 0,
      icon: ImageIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      {/* <Header /> */}

      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-purple rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-purple">Admin Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {userInfo?.email}</p>
                </div>
              </div>

              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>

            <Badge className="bg-brand-coral text-white">
              Content Management System
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="featured-clients">Featured Clients</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="service-pages">Service Pages</TabsTrigger>
              <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="portfolio-items">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-brand-purple">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.title}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Content Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">SEO Services</span>
                        <Badge>{featuredClientsQuery.data?.filter((c: any) => c.servicePage === 'seo').length || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Web Development</span>
                        <Badge>{featuredClientsQuery.data?.filter((c: any) => c.servicePage === 'web-development').length || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Google Ads</span>
                        <Badge>{featuredClientsQuery.data?.filter((c: any) => c.servicePage === 'google-ads').length || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Business Automation</span>
                        <Badge>{featuredClientsQuery.data?.filter((c: any) => c.servicePage === 'ai-development').length || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("featured-clients");
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Add Featured Client
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("case-studies");
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Create Case Study
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("pricing");
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Manage Pricing
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("service-pages");
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Edit Service Pages
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("contacts");
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Contacts
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab("blog-posts")}
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        Manage Blog Posts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contacts">
              <ContactsManager />
            </TabsContent>

            <TabsContent value="newsletter">
              <NewsletterSubscribersManager />
            </TabsContent>

            <TabsContent value="featured-clients">
              <FeaturedClientsManager />
            </TabsContent>

            <TabsContent value="case-studies">
              <CaseStudiesManager />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingPackagesManager />
            </TabsContent>

            <TabsContent value="service-pages">
              <ServicePagesManager />
            </TabsContent>

            <TabsContent value="blog-posts">
              <BlogPostsManager />
            </TabsContent>

            <TabsContent value="portfolio-items">
              <PortfolioItemsManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}