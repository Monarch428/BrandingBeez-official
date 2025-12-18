import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// -------------------- SEO TYPES (your existing) --------------------
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

// -------------------- PPC TYPES (existing) --------------------
export type PpcResultItem = {
  key: string;
  label: string;
  value: string;
  colorClass?: string;
};

export interface PpcCaseStudyCard {
  _id: string;
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  results: PpcResultItem[];

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";
}

// -------------------- WEB DEV TYPES --------------------
export type WebCardResults = {
  performance: string;
  conversions: string;
  users: string; // shown as Scale
};

export interface WebCaseStudyCard {
  _id: string;
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  results: WebCardResults;

  imageUrl?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";
}

// -------------------- DEDICATED RESOURCE TYPES (NEW) --------------------
// NOTE: This is a sensible default shape based on your routing.
// If your Mongo model uses different names, paste it and I’ll map it exactly.
export interface DedicatedResourceCaseStudyCard {
  _id: string;
  slug: string;

  title: string;
  client: string;
  industry: string;
  description: string;

  coverImageUrl?: string;
  coverImageAlt?: string;
  coverFit?: "contain" | "cover";

  // optional: if you have highlights, we can show them later
  // highlights?: { label: string; value: string }[];
}

type ActiveTab = "seo" | "ppc" | "web" | "dedicated";

