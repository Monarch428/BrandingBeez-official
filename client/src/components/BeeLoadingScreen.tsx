import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const beeLogo = "/images/Bee_Logo.png";

type BrandingBeezLoaderProps = {
  usePortal?: boolean;
};

const BrandingBeezLoader: React.FC<BrandingBeezLoaderProps> = ({
  usePortal = true,
}) => {
  const bars = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const LoaderContent = (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        w-full min-h-[100svh]
        px-4 sm:px-6
        bg-gradient-to-br from-[#050017] via-[#07042a] to-[#0a0440]
        text-slate-100
      "
    >
      {/* Center wrapper */}
      <div
        className="
          w-full
          max-w-[360px]
          sm:max-w-[420px]
          md:max-w-[520px]
          mx-auto
          flex flex-col
          items-center
          justify-center
          gap-5 sm:gap-6
          text-center
        "
      >
        {/* Bee */}
        <div className="bee-shake">
          <img
            src={beeLogo}
            alt="BrandingBeez"
            className="
              block mx-auto
              h-auto
              w-[52px]
              xs:w-[56px]
              sm:w-[64px]
              md:w-[72px]
              lg:w-[80px]
              drop-shadow-[0_0_18px_rgba(255,255,255,0.20)]
              select-none
            "
          />
        </div>

        {/* Bars */}
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
                height: "clamp(26px, 6vw, 44px)",
                animation: "barWave 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.09}s`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="flex items-center font-bold text-[11px] sm:text-xs md:text-sm tracking-[0.28em] sm:tracking-[0.35em] text-slate-300 uppercase">
          Loading
          <span className="ml-1 flex">
            <span className="dot dot-1">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
          </span>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes barWave {
          0% { transform: scaleY(0.4); opacity: 0.4; }
          30% { transform: scaleY(1); opacity: 1; }
          60% { transform: scaleY(0.4); opacity: 0.4; }
          100% { transform: scaleY(0.4); opacity: 0.4; }
        }

        .bee-shake {
          animation: beeWobble 1.5s ease-in-out infinite;
        }

        @keyframes beeWobble {
          0% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-1.5px) rotate(-1deg); }
          50% { transform: translateX(0.8px) rotate(1deg); }
          75% { transform: translateX(-0.5px) rotate(-0.5deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }

        .dot {
          opacity: 0;
          animation: dotBlink 1.6s infinite;
          font-weight: bold;
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
      `}</style>
    </div>
  );

  return usePortal
    ? createPortal(LoaderContent, document.body)
    : LoaderContent;
};

export default BrandingBeezLoader;
