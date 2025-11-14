import { Facebook, Linkedin, Phone, Mail, MapPin, Instagram, Globe, Award } from "lucide-react";
import { useRegion } from "@/hooks/use-region";
import brandingBeezLogo from "@assets/BB_Logo_footer.png";
import designRushBadge from "@assets/View our Profile - Inverted 2_1754040098404.png";
import clutchLogo from "@assets/clutch_1754040557107.png";
import goodFirmsLogo from "@assets/Unknown_1754040557107.png";
import sortlistLogo from "@assets/123_1754042746428.png";
import bniLogo from "@assets/bni_1752907520728.jpg";
import masterNetworksLogo from "@assets/mn_1752907520731.jpg";
import h7NetworksLogo from "@assets/h7_1752907520730.jpg";

export default function Footer() {
  const { regionConfig } = useRegion();
  const currentYear = new Date().getFullYear();
  
  // BrandingBeez White Logo - already optimized for dark backgrounds
  const BrandingBeezLogo = () => (
    <img 
      src={brandingBeezLogo} 
      alt="BrandingBeez" 
      className="h-10 sm:h-12 w-32 mb-4" 
      width="112" 
      height="42" 
      style={{aspectRatio: '3.5/1'}}
    />
  );

  // X.com Icon Component
  const XIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  // Behance Icon Component
  const BehanceIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7v10c0 .55.45 1 1 1h5.5c3.04 0 5.5-2.46 5.5-5.5v-1C12 8.46 9.54 6 6.5 6H1c-.55 0-1 .45-1 1zm2 2h4.5c1.93 0 3.5 1.57 3.5 3.5S8.43 16 6.5 16H2V9zm7.5-2h7v1.5h-7V7zm2.5 8.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5zm0-4c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5z"/>
    </svg>
  );

  // Pinterest Icon Component
  const PinterestIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.99-5.373 11.99-12C24 5.372 18.627.001 12.001.001z"/>
    </svg>
  );

  // Reddit Icon Component  
  const RedditIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-brand-purple text-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h2 className="font-semibold mb-4 text-base">BrandingBeez</h2>
            <BrandingBeezLogo />
            <p className="text-gray-400 mb-4 max-w-md text-sm">
              Trusted white-label partner since 2020.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/brandingbeez/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hite transition-colors touch-manipulation"
                aria-label="Visit BrandingBeez LinkedIn profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/BrandingBeez/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hite transition-colors touch-manipulation"
                aria-label="Visit BrandingBeez Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/brandingbeez/?igsh=ZHY0eGtvY2p3bm5p#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hite transition-colors touch-manipulation"
                aria-label="Visit BrandingBeez Instagram profile"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.behance.net/brandingbeez" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hite transition-colors touch-manipulation"
                aria-label="Visit BrandingBeez Behance portfolio"
              >
                <BehanceIcon />
              </a>
              <a 
                href="https://in.pinterest.com/brandingbeez/_created/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hite transition-colors touch-manipulation"
                aria-label="Visit BrandingBeez Pinterest boards"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://brandingbeez.co.uk/services/ai-development" className="hite transition-colors text-sm touch-manipulation">AI Development</a></li>
              <li><a href="/services/web-development" className="hite transition-colors text-sm touch-manipulation">Web Development</a></li>
              <li><a href="/services/seo" className="hite transition-colors text-sm touch-manipulation">SEO Services</a></li>
              <li><a href="/services/google-ads" className="hite transition-colors text-sm touch-manipulation">Google Ads</a></li>
              <li><a href="/services/dedicated-resources" className="hite transition-colors text-sm touch-manipulation">Dedicated Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Menus</h3>
            <ul className="space-y-2 text-gray-400">
              {/* <li><a href="https://brandingbeez.co.uk/services/ai-development" className="hite transition-colors text-sm touch-manipulation">AI Development</a></li> */}
              <li><a href="/onboarding-wizard" className="hite transition-colors text-sm touch-manipulation">Find Service</a></li>
              <li><a href="/pricing-calculator" className="hite transition-colors text-sm touch-manipulation">Calculator</a></li>
              <li><a href="/contact" className="hite transition-colors text-sm touch-manipulation">Contact</a></li>
              {/* <li><a href="/services/dedicated-resources" className="hite transition-colors text-sm touch-manipulation">Dedicated Resources</a></li> */}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-base">
              <span className="truncate">Contact</span>
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                <a href="mailto:info@brandingbeez.co.uk" className="hite transition-colors text-sm break-all touch-manipulation">
                  info@brandingbeez.co.uk
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" />
                <a href="tel:+919952462833" className="hite transition-colors text-sm touch-manipulation">
                  +91 99524 62833
                </a>
              </li>
              <li className="text-sm">
                <a 
                  href="https://calendly.com/vignesh-velusamy/30min" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-coral rand-coral-light transition-colors touch-manipulation"
                >
                  Book Consultation
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Directory Listings & Networking Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-gray-800">
          {/* Directory Listings */}
          <div>
            <h3 className="font-semibold mb-4 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-coral" />
              Listed On
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <a 
                href="https://www.designrush.com/agency/profile/brandingbeez" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <img src={designRushBadge} alt="BrandingBeez's rating on AI App Development Agency Listing by DesignRush, the industry-leading B2B Marketplace connecting brands with agencies" className="h-14 w-auto" loading="lazy" decoding="async" />
              </a>
              <a 
                href="https://clutch.co/profile/brandingbeez" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <img src={clutchLogo} alt="Clutch" className="h-10 w-auto" loading="lazy" decoding="async" />
              </a>
              <a 
                href="https://www.goodfirms.co/company/brandingbeez" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <img src={goodFirmsLogo} alt="GoodFirms" className="h-10 w-auto" loading="lazy" decoding="async" />
              </a>
              <a 
                href="https://www.sortlist.com/agency/brandingbeez" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <img src={sortlistLogo} alt="Sortlist" className="h-10 w-auto" loading="lazy" decoding="async" />
              </a>
            </div>
          </div>
          
          {/* Networking Partners */}
          <div>
            <h3 className="font-semibold mb-4 text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-coral" />
              Networking Partners
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20">
                <img src={bniLogo} alt="BNI" className="h-10 w-auto object-contain" loading="lazy" decoding="async" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20">
                <img src={masterNetworksLogo} alt="Master Networks" className="h-10 w-auto object-contain" loading="lazy" decoding="async" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20">
                <img src={h7NetworksLogo} alt="H7 Networks" className="h-10 w-auto object-contain" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="py-4 sm:py-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400">
            <a href="/privacy-policy" className="hover:text-white transition-colors touch-manipulation">Privacy Policy</a>
            <span className="text-gray-600">•</span>
            <a href="/terms-of-service" className="hover:text-white transition-colors touch-manipulation">Terms of Service</a>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-4 sm:pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} BrandingBeez. Trusted white-label partner since 2020.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Export both default and named for compatibility
export { Footer };
