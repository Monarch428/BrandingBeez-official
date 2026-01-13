import express from "express";
import axios from "axios";
import { storage } from "../storage";

export const authApiRouter = express.Router();

// === CONFIG ===
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// const GOOGLE_REDIRECT_URI ="https://brandingbeez.co.uk/api/oauthapi/callback";
const GOOGLE_REDIRECT_URI = "https://localhost:8000/api/oauthapi/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "[auth-api-router] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.",
  );
}

// === Step 1: Login URL ===
authApiRouter.get("/login", (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).send("Missing GOOGLE_CLIENT_ID in environment.");
  }

  // ✅ Only basic scopes
  const scope = ["openid", "email", "profile"].join(" ");

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope,
    }).toString();

  res.redirect(authUrl);
});

// === Step 2: OAuth Callback ===
authApiRouter.get("/callback", async (req, res) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    console.error("Missing ?code on /callback");
    return res.status(400).send("Missing ?code parameter from Google OAuth");
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res
      .status(500)
      .send("Server is missing Google OAuth env variables (CLIENT_ID/SECRET).");
  }

  try {
    // Exchange code for tokens
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

    const { access_token, refresh_token, expires_in } = tokenRes.data ?? {};

    if (!access_token) {
      console.error("No access_token in token response:", tokenRes.data);
      return res.status(500).send("Google did not return an access token.");
    }

    // Fetch user info
    let email = "";
    let name = "";
    let picture = "";

    try {
      const userInfoRes = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      email = userInfoRes.data?.email || "";
      name = userInfoRes.data?.name || "";
      picture = userInfoRes.data?.picture || "";
    } catch (userinfoErr: any) {
      console.error(
        "Failed to fetch userinfo:",
        userinfoErr.response?.data || userinfoErr,
      );
    }

    const expiryMs =
      typeof expires_in === "number"
        ? Date.now() + expires_in * 1000
        : Date.now() + 3600 * 1000;

    // ✅ DEBUG: verify storage wiring
    console.log("[oauthapi] storage methods:", {
      save: typeof (storage as any).saveAPIGoogleAuthTokens,
      get: typeof (storage as any).getAPIGoogleAuthTokens,
    });

    const savedRow = await storage.saveAPIGoogleAuthTokens({
      accessToken: access_token,
      refreshToken: refresh_token || "",
      expiryDate: expiryMs,
      email: email || "unknown",
    });

    console.log("[oauthapi] saved tokens row:", savedRow);

    res.send(`
      <h2>Google OAuth Connected Successfully</h2>
      ${
        email
          ? `<p>Connected account: <strong>${email}</strong></p>`
          : "<p>Connected to Google account.</p>"
      }
      ${name ? `<p>Name: <strong>${name}</strong></p>` : ""}
      ${
        picture
          ? `<p><img src="${picture}" alt="Profile" style="width:64px;height:64px;border-radius:50%;" /></p>`
          : ""
      }
      <p>You can close this window and return to the Admin Panel.</p>
    `);
  } catch (err: any) {
    console.error("OAuth error (token/userinfo):", err.response?.data || err);
    res.status(500).send("Failed to authenticate with Google");
  }
});

// === Admin: Fetch stored token ===
authApiRouter.get("/token", async (req, res) => {
  // ✅ DEBUG: verify storage wiring
  console.log("[oauthapi] storage methods (/token):", {
    save: typeof (storage as any).saveAPIGoogleAuthTokens,
    get: typeof (storage as any).getAPIGoogleAuthTokens,
  });

  const tokens = await storage.getAPIGoogleAuthTokens();
  res.json(tokens);
});
