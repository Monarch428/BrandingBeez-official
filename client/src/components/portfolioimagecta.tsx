// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { ArrowRight, ExternalLink } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface PortfolioItem {
//   _id: string;
//   id: number;
//   title: string;
//   imageUrl?: string;
//   image?: string;
//   serviceCategory?: string;
//   projectUrl?: string;
//   description?: string;
// }

// interface Slide {
//   id: string | number;
//   bg: string;
//   title: string;
//   projectUrl?: string;
//   description?: string;
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
//     title: item.title,
//     description: item.description,
//     projectUrl: item.projectUrl,
//   };
// };

// const PortfolioCtaSection: React.FC = () => {
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [active, setActive] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
//   const thumbStripRef = useRef<HTMLDivElement | null>(null);

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
//         setSlides(filtered.map(mapItemToSlide));
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
//       className={`
//         relative
//         w-full
//         md:w-screen md:left-1/2 md:right-1/2 md:-ml-[50vw]
//         min-h-[480px]
//         sm:min-h-[520px]
//         md:min-h-[520px]
//         lg:min-h-[580px]
//         md:h-[80vh]
//         lg:h-[85vh]
//         max-h-[720px]
//         text-white
//         overflow-hidden
//       `}
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       {/* Background Slides with Split Layout */}
//       {slides.map((slide, index) => (
//         <div
//           key={slide.id}
//           className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"
//             }`}
//         >
//           {/* Mobile: full image background */}
//           <div
//             className="
//               absolute inset-0
//               bg-cover bg-center bg-no-repeat
//               md:hidden
//             "
//             style={{ backgroundImage: `url(${slide.bg})` }}
//           />

//           {/* Desktop: left black + right image */}
//           {/* Left Side - Pure Black */}
//           <div className="hidden md:block absolute top-0 left-0 bottom-0 w-[22%] bg-black/95" />

//           {/* Right Side - Image */}
//           <div
//             className="
//               hidden md:block
//               absolute top-0 right-0 bottom-0 w-[78%]
//               bg-cover bg-center bg-no-repeat
//             "
//             style={{ backgroundImage: `url(${slide.bg})` }}
//           />

//           {/* Gradient Blend in the Middle (desktop only) */}
//           <div
//             className="hidden md:block absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 "linear-gradient(90deg, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 10%, rgba(5, 5, 5, 1) 20%, rgba(0, 0, 0, 0.01) 100%, transparent 60%)",
//             }}
//           />

//           {/* Dark overlay on mobile for better text contrast */}
//           <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
//         </div>
//       ))}

//       {/* Content Container */}
//       <div
//         className="
//           absolute inset-0 z-30
//           flex flex-col
//           justify-end md:justify-center lg:justify-end
//           px-4 sm:px-6 md:px-12 lg:px-20
//           pb-20 sm:pb-20 md:pb-10 lg:pb-12
//         "
//       >
//         <div className="max-w-xl sm:max-w-2xl md:max-w-[460px] flex flex-col">
//           <div className="flex items-start gap-3 mb-3 sm:mb-4">
//             <h2
//               className="
//                 text-2xl sm:text-3xl md:text-4xl lg:text-5xl
//                 font-black tracking-tight text-left
//               "
//             >
//               {currentSlide.title}
//             </h2>
//           </div>

//           {/* Description */}
//           <p
//             className="
//               text-sm sm:text-base md:text-lg
//               text-white/95 text-left
//               leading-relaxed
//               mb-4 sm:mb-5 md:mb-8
//               max-w-xl
//             "
//           >
//             {currentSlide.description ||
//               "Explore how we helped this client achieve better performance and user experience with a custom-built solution."}
//           </p>

//           {/* Main CTA: View More Portfolio (replaces Watch Now) */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//             <Button
//               className="
//                 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
//                 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
//                 text-white font-bold
//                 px-7 sm:px-9 lg:px-12
//                 py-3.5 sm:py-4.5
//                 rounded-lg
//                 text-sm sm:text-base
//                 shadow-2xl
//                 transition-all duration-300
//                 hover:scale-105
//                 self-start
//               "
//               onClick={() => {
//                 // Go to full portfolio page
//                 window.location.href = "/portfolio";
//               }}
//             >
//               View More Portfolio <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
//             </Button>

//             {/* View Live Website – MOBILE (inline under main CTA) */}
//             {currentSlide.projectUrl && (
//               <Button
//                 variant="outline"
//                 className="
//                   md:hidden
//                   bg-black/50
//                   border-white/60
//                   hover:bg-black/70
//                   text-white
//                   text-xs sm:text-sm
//                   px-4 sm:px-5 py-2.5
//                   rounded-full
//                   backdrop-blur-sm
//                 "
//                 onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
//               >
//                 <ExternalLink className="w-4 h-4 mr-2" />
//                 View Live Website
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* View Live Website – DESKTOP (above thumbnails, right aligned) */}
//       {currentSlide.projectUrl && (
//         <div
//           className="
//             hidden md:flex
//             absolute
//             z-30
//             right-8
//             bottom-24
//             justify-end
//           "
//         >
//           <Button
//             variant="outline"
//             className="
//               bg-black/40
//               border-white/50
//               hover:bg-black/70
//               text-white
//               text-sm
//               px-5 py-2.5
//               rounded-full
//               backdrop-blur-sm
//             "
//             onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
//           >
//             <ExternalLink className="w-4 h-4 mr-2" />
//             View Live Website
//           </Button>
//         </div>
//       )}

