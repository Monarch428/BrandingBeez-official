// src/components/FlyingBeeLoader.tsx
import React, { useMemo } from "react";

const beeLogo = "/images/Bee_Logo.png";

type BrandingBeezLoaderProps = {
  /**
   * "fullscreen" => covers entire viewport (default)
   * "contained"  => covers only its parent (parent must be relative)
   */
  mode?: "fullscreen" | "contained";

  /**
   * Optional: set a minimum height when used in contained mode
   * (helps avoid collapse in short containers)
   */
  minHeightClassName?: string;
};

const BrandingBeezLoader: React.FC<BrandingBeezLoaderProps> = ({
  mode = "fullscreen",
  minHeightClassName = "min-h-[260px]",
}) => {
  const bars = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  const containerClass =
    mode === "fullscreen"
      ? "fixed inset-0 z-[9999]"
      : `absolute inset-0 z-[10] ${minHeightClassName}`;

  return (
    <div
      className={`${containerClass} flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-[#050017] via-[#07042a] to-[#0a0440] text-slate-100`}
    >
      {/* Responsive wrapper: scales down on small screens, keeps center aligned */}
      <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[520px] flex flex-col items-center gap-5 sm:gap-6">
        {/* Bee */}
        <div className="relative flex items-center justify-center bee-shake">
          <img
            src={beeLogo}
            alt="BrandingBeez"
            className="
              mb-1
              h-auto
              w-[52px] xs:w-[56px] sm:w-[64px] md:w-[72px] lg:w-[80px]
              drop-shadow-[0_0_18px_rgba(255,255,255,0.20)]
              select-none
            "
          />

          {/* ZZZ (kept optional, but responsive if enabled) */}
          {/*
          <div className="absolute -top-7 right-3 sm:right-4 flex flex-col items-center gap-[2px] pointer-events-none">
            <span className="zzz zzz-1">Z</span>
            <span className="zzz zzz-2">Z</span>
            <span className="zzz zzz-3">Z</span>
          </div>
          */}
        </div>

        {/* Animated bars */}
        <div className="flex items-end justify-center gap-2 sm:gap-2.5">
          {bars.map((i) => (
            <span
              key={i}
              className="
                rounded-full
                bg-[#ff5bd5]
                shadow-[0_0_18px_rgba(255,91,213,0.8)]
                w-[5px] sm:w-[6px] md:w-[7px]
              "
              style={{
                // Responsive heights via clamp so it looks good from 320px to desktop
                height: "clamp(26px, 6vw, 44px)",
                animation: "barWave 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.09}s`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-1.5 sm:mt-2 flex items-center justify-center font-bold text-[11px] sm:text-xs md:text-sm tracking-[0.28em] sm:tracking-[0.35em] text-slate-300 uppercase">
          <span>Loading</span>

          <span className="ml-1 flex">
            <span className="dot dot-1 font-bold">.</span>
            <span className="dot dot-2 font-bold">.</span>
            <span className="dot dot-3 font-bold">.</span>
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        /* Bar wave */
        @keyframes barWave {
          0% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          30% {
            transform: scaleY(1);
            opacity: 1;
          }
          60% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          100% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
        }

        /* Bee gentle shake */
        .bee-shake {
          animation: beeWobble 1.5s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes beeWobble {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(-1.5px) rotate(-1deg);
          }
          50% {
            transform: translateX(0.8px) rotate(1deg);
          }
          75% {
            transform: translateX(-0.5px) rotate(-0.5deg);
          }
          100% {
            transform: translateX(0) rotate(0deg);
          }
        }

        /* Dots base */
        .dot {
          opacity: 0;
          animation: dotBlink 1.6s infinite;
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.25s; }
        .dot-3 { animation-delay: 0.5s; }

        @keyframes dotBlink {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* ZZZ floating (responsive sizing if you enable it) */
        .zzz {
          font-size: clamp(0.6rem, 1.8vw, 0.8rem);
          line-height: 1;
          color: rgba(248, 250, 252, 0.85);
          text-shadow: 0 0 8px rgba(248, 250, 252, 0.9);
          opacity: 0;
          animation: zFloat 1.5s ease-in-out infinite;
        }

        .zzz-1 { animation-delay: 0s; }
        .zzz-2 { animation-delay: 0.18s; }
        .zzz-3 { animation-delay: 0.36s; }

        @keyframes zFloat {
          0% {
            transform: translateY(6px) translateX(0) scale(0.85);
            opacity: 0;
          }
          20% { opacity: 0.8; }
          50% {
            transform: translateY(-2px) translateX(2px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(-8px) translateX(4px) scale(1);
            opacity: 0;
          }
          100% {
            transform: translateY(6px) translateX(0) scale(0.85);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandingBeezLoader;
