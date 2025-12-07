// src/components/phase-slider-section.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export interface PhaseItem {
  id: number | string;
  label: string;          // e.g. "Phase 1"
  title: string;          // e.g. "Discovery & Team Planning"
  intro: string;          // e.g. "We understand your:"
  points: string[];       // main bullet list
  extraIntro?: string;    // optional second block title
  extraPoints?: string[]; // optional second block bullets
  outcome: string;        // bottom line text
}

interface PhaseSliderSectionProps {
  sectionId?: string;
  heading?: string;
  subheading?: string;
  phases: PhaseItem[];
  /** Override height if needed, e.g. "h-[420px] sm:h-[440px]" */
  cardHeightClass?: string;
}

export const PhaseSliderSection: React.FC<PhaseSliderSectionProps> = ({
  sectionId,
  heading = "How Our Process Works",
  subheading = "A simple, transparent process built for agencies.",
  phases,
  cardHeightClass,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // ✅ Guard: if no phases, don't try to render slider (prevents runtime error)
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

    // Swipe threshold
    if (diff > 50 && currentPhase < totalPhases - 1) {
      // swipe left -> next
      goToNextPhase();
    } else if (diff < -50 && currentPhase > 0) {
      // swipe right -> prev
      goToPrevPhase();
    }

    setTouchStartX(null);
  };

  return (
    <section
      id={sectionId}
      className="py-16 px-4 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-purple mb-3">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-gray-600">
              {subheading}
            </p>
          )}
        </div>

        {/* Phase slider card + side arrows */}
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Card
            className={[
              "bg-gradient-to-r from-brand-purple to-brand-coral",
              "text-white border-none shadow-lg",
              "mx-auto px-10 sm:px-14 py-8",
              "rounded-2xl",
              cardHeightClass || "h-[360px] sm:h-[400px]",
            ].join(" ")}
          >
            {/* Header – phase + title, left aligned */}
            <CardHeader className="pb-4 px-0">
              <div className="flex flex-col items-start gap-1 pl-16 sm:pl-24">
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                  {activePhase.label} of {totalPhases}
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-white">
                  {activePhase.title}
                </h3>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 sm:px-10">
              {/* Main points – aligned under title */}
              <div className="pl-16 sm:pl-14">
                <p className="text-base font-medium text.white mb-2">
                  {activePhase.intro}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-14 text-m text-white/90">
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

              {/* Optional extra block (like your Phase 4 “You get: …”) */}
              {activePhase.extraIntro && activePhase.extraPoints?.length ? (
                <div className="pt-3 border-t border-white/15 pl-16 sm:pl-24">
                  <p className="text-base font-medium text-white mb-2">
                    {activePhase.extraIntro}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-m text-white/90">
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

              {/* Bottom: outcome + dots */}
              <div className="pt-4 border-t border-white/15">
                <p className="text-sm text-white/90 font-medium flex items-center justify-center gap-2 mb-4 text-center">
                  <span>{activePhase.outcome}</span>
                </p>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Side arrows */}
          <button
            type="button"
            onClick={goToPrevPhase}
            disabled={currentPhase === 0}
            className="
              group absolute
              -left-16
              top-40 -translate-y-1/2
              hidden md:flex
              items-center justify-center
              h-14 w-14
              rounded-full bg-brand-purple text-white
              shadow-xl border-2 border-white
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-brand-coral hover:shadow-2xl hover:scale-110
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-coral/40
              transition-all duration-200
            "
            aria-label="Previous phase"
          >
            <span className="text-2xl font-bold tracking-tight transition-transform duration-200 group-hover:-translate-x-0.5">
              {"<"}
            </span>
          </button>

          <button
            type="button"
            onClick={goToNextPhase}
            disabled={currentPhase === totalPhases - 1}
            className="
              group absolute
              -right-16
              top-40 -translate-y-1/2
              hidden md:flex
              items-center justify-center
              h-14 w-14
              rounded-full bg-brand-purple text-white
              shadow-xl border-2 border-white
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-brand-coral hover:shadow-2xl hover:scale-110
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-coral/40
              transition-all duration-200
            "
            aria-label="Next phase"
          >
            <span className="text-2xl font-bold tracking-tight transition-transform duration-200 group-hover:translate-x-0.5">
              {">"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
