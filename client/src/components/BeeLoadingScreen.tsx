// src/components/FlyingBeeLoader.tsx
import React, { useMemo } from "react";
import beeLogo from "../../public/images/Bee_Logo.png"; 

const BrandingBeezLoader: React.FC = () => {
  const bars = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#050017] via-[#07042a] to-[#0a0440] text-slate-100">
      <div className="flex flex-col items-center gap-6">
        {/* Bee logo (optional) */}
        <img
          src={beeLogo}
          alt="BrandingBeez"
          className="w-12 h-12 mb-1 drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]"
        />

        {/* Animated bars */}
        <div className="flex items-end gap-2">
          {bars.map((i) => (
            <span
              key={i}
              className="w-1.5 md:w-2 rounded-full bg-[#ff5bd5] shadow-[0_0_18px_rgba(255,91,213,0.8)]"
              style={{
                height: "40px",
                animation: "barWave 1.1s ease-in-out infinite",
                animationDelay: `${i * 0.09}s`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>

        {/* LOADING text */}
        <div className="mt-2 text-xs md:text-sm tracking-[0.35em] text-slate-300 uppercase">
          Loading
        </div>
      </div>

      {/* Keyframes for the bar motion */}
      <style>{`
        @keyframes barWave {
          0%, 100% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandingBeezLoader;
