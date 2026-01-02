"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { TimeFormatMode, TimeZoneOptionId } from "@/utils/timezone-utils";
import {
    groupTimeZones,
    searchTimeZones,
    getTimeZonePreviewTime,
} from "@/utils/timezone-utils";

type Props = {
    value: TimeZoneOptionId;
    onChange: (tz: TimeZoneOptionId) => void;
    initialMode?: TimeFormatMode;
    className?: string;
};

export const TimeZonePicker: React.FC<Props> = ({
    value,
    onChange,
    initialMode = "ampm",
    className = "",
}) => {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<TimeFormatMode>(initialMode);

    // ⏱️ refresh preview time every minute (Calendly-like)
    const [, forceTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => forceTick((x) => x + 1), 60_000);
        return () => clearInterval(t);
    }, []);

    const filtered = useMemo(() => searchTimeZones(query), [query]);

    const grouped = useMemo(() => {
        const map = groupTimeZones(filtered);
        const keys = Array.from(map.keys()).sort((a, b) => {
            if (a === "TIME ZONE") return -1;
            if (b === "TIME ZONE") return 1;
            if (a === "US/CANADA") return -1;
            if (b === "US/CANADA") return 1;
            return a.localeCompare(b);
        });
        return { map, keys };
    }, [filtered]);

    return (
        <div className={`w-full ${className}`}>
            {/* Search */}
            <div className="w-full">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="
            w-full rounded-md border border-blue-500/80 bg-white
            px-3 py-2.5 text-[13px]
            sm:px-4 sm:py-3 sm:text-sm
            outline-none
            focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30
          "
                />
            </div>

            {/* Header row: TIME ZONE + toggle */}
            <div className="mt-3 sm:mt-4 flex items-center justify-between gap-3">
                <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-gray-800">
                    TIME ZONE
                </div>

                {/* Wrap-safe for 320px */}
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-700 shrink-0">
                    <span className={mode === "ampm" ? "font-semibold text-gray-900" : ""}>
                        am/pm
                    </span>

                    <button
                        type="button"
                        onClick={() => setMode((m) => (m === "ampm" ? "24h" : "ampm"))}
                        className={`
              relative inline-flex h-5 w-9 items-center rounded-full
              transition-colors
              ${mode === "24h" ? "bg-blue-600" : "bg-gray-300"}
            `}
                        aria-label="Toggle time format"
                    >
                        <span
                            className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow
                transition-transform
                ${mode === "24h" ? "translate-x-4" : "translate-x-1"}
              `}
                        />
                    </button>

                    <span className={mode === "24h" ? "font-semibold text-gray-900" : ""}>
                        24h
                    </span>
                </div>
            </div>

            {/* Scroll list */}
            <div
                className="
          mt-3 w-full overflow-auto rounded-md border border-gray-200 bg-white
          max-h-[65vh] sm:max-h-72
        "
            >
                {grouped.keys.map((groupKey) => {
                    const items = grouped.map.get(groupKey) || [];
                    if (!items.length) return null;

                    return (
                        <div key={groupKey}>
                            {/* Group heading */}
                            <div
                                className="
                  sticky top-0 z-10 bg-white
                  px-3 py-2 sm:px-4
                  text-[12px] sm:text-sm font-bold text-gray-900
                  border-b border-gray-100
                "
                            >
                                {groupKey}
                            </div>

                            {/* Items */}
                            <div className="py-1">
                                {items.map((tz) => {
                                    const isSelected = tz.id === value;

                                    return (
                                        <button
                                            key={tz.id}
                                            type="button"
                                            onClick={() => onChange(tz.id)}
                                            className={[
                                                // Layout switches at xs for 320px:
                                                // - xs: label + time stacked (no overflow)
                                                // - sm+: row layout like Calendly
                                                "w-full text-left transition-colors",
                                                "px-3 py-2.5 sm:px-4 sm:py-3",
                                                "flex flex-col items-start gap-1",
                                                "sm:flex-row sm:items-center sm:justify-between sm:gap-3",
                                                isSelected
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-900 hover:bg-blue-50",
                                            ].join(" ")}
                                        >
                                            <span className="text-[13px] sm:text-sm font-medium leading-snug break-words">
                                                {tz.label}
                                            </span>

                                            <span
                                                className={[
                                                    "text-[12px] sm:text-sm tabular-nums",
                                                    // On mobile align right visually without forcing overflow
                                                    "sm:shrink-0",
                                                    isSelected ? "text-white" : "text-gray-600",
                                                ].join(" ")}
                                            >
                                                {getTimeZonePreviewTime(tz.id, mode)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {!filtered.length && (
                    <div className="px-3 sm:px-4 py-6 text-sm text-gray-500">
                        No time zones found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeZonePicker;
