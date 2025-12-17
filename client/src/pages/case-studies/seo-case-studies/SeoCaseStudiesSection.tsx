import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Award, DollarSign } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export interface SeoCaseStudyCard {
  _id: string;
  id: number;
  slug: string;

  cardTitle: string;
  cardClient: string;
  cardIndustry: string;
  cardDescription: string;

  cardResultsTraffic: string;
  cardResultsKeywords: string;
  cardResultsRevenue: string;

  cardCoverImageUrl?: string;
  cardCoverImageAlt?: string;
  cardCoverFit?: "contain" | "cover";

  createdAt: string;
  updatedAt: string;
}

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 px-3 py-2 shadow-sm">
      <div className="p-1.5 rounded-md bg-[#ee4962]">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export function SeoCaseStudyCardsPage() {
  const [cards, setCards] = useState<SeoCaseStudyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/seo-case-studies");
        if (!res.ok) throw new Error(`Failed to load: ${res.status} ${res.statusText}`);

        const data = (await res.json()) as SeoCaseStudyCard[];
        if (!cancelled) setCards(data || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load case studies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...cards].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [cards]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading case studies…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ee4962] text-white px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">SEO Case Studies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Real Results. Real Growth.
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our SEO wins across industries — traffic, rankings, and lead growth.
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
            No case studies yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((c) => {
              const fit = c.cardCoverFit || "contain";
              return (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Cover */}
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    {c.cardCoverImageUrl ? (
                      <ImageWithFallback
                        src={c.cardCoverImageUrl}
                        alt={c.cardCoverImageAlt || c.cardTitle}
                        className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{c.cardIndustry}</div>
                        <div className="text-lg font-bold text-gray-900 leading-snug">
                          {c.cardTitle}
                        </div>
                        <div className="text-sm text-gray-600">{c.cardClient}</div>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center rounded-full bg-[#391B66] text-white px-3 py-1 text-xs">
                          {c.slug}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {c.cardDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <StatPill icon={TrendingUp} value={c.cardResultsTraffic} label="Traffic" />
                      <StatPill icon={Award} value={c.cardResultsKeywords} label="Keywords" />
                      <StatPill icon={DollarSign} value={c.cardResultsRevenue} label="Revenue" />
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/seo-case-study/${c.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#ee4962] text-white font-semibold rounded-xl px-4 py-3 hover:opacity-95 transition"
                      >
                        View Case Study <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
