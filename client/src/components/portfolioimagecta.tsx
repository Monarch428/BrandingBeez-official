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
  description?: string;
}

interface Slide {
  id: string | number;
  bg: string;
  title: string;
  projectUrl?: string;
  description?: string;
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
    description: item.description,
    projectUrl: item.projectUrl,
  };
};

const PortfolioCtaSection: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

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
        setSlides(filtered.map(mapItemToSlide));
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

    strip.scrollTo({
      left: Math.max(
        0,
        Math.min(strip.scrollWidth - strip.clientWidth, targetScrollLeft),
      ),
      behavior: "smooth",
    });
  }, [active]);

  if (loading || slides.length === 0) return null;

  const currentSlide = slides[active];

  return (
    <section
      className="
    relative w-screen left-1/2 right-1/2 -ml-[50vw]
    h-[65vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]
    max-h-[900px]
    text-white overflow-hidden
  "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"
            }`}
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          {/* DARKER base overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* VERY STRONG LEFT SHADOW (text safe zone) */}
          <div className="absolute inset-y-0 left-0 w-3/4 md:w-[55%] bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

          {/* STRONG RIGHT SHADOW (visual balance) */}
          {/* <div className="absolute inset-y-0 right-0 w-2/3 md:w-[45%] bg-gradient-to-l from-black/80 via-black/55 to-transparent" /> */}
        </div>
      ))}

      {/* TEXT */}
      <div
        className="
      absolute z-30
      left-4 right-4
      sm:left-8 sm:right-auto
      md:left-16
      bottom-28
      md:bottom-auto md:top-1/2 md:-translate-y-1/2
      max-w-md md:max-w-2xl
      flex flex-col items-start
      gap-3 sm:gap-4
    "
      >
        <h2
          className="
        text-2xl sm:text-3xl md:text-5xl
        font-bold
        leading-[1.15]
        drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]
        text-left
      "
        >
          {currentSlide.title}
        </h2>

        <p
          className="
        text-white/90
        text-sm sm:text-base md:text-lg
        leading-relaxed
        drop-shadow-[0_3px_14px_rgba(0,0,0,0.9)]
        max-w-md
        text-left
      "
        >
          {currentSlide.description}
        </p>
      </div>

      {/* Desktop CTA (center overlay) */}
      {currentSlide.projectUrl && (
        <div
          className="
        hidden md:flex
        absolute inset-0
        z-20 items-center justify-center
      "
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Button
            variant="outline"
            className={`
          border-white bg-transparent text-white
          hover:bg-white hover:text-brand-coral
          backdrop-blur-xl px-6 py-3 rounded-full
          transition-all duration-300 shadow-2xl
          ${hovered
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

      {/* Mobile CTA */}
      {currentSlide.projectUrl && (
        <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
          <Button
            variant="outline"
            className="
          border-white bg-black/50 text-white
          hover:bg-white hover:text-brand-coral
          backdrop-blur-xl px-5 py-2 rounded-full
          text-xs sm:text-sm shadow-xl
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
        absolute
        bottom-3 sm:bottom-4 md:bottom-6
        left-0 right-0
        z-30 px-3 sm:px-4
      "
        >
          <div
            ref={thumbStripRef}
            className="
          mx-auto py-2
          max-w-[260px] sm:max-w-[320px] md:max-w-[380px]
          overflow-x-auto whitespace-nowrap scrollbar-none
        "
          >
            <div className="inline-flex gap-1.5 sm:gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  ref={(el) => (thumbRefs.current[index] = el)}
                  onClick={() => setActive(index)}
                  className={`
                w-10 h-7 sm:w-12 sm:h-8 md:w-14 md:h-9
                rounded-md bg-cover bg-center border transition-all
                ${index === active
                      ? "border-brand-coral scale-110 shadow-lg"
                      : "border-white/30 opacity-60 hover:opacity-90"
                    }
              `}
                  style={{ backgroundImage: `url(${slide.bg})` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right CTA (desktop / tablet only) */}
      <a
        href="/portfolio"
        className="
      hidden sm:inline-flex
      absolute bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-10
      z-30
      bg-gradient-to-br from-brand-coral via-brand-purple/90 to-brand-coral
      text-white px-5 py-2 rounded-md font-bold text-xs sm:text-sm hover:from-brand-purple hover:to-brand-coral
      shadow-xl transition-all items-center gap-2
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
