import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export interface SeoCaseStudyCard {
  _id: string;
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
}

export function SeoCaseStudyCardsPage() {
  const [, setLocation] = useLocation();

  const [cards, setCards] = useState<SeoCaseStudyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // ✅ Adjust endpoint if your backend uses a different URL
        const res = await fetch("/api/seo-case-studies");

        if (!res.ok) {
          throw new Error(`Failed to load case studies: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as SeoCaseStudyCard[];

        if (cancelled) return;

        setCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Unable to load case studies");
          setCards([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;

    return cards.filter((c) => {
      const hay = `${c.cardTitle} ${c.cardClient} ${c.cardIndustry} ${c.cardDescription}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cards, query]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Loading SEO case studies…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-red-500 font-semibold mb-2">{error}</div>
        <button
          className="mt-2 px-5 py-2 rounded-lg bg-[#ee4962] text-white font-semibold"
          onClick={() => setLocation("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center rounded-full bg-[#ee4962] text-white px-4 py-1.5 text-sm mb-3">
              SEO Case Studies
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Real SEO wins. Real growth.
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Explore our SEO case studies and see how we improved traffic, rankings, and revenue.
            </p>
          </div>

          {/* Search */}
          <div className="w-full lg:w-[420px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by client, industry, or keyword…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#ee4962]/30"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {filtered.map((card) => {
            const href = `/seo-case-study/${card.slug}`;

            return (
              <Link key={card._id} href={href}>
                <a className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Cover */}
                  <div className="relative bg-gray-50">
                    {card.cardCoverImageUrl ? (
                      <ImageWithFallback
                        src={card.cardCoverImageUrl}
                        alt={card.cardCoverImageAlt || card.cardTitle}
                        className={`w-full h-[220px] ${
                          card.cardCoverFit === "contain" ? "object-contain" : "object-cover"
                        }`}
                      />
                    ) : (
                      <div className="w-full h-[220px] flex items-center justify-center text-sm text-gray-400">
                        Cover image not provided
                      </div>
                    )}

                    <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800">
                      {card.cardIndustry}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">{card.cardClient}</div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ee4962] transition-colors">
                      {card.cardTitle}
                    </h3>

                    <p className="text-gray-600 mt-2 line-clamp-3">{card.cardDescription}</p>

                    {/* Results */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <ResultChip label="Traffic" value={card.cardResultsTraffic} />
                      <ResultChip label="Keywords" value={card.cardResultsKeywords} />
                      <ResultChip label="Revenue" value={card.cardResultsRevenue} />
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-[#ee4962] font-semibold">
                      View case study <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-14">No case studies match your search.</div>
        ) : null}
      </div>
    </section>
  );
}

function ResultChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-sm font-bold text-gray-900 mt-0.5">{value}</div>
    </div>
  );
}
