// src/server/google-calendar.ts
import { google } from "googleapis";
import { storage } from "./storage";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALENDAR_ID,
} = process.env;

const CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";

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

  // main attendee
  attendeeEmail?: string;
  attendeeName?: string;

  // ✅ NEW: guests
  guestEmails?: string[];
}

export interface CreateMeetEventResult {
  eventId: string;
  meetingLink?: string;
}

// ✅ NEW: shared auth helper
async function ensureGoogleAuth(): Promise<boolean> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET).",
    );
    return false;
  }

  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let expiryDate: number | undefined;

  if (GOOGLE_REFRESH_TOKEN) {
    // using static refresh token from env
    refreshToken = GOOGLE_REFRESH_TOKEN;
  } else {
    // fallback: tokens from DB
    const tokens = await storage.getGoogleAuthTokens();
    if (!tokens || !tokens.refreshToken) {
      console.warn(
        "[Google Calendar] No refresh token found in DB – cannot talk to Calendar.",
      );
      return false;
    }
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
    expiryDate = tokens.expiryDate;
  }

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  return true;
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

  const authOk = await ensureGoogleAuth();
  if (!authOk) {
    console.warn(
      "[Google Calendar] Auth failed – skipping Meet creation, but continuing booking.",
    );
    return { eventId: "", meetingLink: undefined };
  }

  const timeZone = "Asia/Kolkata";

  // ✅ Build attendees list: main attendee + guests
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
      // avoid duplicating main attendee
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
    calendarId: CALENDAR_ID,
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
   NEW: BUSY TIME LOOKUP
   - Use this so GCal busy = booked in your scheduler
------------------------------------------------------------------ */

export interface BusyTimeRange {
  start: string; // ISO
  end: string;   // ISO
}

/**
 * Get all busy periods in Google Calendar for a specific date (IST day).
 */
export async function getBusyTimeRangesForDate(
  date: string, // "YYYY-MM-DD"
): Promise<BusyTimeRange[]> {
  const authOk = await ensureGoogleAuth();
  if (!authOk) {
    console.warn(
      "[Google Calendar] Auth failed – returning empty busy list for date",
      date,
    );
    return [];
  }

  const timeZone = "Asia/Kolkata";

  // full day in IST
  const timeMin = new Date(`${date}T00:00:00+05:30`).toISOString();
  const timeMax = new Date(`${date}T23:59:59+05:30`).toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const busy =
    res.data.calendars?.[CALENDAR_ID]?.busy?.map((b) => ({
      start: b.start as string,
      end: b.end as string,
    })) ?? [];

  console.log("[Google Calendar] Busy ranges for", date, "=>", busy);

  return busy;
}

/**
 * Check if a given slot overlaps any busy range.
 */
export function isSlotOverlappingBusy(
  date: string,       // "YYYY-MM-DD"
  startTime: string,  // "HH:mm"
  endTime: string,    // "HH:mm"
  busyRanges: BusyTimeRange[],
): boolean {
  const slotStart = new Date(`${date}T${startTime}:00+05:30`).getTime();
  const slotEnd = new Date(`${date}T${endTime}:00+05:30+05:30`.replace("+05:30+05:30", "+05:30")).getTime();

  return busyRanges.some((b) => {
    const busyStart = new Date(b.start).getTime();
    const busyEnd = new Date(b.end).getTime();
    // overlap check
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}