//       {/* Thumbnail Strip */}
//       {slides.length > 1 && (
//         <div
//           className="
//             absolute
//             z-30
//             flex items-center
//             gap-3
//             justify-between
//             px-4 sm:px-6
//             bottom-3 sm:bottom-4
//             w-full
//             md:w-auto md:right-8 md:left-auto md:justify-end
//           "
//         >
//           <div
//             ref={thumbStripRef}
//             className="
//               flex items-center
//               px-1 sm:px-2 py-1.5 sm:py-2
//               gap-2
//               overflow-x-auto
//               scrollbar-none
//               max-w-full
//               md:max-w-[650px]
//               bg-black/30 md:bg-transparent
//               rounded-full md:rounded-none
//               backdrop-blur-sm md:backdrop-blur-0
//             "
//           >
//             {slides.map((slide, index) => (
//               <button
//                 key={slide.id}
//                 ref={(el) => (thumbRefs.current[index] = el)}
//                 onClick={() => setActive(index)}
//                 className={`
//                   relative flex-shrink-0
//                   w-14 h-10 sm:w-16 sm:h-12
//                   rounded-lg overflow-hidden
//                   transition-all duration-300
//                   border border-white/10
//                   ${index === active
//                     ? "scale-110 shadow-xl border-white/40"
//                     : "opacity-60 hover:opacity-85 hover:scale-105"
//                   }
//                 `}
//               >
//                 <div
//                   className="w-full h-full bg-cover bg-center"
//                   style={{ backgroundImage: `url(${slide.bg})` }}
//                 />
//               </button>
//             ))}
//           </div>

//           {/* Arrow Button */}
//           <button
//             onClick={() => setActive((prev) => (prev + 1) % slides.length)}
//             className="
//               flex-shrink-0
//               w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
//               bg-white/10 hover:bg-white/20
//               backdrop-blur-sm
//               rounded-full
//               flex items-center justify-center
//               transition-all duration-300
//               hover:scale-110
//               border border-white/20
//             "
//           >
//             <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default PortfolioCtaSection;








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
  slug?: string;
}

interface Slide {
  id: string | number;
  bg: string;
  title: string;
  projectUrl?: string;
  description?: string;
}

