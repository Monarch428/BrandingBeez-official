import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaMarkup } from "@/components/schema-markup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRegion } from "@/hooks/use-region";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Gift,
  CheckCircle,
  Star,
  Globe,
  Users,
  Zap,
  ArrowRight,
  Handshake,
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
    description: '', // This field is optional
    contactMethod: [] as string[],
    couponCode: ''
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
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
        contactMethod: [],
        couponCode: ''
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
    // Construct a comprehensive message
    const comprehensiveMessage = [
      `Service(s) Needed: ${formData.servicesNeeded.join(', ') || 'Not specified'}`,
      `Timeline: ${formData.timeline || 'Not specified'}`,
      `Budget: ${formData.budget || 'Not specified'}`,
      `Description: ${formData.description || 'No additional description provided'}`,
    ].join('\n');

    // This is where the change is applied.
    const submissionData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.companyName || 'Not provided',
      inquiry_type: 'contact-us-page-contact-form',
      message: comprehensiveMessage,
      preferred_contact: formData.contactMethod.join(', ') || 'email',
      country: regionConfig.code,
      topPriority: formData.servicesNeeded[0] || 'General Inquiry',
      couponCode: formData.couponCode,
      contactFormType: 'contact-us-page-contact-form'
    };

    contactMutation.mutate(submissionData);
  };

  const handleInputChange = (field: string, value: string) => {
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
              Contact Our Global Team
            </h1>
            <h2 className="text-xl text-gray-600">
              Ready to scale your agency? Let's talk about your project.
            </h2>
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
                <span className="font-semibold">{regionConfig.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe Free Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-brand-purple mb-4">Subscribe Free</h3>
            <p className="text-xl text-gray-600 mb-8">Join our newsletter for exclusive insights and updates on digital marketing trends</p>
            <Button 
              size="lg"
              className="bg-brand-coral hover:bg-brand-coral/90 text-white"
              onClick={() => window.open('https://zcmp.in/JzHy', '_blank')}
            >
              Subscribe Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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
                        placeholder="Enter your phone number"
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
                    <Label htmlFor="description">Project Description (Optional)</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us about your project, goals, and any specific requirements... (Optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
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
                        placeholder="Enter coupon code (e.g. SEO50, WEB20, ADS15)"
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
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white py-3"
                >
                  {contactMutation.isPending ? "Sending..." : "Get Quote"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  We'll contact you within 4 hours to discuss your project
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Other Ways to Reach Us Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-purple mb-4">Other Ways to Reach Us</h2>
              <p className="text-xl text-gray-600">Choose your preferred method of contact</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Phone className="w-12 h-12 mx-auto mb-4 text-brand-coral" />
                  <h4 className="text-xl font-semibold mb-2">Sales Inquiries</h4>
                  <p className="text-gray-600 mb-4">Speak directly with our sales team</p>
                  <p className="font-semibold text-brand-purple">{regionConfig.phone}</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 mx-auto mb-4 text-brand-coral" />
                  <h3 className="text-xl font-semibold mb-2">Careers</h3>
                  <p className="text-gray-600 mb-4">Join our growing team</p>
                  <Button variant="outline" className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white">
                    View Open Positions
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Handshake className="w-12 h-12 mx-auto mb-4 text-brand-coral" />
                  <h3 className="text-xl font-semibold mb-2">Partnerships</h3>
                  <p className="text-gray-600 mb-4">Explore partnership opportunities</p>
                  <Button variant="outline" className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white">
                    Partner With Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <SchemaMarkup 
          type="webpage"
          data={{
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact BrandingBeez",
            "description": "Contact BrandingBeez for white-label design, development, and marketing services.",
            "url": "https://brandingbeez.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "BrandingBeez",
              "telephone": regionConfig.phone,
              "email": regionConfig.email,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": regionConfig.code
              }
            }
          }}
        />
      </main>

      <Footer />
    </div>
  );
}