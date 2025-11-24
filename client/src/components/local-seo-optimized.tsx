import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/hooks/use-region";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Users, 
  Star,
  ExternalLink,
  Navigation,
  Building,
  Car,
  Wifi,
  CreditCard,
  Shield,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface LocalLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  features: string[];
  description: string;
  images: string[];
  type: "headquarters" | "branch" | "coworking" | "remote";
}

interface LocalSEOProps {
  showLocations?: boolean;
  showServiceAreas?: boolean;
  showLocalReviews?: boolean;
  showBusinessHours?: boolean;
  showNAPInfo?: boolean;
  variant?: "full" | "compact" | "sidebar";
  className?: string;
}

const locations: LocalLocation[] = [
  {
    name: "BrandingBeez US Headquarters",
    address: "123 Congress Ave, Suite 1400",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    country: "United States",
    phone: "+91 99524 62833",
    email: "austin@brandingbeez.com",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed"
    },
    services: ["SEO", "Web Development", "Google Ads", "Digital Marketing"],
    features: ["Free Parking", "WiFi", "Conference Rooms", "24/7 Security"],
    description: "Our main headquarters in Austin, Texas serves as the central hub for our US operations.",
    images: ["/api/placeholder/400/300"],
    type: "headquarters"
  },
  {
    name: "BrandingBeez West Coast Hub",
    address: "456 Market St, Floor 20",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
    phone: "+1 (415) 555-0456",
    email: "sf@brandingbeez.com",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    services: ["Business Automation", "SaaS Marketing", "Tech Consulting"],
    features: ["Public Transit Access", "WiFi", "Client Meeting Rooms"],
    description: "Our West Coast hub specializes in tech industry clients and automation solutions.",
    images: ["/api/placeholder/400/300"],
    type: "branch"
  },
  {
    name: "BrandingBeez East Coast Hub",
    address: "789 Broadway, Suite 500",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    country: "United States",
    phone: "+1 (212) 555-0789",
    email: "ny@brandingbeez.com",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    hours: {
      monday: "8:00 AM - 7:00 PM",
      tuesday: "8:00 AM - 7:00 PM",
      wednesday: "8:00 AM - 7:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    services: ["Financial Services Marketing", "E-commerce", "Brand Strategy"],
    features: ["Metro Access", "WiFi", "Client Workspace", "Reception"],
    description: "Our East Coast hub focuses on financial services and e-commerce clients.",
    images: ["/api/placeholder/400/300"],
    type: "branch"
  }
];

const serviceAreas = [
  { name: "Austin Metro", state: "TX", population: "2.3M", zipcodes: ["78701", "78702", "78703", "78704"] },
  { name: "San Francisco Bay Area", state: "CA", population: "7.7M", zipcodes: ["94102", "94103", "94104", "94105"] },
  { name: "New York Metro", state: "NY", population: "20.1M", zipcodes: ["10003", "10004", "10005", "10006"] },
  { name: "Dallas-Fort Worth", state: "TX", population: "7.6M", zipcodes: ["75201", "75202", "75203", "75204"] },
  { name: "Los Angeles", state: "CA", population: "13.2M", zipcodes: ["90210", "90211", "90212", "90213"] },
  { name: "Chicago", state: "IL", population: "9.5M", zipcodes: ["60601", "60602", "60603", "60604"] }
];

const localReviews = [
  {
    name: "Sarah Mitchell",
    business: "Austin Digital Agency",
    rating: 5,
    text: "BrandingBeez transformed our local SEO strategy. We're now ranking #1 for 'digital marketing Austin' and seeing 300% more local leads.",
    location: "Austin, TX",
    date: "2 weeks ago",
    service: "Local SEO"
  },
  {
    name: "Michael Chen",
    business: "SF Tech Solutions",
    rating: 5,
    text: "Their Google My Business optimization helped us get 5x more local calls. The San Francisco team really understands our market.",
    location: "San Francisco, CA",
    date: "1 month ago",
    service: "GMB Optimization"
  },
  {
    name: "Jennifer Rodriguez",
    business: "NYC Marketing Group",
    rating: 5,
    text: "Working with the New York office was seamless. They helped us dominate local search results across all 5 boroughs.",
    location: "New York, NY",
    date: "3 weeks ago",
    service: "Local SEO"
  }
];

