import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import brandingBeezLogo from "@assets/BB_Logo_Color.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const openCalendly = () => {
    window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-brand-coral/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer">
                <img
                  src={brandingBeezLogo}
                  alt="BrandingBeez"
                  className="h-6 sm:h-8 w-auto object-contain"
                  width="112"
                  height="32"
                />
              </div>
            </Link>
          </div>

          {/* Navigation - Prevent layout shift with min-width */}
          <nav
            className="hidden md:flex space-x-8"
            style={{ minWidth: "560px" }}
          >
            <Link href="/">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Home
              </span>
            </Link>
            <Link href="/services">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/services" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Services
              </span>
            </Link>
            {/* <Link href="/onboarding-wizard">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/onboarding-wizard" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Find Service
              </span>
            </Link>
            <Link href="/pricing-calculator">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/pricing-calculator" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Calculator
              </span>
            </Link> */}
            <Link href="/blog">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/blog" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Blog
              </span>
            </Link>
            <Link href="/about">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/about" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                About
              </span>
            </Link>
            <Link href="/portfolio">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/portfolio" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Portfolio
              </span>
            </Link>
            {/* <Link href="/contact">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/contact" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                Contact
              </span>
            </Link> */}
            <Link href="/newsletter">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/news-letter" ? "text-brand-coral-darker" : "text-gray-700 hover:text-brand-coral-darker"}`}
              >
                News letter
              </span>
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={openCalendly}
              className="hidden sm:flex bg-gradient-to-r from-brand-coral to-pink-500 hover:from-brand-coral-dark hover:to-pink-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base touch-manipulation"
            >
              Book a Call
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 h-10 w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link href="/">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </button>
              </Link>
              <Link href="/services">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/services" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </button>
              </Link>
              <Link href="/onboarding-wizard">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/onboarding-wizard" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Find Service
                </button>
              </Link>
              <Link href="/pricing-calculator">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/pricing-calculator" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calculator
                </button>
              </Link>
              <Link href="/blog">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/blog" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </button>
              </Link>
              <Link href="/about">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/about" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </button>
              </Link>
              <Link href="/portfolio">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/portfolio" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </button>
              </Link>
              <Link href="/contact">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/contact" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </button>
              </Link>

              <Link href="/newsletter">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/contact" ? "text-brand-coral-darker bg-brand-coral/10" : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </button>
              </Link>

              <div className="pt-2 border-t border-gray-200">
                <Button
                  onClick={() => {
                    openCalendly();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-brand-coral-darker hover:bg-brand-coral-dark text-white px-4 py-3 rounded-lg transition-colors font-medium text-base touch-manipulation"
                >
                  Book a Call
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Export both default and named for compatibility
export { Header };
