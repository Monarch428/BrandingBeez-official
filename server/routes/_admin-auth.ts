// server/routes/_admin-auth.ts
import type { Express, Request, Response, NextFunction, RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string | string[] | undefined; name: string | string[] | undefined };
    }
  }
}

export function buildAdminAuth() {
  const ADMIN_EMAIL = "info@brandingbeez.co.uk";
  const ADMIN_PASSWORD = "Vignesh@95";

  const authenticateAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ authenticated: false, message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const expected = Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString("base64");

    if (token !== expected) {
      return res.status(401).json({ authenticated: false, message: "Invalid credentials" });
    }

    req.user = { id: "admin", name: "Admin User" };
    next();
  };

  const registerAuthRoutes = (app: Express) => {
    // Admin login endpoint
    app.post("/api/auth/login", (req, res) => {
      const { email, password } = req.body;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = Buffer.from(`${email}:${password}`).toString("base64");
        return res.json({
          authenticated: true,
          token,
          user: { id: "admin", name: "Admin User", email },
        });
      }

      return res.status(401).json({ authenticated: false, message: "Invalid email or password" });
    });

    // Auth check endpoint
    app.get("/api/auth/check", (req, res) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ authenticated: false, user: null });
      }

      const token = authHeader.split(" ")[1];
      const expected = Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString("base64");

      if (token === expected) {
        return res.json({
          authenticated: true,
          user: { id: "admin", name: "Admin User", email: ADMIN_EMAIL },
        });
      }

      return res.json({ authenticated: false, user: null });
    });
  };

  return { authenticateAdmin, registerAuthRoutes };
}
