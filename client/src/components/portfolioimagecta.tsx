// "use client";

// import React, { useEffect, useState } from "react";
// import { ExternalLink } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface PortfolioItem {
//   _id: string;
//   id: number;
//   title: string;
//   imageUrl?: string;
//   image?: string;
//   serviceCategory?: string;
//   projectUrl?: string;
// }

// interface Slide {
//   id: string | number;
//   bg: string;
//   projectUrl?: string;
// }

// const isAllowedCategory = (item: PortfolioItem) => {
//   const cat = (item.serviceCategory || "").toLowerCase();
//   return cat === "web-development" || cat === "custom-app-development";
// };

// const mapItemToSlide = (item: PortfolioItem): Slide => {
//   const bg = item.imageUrl || item.image || "/images/portfolio-placeholder.jpg";
//   return {
//     id: item._id || item.id,
//     bg,
//     projectUrl: item.projectUrl,
//   };
// };

// const PortfolioCtaSection: React.FC = () => {
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [active, setActive] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     const fetchPortfolio = async () => {
//       try {
//         const res = await fetch("/api/portfolio", {
//           headers: { "Cache-Control": "no-cache" },
//         });

//         const data: PortfolioItem[] = await res.json();
//         if (cancelled) return;

//         const filtered = data.filter(isAllowedCategory);
//         const mappedSlides = filtered.map(mapItemToSlide);

//         setSlides(mappedSlides);
//       } catch (err) {
//         console.error(err);
//         setSlides([]);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchPortfolio();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Autoplay
//   useEffect(() => {
//     if (paused || slides.length <= 1) return;

//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [paused, slides.length]);

//   if (loading || slides.length === 0) return null;

//   const currentSlide = slides[active];

//   return (
//     <section
//       className="
//         relative 
//         w-screen 
//         left-1/2 
//         right-1/2 
//         -ml-[50vw] 
//         h-[75vh] md:h-[85vh] 
//         text-white 
//         overflow-hidden
//       "
//     >
//       {/* Slides (full image visible: contain, no-repeat) */}
//       {slides.map((slide, index) => (
//         <div
//           key={slide.id}
//           className={`absolute inset-0 bg-no-repeat bg-contain bg-center transition-opacity duration-700 ${
//             index === active ? "opacity-100" : "opacity-0"
//           }`}
//           style={{ backgroundImage: `url(${slide.bg})`, backgroundColor: "#050816" }}
//         >
//           {/* Optional subtle dark overlay */}
//           <div className="absolute inset-0 bg-black/35" />
//         </div>
//       ))}

//       {/* Hover Overlay Button */}
//       <div
//         className="absolute inset-0 z-20 flex items-center justify-center"
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {hovered && currentSlide.projectUrl && (
//           <Button
//             variant="outline"
//             className="
//               border-white bg-transparent text-white 
//               hover:bg-white hover:text-brand-coral
//               backdrop-blur-xl px-6 py-3 rounded-full 
//               transition-all shadow-xl
//             "
//             onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
//           >
//             Visit Live Website
//             <ExternalLink className="w-4 h-4 ml-2" />
//           </Button>
//         )}
//       </div>

//       {/* Thumbnails */}
//       {slides.length > 1 && (
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
//           {slides.map((slide, index) => (
//             <button
//               key={slide.id}
//               onClick={() => setActive(index)}
//               className={`w-20 h-12 rounded-lg bg-cover bg-center border transition-all ${
//                 index === active
//                   ? "border-brand-coral scale-110 shadow-lg"
//                   : "border-white/30 opacity-60 hover:opacity-100"
//               }`}
//               style={{ backgroundImage: `url(${slide.bg})` }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Bottom Right: View More Portfolio */}
//       <a
//         href="/portfolio"
//         className="
//           absolute bottom-8 right-6 md:bottom-10 md:right-10
//           bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral 
//           text-white 
//           px-5 py-2 rounded-lg 
//           font-bold text-sm 
//           shadow-md 
//           hover:from-brand-coral hover:via-brand-purple/90 hover:to-brand-purple
//           transition-all duration-300
//           z-30
//         "
//       >
//         View More Portfolio
//       </a>
//     </section>
//   );
// };

// export default PortfolioCtaSection;









"use client";

import React, { useEffect, useState } from "react";
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
        projectUrl: item.projectUrl,
    };
};

const PortfolioCtaSection: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(false);

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

    // Autoplay
    useEffect(() => {
        if (paused || slides.length <= 1) return;

        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [paused, slides.length]);

    if (loading || slides.length === 0) return null;

    const currentSlide = slides[active];

    return (
        <div
            className="
        relative 
        w-full
        aspect-[16/9]
        rounded-3xl
        overflow-hidden
        shadow-lg
        transition-all
        bg-[#050816]
      "
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 bg-cover bg-top duration-700 ${index === active ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ backgroundImage: `url(${slide.bg})` }}
                >
                    <div className="absolute inset-0" />
                </div>
            ))}

            {/* Hover Overlay Button */}
            <div
                className="absolute inset-0 z-20 flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {hovered && currentSlide.projectUrl && (
                    <Button
                        variant="outline"
                        className="
              border-white bg-transparent text-white 
              hover:bg-white hover:text-brand-coral
              backdrop-blur-xl px-6 py-3 rounded-full 
              transition-all shadow-xl
            "
                        onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
                    >
                        Visit Live Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>

            {/* Thumbnails */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => setActive(index)}
                            className={`w-16 h-10 rounded-xl bg-cover bg-center border transition-all ${index === active
                                    ? "border-brand-coral scale-110 shadow-lg"
                                    : "border-white/30 opacity-50 hover:opacity-100"
                                }`}
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        />
                    ))}
                </div>
            )}

            {/* Bottom Right CTA */}
            <a
                href="/portfolio"
                className="
          absolute bottom-10 right-10
          bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral 
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
        </div>
    );
};

export default PortfolioCtaSection;
