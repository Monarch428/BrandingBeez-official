"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Globe, ChevronDown } from "lucide-react";

import type { TimeFormatMode, TimeZoneOptionId } from "@/utils/timezone-utils";
import {
    groupTimeZones,
    searchTimeZones,
    getTimeZonePreviewTime,
    timeZoneOptions,
} from "@/utils/timezone-utils";

type Props = {
    value: TimeZoneOptionId;
    onChange: (tz: TimeZoneOptionId) => void;
    initialMode?: TimeFormatMode;
    className?: string;
};

const TimeZonePicker: React.FC<Props> = ({
    value,
    onChange,
    initialMode = "ampm",
    className = "",
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<TimeFormatMode>(initialMode);

    // refresh preview time every minute
    const [, forceTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => forceTick((x) => x + 1), 60_000);
        return () => clearInterval(t);
    }, []);

    const selected =
        timeZoneOptions.find((t) => t.id === value) ||
        timeZoneOptions.find((t) => t.id === "browser")!;

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

    const close = () => {
        setOpen(false);
        setQuery("");
    };

    return (
        <div className={`w-full ${className}`}>
            <Popover.Root open={open} onOpenChange={setOpen}>
                {/* Trigger MUST be a single element */}
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        className="
              w-full inline-flex items-center justify-between gap-3
              rounded-md border border-slate-200 bg-white
              px-3 py-2 text-[13px] sm:text-sm
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
            "
                    >
                        <span className="inline-flex items-center gap-2 min-w-0">
                            <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                            <span className="truncate text-slate-800">
                                {selected.label}
                            </span>
                        </span>

                        <span className="inline-flex items-center gap-2 shrink-0">
                            <span className="text-[12px] text-slate-500 tabular-nums">
                                {getTimeZonePreviewTime(selected.id, mode)}
                            </span>
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </span>
                    </button>
                </Popover.Trigger>

                {/* ✅ Portal MUST have ONE child → Fragment */}
                <Popover.Portal>
                    <>
                        {/* Mobile backdrop */}
                        {open && (
                            <div
                                className="fixed inset-0 z-[9998] bg-black/20 sm:hidden"
                                onClick={close}
                            />
                        )}

                        <Popover.Content
                            side="bottom"
                            align="end"
                            sideOffset={10}
                            collisionPadding={12}
                            className="
                z-[9999]
                w-[min(92vw,420px)]
                rounded-lg border border-slate-200 bg-white
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                overflow-hidden
                focus:outline-none
              "
                        >
                            {/* Search */}
                            <div className="p-3 sm:p-4 border-b border-slate-100">
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

                                {/* Header + toggle */}
                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-gray-800">
                                        TIME ZONE
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-700">
                                        <span className={mode === "ampm" ? "font-semibold" : ""}>
                                            am/pm
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMode((m) => (m === "ampm" ? "24h" : "ampm"))
                                            }
                                            className={`
                        relative inline-flex items-center h-5 w-9 rounded-full transition-colors
                        ${mode === "24h" ? "bg-blue-600" : "bg-gray-300"}
                      `}
                                        >
                                            <span
                                                className={`
                          inline-block h-4 w-4 rounded-full bg-white shadow
                          transition-transform
                          ${mode === "24h" ? "translate-x-4" : "translate-x-1"}
                        `}
                                            />
                                        </button>

                                        <span className={mode === "24h" ? "font-semibold" : ""}>
                                            24h
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="max-h-[60vh] sm:max-h-[360px] overflow-auto scrollbar-thin">
                                {grouped.keys.map((group) => {
                                    const items = grouped.map.get(group) || [];
                                    if (!items.length) return null;

                                    return (
                                        <div key={group}>
                                            <div className="sticky top-0 bg-white px-3 py-2 text-xs font-bold border-b">
                                                {group}
                                            </div>

                                            {items.map((tz) => {
                                                const active = tz.id === value;
                                                return (
                                                    <button
                                                        key={tz.id}
                                                        type="button"
                                                        onClick={() => {
                                                            onChange(tz.id);
                                                            close();
                                                        }}
                                                        className={[
                                                            "w-full px-3 py-2.5 flex flex-col sm:flex-row justify-between text-left",
                                                            active
                                                                ? "bg-blue-600 text-white"
                                                                : "hover:bg-blue-50",
                                                        ].join(" ")}
                                                    >
                                                        <span>{tz.label}</span>
                                                        <span className="text-xs tabular-nums">
                                                            {getTimeZonePreviewTime(tz.id, mode)}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </Popover.Content>
                    </>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
};

export default TimeZonePicker;
