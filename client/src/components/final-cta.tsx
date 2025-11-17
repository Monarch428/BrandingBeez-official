import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useRegion } from "@/hooks/use-region";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Phone } from "lucide-react";
import type { InsertContact } from "@shared/schema";

const serviceOptions = [
  "AI Agents Development",
  "Website Development", 
  "SEO Services",
  "Google Ads Management",
  "Branding & Design",
  "Dedicated Resources",
  "N8N Automation",
  "Multiple Services"
];

export function FinalCTA() {
  const { regionConfig, allRegions } = useRegion();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agencyName: "",
    country: regionConfig.name,
    topPriority: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/contacts", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll reach out within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        agencyName: "",
        country: regionConfig.name,
        topPriority: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build comprehensive submission data
    const submissionData = {
      name: formData.name,
      email: formData.email,
      company: formData.agencyName || 'Not provided',
      phone: '', // Not collected in this form
      inquiry_type: 'contact-form',
      message: `Home Page Contact Form Submission\n\n📋 SERVICE INTEREST: ${formData.topPriority}\n\n📢 REGION: ${formData.country}`,
      preferred_contact: 'email',
      country: formData.country,
      topPriority: formData.topPriority,
      agencyName: formData.agencyName,
      couponCode: null,
      service: formData.topPriority
    };
    
    contactMutation.mutate(submissionData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-brand-coral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {regionConfig.contactFormTitle}
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            {regionConfig.contactFormSubtitle}
          </p>
        </div>
        
        {/* Calendly Embed Section */}
        <Card className="bg-white rounded-2xl p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {regionConfig.code === 'DE' ? 'Planen Sie Ihr Strategiegespräch' : 'Schedule Your Strategy Call'}
              </h3>
              <p className="text-gray-600">
                {regionConfig.code === 'DE' ? 'Wählen Sie eine Zeit, die für Sie passt' : 'Choose a time that works for you'}
              </p>
            </div>
            
            {/* Calendly embed placeholder */}
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <Calendar className="text-gray-400 w-16 h-16 mb-4 mx-auto" />
              <p className="text-gray-600 font-medium mb-2">Calendly Widget</p>
              <p className="text-gray-500 text-sm mb-4">Regional timezone handling: {regionConfig.timezone}</p>
              <Button 
                onClick={() => {
                  if ((window as any).Calendly) {
                    (window as any).Calendly.initPopupWidget({ url: regionConfig.calendlyUrl });
                  } else {
                    window.open(regionConfig.calendlyUrl, '_blank');
                  }
                }}
                className="bg-brand-coral rand-coral-dark"
              >
                Open Calendly
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Regional Contact Info Banner */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto mb-8 shadow-lg border border-brand-coral/20">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-brand-purple mb-2">
              {regionConfig.code === 'DE' ? 'Ihre regionalen Kontaktdaten' : 'Your Regional Contact Details'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>{regionConfig.flag}</span>
              <span className="font-semibold text-brand-coral">{regionConfig.name}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-brand-wings/50 rounded-lg">
              <Mail className="w-6 h-6 text-brand-coral mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{regionConfig.code === 'DE' ? 'E-Mail' : 'Email'}</p>
              <p className="font-semibold text-brand-purple">{regionConfig.email}</p>
            </div>
            <div className="p-4 bg-brand-wings/50 rounded-lg">
              <Phone className="w-6 h-6 text-brand-coral mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{regionConfig.code === 'DE' ? 'Telefon' : 'Phone'}</p>
              <p className="font-semibold text-brand-purple">{regionConfig.phone}</p>
            </div>
            <div className="p-4 bg-brand-wings/50 rounded-lg">
              <Calendar className="w-6 h-6 text-brand-coral mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{regionConfig.code === 'DE' ? 'Zeitzone' : 'Timezone'}</p>
              <p className="font-semibold text-brand-purple">{regionConfig.timezone}</p>
            </div>
          </div>
        </div>

        {/* Alternative Contact Form */}
        <Card className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
          <CardContent className="p-0">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {regionConfig.code === 'DE' ? 'Oder nehmen Sie Kontakt auf' : 'Or Get in Touch'}
              </h3>
              <p className="text-gray-600">
                {regionConfig.code === 'DE' ? 'Wir melden uns innerhalb von 24 Stunden' : 'We\'ll reach out within 24 hours'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</Label>
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Your Name" 
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="your@email.com" 
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-2">Agency Name</Label>
                  <Input 
                    id="agencyName"
                    type="text" 
                    placeholder="Your Agency"
                    value={formData.agencyName}
                    onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {allRegions.map((region) => (
                        <SelectItem key={region.code} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="topPriority" className="block text-sm font-medium text-gray-700 mb-2">Top Priority</Label>
                <Select value={formData.topPriority} onValueChange={(value) => handleInputChange('topPriority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your top priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-coral text-white px-8 py-4 rounded-lg rand-coral-dark transition-colors font-semibold text-lg"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
