import React, { memo, useMemo } from "react";
import { Facebook, Linkedin, Phone, Mail, MapPin, Instagram, Globe, Award } from "lucide-react";
import { useRegion } from "@/hooks/use-region";

import designRushBadge from "@assets/View our Profile - Inverted 2_1754040098404.png";
import clutchLogo from "@assets/clutch_1754040557107.png";
import goodFirmsLogo from "@assets/Unknown_1754040557107.png";
import sortlistLogo from "@assets/123_1754042746428.png";
import bniLogo from "@assets/bni_1752907520728.jpg";
import masterNetworksLogo from "@assets/mn_1752907520731.jpg";
import h7NetworksLogo from "@assets/h7_1752907520730.jpg";

const superbLogo = "/images/superb.png";
const semrushLogo = "/images/Semrush.png";
const BB_Chris_Logo = "/images/BB_Christmas_Logo_White.webp";


import { BookCallButtonWithModal } from "./book-appoinment";

/** -----------------------------
 *  Small SVG Icons (static)
 *  ----------------------------- */
const XIcon = memo(function XIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
});

const BehanceIcon = memo(function BehanceIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 7v10c0 .55.45 1 1 1h5.5c3.04 0 5.5-2.46 5.5-5.5v-1C12 8.46 9.54 6 6.5 6H1c-.55 0-1 .45-1 1zm2 2h4.5c1.93 0 3.5 1.57 3.5 3.5S8.43 16 6.5 16H2V9zm7.5-2h7v1.5h-7V7zm2.5 8.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5zm0-4c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5z" />
    </svg>
  );
});

const PinterestIcon = memo(function PinterestIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.99-5.373 11.99-12C24 5.372 18.627.001 12.001.001z" />
    </svg>
  );
});

/** -----------------------------
 *  Shared UI helpers
 *  ----------------------------- */
function FooterLink({
  href,
  children,
  external,
  ariaLabel,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const rel = external ? "noopener noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={[
        "text-gray-400 transition-colors",
        "hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        "touch-manipulation",
        className,
      ].join(" ")}
    >
      {children}
    </a>
  );
}

const BrandingBeezLogo = memo(function BrandingBeezLogo() {
  return (
    <div className="mb-4">
      <img
        src={BB_Chris_Logo}
        alt="BrandingBeez"
        className="h-14 sm:h-16 md:h-20 w-auto max-w-[260px] object-contain"
        loading="lazy"
        decoding="async"
        width={260}
        height={80}
      />
    </div>
  );
});

/** -----------------------------
 *  Main Footer
 *  ----------------------------- */
