// src/components/FlyingBeeLoader.tsx
import React, { useMemo } from "react";
import beeLogo from "../../public/images/Bee_Logo.png";

const BrandingBeezLoader: React.FC = () => {
  const bars = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#050017] via-[#07042a] to-[#0a0440] text-slate-100">
      <div className="flex flex-col items-center gap-6">
        {/* Bee + Sleeping ZZZ */}
        <div className="relative flex items-center justify-center bee-shake">
          <img
            src={beeLogo}
            alt="BrandingBeez"
            className="w-15 h-20 mb-1 drop-shadow-[0_0_18px_rgba(255,255,255,0.20)]"
          />

          {/* ZZZ floating above bee */}
          {/* <div className="absolute -top-7 right-5 flex flex-col items-center gap-[2px] pointer-events-none">
            <span className="zzz zzz-1">Z</span>
            <span className="zzz zzz-2">Z</span>
            <span className="zzz zzz-3">Z</span>
          </div> */}
        </div>

        {/* Animated bars */}
        <div className="flex items-end gap-2">
          {bars.map((i) => (
            <span
              key={i}
              className="w-1.5 md:w-2 rounded-full bg-[#ff5bd5] shadow-[0_0_18px_rgba(255,91,213,0.8)]"
              style={{
                height: "40px",
                animation: "barWave 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.09}s`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>

        {/* Loading text with dots */}
        <div className="mt-2 flex items-center font-bold text-xs md:text-sm tracking-[0.35em] text-slate-300 uppercase">
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

        /* ZZZ floating */
        .zzz {
          font-size: 0.7rem;
          line-height: 0.7rem;
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
