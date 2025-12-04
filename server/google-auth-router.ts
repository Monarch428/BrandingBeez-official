import express from "express";
import { storage } from "./storage";
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
  const code = req.query.code as string;

  try {
    const response = await axios.post(
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

    const { access_token, refresh_token, expires_in } = response.data;

    await storage.saveGoogleAuthTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiryDate: Date.now() + expires_in * 1000,
    });

    res.send(`
      <h2>Google OAuth Connected Successfully</h2>
      <p>You can close this window and return to the Admin Panel.</p>
    `);
  } catch (err: any) {
    console.error("OAuth error:", err);
    res.status(500).send("Failed to authenticate with Google");
  }
});

// === Admin: Fetch stored token ===
router.get("/oauth/token", async (req, res) => {
  const tokens = await storage.getGoogleAuthTokens();
  res.json(tokens);
});

export default router;
