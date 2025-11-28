// src/server/google-calendar.ts
import { google } from "googleapis";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALENDAR_ID,
} = process.env;

// Use specific calendar if set, else primary calendar of the refresh-token user
const CALENDAR_ID = GOOGLE_CALENDAR_ID || "primary";

// OAuth2 client (using refresh token – no user interaction at runtime)
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
);

// Attach refresh token if present
if (GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });
}

// Calendar API client
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CreateMeetEventParams {
  summary: string;
  description?: string;
  date: string;       
  startTime: string; 
  endTime: string;    
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

  // If any of these are missing, skip creating a Meet (do not break booking)
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.warn(
      "[Google Calendar] Missing OAuth env vars (CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN) – skipping Meet creation.",
    );
    return { eventId: "", meetingLink: undefined };
  }

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
        requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  // Normalize any null → undefined for TypeScript
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
