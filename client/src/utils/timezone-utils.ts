// src/utils/timezone-utils.ts

export type TimeZoneOptionId = string;

export type TimeFormatMode = "ampm" | "24h";

export type TimeZoneOption = {
  id: TimeZoneOptionId;      
  label: string;             
  group: string;             
  keywords?: string[];      
};

export const timeZoneOptions: TimeZoneOption[] = [
  {
    id: "browser",
    label: "Auto-detect (Local Time)",
    group: "TIME ZONE",
    keywords: ["local", "browser", "auto", "detect"],
  },

  // US/CANADA
  {
    id: "America/Los_Angeles",
    label: "Pacific Time - US & Canada",
    group: "US/CANADA",
    keywords: ["pt", "pst", "pdt", "california", "vancouver", "seattle"],
  },
  {
    id: "America/Denver",
    label: "Mountain Time - US & Canada",
    group: "US/CANADA",
    keywords: ["mt", "mst", "mdt", "colorado", "utah", "arizona*"],
  },
  {
    id: "America/Chicago",
    label: "Central Time - US & Canada",
    group: "US/CANADA",
    keywords: ["ct", "cst", "cdt", "texas", "illinois"],
  },
  {
    id: "America/New_York",
    label: "Eastern Time - US & Canada",
    group: "US/CANADA",
    keywords: ["et", "est", "edt", "new york", "toronto", "miami"],
  },
  {
    id: "America/Anchorage",
    label: "Alaska Time",
    group: "US/CANADA",
    keywords: ["ak", "alaska", "akst", "akdt"],
  },
  {
    id: "Pacific/Honolulu",
    label: "Hawaii Time",
    group: "US/CANADA",
    keywords: ["hawaii", "hst", "honolulu"],
  },
  {
    id: "America/St_Johns",
    label: "Newfoundland Time",
    group: "US/CANADA",
    keywords: ["st johns", "newfoundland", "nst", "ndt"],
  },
  {
    id: "America/Halifax",
    label: "Atlantic Time - Canada",
    group: "US/CANADA",
    keywords: ["atlantic", "halifax", "ast", "adt"],
  },

  // AMERICA (Calendly shows a wider region list; here are common ones you had + more)
  {
    id: "America/Mexico_City",
    label: "Mexico City Time",
    group: "AMERICA",
    keywords: ["mexico", "cdmx"],
  },
  {
    id: "America/Bogota",
    label: "Bogota, Jamaica, Lima Time",
    group: "AMERICA",
    keywords: ["bogota", "jamaica", "lima", "peru", "colombia"],
  },
  {
    id: "America/Santiago",
    label: "Santiago Time",
    group: "AMERICA",
    keywords: ["chile", "santiago"],
  },
  {
    id: "America/Sao_Paulo",
    label: "Brasilia Time",
    group: "AMERICA",
    keywords: ["brazil", "brasilia", "sao paulo"],
  },
  {
    id: "America/Argentina/Buenos_Aires",
    label: "Buenos Aires Time",
    group: "AMERICA",
    keywords: ["argentina", "buenos aires"],
  },

  // EUROPE
  {
    id: "Europe/London",
    label: "London Time - UK",
    group: "EUROPE",
    keywords: ["uk", "britain", "england", "london", "bst", "gmt"],
  },
  {
    id: "Europe/Berlin",
    label: "Berlin Time",
    group: "EUROPE",
    keywords: ["germany", "cest", "cet"],
  },

  // ASIA
  {
    id: "Asia/Riyadh",
    label: "Riyadh Time",
    group: "ASIA",
    keywords: ["saudi", "arabia", "riyadh"],
  },
  {
    id: "Asia/Dubai",
    label: "Dubai Time",
    group: "ASIA",
    keywords: ["uae", "dubai"],
  },
  {
    id: "Asia/Kolkata",
    label: "India Standard Time",
    group: "ASIA",
    keywords: ["india", "ist", "kolkata", "chennai", "bangalore", "mumbai"],
  },
  {
    id: "Asia/Singapore",
    label: "Singapore Time",
    group: "ASIA",
    keywords: ["sg", "singapore"],
  },
  {
    id: "Asia/Shanghai",
    label: "China Time - Beijing",
    group: "ASIA",
    keywords: ["china", "beijing", "shanghai", "cst"],
  },
  {
    id: "Asia/Tokyo",
    label: "Japan Time - Tokyo",
    group: "ASIA",
    keywords: ["japan", "tokyo", "jst"],
  },

  // AFRICA
  {
    id: "Africa/Johannesburg",
    label: "South Africa Time",
    group: "AFRICA",
    keywords: ["johannesburg", "south africa", "sast"],
  },

  // AUSTRALIA
  {
    id: "Australia/Perth",
    label: "Perth Time",
    group: "AUSTRALIA",
    keywords: ["perth", "awst"],
  },
  {
    id: "Australia/Adelaide",
    label: "Adelaide Time",
    group: "AUSTRALIA",
    keywords: ["adelaide", "acst", "acdt"],
  },
  {
    id: "Australia/Sydney",
    label: "Sydney Time",
    group: "AUSTRALIA",
    keywords: ["sydney", "aest", "aedt"],
  },
];

