// src/server/google-calendar.ts
import { google } from "googleapis";
import { storage } from "../storage";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALENDAR_ID,
} = process.env;

const DEFAULT_CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";

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

/**
 * Shared auth helper.
 * Returns the calendarId that should be used.
 */
async function ensureGoogleAuth(): Promise<{ calendarId: string } | null> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET).",
    );
    return null;
  }

  // Always prefer DB tokens (from OAuth flow)
  const tokens = await storage.getGoogleAuthTokens();

  if (!tokens || !tokens.refreshToken) {
    console.warn(
      "[Google Calendar] No refresh token found in DB – cannot talk to Calendar.",
    );
    return null;
  }

  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiryDate,
  });

  const calendarId = tokens.calendarId || DEFAULT_CALENDAR_ID;
  return { calendarId };
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
  const { calendarId } = auth;

  const timeZone = "Asia/Kolkata";

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
   BUSY TIME LOOKUP
------------------------------------------------------------------ */

export interface BusyTimeRange {
  start: string; // ISO
  end: string; // ISO
}

export async function getBusyTimeRangesForDate(
  date: string, // "YYYY-MM-DD"
): Promise<BusyTimeRange[]> {
  const auth = await ensureGoogleAuth();
  if (!auth) {
    console.warn(
      "[Google Calendar] Auth failed – returning empty busy list for date",
      date,
    );
    return [];
  }
  const { calendarId } = auth;

  const timeZone = "Asia/Kolkata";

  const timeMin = new Date(`${date}T00:00:00+05:30`).toISOString();
  const timeMax = new Date(`${date}T23:59:59+05:30`).toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone,
      items: [{ id: calendarId }],
    },
  });

  const busy =
    res.data.calendars?.[calendarId]?.busy?.map((b) => ({
      start: b.start as string,
      end: b.end as string,
    })) ?? [];

  console.log("[Google Calendar] Busy ranges for", date, "=>", busy);

  return busy;
}

export function isSlotOverlappingBusy(
  date: string,
  startTime: string,
  endTime: string,
  busyRanges: BusyTimeRange[],
): boolean {
  const slotStart = new Date(`${date}T${startTime}:00+05:30`).getTime();
  const slotEnd = new Date(`${date}T${endTime}:00+05:30`).getTime();

  return busyRanges.some((b) => {
    const busyStart = new Date(b.start).getTime();
    const busyEnd = new Date(b.end).getTime();
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}
