// src/server/google-calendar.ts
import { google } from "googleapis";
import { storage } from "./storage";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALENDAR_ID,
} = process.env;

// Use specific calendar if set, else primary calendar of the refresh-token user
const CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";

// OAuth2 client (we'll set credentials dynamically per call)
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
);

// Calendar API client
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CreateMeetEventParams {
  summary: string;
  description?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  attendeeEmail?: string;
  attendeeName?: string;
}

export interface CreateMeetEventResult {
  eventId: string;
  meetingLink?: string;
}

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
  } = params;

  console.log("[Google Calendar] createGoogleMeetEvent params:", params);

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET) – skipping Meet creation.",
    );
    return { eventId: "", meetingLink: undefined };
  }

  // ✅ Prefer env token if set (simple mode), else fallback to DB token
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let expiryDate: number | undefined;

  if (GOOGLE_REFRESH_TOKEN) {
    refreshToken = GOOGLE_REFRESH_TOKEN;
  } else {
    const tokens = await storage.getGoogleAuthTokens();
    if (!tokens || !tokens.refreshToken) {
      console.warn(
        "[Google Calendar] No refresh token found in DB – skipping Meet creation.",
      );
      return { eventId: "", meetingLink: undefined };
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

  const timeZone = "Asia/Kolkata";

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
    attendees: attendeeEmail
      ? [
          {
            email: attendeeEmail,
            displayName: attendeeName,
          },
        ]
      : [],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
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
