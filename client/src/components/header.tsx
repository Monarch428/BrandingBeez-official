import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Search, MousePointerClick, Users, MonitorSmartphone, Cpu, Dot, } from "lucide-react";
import brandingBeezLogo from "@assets/BB_Logo_Color.png";
import { BookCallButtonWithModal } from "./book-appoinment";
import BB_Chris_Logo from "../../public/images/BB_Christmas_Logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesSubmenuOpen, setIsServicesSubmenuOpen] = useState(false);
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const [isDesktopServicesPinned, setIsDesktopServicesPinned] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [location, navigate] = useLocation(); // ✅ can navigate programmatically

  const openCalendly = () => {
    // window.open("https://calendly.com/vignesh-velusamy/30min", "_blank");
    window.open("/book-appointment", "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Desktop / mobile service links
  const serviceMenuItems = [
    {
      label: "SEO Services (White-label)",
      href: "/services/seo",
      description: "White-label SEO for agencies managing multiple clients.",
      icon: Search,
      recommended: false,
    },
    {
      label: "PPC Advertising (White-label)",
      href: "/services/google-ads",
      description: "Done-for-you Google Ads & PPC campaign management.",
      icon: MousePointerClick,
      recommended: false,
    },
    {
      label: "Dedicated Resources",
      href: "/services/dedicated-resources",
      description: "Hire designers, developers, SEO & PPC specialists.",
      icon: Users,
      recommended: true,
    },
    {
      label: "Website Design & Development (White-label)",
      href: "/services/web-development",
      description: "High-converting sites built for your agency clients.",
      icon: MonitorSmartphone,
      recommended: false,
    },
    {
      label: "Custom Web & Mobile Application Development (AI-Powered)",
      href: "/services/custom-app-development",
      description: "Custom apps & AI-powered solutions for scale.",
      icon: Cpu,
      recommended: false,
    },
  ];

  // ✅ CLICK HANDLER: one click = toggle + navigate (when opening)
  const handleDesktopServicesClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsDesktopServicesPinned((prev) => {
      const next = !prev;
      setIsDesktopServicesOpen(next);
      if (next) {
        navigate("/services");
      }
      return next;
    });
  };

  // ✅ close when clicking outside if pinned
  useEffect(() => {
    if (!isDesktopServicesPinned) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsDesktopServicesPinned(false);
        setIsDesktopServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDesktopServicesPinned]);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-brand-coral/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer">
                <img
                  src={BB_Chris_Logo}
                  alt="BrandingBeez"
                  className="h-16 w-auto object-contain"
                  width="320"
                  height="80"
                />
              </div>
            </Link>
          </div>

          {/* Navigation - Prevent layout shift with min-width */}
          <nav
            className="hidden md:flex items-center justify-center space-x-8"
            style={{ minWidth: "560px" }}
          >
            <Link href="/">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/"
                  ? "text-brand-coral-darker"
                  : "text-gray-700 hover:text-brand-coral-darker"
                  }`}
              >
                Home
              </span>
            </Link>

            {/* SERVICES MEGA MENU (Desktop) */}
            <div
              className="relative"
              ref={servicesRef}
              onMouseEnter={() => {
                setIsDesktopServicesOpen(true);
              }}
              onMouseLeave={() => {
                if (!isDesktopServicesPinned) {
                  setIsDesktopServicesOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={handleDesktopServicesClick}
                className={`inline-flex items-center gap-1 font-medium cursor-pointer transition-colors ${location.startsWith("/services") || isDesktopServicesOpen
                  ? "text-brand-coral-darker"
                  : "text-gray-700 hover:text-brand-coral-darker"
                  }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 mt-[1px] transition-transform duration-200 ${isDesktopServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isDesktopServicesOpen && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 mt-3 w-[720px] lg:w-[880px] max-w-[calc(100vw-4rem)] z-40">
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/5 p-4 sm:p-6 ring-1 ring-black/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {serviceMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} className="relative group">
                            <a className="block relative cursor-pointer rounded-xl px-3 py-3 border border-transparent hover:bg-brand-coral/10 hover:border-brand-coral hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-brand-coral">
                                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-white" />
                                  </div>
                                </div>

                                <div className="min-w-0 w-full">
                                  <div className="flex items-center gap-3">
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-brand-coral-darker truncate">
                                      {item.label}
                                    </div>

                                    {item.recommended && (
                                      <div className="flex items-center group/recommended">
                                        <span className="relative inline-flex items-center gap-1 text-[12px] font-bold px-3 py-[4px] rounded-full bg-brand-coral/10 text-brand-coral-darker">
                                          <Dot className="w-4 h-4 text-brand-coral" />
                                          <span>RECOMMENDED</span>
                                          <span
                                            className="absolute inset-0 rounded-full pointer-events-none animate-shimmer"
                                            aria-hidden="true"
                                            style={{
                                              boxShadow: "0 0 18px rgba(255, 255, 255, 0.6)",
                                              filter: "blur(8px)",
                                            }}
                                          />
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="ml-auto hidden sm:flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400 group-hover:text-brand-coral-darker"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            <Link href="/blog">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/blog"
                  ? "text-brand-coral-darker"
                  : "text-gray-700 hover:text-brand-coral-darker"
                  }`}
              >
                Blog
              </span>
            </Link>
            <Link href="/about">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/about"
                  ? "text-brand-coral-darker"
                  : "text-gray-700 hover:text-brand-coral-darker"
                  }`}
              >
                About
              </span>
            </Link>
            <Link href="/portfolio">
              <span
                className={`font-medium transition-colors cursor-pointer ${location === "/portfolio"
                  ? "text-brand-coral-darker"
                  : "text-gray-700 hover:text-brand-coral-darker"
                  }`}
              >
                Portfolio
              </span>
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <BookCallButtonWithModal
              buttonLabel="Book a call"
              className="hidden sm:flex bg-gradient-to-r from-brand-coral to-pink-500 hover:from-brand-coral-dark hover:to-pink-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base touch-manipulation"
              buttonSize="lg"
            // defaultServiceType="Website Development"
            />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 h-10 w-10"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (!isMobileMenuOpen) {
                  setIsServicesSubmenuOpen(false);
                }
              }}
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
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/"
                    ? "text-brand-coral-darker bg-brand-coral/10"
                    : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </button>
              </Link>

              {/* SERVICES with mobile submenu */}
              <div
                className={`flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location.startsWith("/services")
                  ? "text-brand-coral-darker bg-brand-coral/10"
                  : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                  }`}
              >
                {/* ⭐ Click text -> navigate to /services */}
                <button
                  className="flex-1 text-left"
                  onClick={() => {
                    navigate("/services");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Services
                </button>

                {/* ⭐ Click chevron -> toggle dropdown only */}
                <button
                  className="ml-2 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsServicesSubmenuOpen((prev) => !prev);
                  }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isServicesSubmenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              {isServicesSubmenuOpen && (
                <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">
                  {serviceMenuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <button
                        className="block w-full text-left px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50 transition-colors touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </button>
                    </Link>
                  ))}
                </div>
              )}

              {/* <Link href="/onboarding-wizard">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${
                    location === "/onboarding-wizard"
                      ? "text-brand-coral-darker bg-brand-coral/10"
                      : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Find Service
                </button>
              </Link> */}
              {/* <Link href="/pricing-calculator">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${
                    location === "/pricing-calculator"
                      ? "text-brand-coral-darker bg-brand-coral/10"
                      : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calculator
                </button>
              </Link> */}
              <Link href="/blog">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/blog"
                    ? "text-brand-coral-darker bg-brand-coral/10"
                    : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </button>
              </Link>
              <Link href="/about">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/about"
                    ? "text-brand-coral-darker bg-brand-coral/10"
                    : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </button>
              </Link>
              <Link href="/portfolio">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/portfolio"
                    ? "text-brand-coral-darker bg-brand-coral/10"
                    : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </button>
              </Link>
              <Link href="/contact">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${location === "/contact"
                    ? "text-brand-coral-darker bg-brand-coral/10"
                    : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </button>
              </Link>

              {/* <Link href="/newsletter">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors touch-manipulation ${
                    location === "/newsletter"
                      ? "text-brand-coral-darker bg-brand-coral/10"
                      : "text-gray-700 hover:text-brand-coral-darker hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </button>
              </Link> */}

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

export { Header };
