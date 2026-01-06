// // src/server/google-calendar.ts
// import { google } from "googleapis";
// import { storage } from "../storage";

// const {
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GOOGLE_CALENDAR_ID,
// } = process.env;

// const DEFAULT_CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";

// const oauth2Client = new google.auth.OAuth2(
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
// );

// const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// export interface CreateMeetEventParams {
//   summary: string;
//   description?: string;
//   date: string; // "YYYY-MM-DD"
//   startTime: string; // "HH:mm"
//   endTime: string; // "HH:mm"
//   attendeeEmail?: string;
//   attendeeName?: string;
//   guestEmails?: string[];
// }

// export interface CreateMeetEventResult {
//   eventId: string;
//   meetingLink?: string;
// }

// /**
//  * Shared auth helper.
//  * Returns the calendarId that should be used.
//  */
// async function ensureGoogleAuth(): Promise<{ calendarId: string } | null> {
//   if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
//     console.warn(
//       "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET).",
//     );
//     return null;
//   }

//   // Always prefer DB tokens (from OAuth flow)
//   const tokens = await storage.getGoogleAuthTokens();

//   if (!tokens || !tokens.refreshToken) {
//     console.warn(
//       "[Google Calendar] No refresh token found in DB – cannot talk to Calendar.",
//     );
//     return null;
//   }

//   oauth2Client.setCredentials({
//     access_token: tokens.accessToken,
//     refresh_token: tokens.refreshToken,
//     expiry_date: tokens.expiryDate,
//   });

//   const calendarId = tokens.calendarId || DEFAULT_CALENDAR_ID;
//   return { calendarId };
// }

// /* ------------------------------------------------------------------
//    CREATE GOOGLE MEET EVENT
// ------------------------------------------------------------------ */
// export async function createGoogleMeetEvent(
//   params: CreateMeetEventParams,
// ): Promise<CreateMeetEventResult> {
//   const {
//     summary,
//     description,
//     date,
//     startTime,
//     endTime,
//     attendeeEmail,
//     attendeeName,
//     guestEmails = [],
//   } = params;

//   console.log("[Google Calendar] createGoogleMeetEvent params:", params);

//   const auth = await ensureGoogleAuth();
//   if (!auth) {
//     console.warn(
//       "[Google Calendar] Auth failed – skipping Meet creation, but continuing booking.",
//     );
//     return { eventId: "", meetingLink: undefined };
//   }
//   const { calendarId } = auth;

//   const timeZone = "Asia/Kolkata";

//   const attendees: { email: string; displayName?: string }[] = [];

//   if (attendeeEmail) {
//     attendees.push({
//       email: attendeeEmail,
//       displayName: attendeeName,
//     });
//   }

//   guestEmails
//     .filter((g) => !!g)
//     .forEach((g) => {
//       if (!attendeeEmail || g.toLowerCase() !== attendeeEmail.toLowerCase()) {
//         attendees.push({ email: g });
//       }
//     });

//   const event = {
//     summary,
//     description,
//     start: {
//       dateTime: `${date}T${startTime}:00`,
//       timeZone,
//     },
//     end: {
//       dateTime: `${date}T${endTime}:00`,
//       timeZone,
//     },
//     attendees,
//     conferenceData: {
//       createRequest: {
//         requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2)}`,
//         conferenceSolutionKey: { type: "hangoutsMeet" },
//       },
//     },
//   };

//   const response = await calendar.events.insert({
//     calendarId,
//     requestBody: event as any,
//     conferenceDataVersion: 1,
//   });

//   const data = response.data;

//   const meetingLink =
//     (data.hangoutLink ??
//       data.conferenceData?.entryPoints?.find(
//         (e) => e.entryPointType === "video",
//       )?.uri ??
//       undefined) || undefined;

//   console.log("[Google Calendar] Event created:", {
//     id: data.id,
//     meetingLink,
//   });

//   return {
//     eventId: data.id || "",
//     meetingLink,
//   };
// }

// /* ------------------------------------------------------------------
//    BUSY TIME LOOKUP
// ------------------------------------------------------------------ */

// export interface BusyTimeRange {
//   start: string; // ISO
//   end: string; // ISO
// }

// export async function getBusyTimeRangesForDate(
//   date: string, // "YYYY-MM-DD"
// ): Promise<BusyTimeRange[]> {
//   const auth = await ensureGoogleAuth();
//   if (!auth) {
//     console.warn(
//       "[Google Calendar] Auth failed – returning empty busy list for date",
//       date,
//     );
//     return [];
//   }
//   const { calendarId } = auth;

