// src/utils/timezone-utils.ts

// We’ll use IANA timezone IDs plus a special "browser" option
export type TimeZoneOptionId = string;

export const timeZoneOptions: { id: TimeZoneOptionId; label: string }[] = [
  { id: "browser", label: "Auto-detect (your local time)" },

  // United States
  {
    id: "America/New_York",
    label: "United States – Eastern Standard Time (EST, UTC-5)",
  },
  {
    id: "America/Chicago",
    label: "United States – Central Standard Time (CST, UTC-6)",
  },
  {
    id: "America/Denver",
    label: "United States – Mountain Standard Time (MST, UTC-7)",
  },
  {
    id: "America/Los_Angeles",
    label: "United States – Pacific Standard Time (PST, UTC-8)",
  },
  {
    id: "America/Anchorage",
    label: "United States – Alaska Standard Time (AKST, UTC-9)",
  },
  {
    id: "Pacific/Honolulu",
    label:
      "United States – Hawaii-Aleutian Standard Time (HST, UTC-10)",
  },

  // United Kingdom
  {
    id: "Europe/London",
    label:
      "United Kingdom – GMT / British Summer Time (GMT/BST, UTC+0/UTC+1)",
  },

  // Germany
  {
    id: "Europe/Berlin",
    label:
      "Germany – Central European Time / Summer Time (CET/CEST, UTC+1/UTC+2)",
  },

  // India
  {
    id: "Asia/Kolkata",
    label: "India – India Standard Time (IST, UTC+5:30)",
  },

  // Australia
  {
    id: "Australia/Perth",
    label:
      "Australia – Australian Western Standard Time (AWST, UTC+8)",
  },
  {
    id: "Australia/Adelaide",
    label:
      "Australia – Australian Central Standard Time (ACST, UTC+9:30)",
  },
  {
    id: "Australia/Sydney",
    label:
      "Australia – Australian Eastern Time (AEST/AEDT, UTC+10/UTC+11)",
  },

  // Canada
  {
    id: "America/St_Johns",
    label: "Canada – Newfoundland Standard Time (NST, UTC-3:30)",
  },
  {
    id: "America/Halifax",
    label: "Canada – Atlantic Standard Time (AST, UTC-4)",
  },
  {
    id: "America/Toronto",
    label: "Canada – Eastern Standard Time (EST, UTC-5)",
  },
  {
    id: "America/Winnipeg",
    label: "Canada – Central Standard Time (CST, UTC-6)",
  },
  {
    id: "America/Edmonton",
    label: "Canada – Mountain Standard Time (MST, UTC-7)",
  },
  {
    id: "America/Vancouver",
    label: "Canada – Pacific Standard Time (PST, UTC-8)",
  },

  // United Arab Emirates
  {
    id: "Asia/Dubai",
    label: "United Arab Emirates – Gulf Standard Time (GST, UTC+4)",
  },

  // Saudi Arabia
  {
    id: "Asia/Riyadh",
    label: "Saudi Arabia – Arabia Standard Time (AST, UTC+3)",
  },

  // Singapore
  {
    id: "Asia/Singapore",
    label: "Singapore – Singapore Standard Time (SGT, UTC+8)",
  },

  // Japan
  {
    id: "Asia/Tokyo",
    label: "Japan – Japan Standard Time (JST, UTC+9)",
  },

  // China
  {
    id: "Asia/Shanghai",
    label: "China – China Standard Time (CST, UTC+8)",
  },

  // South Africa
  {
    id: "Africa/Johannesburg",
    label:
      "South Africa – South Africa Standard Time (SAST, UTC+2)",
  },

  // Mexico
  {
    id: "America/Mexico_City",
    label: "Mexico – Central Standard Time (CST, UTC-6)",
  },

  // Brazil
  {
    id: "America/Sao_Paulo",
    label: "Brazil – Brasília Time (BRT, UTC-3)",
  },

  // Argentina
  {
    id: "America/Argentina/Buenos_Aires",
    label: "Argentina – Argentina Time (ART, UTC-3)",
  },

  // Chile
  {
    id: "America/Santiago",
    label: "Chile – Chile Standard Time (CLT, UTC-4)",
  },
];

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
  return new Date(utcMillis); // represents the absolute instant
};

// Format a time in a given timezone (or browser local)
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

// For displaying "4:00 PM – 4:30 PM" in chosen timezone
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

// Get minutes from midnight for LOCAL browser time (for "past slot" logic)
export const getLocalMinutesFromISTSlot = (time: string, date: Date) => {
  const localInstant = getInstantFromISTSlot(time, date);
  return localInstant.getHours() * 60 + localInstant.getMinutes();
};