// ------------------------------------------------------------------
// ✅ Slot conversion logic (your existing logic kept)
// ------------------------------------------------------------------

// Convert "HH:mm" (IST time) into a UTC instant for a given date
export const getInstantFromISTSlot = (time: string, date: Date) => {
  const [h, m] = time.split(":").map(Number);
  // IST is UTC+5:30 → UTC hour = IST hour - 5:30
  const utcMillis = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    h - 5,
    m - 30,
  );
  return new Date(utcMillis);
};

// ------------------------------------------------------------------
// ✅ Calendly-like "right side" preview time for each timezone
//    returns: "8:21am" OR "20:21" based on toggle
// ------------------------------------------------------------------

const formatPreviewAMPM = (date: Date, timeZone?: string) => {
  // We want "8:21am" (lowercase am/pm, no seconds)
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).formatToParts(date);

  let h = "";
  let m = "";
  let dp = "";
  for (const p of parts) {
    if (p.type === "hour") h = p.value;
    if (p.type === "minute") m = p.value;
    if (p.type === "dayPeriod") dp = p.value.toLowerCase(); // AM -> am
  }
  return `${h}:${m}${dp}`;
};

const formatPreview24H = (date: Date, timeZone?: string) => {
  // "20:21"
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
};

/**
 * Calendly-style right-side preview time for a timezone option
 */
export const getTimeZonePreviewTime = (
  timeZone: TimeZoneOptionId,
  mode: TimeFormatMode = "ampm",
  now: Date = new Date(),
) => {
  if (timeZone === "browser") {
    return mode === "24h" ? formatPreview24H(now) : formatPreviewAMPM(now);
  }

  return mode === "24h"
    ? formatPreview24H(now, timeZone)
    : formatPreviewAMPM(now, timeZone);
};

// ------------------------------------------------------------------
// ✅ Slot label formatting in selected timezone (your logic kept)
// ------------------------------------------------------------------

export const formatInstantForTimeZone = (
  instant: Date,
  timeZone: TimeZoneOptionId,
) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (timeZone === "browser") {
    return instant.toLocaleTimeString([], options);
  }

  return instant.toLocaleTimeString([], {
    ...options,
    timeZone,
  });
};

export const formatSlotLabelForTimeZone = (
  startTime: string,
  endTime: string,
  date: Date,
  timeZone: TimeZoneOptionId,
) => {
  const instantStart = getInstantFromISTSlot(startTime, date);
  const instantEnd = getInstantFromISTSlot(endTime, date);

  return `${formatInstantForTimeZone(
    instantStart,
    timeZone,
  )} – ${formatInstantForTimeZone(instantEnd, timeZone)}`;
};

export const getLocalMinutesFromISTSlot = (time: string, date: Date) => {
  const localInstant = getInstantFromISTSlot(time, date);
  return localInstant.getHours() * 60 + localInstant.getMinutes();
};

// ------------------------------------------------------------------
// ✅ Search helper (Calendly-like search box)
// ------------------------------------------------------------------

export const searchTimeZones = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return timeZoneOptions;

  return timeZoneOptions.filter((tz) => {
    const hay = [
      tz.label,
      tz.id,
      tz.group,
      ...(tz.keywords || []),
    ]
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });
};

// ------------------------------------------------------------------
// ✅ Group helper (for rendering headings like "US/CANADA", "AMERICA")
// ------------------------------------------------------------------

export const groupTimeZones = (list: TimeZoneOption[]) => {
  const map = new Map<string, TimeZoneOption[]>();
  for (const item of list) {
    const key = item.group || "TIME ZONE";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
};