export function LocalSEOOptimized({
  showLocations = true,
  showServiceAreas = true,
  showLocalReviews = true,
  showBusinessHours = true,
  showNAPInfo = true,
  variant = "full",
  className = ""
}: LocalSEOProps) {
  const { regionConfig } = useRegion();

  const getCurrentLocation = () => {
    return locations.find(loc => loc.phone === regionConfig.phone) || locations[0];
  };

  const renderLocationCard = (location: LocalLocation) => (
    <Card key={location.name} className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{location.name}</CardTitle>
          <Badge variant={location.type === "headquarters" ? "default" : "secondary"}>
            {location.type === "headquarters" ? "HQ" : "Branch"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address & Contact */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{location.address}</p>
              <p className="text-sm text-gray-600">
                {location.city}, {location.state} {location.zipCode}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-coral" />
            <a href={`tel:${location.phone}`} className="text-brand-coral ">
              {location.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-brand-coral" />
            <a href={`mailto:${location.email}`} className="text-brand-coral ">
              {location.email}
            </a>
          </div>
        </div>

        {/* Business Hours */}
        {showBusinessHours && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-medium">{location.hours.monday}</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium">{location.hours.saturday}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium">{location.hours.sunday}</span>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        <div>
          <h4 className="font-medium mb-2">Services Available</h4>
          <div className="flex flex-wrap gap-1">
            {location.services.map(service => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium mb-2">Amenities</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {location.features.map(feature => (
              <div key={feature} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Navigation className="w-4 h-4 mr-1" />
            Directions
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompactLocation = (location: LocalLocation) => (
    <div key={location.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-brand-coral/10 rounded-lg">
        <Building className="w-4 h-4 text-brand-coral" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{location.city}, {location.state}</h4>
        <p className="text-sm text-gray-600">{location.address}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-brand-coral">{location.phone}</p>
        <p className="text-xs text-gray-600">{location.type}</p>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {/* NAP Information */}
      {showNAPInfo && (
        <div className="bg-brand-coral/5 border border-brand-coral/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-brand-coral mb-2">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Name:</strong> BrandingBeez
            </div>
            <div>
              <strong>Address:</strong> {getCurrentLocation().address}
            </div>
            <div>
              <strong>Phone:</strong> {getCurrentLocation().phone}
            </div>
          </div>
        </div>
      )}

      {/* Locations */}
      {showLocations && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Locations</h2>
          <p className="text-gray-600 mb-6">
            We have offices across the United States to serve you better.
          </p>
          
          {variant === "full" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(renderLocationCard)}
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map(renderCompactLocation)}
            </div>
          )}
        </div>
      )}

      {/* Service Areas */}
      {showServiceAreas && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Service Areas</h2>
          <p className="text-gray-600 mb-6">
            We proudly serve businesses across major metropolitan areas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceAreas.map(area => (
              <Card key={area.name} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-coral/10 rounded-lg">
                    <Globe className="w-4 h-4 text-brand-coral" />
                  </div>
                  <div>
                    <h4 className="font-medium">{area.name}</h4>
                    <p className="text-sm text-gray-600">{area.state} • {area.population}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Local Reviews */}
      {showLocalReviews && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Local Client Reviews</h2>
          <p className="text-gray-600 mb-6">
            See what local businesses are saying about our services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localReviews.map((review, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-4">
                  "{review.text}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.business}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{review.location}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                
                <Badge variant="outline" className="mt-2">
                  {review.service}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Local CTA */}
      <div className="bg-gradient-to-r from-brand-purple to-purple-600 text-white p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Ready to Dominate Local Search?</h3>
        <p className="text-white/90 mb-4">
          Get a free local SEO audit and see how we can help your business rank higher in local search results.
        </p>
        <Button className="bg-white text-brand-purple ray-100">
          Get Free Local SEO Audit
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Google My Business Integration Component
export function GoogleMyBusinessWidget() {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">BrandingBeez</h3>
          <p className="text-sm text-gray-600">Digital Marketing Agency</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="font-medium">4.9</span>
          <span className="text-sm text-gray-600">(127 reviews)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-green-600">Open • Closes 6 PM</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-sm">Austin, TX</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button size="sm" className="flex-1">
          <Phone className="w-4 h-4 mr-1" />
          Call
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Navigation className="w-4 h-4 mr-1" />
          Directions
        </Button>
      </div>
    </div>
  );
}