import React, { useEffect, useRef, useMemo, useState } from "react";

interface ChristmasEffectsProps {
  showOnMobile?: boolean;
  showSnow?: boolean;        // canvas snow
  showGlow?: boolean;        // bokeh glow
  showLights?: boolean;      // top lights
  showEmojiSnow?: boolean;   // ❄ emoji snow
}

/* ------------------------ Canvas-based smooth diagonal snowfall ----------- */

const CanvasSnow: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // set canvas size using DPR for crispness but draw in CSS pixels
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 🔹 Global speed factor – lower = slower, higher = faster
    const SPEED_FACTOR = 0.18;

    // flake count based on screen width (fewer on mobile)
    const FLAKE_COUNT = width < 768 ? 70 : 150;

    const flakes = Array.from({ length: FLAKE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 3,
      d: Math.random() + 1,
    }));

    let animationFrameId: number | null = null;
    let running = true;

    const update = () => {
      flakes.forEach((f) => {
        // gentle diagonal: mostly down, slightly left
        f.y += (Math.pow(f.d, 2) + 0.8) * SPEED_FACTOR;
        f.x -= 0.15 * f.d * SPEED_FACTOR;

        // when the flake goes below the screen -> respawn at random X along top
        if (f.y > height) {
          f.y = -10;
          f.x = Math.random() * width;
        }

        // if it drifts far off to the left, re-enter from the right sometimes
        if (f.x < -50) {
          f.x = width + Math.random() * 50;
          f.y = Math.random() * (height * 0.3);
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();

      flakes.forEach((f) => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      });

      ctx.fill();
      update();
    };

    const loop = () => {
      if (!running) return;
      if (!document.hidden) {
        draw();
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        if (animationFrameId != null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!running) {
          running = true;
          loop();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (animationFrameId != null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[996] ${className ?? ""}`}
    />
  );
};

/* ---------------------- Soft bokeh / glow particles ---------------------- */
/* lighter & fewer so it’s not “smoky” */

const GlowParticles: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100, // vh
        left: Math.random() * 100, // %
        size: 40 + Math.random() * 120, // px
        opacity: 0.08 + Math.random() * 0.12,
        color:
          [
            "rgba(213, 200, 255, 1)", // light brand purple
            "rgba(255, 186, 160, 1)", // coral-ish
            "rgba(255, 255, 255, 1)", // white
          ][Math.floor(Math.random() * 3)],
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[997] overflow-hidden mix-blend-screen">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full blur-3xl animate-pulse"
          style={{
            top: `${p.top}vh`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            animationDuration: "4s",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ---------------------- ❄ Emoji snow overlay ---------------------------- */

interface EmojiFlakeConfig {
  id: number;
  left: number;
  duration: number;
  delay: number;
  fontSize: number;
  opacity: number;
}

const EmojiSnow: React.FC = () => {
  // precompute random config once so we don't re-randomize every render
  const flakes = useMemo<EmojiFlakeConfig[]>(
    () =>
      Array.from({ length: 60 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        duration: 20 + Math.random() * 25,
        delay: Math.random() * -20,
        fontSize: 12 + Math.random() * 24,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[998] overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="select-none"
          style={{
            position: "absolute",
            top: "-10%",
            left: `${f.left}%`,
            animationName: "emoji-snowfall",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            fontSize: `${f.fontSize}px`,
            opacity: f.opacity,
            color: "#ffffff",
            textShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          ❄
        </span>
      ))}
      <style>
        {`
          @keyframes emoji-snowfall {
            0% {
              transform: translate3d(20vw, -100%, 0) rotate(0deg);
            }
            100% {
              transform: translate3d(-20vw, 110vh, 0) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

/* ---------------------- Top “Christmas lights” bar ----------------------- */
/* keep or disable via showLights prop */

const LightsBar: React.FC = () => {
  const bulbs = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        id: i,
        color: ["#ff4b5c", "#ffd166", "#4cd137", "#118ab2"][i % 4],
        delay: i * 0.15,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed top-0 inset-x-0 z-[999] flex justify-center pt-2">
      <div className="flex gap-3">
        {bulbs.map((b) => (
          <div
            key={b.id}
            className="w-2 h-4 sm:w-2.5 sm:h-5 rounded-full shadow-md animate-pulse"
            style={{
              backgroundColor: b.color,
              animationDuration: "1.6s",
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------------------------- Main wrapper -------------------------------- */

const ChristmasEffects: React.FC<ChristmasEffectsProps> = ({
  showOnMobile = false,
  showSnow = true,
  showGlow = true,
  showLights = true,
  showEmojiSnow = true,
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setEnabled(false);
      return;
    }

    // Disable on small screens unless explicitly allowed
    if (!showOnMobile && window.innerWidth < 640) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
  }, [showOnMobile]);

  if (!enabled) return null;

  const responsiveClass = showOnMobile ? "" : "hidden sm:block";

  return (
    <>
      {showGlow && (
        <div className={responsiveClass}>
          <GlowParticles />
        </div>
      )}

      {showSnow && (
        <div className={responsiveClass}>
          <CanvasSnow />
        </div>
      )}

      {showEmojiSnow && (
        <div className={responsiveClass}>
          <EmojiSnow />
        </div>
      )}

      {showLights && (
        <div className={responsiveClass}>
          <LightsBar />
        </div>
      )}
    </>
  );
};

export default ChristmasEffects;
