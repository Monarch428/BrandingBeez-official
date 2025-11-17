import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContactFormOptimized } from "@/components/contact-form-optimized";
import { useRegion } from "@/hooks/use-region";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Headphones,
  Users,
  Building,
  Calendar,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Gift,
  Copy
} from "lucide-react";

export default function Contact() {
  const { regionConfig } = useRegion();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    servicesNeeded: [] as string[],
    timeline: '',
    budget: '',
    description: '',
    contactMethod: [] as string[],
    couponCode: ''
  });

  // Auto-fill coupon code and service from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const couponFromUrl = urlParams.get('coupon');
    const serviceFromUrl = urlParams.get('service');
    
    setFormData(prev => ({
      ...prev,
      ...(couponFromUrl && { couponCode: couponFromUrl }),
      ...(serviceFromUrl && { servicesNeeded: [serviceFromUrl] })
    }));
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter(s => s !== service)
        : [...prev.servicesNeeded, service]
    }));
  };

  const handleContactMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethod: prev.contactMethod.includes(method)
        ? prev.contactMethod.filter(m => m !== method)
        : [...prev.contactMethod, method]
    }));
  };

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "We'll contact you within 4 hours to schedule your free consultation.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        website: '',
        industry: '',
        companySize: '',
        servicesNeeded: [],
        timeline: '',
        budget: '',
        description: '',
        contactMethod: []
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Please try again or call us directly at (855) SCALE-UP.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      company: formData.companyName,
      inquiry_type: formData.servicesNeeded.join(', ') || 'General Inquiry',
      message: formData.description,
      preferred_contact: formData.contactMethod.join(', ') || 'email',
      country: regionConfig.code,
      topPriority: formData.servicesNeeded[0] || 'General Inquiry',
      couponCode: formData.couponCode
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-wings via-white to-brand-wings/30">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="text-sm text-gray-500 mb-4">
              Home &gt; Contact
            </nav>
            <h1 className="text-4xl font-bold text-brand-purple mb-4">
              Get in Touch with Our Team
            </h1>
            <p className="text-xl text-gray-600">
              Ready to scale your agency? Let's discuss your needs.
            </p>
          </div>
        </section>

        {/* Quick Contact Bar */}
        <section className="py-4 px-4 bg-brand-coral text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">(855) SCALE-UP</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">hello@brandingbeez.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-semibold">Live support available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Our Office</h2>
              <p className="text-xl text-gray-600">Visit us at our New York headquarters</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Office Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-brand-purple flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    New York Headquarters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">123 Business Avenue, Suite 500<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">+91 99524 62833</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">ny@brandingbeez.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-coral mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Hours</p>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday-Friday: 9:00 AM - 6:00 PM EST</p>
                        <p>Saturday: 10:00 AM - 2:00 PM EST</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Getting Here</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Parking:</strong> Street parking and nearby garages
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Public Transit:</strong> 2 blocks from Union Square subway
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Map Placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-brand-coral mx-auto mb-2" />
                      <p className="text-gray-600 font-semibold">Interactive Map</p>
                      <p className="text-sm text-gray-500">123 Business Avenue, NYC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Primary Contact Form */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Start Your Project Today</h2>
              <p className="text-xl text-gray-600">Tell us about your project and we'll get back to you within 4 hours</p>
            </div>
            
            {/* Promo Code Confirmation Alert */}
            {formData.couponCode && (
              <div className="max-w-2xl mx-auto mb-8">
                <Alert className="border-green-200 bg-green-50">
                  <Gift className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Promo code {formData.couponCode} applied!</strong> 
                    {formData.couponCode === 'SEO50' && ' Enjoy 50% off your first SEO service.'}
                    {formData.couponCode === 'WEB20' && ' Enjoy 20% off your first website project!'}
                    {formData.couponCode === 'ADS15' && ' Enjoy 15% off your first Google Ads project!'}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-brand-purple mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-brand-purple mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 employees</SelectItem>
                            <SelectItem value="6-25">6-25 employees</SelectItem>
                            <SelectItem value="26-100">26-100 employees</SelectItem>
                            <SelectItem value="100+">100+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-purple mb-4">Project Details</h3>
                    
                    {/* Services Needed */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">Services Needed (Select all that apply)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'SEO Services',
                          'Website Development', 
                          'N8N Automation',
                          'Google Ads Management',
                          'Dedicated Resources',
                          'AI SaaS Development'
                        ].map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.servicesNeeded.includes(service)}
                              onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <Label htmlFor={service} className="text-sm">{service}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">ASAP (Within 2 weeks)</SelectItem>
                            <SelectItem value="1-month">1 Month</SelectItem>
                            <SelectItem value="2-3-months">2-3 Months</SelectItem>
                            <SelectItem value="3+-months">3+ Months</SelectItem>
                            <SelectItem value="exploring">Just exploring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">Under $5,000</SelectItem>
                            <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                            <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                            <SelectItem value="50k+">$50,000+</SelectItem>
                            <SelectItem value="not-sure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        maxLength={500}
                        placeholder="Tell us about your project, goals, and any specific requirements..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">Preferred Contact Method</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          'Phone call',
                          'Email',
                          'Video meeting',
                          'In-person meeting'
                        ].map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox
                              id={method}
                              checked={formData.contactMethod.includes(method)}
                              onCheckedChange={() => handleContactMethodToggle(method)}
                            />
                            <Label htmlFor={method} className="text-sm">{method}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-brand-purple mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-brand-coral" />
                      Special Offer
                    </h3>
                    <div>
                      <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="couponCode"
                          type="text"
                          placeholder="Enter coupon code (e.g. SEO50OFF, WEB50OFF)"
                          value={formData.couponCode}
                          onChange={(e) => handleInputChange('couponCode', e.target.value)}
                          className="flex-1"
                        />
                        {formData.couponCode && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('couponCode', '')}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      {formData.couponCode && (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Coupon code "{formData.couponCode}" will be applied to your project
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      size="lg"
                      className="bg-brand-coral rand-coral/90 text-white px-8"
                    >
                      {contactMutation.isPending ? 'Submitting...' : 'Schedule Free Consultation'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-3">
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Alternative Contact Methods */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Other Ways to Reach Us</h2>
              <p className="text-xl text-gray-600">Choose the method that works best for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">Sales Inquiries</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> sales@brandingbeez.com</p>
                    <p><strong>Phone:</strong> (855) SCALE-UP ext. 1</p>
                    <p><strong>Best for:</strong> New project discussions, pricing questions</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">Support Requests</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> support@brandingbeez.com</p>
                    <p><strong>Phone:</strong> (855) SCALE-UP ext. 2</p>
                    <p><strong>Portal:</strong> client.brandingbeez.com</p>
                    <p><strong>Best for:</strong> Existing project support, technical issues</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center  transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-brand-coral" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-purple mb-2">Partnership Opportunities</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> partners@brandingbeez.com</p>
                    <p><strong>Phone:</strong> (855) SCALE-UP ext. 3</p>
                    <p><strong>Best for:</strong> Referral partnerships, strategic alliances</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Quick answers to common questions</p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-brand-purple mb-2">What's your typical response time?</h3>
                  <p className="text-gray-600">We respond to all inquiries within 4 hours during business hours.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-brand-purple mb-2">Do you offer free consultations?</h3>
                  <p className="text-gray-600">Yes, all initial strategy consultations are complimentary.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-brand-purple mb-2">Can we visit your office?</h3>
                  <p className="text-gray-600">Absolutely! Schedule an appointment and we'll give you a tour.</p>
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