// src/components/phase-slider-section.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export interface PhaseItem {
  id: number | string;
  label: string;
  title: string;
  intro: string;
  points: string[];
  extraIntro?: string;
  extraPoints?: string[];
  outcome: string;
}

interface PhaseSliderSectionProps {
  sectionId?: string;
  heading?: string;
  subheading?: string;
  phases: PhaseItem[];

  badgeLabel?: string;
  badgeClassName?: string;

  sectionClassName?: string;
  wrapperClassName?: string;
  cardClassName?: string;
  cardHeightClass?: string;
}

export const PhaseSliderSection: React.FC<PhaseSliderSectionProps> = ({
  sectionId,
  heading = "How Our Process Works",
  subheading = "A simple, transparent process built for agencies.",
  phases,
  badgeLabel,
  badgeClassName,
  sectionClassName,
  wrapperClassName,
  cardClassName,
  cardHeightClass,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Guard: if no phases, don't render
  if (!phases || phases.length === 0) {
    return null;
  }

  const totalPhases = phases.length;
  const activePhase = phases[currentPhase] ?? phases[0];

  const goToNextPhase = () => {
    setCurrentPhase((prev) => (prev + 1 < totalPhases ? prev + 1 : prev));
  };

  const goToPrevPhase = () => {
    setCurrentPhase((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    // basic swipe threshold
    if (diff > 50 && currentPhase < totalPhases - 1) {
      goToNextPhase();
    } else if (diff < -50 && currentPhase > 0) {
      goToPrevPhase();
    }

    setTouchStartX(null);
  };

  const sectionClasses = [
    "py-8 sm:py-8 lg:py-10",
    "px-4 sm:px-6 lg:px-8",
    sectionClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClasses = [
    "max-w-5xl lg:max-w-6xl mx-auto",
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const cardClasses = [
    "w-full max-w-5xl mx-auto",
    "bg-gradient-to-r from-brand-purple to-brand-coral",
    "text-white border-none shadow-lg",
    "px-4 sm:px-8 md:px-10 py-6 sm:py-6",
    "rounded-2xl",
    "flex flex-col", 
    cardHeightClass || "min-h-[320px] sm:min-h-[360px] md:min-h-[380px]",
    cardClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={sectionId} className={sectionClasses}>
      <div className={wrapperClasses}>
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          {/* {badgeLabel && (
            <div className="flex items-center justify-center mb-4">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full",
                  "bg-brand-coral px-4 py-1.5 border border-brand-purple/15",
                  "text-xs sm:text-sm font-medium text-white",
                  badgeClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>{badgeLabel}</span>
              </div>
            </div>
          )} */}

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-purple mb-3">
            {heading}
          </h2>
          {subheading && (
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Slider */}
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Card className={cardClasses}>
            {/* Header – phase + title */}
            <CardHeader className="pb-3 sm:pb-4 px-0">
              <div className="flex flex-col items-start gap-1 pl-4 sm:pl-8 md:pl-10">
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                  {activePhase.label} of {totalPhases}
                </p>
                <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white leading-snug">
                  {activePhase.title}
                </h3>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col px-1 sm:px-4 md:px-6">
              {/* Top content block (intro + points + extra) */}
              <div className="space-y-5 sm:space-y-6">
                {/* Main points */}
                <div className="pl-4 sm:pl-8 md:pl-10">
                  <p className="text-sm md:text-base font-medium text-white mb-3">
                    {activePhase.intro}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 md:gap-x-10 text-sm text-white/90">
                    {activePhase.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <CheckCircle className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional extra block (e.g. “You get: …”) */}
                {activePhase.extraIntro && activePhase.extraPoints?.length ? (
                  <div className="pt-4 border-t border-white/15 pl-4 sm:pl-8 md:pl-10">
                    <p className="text-sm md:text-base font-medium text-white mb-2">
                      {activePhase.extraIntro}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-white/90">
                      {activePhase.extraPoints.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 leading-relaxed"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Bottom block: always sticks to bottom of card */}
              <div className="pt-4 border-t border-white/15 mt-6">
                <p className="text-xs md:text-sm text-white/90 font-medium flex items-center justify-center gap-2 mb-3 sm:mb-4 text-center px-2">
                  <span>{activePhase.outcome}</span>
                </p>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  {phases.map((phase, idx) => (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setCurrentPhase(idx)}
                      className={[
                        "h-2.5 w-2.5 rounded-full transition-all duration-200",
                        idx === currentPhase
                          ? "bg-white scale-125 shadow-sm"
                          : "bg-white/40 hover:bg-white/70",
                      ].join(" ")}
                      aria-label={phase.title}
                    />
                  ))}
                </div>

                {/* Prev / Next buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: text hint on small screens if you ever want it – currently omitted */}
                  <div className="hidden sm:block text-xs text-white/80">
                    Swipe or use buttons to navigate phases
                  </div>

                  <div className="flex items-center justify-center sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={goToPrevPhase}
                      disabled={currentPhase === 0}
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold",
                        "border border-white/60 bg-white/10 text-white/90",
                        "backdrop-blur-sm transition-all duration-200",
                        "hover:bg-white/20 hover:border-white",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                      ].join(" ")}
                      aria-label="Previous phase"
                    >
                      <span className="text-base leading-none">‹</span>
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={goToNextPhase}
                      disabled={currentPhase === totalPhases - 1}
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold",
                        "border border-white bg-white text-brand-purple",
                        "shadow-sm transition-all duration-200",
                        "hover:shadow-md hover:-translate-y-0.5",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      ].join(" ")}
                      aria-label="Next phase"
                    >
                      <span>Next</span>
                      <span className="text-base leading-none">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
