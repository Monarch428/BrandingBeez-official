// src/utils/timezone-utils.ts

export type TimeZoneOptionId = string;

export const timeZoneOptions: { id: TimeZoneOptionId; label: string }[] = [
  { id: "browser", label: "Auto-detect (Local Time)" },

  // United States
  { id: "America/New_York", label: "US – E – Standard Time (UTC-5)" },
  { id: "America/Chicago", label: "US – C – Standard Time (UTC-6)" },
  { id: "America/Denver", label: "US – M – Standard Time (UTC-7)" },
  { id: "America/Los_Angeles", label: "US – P – Standard Time (UTC-8)" },
  { id: "America/Anchorage", label: "US – A – Standard Time (UTC-9)" },
  { id: "Pacific/Honolulu", label: "US – H – Standard Time (UTC-10)" },

  // United Kingdom
  {
    id: "Europe/London",
    label: "UK – G – Mean Time / B – Summer Time (UTC+0 / UTC+1)",
  },

  // Germany
  {
    id: "Europe/Berlin",
    label: "DE – C – European Time / C – European Summer Time (UTC+1 / UTC+2)",
  },

  // India
  { id: "Asia/Kolkata", label: "IND – KOL – Standard Time (UTC+5:30)" },

  // Australia
  { id: "Australia/Perth", label: "AU – W – Standard Time (UTC+8)" },
  { id: "Australia/Adelaide", label: "AU – C – Standard Time (UTC+9:30)" },
  {
    id: "Australia/Sydney",
    label: "AU – E – Standard Time / E – Daylight Time (UTC+10 / UTC+11)",
  },

  // Canada
  { id: "America/St_Johns", label: "CA – N – Standard Time (UTC-3:30)" },
  { id: "America/Halifax", label: "CA – A – Standard Time (UTC-4)" },
  { id: "America/Toronto", label: "CA – E – Standard Time (UTC-5)" },
  { id: "America/Winnipeg", label: "CA – C – Standard Time (UTC-6)" },
  { id: "America/Edmonton", label: "CA – M – Standard Time (UTC-7)" },
  { id: "America/Vancouver", label: "CA – P – Standard Time (UTC-8)" },

  // UAE
  { id: "Asia/Dubai", label: "UAE – G – Standard Time (UTC+4)" },

  // Saudi Arabia
  { id: "Asia/Riyadh", label: "SA – A – Standard Time (UTC+3)" },

  // Singapore
  { id: "Asia/Singapore", label: "SG – S – Standard Time (UTC+8)" },

  // Japan
  { id: "Asia/Tokyo", label: "JP – J – Standard Time (UTC+9)" },

  // China
  { id: "Asia/Shanghai", label: "CN – C – Standard Time (UTC+8)" },

  // South Africa
  { id: "Africa/Johannesburg", label: "ZA – S – Standard Time (UTC+2)" },

  // Mexico
  { id: "America/Mexico_City", label: "MX – C – Standard Time (UTC-6)" },

  // Brazil
  { id: "America/Sao_Paulo", label: "BR – B – Time (UTC-3)" },

  // Argentina
  {
    id: "America/Argentina/Buenos_Aires",
    label: "AR – A – Time (UTC-3)",
  },

  // Chile
  { id: "America/Santiago", label: "CL – C – Standard Time (UTC-4)" },
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
  return new Date(utcMillis);
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
