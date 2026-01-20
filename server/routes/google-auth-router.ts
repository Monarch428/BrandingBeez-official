// src/server/google-oauth-router.ts
import express from "express";
import { storage } from "../storage";
import axios from "axios";

const router = express.Router();

// === CONFIG ===
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
// const GOOGLE_REDIRECT_URI = "https://localhost:8000/api/google/oauth/callback";
const GOOGLE_REDIRECT_URI = "https://brandingbeez.co.uk/api/google/oauth/callback";

// === Step 1: Login URL ===
router.get("/oauth/login", (req, res) => {
  const scope = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "openid",
    "email",
    "profile",
  ].join(" ");

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope,
    });

  res.redirect(authUrl);
});

// === Step 2: OAuth Callback ===
router.get("/oauth/callback", async (req, res) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    console.error("Missing ?code on /oauth/callback");
    return res.status(400).send("Missing ?code parameter from Google OAuth");
  }

  try {
    // 1️⃣ Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    console.log("Token response from Google:", tokenRes.data);

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    if (!access_token) {
      console.error("No access_token in token response");
      return res.status(500).send("Google did not return an access token.");
    }

    // 2️⃣ Try to fetch user info (email)
    let email: string | undefined;
    try {
      const userInfoRes = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      console.log("User info:", userInfoRes.data);
      email = userInfoRes.data.email;
    } catch (userinfoErr: any) {
      console.error(
        "Failed to fetch userinfo:",
        userinfoErr.response?.data || userinfoErr,
      );
    }

    // 3️⃣ NEW: Fetch Calendar List and detect primary calendarId
    let calendarId: string | undefined;
    try {
      const calRes = await axios.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const items = calRes.data?.items || [];
      const primary = items.find((c: any) => c.primary === true);

      calendarId = primary?.id || items[0]?.id || "primary";

      console.log("Detected calendarId from Google:", calendarId);
    } catch (calErr: any) {
      console.error(
        "Failed to fetch calendarList:",
        calErr.response?.data || calErr,
      );
      // fallback – if this fails, we'll use 'primary'
      calendarId = "primary";
    }

    // 4️⃣ Save tokens + calendarId in DB
    await storage.saveGoogleAuthTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiryDate: Date.now() + expires_in * 1000,
      email: email || "",
      calendarId: calendarId || "primary",
    });

    res.send(`
      <h2>Google OAuth Connected Successfully</h2>
      ${
        email
          ? `<p>Connected account: <strong>${email}</strong></p>`
          : "<p>Connected to Google Calendar.</p>"
      }
      <p>Using calendar: <strong>${calendarId}</strong></p>
      <p>You can close this window and return to the Admin Panel.</p>
    `);
  } catch (err: any) {
    console.error("OAuth error (token or userinfo):", err.response?.data || err);
    res.status(500).send("Failed to authenticate with Google");
  }
});

// === Admin: Fetch stored token ===
router.get("/oauth/token", async (req, res) => {
  const tokens = await storage.getGoogleAuthTokens();
  res.json(tokens);
});

export default router;
