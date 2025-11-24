import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactFormOptimized } from "@/components/contact-form-optimized";
import { TrustBar } from "@/components/trust-bar";
import { useRegion } from "@/hooks/use-region";
import { Link } from "wouter";
import { 
  Search, 
  Code, 
  Zap, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
  Award,
  Target,
  Shield,
  Handshake,
  ChevronRight,
  Play,
  Download,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import brandingBeezLogo from "@assets/Logo_1751475462352.jpg";
import bniLogo from "@assets/BNI_logo_Red_PMS_Final_1751475594524.png";

export default function Home() {
  const { regionConfig } = useRegion();

  const openCalendly = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: regionConfig.calendlyUrl });
    } else {
      window.open(regionConfig.calendlyUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral text-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <span className="text-sm font-semibold text-white">✓ Trusted by 25+ Agencies Worldwide</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Scale Your Agency 
                  <span className="text-brand-yellow"> Without Hiring</span>
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  White-label digital services that help agencies deliver exceptional results to their clients. 
                  From SEO to web development, we handle the work so you can focus on growth.
                </p>
                
                {/* Key Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-yellow" />
                    <span className="text-lg text-white">100% White-Label</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-yellow" />
                    <span className="text-lg text-white">24hr Response Time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-yellow" />
                    <span className="text-lg text-white">85% Satisfaction Rate</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-brand-coral rand-coral-dark text-white px-8 py-4"
                    onClick={openCalendly}
                  >
                    Book Your Free Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-brand-purple px-8 py-4"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    View Our Case Studies
                  </Button>
                </div>
              </div>
              
              {/* Hero Visual */}
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <div className="w-32 h-32 bg-white/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Meet Your Dedicated Team</h3>
                  <p className="text-white/80 mb-6">
                    Vetted professionals ready to scale your agency
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-white hite/20 border border-white/30"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar Section */}
        <TrustBar />

        {/* Services Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive digital solutions for your agency
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Service Cards */}
              <Card className="card-hover-effect p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Services</h3>
                <p className="text-gray-600 text-sm">Drive organic traffic with our expert optimization</p>
              </Card>
              
              <Card className="card-hover-effect p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Development</h3>
                <p className="text-gray-600 text-sm">Custom websites that convert visitors to customers</p>
              </Card>
              
              <Card className="card-hover-effect p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Ads</h3>
                <p className="text-gray-600 text-sm">Maximize ROI with targeted advertising campaigns</p>
              </Card>
              
              <Card className="card-hover-effect p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automation</h3>
                <p className="text-gray-600 text-sm">Streamline workflows with intelligent automation</p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Scale Your Agency?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join 25+ agencies worldwide that trust BrandingBeez for their white-label needs
              </p>
              <Button 
                size="lg" 
                className="bg-white text-brand-purple hite/90 px-8 py-4"
                onClick={openCalendly}
              >
                Book Your Free Strategy Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Meet Your Dedicated Team</p>
                    <p className="text-sm opacity-80">Vetted professionals ready to scale your agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* US Agencies Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">
                7+ US Agencies Are Scaling With Us
              </h2>
              <p className="text-xl text-gray-600">
                Trusted by leading US agencies to deliver exceptional results
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Digital Agency NYC</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Target className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Growth Partners LA</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Spark Creative</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Team Solutions</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Secure Web Co</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Code className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Code Masters</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Award className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Layer Design</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-2">
                    <Handshake className="w-8 h-8 text-brand-coral" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Elite Studios</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Logos */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-brand-purple mb-8">Networking Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <img src={bniLogo} alt="BNI" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              <div className="text-2xl font-bold text-gray-400">Master Network</div>
              <div className="text-2xl font-bold text-gray-400">H7</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-coral">25+</div>
                <div className="text-sm text-gray-600">Partner Agencies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-coral">85%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-coral">24hr</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Success Stories Carousel */}
        <section className="py-16 px-4 bg-white" id="case-studies">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Client Success Stories</h2>
              <p className="text-xl text-gray-600">See how we've helped agencies scale and succeed</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className=" transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-4">
                    "Increased our capacity by 300% while maintaining quality. 
                    BrandingBeez has been instrumental in our growth."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-coral/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">CEO, DigitalCraft Agency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-4">
                    "Best white-label partner we've ever worked with. 
                    The quality and turnaround times are exceptional."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-coral/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <p className="font-semibold">Michael Chen</p>
                      <p className="text-sm text-gray-600">Founder, GrowthLab</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className=" transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-4">
                    "ROI was visible within the first month. 
                    They've become an essential part of our team."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-coral/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <p className="font-semibold">Emily Rodriguez</p>
                      <p className="text-sm text-gray-600">Director, ScaleUp Marketing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/about">
                <Button variant="outline" className="border-brand-coral text-brand-coral rand-coral hite">
                  View All Success Stories
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Most Used Services Grid */}
        <section className="py-16 px-4" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Most Used Services</h2>
              <p className="text-xl text-gray-600">Our top 4 services that agencies choose most</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className=" ">
                <CardHeader className="flex-grow">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-rand-coral/20 transition-colors">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg font-bold text-brand-purple">Dedicated Resources</CardTitle>
                  <p className="text-gray-600">Scale your team with vetted professionals</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-2xl font-bold text-brand-coral mb-4">Starting at $2,800/month</div>
                  <Link href="/services">
                    <Button className="w-full bg-brand-coral rand-coral/90 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className=" ">
                <CardHeader className="flex-grow">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-rand-coral/20 transition-colors">
                    <Code className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg font-bold text-brand-purple">Website Development</CardTitle>
                  <p className="text-gray-600">Custom websites that convert</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-2xl font-bold text-brand-coral mb-4">Starting at $2,500/project</div>
                  <Link href="/services/web-development">
                    <Button className="w-full bg-brand-coral rand-coral/90 text-white">
                      View Portfolio
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className=" ">
                <CardHeader className="flex-grow">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-rand-coral/20 transition-colors">
                    <Search className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg font-bold text-brand-purple">SEO</CardTitle>
                  <p className="text-gray-600">Drive organic traffic and rankings</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-2xl font-bold text-brand-coral mb-4">Starting at $1,500/month</div>
                  <Link href="/services/seo">
                    <Button className="w-full bg-brand-coral rand-coral/90 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className=" ">
                <CardHeader className="flex-grow">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4 group-rand-coral/20 transition-colors">
                    <Zap className="w-6 h-6 text-brand-coral" />
                  </div>
                  <CardTitle className="text-lg font-bold text-brand-purple">Custom App Development</CardTitle>
                  <p className="text-gray-600">Tailored applications for your needs</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-2xl font-bold text-brand-coral mb-4">Starting at $7,500/project</div>
                  <Link href="/services">
                    <Button className="w-full bg-brand-coral rand-coral/90 text-white">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" className="border-brand-coral text-brand-coral rand-coral hite px-8 py-3">
                  View All Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>



        {/* Contact Section */}
        <section className="py-16 px-4 bg-brand-purple text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Agency?</h2>
                <p className="text-xl text-gray-200 mb-8">
                  Join 150+ agencies that trust us to deliver exceptional results for their clients.
                </p>
                
                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-coral" />
                    <span>hello@brandingbeez.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-coral" />
                    <span>123 Business Ave, NYC</span>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white text-black">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="agencyName">Agency Name</Label>
                        <Input
                          id="agencyName"
                          type="text"
                          value={formData.agencyName}
                          onChange={(e) => handleInputChange('agencyName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="servicesInterested">Services Interested In</Label>
                      <Select value={formData.servicesInterested} onValueChange={(value) => handleInputChange('servicesInterested', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SEO Services">SEO Services</SelectItem>
                          <SelectItem value="Website Development">Website Development</SelectItem>
                          <SelectItem value="N8N Automation">N8N Automation</SelectItem>
                          <SelectItem value="Google Ads">Google Ads</SelectItem>
                          <SelectItem value="Multiple Services">Multiple Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your agency and goals..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-brand-coral rand-coral/90 text-white"
                    >
                      {contactMutation.isPending ? 'Submitting...' : 'Schedule Free Consultation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}