function FooterImpl() {
  // Keep hook (you may use regionConfig later). If unused, it’s still safe.
  useRegion();

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const socialLinks = useMemo(
    () => [
      {
        href: "https://www.linkedin.com/company/brandingbeez/",
        label: "Visit BrandingBeez LinkedIn profile",
        icon: <Linkedin className="w-5 h-5" aria-hidden="true" />,
      },
      {
        href: "https://www.facebook.com/Brandingbeezuk",
        label: "Visit BrandingBeez Facebook page",
        icon: <Facebook className="w-5 h-5" aria-hidden="true" />,
      },
      {
        href: "https://www.instagram.com/brandingbeez/?igsh=ZHY0eGtvY2p3bm5p#",
        label: "Visit BrandingBeez Instagram profile",
        icon: <Instagram className="w-5 h-5" aria-hidden="true" />,
      },
      {
        href: "https://www.behance.net/brandingbeez",
        label: "Visit BrandingBeez Behance portfolio",
        icon: <BehanceIcon />,
      },
      {
        href: "https://in.pinterest.com/brandingbeez/_created/",
        label: "Visit BrandingBeez Pinterest boards",
        icon: <PinterestIcon />,
      },
    ],
    []
  );

  const services = useMemo(
    () => [
      { href: "/services/custom-app-development", label: "Custom App Development (AI Powered)", external: true },
      { href: "/services/web-development", label: "Web Development" },
      { href: "/services/seo", label: "SEO Services" },
      { href: "/services/google-ads", label: "Google Ads" },
      { href: "/services/dedicated-resources", label: "Dedicated Resources" },
    ],
    []
  );

  const menus = useMemo(
    () => [
      { href: "/onboarding-wizard", label: "Find Service" },
      { href: "/pricing-calculator", label: "Calculator" },
      { href: "/contact", label: "Contact" },
    ],
    []
  );

  const listedOn = useMemo(
    () => [
      {
        href: "https://www.designrush.com/agency/profile/brandingbeez",
        imgSrc: designRushBadge,
        imgAlt:
          "BrandingBeez's rating on AI App Development Agency Listing by DesignRush, the industry-leading B2B Marketplace connecting brands with agencies",
      },
      { href: "https://clutch.co/profile/brandingbeez", imgSrc: clutchLogo, imgAlt: "Clutch" },
      { href: "https://www.goodfirms.co/company/brandingbeez", imgSrc: goodFirmsLogo, imgAlt: "GoodFirms" },
      { href: "https://www.sortlist.com/agency/brandingbeez", imgSrc: sortlistLogo, imgAlt: "Sortlist" },
      { href: "https://agencies.semrush.com/brandingbeez/", imgSrc: semrushLogo, imgAlt: "Semrush" },
      { href: "https://superbcompanies.com/organizations/brandingbeez/", imgSrc: superbLogo, imgAlt: "Superb Companies" },
    ],
    []
  );

  const networking = useMemo(
    () => [
      {
        href: "https://bni-coimbatore.in/en-IN/memberdetails?encryptedMemberId=YlRb5cB9FoWJ4qwrQAMZpw%3D%3D&name=Raja+Rajeswari",
        imgSrc: bniLogo,
        imgAlt: "BNI",
      },
      { href: "https://masternetworks.com/", imgSrc: masterNetworksLogo, imgAlt: "Master Networks" },
      { href: "https://www.h7network.com/", imgSrc: h7NetworksLogo, imgAlt: "H7 Networks" },
    ],
    []
  );

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-brand-purple text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top padding */}
        <div className="py-10 sm:py-14 lg:py-16">
          {/* Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Company Info */}
            <div className="sm:col-span-1 lg:col-span-1">
              <BrandingBeezLogo />
              <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                Trusted white-label partner for US digital agencies since 2020.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((s) => (
                  <FooterLink key={s.href} href={s.href} external ariaLabel={s.label} className="hover:text-white">
                    {s.icon}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-base">Services</h3>
              <ul className="mt-4 space-y-2">
                {services.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} external={item.external} className="text-sm">
                      {item.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menus */}
            <div>
              <h3 className="font-semibold text-base">Menus</h3>
              <ul className="mt-4 space-y-2">
                {menus.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} className="text-sm">
                      {item.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-base">Contact</h3>
              <ul className="mt-4 space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:info@brandingbeez.co.uk"
                    className="text-sm break-all hover:text-white transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    info@brandingbeez.co.uk
                  </a>
                </li>

                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+19792717552"
                    className="text-sm hover:text-white transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    +1 979 271 7552
                  </a>
                </li>

                <li className="pt-1">
                  <BookCallButtonWithModal
                    buttonLabel="Book Consultation"
                    buttonVariant="ghost"
                    className="p-0 h-auto bg-transparent hover:bg-transparent text-brand-coral hover:text-brand-coral-light transition-colors touch-manipulation"
                  />
                </li>
              </ul>
            </div>
          </div>

          {/* Directory Listings & Networking Partners */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-800">
            {/* Directory Listings */}
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-coral" aria-hidden="true" />
                Listed On
              </h3>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {listedOn.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.imgAlt}
                      className="h-10 sm:h-12 w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                      width={140}
                      height={48}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Networking Partners */}
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-coral" aria-hidden="true" />
                Networking Partners
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                {networking.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.imgAlt}
                      className="h-10 sm:h-12 w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                      width={120}
                      height={48}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-10 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400">
              <a href="/privacy-policy" className="hover:text-white transition-colors touch-manipulation">
                Privacy Policy
              </a>
              <span className="text-gray-600" aria-hidden="true">
                •
              </span>
              <a href="/terms-of-service" className="hover:text-white transition-colors touch-manipulation">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-6 pb-2 border-t border-gray-800 text-center mt-6">
            <p className="text-gray-400 text-xs sm:text-sm">© {currentYear} BrandingBeez. Trusted white-label partner since 2020.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const Footer = memo(FooterImpl);
export default Footer;
export { Footer };