//   const timeZone = "Asia/Kolkata";

//   const timeMin = new Date(`${date}T00:00:00+05:30`).toISOString();
//   const timeMax = new Date(`${date}T23:59:59+05:30`).toISOString();

//   const res = await calendar.freebusy.query({
//     requestBody: {
//       timeMin,
//       timeMax,
//       timeZone,
//       items: [{ id: calendarId }],
//     },
//   });

//   const busy =
//     res.data.calendars?.[calendarId]?.busy?.map((b) => ({
//       start: b.start as string,
//       end: b.end as string,
//     })) ?? [];

//   console.log("[Google Calendar] Busy ranges for", date, "=>", busy);

//   return busy;
// }

// export function isSlotOverlappingBusy(
//   date: string,
//   startTime: string,
//   endTime: string,
//   busyRanges: BusyTimeRange[],
// ): boolean {
//   const slotStart = new Date(`${date}T${startTime}:00+05:30`).getTime();
//   const slotEnd = new Date(`${date}T${endTime}:00+05:30`).getTime();

//   return busyRanges.some((b) => {
//     const busyStart = new Date(b.start).getTime();
//     const busyEnd = new Date(b.end).getTime();
//     return slotStart < busyEnd && slotEnd > busyStart;
//   });
// }


// src/server/google-calendar.ts
import { google } from "googleapis";
import { storage } from "../storage";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_IDS, // ✅ optional: comma-separated list
  HOST_TIMEZONE,       // ✅ optional: defaults to Asia/Kolkata
} = process.env;

const DEFAULT_CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";
const DEFAULT_TIMEZONE = HOST_TIMEZONE || "Asia/Kolkata";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CreateMeetEventParams {
  summary: string;
  description?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  attendeeEmail?: string;
  attendeeName?: string;
  guestEmails?: string[];
}

export interface CreateMeetEventResult {
  eventId: string;
  meetingLink?: string;
}

export interface BusyTimeRange {
  start: string; // ISO
  end: string; // ISO
}

// ✅ used by appointments-router to return 503
export class HostCalendarNotConnectedError extends Error {
  constructor(message = "Host Google Calendar not connected") {
    super(message);
    this.name = "HostCalendarNotConnectedError";
  }
}

function getCalendarIdsToCheck(primaryFromDbOrEnv: string): string[] {
  const envIds = (GOOGLE_CALENDAR_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const merged = [primaryFromDbOrEnv, ...envIds].filter(Boolean);
  return Array.from(new Set(merged));
}

/**
 * Shared auth helper.
 * Returns calendar ids that should be used.
 * IMPORTANT:
 * - For Meet creation we use the first calendar id (primary target).
 * - For busy lookup we can query multiple calendar ids.
 */
async function ensureGoogleAuth(): Promise<{
  calendarId: string;
  calendarIds: string[];
} | null> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET).",
    );
    return null;
  }

  // Always prefer DB tokens (from OAuth flow)
  const tokens = await storage.getGoogleAuthTokens();

  if (!tokens || (!tokens.refreshToken && !tokens.accessToken)) {
    console.warn(
      "[Google Calendar] No tokens found in DB – cannot talk to Calendar.",
    );
    return null;
  }

  oauth2Client.setCredentials({
    access_token: tokens.accessToken || undefined,
    refresh_token: tokens.refreshToken || undefined,
    expiry_date: tokens.expiryDate || undefined,
  });

  // ✅ Proactively refresh access token if needed, and persist updated token
  try {
    const res = await oauth2Client.getAccessToken();
    const freshAccessToken = typeof res === "string" ? res : res?.token;

    // If googleapis refreshed internally, credentials may include new expiry/access token
    const creds: any = oauth2Client.credentials || {};
    const nextAccessToken = creds.access_token || freshAccessToken || tokens.accessToken;
    const nextRefreshToken = creds.refresh_token || tokens.refreshToken;
    const nextExpiry = creds.expiry_date || tokens.expiryDate;

    // Persist refreshed tokens if storage supports it
    if (
      typeof (storage as any).updateGoogleAuthTokens === "function" &&
      (nextAccessToken !== tokens.accessToken ||
        nextRefreshToken !== tokens.refreshToken ||
        nextExpiry !== tokens.expiryDate)
    ) {
      await (storage as any).updateGoogleAuthTokens({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        expiryDate: nextExpiry,
        calendarId: tokens.calendarId || DEFAULT_CALENDAR_ID,
      });
    }

    // Update client credentials (ensures latest tokens used for API calls)
    oauth2Client.setCredentials({
      access_token: nextAccessToken || undefined,
      refresh_token: nextRefreshToken || undefined,
      expiry_date: nextExpiry || undefined,
    });
  } catch (err) {
    console.warn("[Google Calendar] Token refresh failed:", err);
    // If we can’t refresh, treat as not connected
    return null;
  }

  const calendarId = tokens.calendarId || DEFAULT_CALENDAR_ID;
  const calendarIds = getCalendarIdsToCheck(calendarId);

  return { calendarId, calendarIds };
}