export function CaseStudyCardsPage() {
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState<ActiveTab>("seo");

  const [seoCards, setSeoCards] = useState<SeoCaseStudyCard[]>([]);
  const [ppcCards, setPpcCards] = useState<PpcCaseStudyCard[]>([]);
  const [webCards, setWebCards] = useState<WebCaseStudyCard[]>([]);
  const [dedicatedCards, setDedicatedCards] = useState<DedicatedResourceCaseStudyCard[]>([]);

  const [loadingSeo, setLoadingSeo] = useState(true);
  const [loadingPpc, setLoadingPpc] = useState(true);
  const [loadingWeb, setLoadingWeb] = useState(true);
  const [loadingDedicated, setLoadingDedicated] = useState(true);

  const [seoError, setSeoError] = useState<string | null>(null);
  const [ppcError, setPpcError] = useState<string | null>(null);
  const [webError, setWebError] = useState<string | null>(null);
  const [dedicatedError, setDedicatedError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  // ----------- Load SEO -----------
  useEffect(() => {
    let cancelled = false;

    async function loadSeo() {
      try {
        setLoadingSeo(true);
        setSeoError(null);

        const res = await fetch("/api/seo-case-studies");
        if (!res.ok) throw new Error(`Failed to load SEO case studies: ${res.status} ${res.statusText}`);

        const data = (await res.json()) as SeoCaseStudyCard[];
        if (cancelled) return;

        setSeoCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!cancelled) {
          setSeoError(err?.message ?? "Unable to load SEO case studies");
          setSeoCards([]);
        }
      } finally {
        if (!cancelled) setLoadingSeo(false);
      }
    }

    loadSeo();
    return () => {
      cancelled = true;
    };
  }, []);

  // ----------- Load PPC -----------
  useEffect(() => {
    let cancelled = false;

    async function loadPpc() {
      try {
        setLoadingPpc(true);
        setPpcError(null);

        const res = await fetch("/api/ppc-case-studies");
        if (!res.ok) throw new Error(`Failed to load PPC case studies: ${res.status} ${res.statusText}`);

        const data = (await res.json()) as PpcCaseStudyCard[];
        if (cancelled) return;

        setPpcCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!cancelled) {
          setPpcError(err?.message ?? "Unable to load PPC case studies");
          setPpcCards([]);
        }
      } finally {
        if (!cancelled) setLoadingPpc(false);
      }
    }

    loadPpc();
    return () => {
      cancelled = true;
    };
  }, []);

  // ----------- Load WEB DEV -----------
  useEffect(() => {
    let cancelled = false;

    async function loadWeb() {
      try {
        setLoadingWeb(true);
        setWebError(null);

        const res = await fetch("/api/web-case-studies");
        if (!res.ok) throw new Error(`Failed to load Web case studies: ${res.status} ${res.statusText}`);

        const data = (await res.json()) as WebCaseStudyCard[];
        if (cancelled) return;

        setWebCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!cancelled) {
          setWebError(err?.message ?? "Unable to load Web case studies");
          setWebCards([]);
        }
      } finally {
        if (!cancelled) setLoadingWeb(false);
      }
    }

    loadWeb();
    return () => {
      cancelled = true;
    };
  }, []);

  // ----------- Load DEDICATED RESOURCES (NEW) -----------
  useEffect(() => {
    let cancelled = false;

    async function loadDedicated() {
      try {
        setLoadingDedicated(true);
        setDedicatedError(null);

        const res = await fetch("/api/dedicated-resource-case-studies");
        if (!res.ok) {
          throw new Error(`Failed to load Dedicated Resources case studies: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as DedicatedResourceCaseStudyCard[];
        if (cancelled) return;

        setDedicatedCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!cancelled) {
          setDedicatedError(err?.message ?? "Unable to load Dedicated Resources case studies");
          setDedicatedCards([]);
        }
      } finally {
        if (!cancelled) setLoadingDedicated(false);
      }
    }

    loadDedicated();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading =
    activeTab === "seo"
      ? loadingSeo
      : activeTab === "ppc"
      ? loadingPpc
      : activeTab === "web"
      ? loadingWeb
      : loadingDedicated;

  const error =
    activeTab === "seo"
      ? seoError
      : activeTab === "ppc"
      ? ppcError
      : activeTab === "web"
      ? webError
      : dedicatedError;

  const filteredSeo = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seoCards;

    return seoCards.filter((c) => {
      const hay = `${c.cardTitle} ${c.cardClient} ${c.cardIndustry} ${c.cardDescription}`.toLowerCase();
      return hay.includes(q);
    });
  }, [seoCards, query]);

  const filteredPpc = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ppcCards;

    return ppcCards.filter((c) => {
      const hay = `${c.title} ${c.client} ${c.industry} ${c.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [ppcCards, query]);

  const filteredWeb = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return webCards;

    return webCards.filter((c) => {
      const hay = `${c.title} ${c.client} ${c.industry} ${c.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [webCards, query]);

  const filteredDedicated = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dedicatedCards;

    return dedicatedCards.filter((c) => {
      const hay = `${c.title} ${c.client} ${c.industry} ${c.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [dedicatedCards, query]);

  const activeList =
    activeTab === "seo"
      ? (filteredSeo as any[])
      : activeTab === "ppc"
      ? (filteredPpc as any[])
      : activeTab === "web"
      ? (filteredWeb as any[])
      : (filteredDedicated as any[]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Loading{" "}
        {activeTab === "seo"
          ? "SEO"
          : activeTab === "ppc"
          ? "PPC"
          : activeTab === "web"
          ? "Web Development"
          : "Dedicated Resources"}{" "}
        case studies…
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
              {activeTab === "seo"
                ? "SEO Case Studies"
                : activeTab === "ppc"
                ? "PPC / Google Ads Case Studies"
                : activeTab === "web"
                ? "Website Design & Development Case Studies"
                : "Dedicated Resources Case Studies"}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {activeTab === "seo"
                ? "Real SEO wins. Real growth."
                : activeTab === "ppc"
                ? "Real ad wins. Real leads."
                : activeTab === "web"
                ? "Real websites. Real business impact."
                : "Real teams. Real delivery at scale."}
            </h1>

            <p className="text-gray-600 mt-3 max-w-2xl">
              {activeTab === "seo"
                ? "Explore our SEO case studies and see how we improved traffic, rankings, and revenue."
                : activeTab === "ppc"
                ? "Explore our PPC case studies and see how we reduced CPA, improved conversion rates, and scaled ROI."
                : activeTab === "web"
                ? "Explore our website development case studies and see how we built modern, conversion-focused experiences."
                : "Explore our dedicated resources case studies and see how we helped agencies scale with dependable delivery."}
            </p>

            {/* Tabs */}
            <div className="mt-5 inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50 flex-wrap">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "seo" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("seo")}
              >
                SEO
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "ppc" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("ppc")}
              >
                PPC / Google Ads
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "web" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("web")}
              >
                Web Development
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "dedicated" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("dedicated")}
              >
                Dedicated Resources
              </button>
            </div>
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
          {activeTab === "seo"
            ? (activeList as SeoCaseStudyCard[]).map((card) => {
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
                          View case study{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })
            : activeTab === "ppc"
            ? (activeList as PpcCaseStudyCard[]).map((card) => {
                const href = `/ppc-case-study/${card.slug}`;
                const top3 = Array.isArray(card.results) ? card.results.slice(0, 3) : [];

                return (
                  <Link key={card._id} href={href}>
                    <a className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Cover */}
                      <div className="relative bg-gray-50">
                        {card.coverImageUrl ? (
                          <ImageWithFallback
                            src={card.coverImageUrl}
                            alt={card.coverImageAlt || card.title}
                            className={`w-full h-[220px] ${
                              card.coverFit === "contain" ? "object-contain" : "object-cover"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-[220px] flex items-center justify-center text-sm text-gray-400">
                            Cover image not provided
                          </div>
                        )}

                        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800">
                          {card.industry}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2">{card.client}</div>

                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ee4962] transition-colors">
                          {card.title}
                        </h3>

                        <p className="text-gray-600 mt-2 line-clamp-3">{card.description}</p>

                        {/* Results (dynamic) */}
                        <div className={`grid gap-3 mt-6 ${top3.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                          {top3.map((r, idx) => (
                            <ResultChip key={`${r.key}-${idx}`} label={r.label} value={r.value} />
                          ))}
                        </div>

                        <div className="mt-6 inline-flex items-center gap-2 text-[#ee4962] font-semibold">
                          View case study{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })
            : activeTab === "web"
            ? (activeList as WebCaseStudyCard[]).map((card) => {
                const href = `/web-case-study/${card.slug}`;

                return (
                  <Link key={card._id} href={href}>
                    <a className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Image */}
                      <div className="relative bg-gray-50">
                        {card.imageUrl ? (
                          <ImageWithFallback
                            src={card.imageUrl}
                            alt={card.imageAlt || card.title}
                            className={`w-full h-[220px] ${card.imageFit === "contain" ? "object-contain" : "object-cover"}`}
                          />
                        ) : (
                          <div className="w-full h-[220px] flex items-center justify-center text-sm text-gray-400">
                            Cover image not provided
                          </div>
                        )}

                        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800">
                          {card.industry}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2">{card.client}</div>

                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ee4962] transition-colors">
                          {card.title}
                        </h3>

                        <p className="text-gray-600 mt-2 line-clamp-3">{card.description}</p>

                        {/* Results (fixed 3 fields) */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                          <ResultChip label="Performance" value={card.results?.performance || "-"} />
                          <ResultChip label="Conversions" value={card.results?.conversions || "-"} />
                          <ResultChip label="Scale" value={card.results?.users || "-"} />
                        </div>

                        <div className="mt-6 inline-flex items-center gap-2 text-[#ee4962] font-semibold">
                          View case study{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })
            : (activeList as DedicatedResourceCaseStudyCard[]).map((card) => {
                const href = `/dedicated-resource-case-study/${card.slug}`;

                return (
                  <Link key={card._id} href={href}>
                    <a className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Cover */}
                      <div className="relative bg-gray-50">
                        {card.coverImageUrl ? (
                          <ImageWithFallback
                            src={card.coverImageUrl}
                            alt={card.coverImageAlt || card.title}
                            className={`w-full h-[220px] ${card.coverFit === "contain" ? "object-contain" : "object-cover"}`}
                          />
                        ) : (
                          <div className="w-full h-[220px] flex items-center justify-center text-sm text-gray-400">
                            Cover image not provided
                          </div>
                        )}

                        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800">
                          {card.industry}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2">{card.client}</div>

                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ee4962] transition-colors">
                          {card.title}
                        </h3>

                        <p className="text-gray-600 mt-2 line-clamp-3">{card.description}</p>

                        <div className="mt-6 inline-flex items-center gap-2 text-[#ee4962] font-semibold">
                          View case study{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
        </div>

        {activeList.length === 0 ? <div className="text-center text-gray-500 mt-14">No case studies match your search.</div> : null}
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