const SERVICE_CONFIG: {
  serviceCategory: string;
  preferredSlug?: string;
}[] = [
    {
      serviceCategory: "web-development",
      preferredSlug: "socialland-website",
    },
    {
      serviceCategory: "custom-app-development",
    },
    {
      serviceCategory: "seo",
    },
    {
      serviceCategory: "google-ads",
    },
    {
      serviceCategory: "dedicated-resources",
    },
  ];

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

        const selectedItems: PortfolioItem[] = SERVICE_CONFIG.map((cfg) => {
          const cat = cfg.serviceCategory.toLowerCase();

          let match: PortfolioItem | undefined;

          if (cfg.preferredSlug) {
            match = data.find(
              (item) =>
                item.serviceCategory?.toLowerCase() === cat &&
                item.slug === cfg.preferredSlug
            );
          }

          if (!match) {
            match = data.find(
              (item) => item.serviceCategory?.toLowerCase() === cat
            );
          }

          return match!;
        }).filter(Boolean) as PortfolioItem[];

        setSlides(selectedItems.map(mapItemToSlide));
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

  if (loading || slides.length === 0) return null;

  const currentSlide = slides[active];

  return (
    <section
      className={`
        relative
        w-full
        md:w-screen md:left-1/2 md:right-1/2 md:-ml-[50vw]
        min-h-[480px]
        sm:min-h-[520px]
        md:min-h-[520px]
        lg:min-h-[580px]
        md:h-[80vh]
        lg:h-[85vh]
        max-h-[720px]
        text-white
        overflow-x-hidden
      `}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Slides with Split Layout */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Mobile: full image background */}
          <div
            className="
              absolute inset-0
              bg-cover bg-center bg-no-repeat
              md:hidden
            "
            style={{ backgroundImage: `url(${slide.bg})` }}
          />

          {/* Desktop: left black + right image */}
          <div className="hidden md:block absolute top-0 left-0 bottom-0 w-[22%] bg-black/95" />

          <div
            className="
              hidden md:block
              absolute top-0 right-0 bottom-0 w-[78%]
              bg-cover bg-center bg-no-repeat
            "
            style={{ backgroundImage: `url(${slide.bg})` }}
          />

          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 10%, rgba(5, 5, 5, 1) 20%, rgba(0, 0, 0, 0.01) 100%, transparent 60%)",
            }}
          />

          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
        </div>
      ))}

      {/* Content Container */}
      <div
        className="
          absolute inset-0 z-30
          flex flex-col
          justify-end md:justify-center lg:justify-end
          px-4 sm:px-6 md:px-12 lg:px-20
          pb-20 sm:pb-20 md:pb-10 lg:pb-12
        "
      >
        <div className="max-w-xl sm:max-w-2xl md:max-w-[460px] flex flex-col">
          <div className="flex items-start gap-3 mb-3 sm:mb-4">
            <h2
              className="
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                font-black tracking-tight text-left
              "
            >
              {currentSlide.title}
            </h2>
          </div>

          <p
            className="
              text-sm sm:text-base md:text-lg
              text-white/95 text-left
              leading-relaxed
              mb-4 sm:mb-5 md:mb-8
              max-w-xl
            "
          >
            {currentSlide.description ||
              "Explore how we helped this client achieve better performance and user experience with a custom-built solution."}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button
              className="
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
                text-white font-bold
                px-7 sm:px-9 lg:px-12
                py-5 sm:py-6
                rounded-lg
                text-sm sm:text-base
                shadow-2xl
                transition-all duration-300
                hover:scale-105
                self-start
              "
              onClick={() => {
                window.location.href = "/portfolio";
              }}
            >
              View More Portfolio{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>

            {currentSlide.projectUrl && (
              <Button
                variant="outline"
                className="
                  md:hidden
                  bg-black/50
                  border-white/60
                  hover:bg-black/70
                  text-white
                  text-xs sm:text-sm
                  px-4 sm:px-5 py-2.5
                  rounded-full
                  backdrop-blur-sm
                "
                onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Website
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* View Live Website – DESKTOP (above thumbnails, right aligned) */}
      {currentSlide.projectUrl && (
        <div
          className="
            hidden md:flex
            absolute
            z-30
            right-8
            bottom-24
            justify-end mb-5
          "
        >
          <Button
            variant="outline"
            className="
              bg-black/40
              border-white/50
              hover:bg-black/70
              text-white
              text-sm
              px-5 py-2.5
              rounded-full
              backdrop-blur-sm
            "
            onClick={() => window.open(currentSlide.projectUrl!, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Website
          </Button>
        </div>
      )}

      {/* Thumbnail Strip */}
      {slides.length > 1 && (
        <div
          className="
      absolute
      z-50
      flex items-center
      gap-3
      justify-between
      px-4 sm:px-6
      bottom-6 sm:bottom-8
      w-full
      md:w-auto md:right-8 md:left-auto md:justify-end
    "
        >
          <div
            ref={thumbStripRef}
            className="
        flex items-center
        px-1 sm:px-2 py-1.5 sm:py-2
        gap-2
        overflow-x-auto
        overflow-y-visible
        scrollbar-none
        max-w-full
        md:max-w-[650px]
        bg-black/30 md:bg-transparent
        rounded-full md:rounded-none
        backdrop-blur-sm md:backdrop-blur-0
      "
          >
            {slides.map((slide, index) => (
              <div key={slide.id} className="relative group overflow-visible">
                {/* Thumbnail button */}
                <button
                  ref={(el) => (thumbRefs.current[index] = el)}
                  onClick={() => setActive(index)}
                  className={`
              relative flex-shrink-0
              w-14 h-10 sm:w-16 sm:h-12
              rounded-lg overflow-hidden
              transition-all duration-300
              border border-white/10
              ${index === active
                      ? "scale-110 shadow-xl border-white/40"
                      : "opacity-60 hover:opacity-85 hover:scale-105"
                    }
            `}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.bg})` }}
                  />
                </button>

                {/* Hover Popover ABOVE thumbnail */}
                <div
                  className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-3
              opacity-0 group-hover:opacity-100
              pointer-events-none group-hover:pointer-events-auto
              bg-white text-gray-800
              shadow-lg rounded-lg border border-gray-200
              w-48 text-sm
              transition-opacity duration-150
              z-[60]
            "
                >
                  <div className="px-3 py-2 font-semibold border-b border-gray-100 text-center">
                    {slide.title || "Project"}
                  </div>
                  <div className="px-3 py-2 text-xs text-gray-600 text-center">
                    {slide.description?.slice(0, 60) || "View project details"}
                  </div>

                  {/* Arrow pointing down to the thumbnail */}
                  <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Arrow Button */}
          <button
            onClick={() => setActive((prev) => (prev + 1) % slides.length)}
            className="
        flex-shrink-0
        w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
        bg-white/10 hover:bg-white/20
        backdrop-blur-sm
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        border border-white/20
      "
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

    </section>
  );
};

export default PortfolioCtaSection;
