"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  _id: string;
  id: number;
  title: string;
  imageUrl?: string;
  image?: string;
  serviceCategory?: string;
  projectUrl?: string;
}

interface Slide {
  id: string | number;
  bg: string;
  title: string;
  projectUrl?: string;
}

const isAllowedCategory = (item: PortfolioItem) => {
  const cat = (item.serviceCategory || "").toLowerCase();
  return cat === "web-development" || cat === "custom-app-development";
};

const mapItemToSlide = (item: PortfolioItem): Slide => {
  const bg = item.imageUrl || item.image || "/images/portfolio-placeholder.jpg";
  return {
    id: item._id || item.id,
    bg,
    title: item.title,
    projectUrl: item.projectUrl,
  };
};

const PortfolioCtaSection: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  // 🔹 Refs for thumbnails and the scroll container
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio", {
          headers: { "Cache-Control": "no-cache" },
        });

        const data: PortfolioItem[] = await res.json();
        if (cancelled) return;

        const filtered = data.filter(isAllowedCategory);
        const mappedSlides = filtered.map(mapItemToSlide);

        setSlides(mappedSlides);
      } catch (err) {
        console.error(err);
        setSlides([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused, slides.length]);

  // 🔹 When active changes, only scroll the thumbnail STRIP (not the page)
  useEffect(() => {
    const strip = thumbStripRef.current;
    const activeThumb = thumbRefs.current[active];

    if (!strip || !activeThumb) return;

    const stripRect = strip.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();

    const currentScrollLeft = strip.scrollLeft;
    const thumbCenter =
      thumbRect.left - stripRect.left + currentScrollLeft + thumbRect.width / 2;
    const targetScrollLeft = thumbCenter - stripRect.width / 2;

    const maxScroll = strip.scrollWidth - strip.clientWidth;
    const clampedScroll = Math.max(0, Math.min(maxScroll, targetScrollLeft));

    strip.scrollTo({
      left: clampedScroll,
      behavior: "smooth",
    });
  }, [active]);

  if (loading || slides.length === 0) return null;

  const currentSlide = slides[active];

  return (
    <section
      className="
        relative 
        w-screen 
        left-1/2 
        right-1/2 
        -ml-[50vw] 
        h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]
        max-h-[900px]
        text-white 
        overflow-hidden
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides full cover */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-no-repeat bg-cover bg-center transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.bg})`,
            backgroundColor: "#050816",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* LEFT SIDE TEXT BLOCK */}
      <div className="absolute left-4 sm:left-8 md:left-16 top-1/2 -translate-y-1/2 z-30 max-w-xs sm:max-w-md md:max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow-xl leading-tight">
          {currentSlide.title}
        </h2>

        <p className="text-white/80 mt-3 text-sm sm:text-base md:text-lg drop-shadow-lg max-w-md">
          High-quality custom development projects designed for agencies &amp; brands.
        </p>
      </div>

      {/* Desktop Hover Center Visit Button */}
      {currentSlide.projectUrl && (
        <div
          className="hidden md:flex absolute inset-0 z-20 items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Button
            variant="outline"
            className={`
              border-white bg-transparent text-white 
              hover:bg-white hover:text-brand-coral
              backdrop-blur-xl px-6 py-3 rounded-full 
              transition-all duration-300 shadow-xl
              ${
                hovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }
            `}
            onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
          >
            Visit Live Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Mobile CTA Button (always visible if projectUrl exists) */}
      {currentSlide.projectUrl && (
        <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <Button
            variant="outline"
            className="
              border-white bg-black/30 text-white 
              hover:bg-white hover:text-brand-coral
              backdrop-blur-xl px-5 py-2 rounded-full 
              text-xs sm:text-sm
              transition-all shadow-lg
            "
            onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
          >
            Visit Live Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div
          className="
            absolute bottom-3 sm:bottom-5 
            left-0 right-0 
            z-30 
            px-4 sm:px-6
          "
        >
          {/* Fixed-width, scrollable thumbnail strip */}
          <div
            ref={thumbStripRef}
            className="
              mx-auto 
              max-w-[220px] sm:max-w-[320px] md:max-w-[380px] 
              overflow-x-auto 
              overflow-y-hidden 
              whitespace-nowrap 
              scrollbar-none scrollbar-smooth
            "
          >
            <div className="inline-flex gap-1.5 sm:gap-2.5 scale-90 sm:scale-95">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  ref={(el) => {
                    thumbRefs.current[index] = el;
                  }}
                  onClick={() => setActive(index)}
                  className={`
                    w-9 h-6 sm:w-12 sm:h-8 md:w-14 md:h-9 
                    rounded-md bg-cover bg-center border 
                    transition-all duration-300
                    ${
                      index === active
                        ? "border-brand-coral scale-110 shadow-md"
                        : "border-white/30 opacity-50 hover:opacity-90"
                    }
                  `}
                  style={{ backgroundImage: `url(${slide.bg})` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right CTA */}
      <a
        href="/portfolio"
        className="
          absolute bottom-6 sm:bottom-8 md:bottom-10 
          right-4 sm:right-6 md:right-10
          bg-gradient-to-br from-brand-coral via-brand-purple/90 to-brand-coral 
          text-white 
          px-5 py-2 rounded-md 
          font-bold text-xs sm:text-sm 
          shadow-md 
          hover:from-brand-coral hover:to-brand-purple
          transition-all duration-300
          inline-flex items-center gap-2
          z-30
        "
      >
        View More Portfolio
        <ArrowRight className="w-4 h-4" />
      </a>
    </section>
  );
};

export default PortfolioCtaSection;






// "use client";

// import React, { useEffect, useState } from "react";
// import { ArrowRight, ExternalLink } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface PortfolioItem {
//     _id: string;
//     id: number;
//     title: string;
//     imageUrl?: string;
//     image?: string;
//     serviceCategory?: string;
//     projectUrl?: string;
// }

// interface Slide {
//     id: string | number;
//     bg: string;
//     projectUrl?: string;
// }

// const isAllowedCategory = (item: PortfolioItem) => {
//     const cat = (item.serviceCategory || "").toLowerCase();
//     return cat === "web-development" || cat === "custom-app-development";
// };

// const mapItemToSlide = (item: PortfolioItem): Slide => {
//     const bg = item.imageUrl || item.image || "/images/portfolio-placeholder.jpg";
//     return {
//         id: item._id || item.id,
//         bg,
//         projectUrl: item.projectUrl,
//     };
// };

// const PortfolioCtaSection: React.FC = () => {
//     const [slides, setSlides] = useState<Slide[]>([]);
//     const [active, setActive] = useState(0);
//     const [paused, setPaused] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [hovered, setHovered] = useState(false);

//     useEffect(() => {
//         let cancelled = false;

//         const fetchPortfolio = async () => {
//             try {
//                 const res = await fetch("/api/portfolio", {
//                     headers: { "Cache-Control": "no-cache" },
//                 });

//                 const data: PortfolioItem[] = await res.json();
//                 if (cancelled) return;

//                 const filtered = data.filter(isAllowedCategory);
//                 const mappedSlides = filtered.map(mapItemToSlide);

//                 setSlides(mappedSlides);
//             } catch (err) {
//                 console.error(err);
//                 setSlides([]);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         };

//         fetchPortfolio();
//         return () => {
//             cancelled = true;
//         };
//     }, []);

//     // Autoplay
//     useEffect(() => {
//         if (paused || slides.length <= 1) return;

//         const timer = setInterval(() => {
//             setActive((prev) => (prev + 1) % slides.length);
//         }, 5000);

//         return () => clearInterval(timer);
//     }, [paused, slides.length]);

//     if (loading || slides.length === 0) return null;

//     const currentSlide = slides[active];

//     return (
//         <div
//             className="
//         relative
//         w-full
//         aspect-[16/9]
//         rounded-3xl
//         overflow-hidden
//         shadow-lg
//         transition-all
//         bg-[#050816]
//       "
//             onMouseEnter={() => setPaused(true)}
//             onMouseLeave={() => setPaused(false)}
//         >
//             {/* Slides */}
//             {slides.map((slide, index) => (
//                 <div
//                     key={slide.id}
//                     className={`absolute inset-0 bg-cover bg-top duration-700 ${index === active ? "opacity-100" : "opacity-0"
//                         }`}
//                     style={{ backgroundImage: `url(${slide.bg})` }}
//                 >
//                     <div className="absolute inset-0" />
//                 </div>
//             ))}

//             {/* Hover Overlay Button */}
//             <div
//                 className="absolute inset-0 z-20 flex items-center justify-center"
//                 onMouseEnter={() => setHovered(true)}
//                 onMouseLeave={() => setHovered(false)}
//             >
//                 {hovered && currentSlide.projectUrl && (
//                     <Button
//                         variant="outline"
//                         className="
//               border-white bg-transparent text-white
//               hover:bg-white hover:text-brand-coral
//               backdrop-blur-xl px-6 py-3 rounded-full
//               transition-all shadow-xl
//             "
//                         onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
//                     >
//                         Visit Live Website
//                         <ExternalLink className="w-4 h-4 ml-2" />
//                     </Button>
//                 )}
//             </div>

//             {/* Thumbnails */}
//             {slides.length > 1 && (
//                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
//                     {slides.map((slide, index) => (
//                         <button
//                             key={slide.id}
//                             onClick={() => setActive(index)}
//                             className={`w-16 h-10 rounded-xl bg-cover bg-center border transition-all ${index === active
//                                     ? "border-brand-coral scale-110 shadow-lg"
//                                     : "border-white/30 opacity-50 hover:opacity-100"
//                                 }`}
//                             style={{ backgroundImage: `url(${slide.bg})` }}
//                         />
//                     ))}
//                 </div>
//             )}

//             {/* Bottom Right CTA */}
//             <a
//                 href="/portfolio"
//                 className="
//           absolute bottom-10 right-10
//           bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral
//           text-white
//           px-5 py-2 rounded-md
//           font-bold text-xs sm:text-sm
//           shadow-md
//           hover:from-brand-coral hover:to-brand-purple
//           transition-all duration-300
//           inline-flex items-center gap-2
//           z-30
//         "
//             >
//                 View More Portfolio
//                 <ArrowRight className="w-4 h-4" />
//             </a>
//         </div>
//     );
// };

// export default PortfolioCtaSection;