/* ------------------------------------------------------------------
   CREATE GOOGLE MEET EVENT
------------------------------------------------------------------ */
export async function createGoogleMeetEvent(
  params: CreateMeetEventParams,
): Promise<CreateMeetEventResult> {
  const {
    summary,
    description,
    date,
    startTime,
    endTime,
    attendeeEmail,
    attendeeName,
    guestEmails = [],
  } = params;

  console.log("[Google Calendar] createGoogleMeetEvent params:", params);

  const auth = await ensureGoogleAuth();
  if (!auth) {
    console.warn(
      "[Google Calendar] Auth failed – skipping Meet creation, but continuing booking.",
    );
    return { eventId: "", meetingLink: undefined };
  }

  // ✅ Use the primary calendar for event creation
  const { calendarId } = auth;

  const timeZone = DEFAULT_TIMEZONE;

  const attendees: { email: string; displayName?: string }[] = [];

  if (attendeeEmail) {
    attendees.push({
      email: attendeeEmail,
      displayName: attendeeName,
    });
  }

  guestEmails
    .filter((g) => !!g)
    .forEach((g) => {
      if (!attendeeEmail || g.toLowerCase() !== attendeeEmail.toLowerCase()) {
        attendees.push({ email: g });
      }
    });

  const event = {
    summary,
    description,
    start: {
      dateTime: `${date}T${startTime}:00`,
      timeZone,
    },
    end: {
      dateTime: `${date}T${endTime}:00`,
      timeZone,
    },
    attendees,
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event as any,
    conferenceDataVersion: 1,
  });

  const data = response.data;

  const meetingLink =
    (data.hangoutLink ??
      data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video",
      )?.uri ??
      undefined) || undefined;

  console.log("[Google Calendar] Event created:", {
    id: data.id,
    meetingLink,
  });

  return {
    eventId: data.id || "",
    meetingLink,
  };
}

/* ------------------------------------------------------------------
   BUSY TIME LOOKUP (HOST CALENDAR)
   IMPORTANT: if auth fails -> THROW (so router returns 503 and avoids double booking)
------------------------------------------------------------------ */
export async function getBusyTimeRangesForDate(
  date: string, // "YYYY-MM-DD"
): Promise<BusyTimeRange[]> {
  const auth = await ensureGoogleAuth();
  if (!auth) {
    console.warn(
      "[Google Calendar] Auth failed – cannot fetch busy time for date",
      date,
    );
    throw new HostCalendarNotConnectedError(
      "Host Google Calendar not connected / token expired.",
    );
  }

  const { calendarIds } = auth;
  const timeZone = DEFAULT_TIMEZONE;

  // ✅ IST boundaries for the selected date
  // Use explicit offset to avoid server timezone differences
  const timeMin = new Date(`${date}T00:00:00+05:30`).toISOString();
  const timeMax = new Date(`${date}T23:59:59+05:30`).toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone,
      items: calendarIds.map((id) => ({ id })),
    },
  });

  const busy: BusyTimeRange[] = [];

  for (const id of calendarIds) {
    const ranges = res.data.calendars?.[id]?.busy ?? [];
    for (const b of ranges) {
      if (b.start && b.end) busy.push({ start: b.start as string, end: b.end as string });
    }
  }

  console.log("[Google Calendar] Busy ranges for", date, "=>", busy);

  return busy;
}

export function isSlotOverlappingBusy(
  date: string,
  startTime: string,
  endTime: string,
  busyRanges: BusyTimeRange[],
): boolean {
  // ✅ Compare with IST slot time converted to ms
  const slotStart = new Date(`${date}T${startTime}:00+05:30`).getTime();
  const slotEnd = new Date(`${date}T${endTime}:00+05:30`).getTime();

  return busyRanges.some((b) => {
    const busyStart = new Date(b.start).getTime();
    const busyEnd = new Date(b.end).getTime();
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}
