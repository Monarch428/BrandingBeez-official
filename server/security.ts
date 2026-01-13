import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// export function securityHeaders() {
//   return helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],

//         // ✅ Explicit hardening
//         baseUri: ["'self'"],
//         objectSrc: ["'none'"],
//         frameAncestors: ["'self'"], // clickjacking protection (replaces X-Frame-Options)
//         formAction: ["'self'"],

//         // ✅ Turnstile + embeds need frames
//         frameSrc: [
//           "'self'",
//           "https://challenges.cloudflare.com",
//           "https://calendly.com",
//           "https://*.calendly.com",
//           "https://www.youtube.com",
//           "https://youtube.com",
//           "https://youtu.be",
//           "https://www.youtube-nocookie.com",
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://*.googleusercontent.com",
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",
//         ],

//         // ✅ Scripts
//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "'unsafe-eval'", // keep ONLY if you truly need it (often required by some tools)
//           "https://challenges.cloudflare.com",

//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://*.googletagmanager.com",
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://www.google-analytics.com",

//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           "https://googleads.g.doubleclick.net",
//           "https://www.googleadservices.com",
//           "https://stats.g.doubleclick.net",

//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",

//           "https://assets.calendly.com",
//           "https://calendly.com",
//           "https://*.calendly.com",

//           "https://www.clarity.ms",
//           "https://c.clarity.ms",
//           "https://scripts.clarity.ms",

//           "https://static.hotjar.com",
//           "https://script.hotjar.com",

//           "https://cdn.jsdelivr.net",

//           "https://snap.licdn.com",
//           "https://*.licdn.com",

//           "https://connect.facebook.net",
//           "https://*.facebook.net",
//         ],

//         // ✅ Inline script attributes (onclick= etc). If you never use them, remove this.
//         scriptSrcAttr: ["'unsafe-inline'"],

//         // ✅ Styles / fonts (this will prevent future CSP breakages)
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://fonts.googleapis.com",
//           "https://assets.calendly.com",
//           "https://static.hotjar.com",
//         ],
//         fontSrc: [
//           "'self'",
//           "data:",
//           "https://fonts.gstatic.com",
//           "https://assets.calendly.com",
//         ],

//         // ✅ Images
//         imgSrc: [
//           "'self'",
//           "data:",
//           "blob:",
//           "https:",

//           "https://brandingbeez.co.uk",
//           "https://www.brandingbeez.co.uk",

//           "https://res.cloudinary.com",
//           "https://*.res.cloudinary.com",

//           "https://static.hotjar.com",
//           "https://*.hotjar.com",
//           "https://*.hotjar.io",

//           "https://*.google.com",
//           "https://www.googletagmanager.com",
//           "https://*.googletagmanager.com",
//           "https://www.google-analytics.com",
//           "https://*.googleusercontent.com",
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           "https://googleads.g.doubleclick.net",
//           "https://stats.g.doubleclick.net",
//           "https://*.doubleclick.net",
//           "https://www.googleadservices.com",
//           "https://pagead2.googlesyndication.com",
//           "https://*.googlesyndication.com",

//           "https://www.clarity.ms",
//           "https://c.clarity.ms",

//           "https://px.ads.linkedin.com",
//           "https://*.linkedin.com",

//           "https://www.facebook.com",
//           "https://*.facebook.com",
//           "https://*.fbcdn.net",

//           "https://img.youtube.com",
//           "https://i.ytimg.com",
//         ],

//         // ✅ Network calls / XHR / beacon
//         connectSrc: [
//           "'self'",
//           "https://challenges.cloudflare.com",

//           "https://res.cloudinary.com",
//           "https://*.res.cloudinary.com",

//           "https://*.hotjar.com",
//           "https://*.hotjar.io",
//           "https://static.hotjar.com",
//           "https://script.hotjar.com",
//           "wss://ws.hotjar.com",
//           "wss://*.hotjar.com",

//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://www.google-analytics.com",
//           "https://analytics.google.com",
//           "https://*.google-analytics.com",
//           "https://region1.google-analytics.com",

//           "https://www.googleadservices.com",
//           "https://googleads.g.doubleclick.net",
//           "https://stats.g.doubleclick.net",
//           "https://*.doubleclick.net",
//           "https://pagead2.googlesyndication.com",
//           "https://*.googlesyndication.com",

//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://*.googletagmanager.com",
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",
//           "https://*.googleusercontent.com",
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           "https://*.clarity.ms",

//           "https://calendly.com",
//           "https://*.calendly.com",

//           "https://px.ads.linkedin.com",
//           "https://snap.licdn.com",
//           "https://*.linkedin.com",
//           "https://*.licdn.com",

//           "https://www.facebook.com",
//           "https://*.facebook.com",

//           "https://capig.stape.nz",
//           "https://*.stape.nz",
//         ],

//         // ✅ Workers (some libs use blob workers)
//         workerSrc: ["'self'", "blob:"],

//         // keep your current behavior
//         upgradeInsecureRequests: [],
//       },
//     },

//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },

//     // You already disabled frameguard; frame-ancestors is better anyway
//     frameguard: false,
//     noSniff: true,
//     xssFilter: true,

//     referrerPolicy: {
//       policy: "strict-origin-when-cross-origin",
//     },
//   });
// }

export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        // ✅ Explicit hardening
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"], // clickjacking protection (replaces X-Frame-Options)
        formAction: ["'self'"],

        // ✅ Turnstile + embeds need frames
        frameSrc: [
          "'self'",
          "https://challenges.cloudflare.com",
          "https://calendly.com",
          "https://*.calendly.com",
          "https://www.youtube.com",
          "https://youtube.com",
          "https://youtu.be",
          "https://www.youtube-nocookie.com",
          "https://tagassistant.google.com",
          "https://*.tagassistant.google.com",
          "https://www.googletagmanager.com",
          "https://googletagmanager.com",
          "https://*.googleusercontent.com",
          "https://www.gstatic.com",
          "https://*.gstatic.com",
        ],

        // ✅ Scripts
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'", // keep ONLY if you truly need it (often required by some tools)
          "https://challenges.cloudflare.com",

          "https://*.google.com",
          "https://*.googleapis.com",
          "https://*.googletagmanager.com",
          "https://www.googletagmanager.com",
          "https://googletagmanager.com",
          "https://www.google-analytics.com",

          "https://www.gstatic.com",
          "https://*.gstatic.com",

          "https://googleads.g.doubleclick.net",
          "https://www.googleadservices.com",
          "https://stats.g.doubleclick.net",

          "https://tagassistant.google.com",
          "https://*.tagassistant.google.com",

          "https://assets.calendly.com",
          "https://calendly.com",
          "https://*.calendly.com",

          "https://www.clarity.ms",
          "https://c.clarity.ms",
          "https://scripts.clarity.ms",

          "https://static.hotjar.com",
          "https://script.hotjar.com",

          "https://cdn.jsdelivr.net",

          "https://snap.licdn.com",
          "https://*.licdn.com",

          "https://connect.facebook.net",
          "https://*.facebook.net",
        ],

        // ✅ Inline script attributes (onclick= etc). If you never use them, remove this.
        scriptSrcAttr: ["'unsafe-inline'"],

        // ✅ Styles / fonts (this will prevent future CSP breakages)
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://assets.calendly.com",
          "https://static.hotjar.com",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://assets.calendly.com",
        ],

        // ✅ Images
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",

          "https://brandingbeez.co.uk",
          "https://www.brandingbeez.co.uk",

          "https://res.cloudinary.com",
          "https://*.res.cloudinary.com",

          "https://static.hotjar.com",
          "https://*.hotjar.com",
          "https://*.hotjar.io",

          "https://*.google.com",
          "https://www.googletagmanager.com",
          "https://*.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://*.googleusercontent.com",
          "https://www.gstatic.com",
          "https://*.gstatic.com",

          "https://googleads.g.doubleclick.net",
          "https://stats.g.doubleclick.net",
          "https://*.doubleclick.net",
          "https://www.googleadservices.com",
          "https://pagead2.googlesyndication.com",
          "https://*.googlesyndication.com",

          "https://www.clarity.ms",
          "https://c.clarity.ms",

          "https://px.ads.linkedin.com",
          "https://*.linkedin.com",

          "https://www.facebook.com",
          "https://*.facebook.com",
          "https://*.fbcdn.net",

          "https://img.youtube.com",
          "https://i.ytimg.com",
        ],

        // ✅ Network calls / XHR / beacon
        connectSrc: [
          "'self'",
          "https://challenges.cloudflare.com",

          "https://res.cloudinary.com",
          "https://*.res.cloudinary.com",

          "https://*.hotjar.com",
          "https://*.hotjar.io",
          "https://static.hotjar.com",
          "https://script.hotjar.com",
          "wss://ws.hotjar.com",
          "wss://*.hotjar.com",

          "https://*.google.com",
          "https://*.googleapis.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://*.google-analytics.com",
          "https://region1.google-analytics.com",

          "https://www.googleadservices.com",
          "https://googleads.g.doubleclick.net",
          "https://stats.g.doubleclick.net",
          "https://*.doubleclick.net",
          "https://pagead2.googlesyndication.com",
          "https://*.googlesyndication.com",

          "https://www.googletagmanager.com",
          "https://googletagmanager.com",
          "https://*.googletagmanager.com",
          "https://tagassistant.google.com",
          "https://*.tagassistant.google.com",
          "https://*.googleusercontent.com",
          "https://www.gstatic.com",
          "https://*.gstatic.com",

          "https://*.clarity.ms",

          "https://calendly.com",
          "https://*.calendly.com",

          "https://px.ads.linkedin.com",
          "https://snap.licdn.com",
          "https://*.linkedin.com",
          "https://*.licdn.com",

          "https://www.facebook.com",
          "https://*.facebook.com",

          "https://capig.stape.nz",
          "https://*.stape.nz",
        ],

        // ✅ Workers (some libs use blob workers)
        workerSrc: ["'self'", "blob:"],

        // keep your current behavior
        upgradeInsecureRequests: [],
      },
    },

    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // You already disabled frameguard; frame-ancestors is better anyway
    frameguard: false,
    noSniff: true,
    xssFilter: true,

    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  });
}


export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    const publicEndpoints = [
      "/api/blog",
      "/api/blog/",
      "/api/health",
      "/api/environment"
    ];

    return publicEndpoints.some((endpoint) => req.path.startsWith(endpoint));
  }
});

// Rate limiting for generic forms
export const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 form submissions per 15 minutes
  message: {
    error: "Too many form submissions from this IP, please try again later.",
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Contact form rate limiting (slightly stricter)
export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many contact requests from this IP, please try again later.",
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public content rate limiting (very generous)
export const publicContentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Basic spam detection middleware
export function spamDetection(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  // Check for common spam patterns
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /\$\$\$|make money fast|get rich/i,
    /click here|limited time|act now/i,
    /\b[A-Z]{10,}\b/, // All caps words
    /(.)\1{4,}/, // Repeated characters (5+ in a row)
    /http[s]?:\/\/[^\s]+/i // URLs in form data
  ];

  // Honeypot field
  if (body.website && body.website.trim() !== "") {
    console.log("Spam detected: Honeypot field filled");
    return res.status(429).json({
      error: "Spam detected",
      message: "Your submission appears to be spam. Please try again."
    });
  }

  const textFields = [body.message, body.name, body.company, body.email].filter(Boolean);

  for (const field of textFields) {
    if (typeof field === "string") {
      for (const pattern of spamPatterns) {
        if (pattern.test(field)) {
          console.log("Spam detected: Pattern match -", pattern.source);
          return res.status(429).json({
            error: "Spam detected",
            message:
              "Your submission contains content that appears to be spam. Please revise and try again."
          });
        }
      }
    }
  }

  // Length checks
  if (body.message && body.message.length > 2000) {
    return res.status(400).json({
      error: "Content too long",
      message: "Message is too long. Please keep it under 2000 characters."
    });
  }

  if (body.message && body.message.length < 10) {
    return res.status(400).json({
      error: "Content too short",
      message: "Message is too short. Please provide more details."
    });
  }

  next();
}

// Input validation and sanitization
export function validateContactForm(req: Request, res: Response, next: NextFunction) {
  const { name, email, company, phone, service, message } = req.body;

  const isEmptyString = (value: any) =>
    !value || typeof value !== "string" || value.trim().length === 0;

  const missingFields: string[] = [];
  if (isEmptyString(name)) missingFields.push("name");
  if (isEmptyString(email)) missingFields.push("email address");

  const hasServiceDetails = service || company || phone;
  if (!hasServiceDetails && isEmptyString(message)) {
    missingFields.push("message or service selection");
  }

  if (missingFields.length > 0) {
    const fieldList =
      missingFields.length === 1
        ? missingFields[0]
        : missingFields.slice(0, -1).join(", ") +
        " and " +
        missingFields[missingFields.length - 1];

    return res.status(400).json({
      error: "Missing required fields",
      message: `Please provide your ${fieldList}.`
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
      message: "Please provide a valid email address."
    });
  }

  // Disposable emails
  const disposableDomains = [
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "throwaway.email",
    "temp-mail.org",
    "mailinator.com"
  ];

  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain && disposableDomains.includes(emailDomain)) {
    return res.status(400).json({
      error: "Invalid email domain",
      message: "Disposable email addresses are not allowed. Please use a permanent email address."
    });
  }

  // Phone validation
  if (phone && typeof phone === "string") {
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone format",
        message: "Please provide a valid phone number."
      });
    }
  }

  // Sanitization
  const sanitizeString = (value: any, maxLength: number) =>
    typeof value === "string" ? value.trim().substring(0, maxLength) : "";

  req.body = {
    name: sanitizeString(name, 100),
    email: sanitizeString(email, 100).toLowerCase(),
    company: sanitizeString(company, 100),
    phone: sanitizeString(phone, 20),
    service: sanitizeString(service, 100),
    message: sanitizeString(message, 2000),
    region: req.body.region || "US",
    // Preserve additional fields
    ...Object.fromEntries(
      Object.entries(req.body).filter(
        ([key]) =>
          !["name", "email", "company", "phone", "service", "message", "region"].includes(key)
      )
    )
  };

  next();
}

// CORS configuration
export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      // Local dev / admin UI
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8000",
      "https://localhost:8000",

      // Your production domains
      "https://brandingbeez.com",
      "https://www.brandingbeez.com",
      "https://brandingbeez.co.uk",
      "https://www.brandingbeez.co.uk",
      "https://brandingbeez.replit.app",
      "https://branding-beez-monarchteamai.replit.app",
      "https://monarchteamai-brandingbeez.replit.app",
      "https://brandingbeez-official.onrender.com"
    ];

    if (
      allowedOrigins.includes(origin) ||
      (origin && origin.endsWith(".replit.app"))
    ) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// Security logging middleware
export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  const suspiciousPatterns = [
    /\/admin/i,
    /\/wp-admin/i,
    /\/phpmyadmin/i,
    /\.php$/i,
    /\/api\/.*\/.*\/.*/
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(req.path))) {
    console.log(`[SECURITY] Suspicious request: ${req.method} ${req.path} from ${req.ip}`);
  }

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.log(
        `[PERFORMANCE] Slow request: ${req.method} ${req.path} took ${duration}ms`
      );
    }
  });

  next();
}

// Disable X-Powered-By header
export function hidePoweredBy(req: Request, res: Response, next: NextFunction) {
  res.removeHeader("X-Powered-By");
  next();
}









// import { Request, Response, NextFunction } from "express";
// import rateLimit from "express-rate-limit";
// import helmet from "helmet";

// export function securityHeaders() {
//   return helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", "data:", "blob:"],

//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "'unsafe-eval'",
//           "data:",

//           // Google / GTM / GA
//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://*.googletagmanager.com",
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://www.google-analytics.com",

//           // ✅ Tag Assistant static assets (needed for preview UI/handshake)
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           // ✅ Google Ads / DoubleClick (CRITICAL FIX)
//           "https://googleads.g.doubleclick.net",
//           "https://www.googleadservices.com",
//           "https://stats.g.doubleclick.net",

//           // Tag Assistant Preview
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",

//           // Calendly
//           "https://assets.calendly.com",
//           "https://calendly.com",
//           "https://*.calendly.com",

//           // Microsoft Clarity
//           "https://www.clarity.ms",
//           "https://c.clarity.ms",
//           "https://scripts.clarity.ms",

//           // CDN / tooling
//           "https://cdn.jsdelivr.net",
//           "https://replit.com",
//           "https://*.replit.com",

//           // LinkedIn Insight Tag scripts
//           "https://snap.licdn.com",
//           "https://*.licdn.com"
//         ],

//         scriptSrcElem: [
//           "'self'",
//           "'unsafe-inline'",
//           "data:",

//           // Google / GTM / GA
//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://*.googletagmanager.com",
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://www.google-analytics.com",

//           // ✅ Tag Assistant static assets (needed for preview UI/handshake)
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           // ✅ Google Ads / DoubleClick (CRITICAL FIX)
//           "https://googleads.g.doubleclick.net",
//           "https://www.googleadservices.com",
//           "https://stats.g.doubleclick.net",

//           // Tag Assistant Preview
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",

//           // Calendly
//           "https://assets.calendly.com",
//           "https://calendly.com",
//           "https://*.calendly.com",

//           // Microsoft Clarity
//           "https://www.clarity.ms",
//           "https://c.clarity.ms",
//           "https://scripts.clarity.ms",

//           // CDN / tooling
//           "https://cdn.jsdelivr.net",
//           "https://replit.com",
//           "https://*.replit.com",

//           // LinkedIn Insight Tag scripts
//           "https://snap.licdn.com",
//           "https://*.licdn.com"
//         ],

//         scriptSrcAttr: ["'unsafe-inline'"],

//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://*.googleapis.com",
//           "https://fonts.googleapis.com",
//           "https://assets.calendly.com"
//         ],

//         fontSrc: [
//           "'self'",
//           "data:",
//           "https://fonts.gstatic.com",
//           "https://*.googleapis.com",
//           "https://assets.calendly.com"
//         ],

//         imgSrc: [
//           "'self'",
//           "data:",
//           "blob:",
//           "https:",
//           "http:",

//           // Cloudinary
//           "https://res.cloudinary.com",
//           "https://*.res.cloudinary.com",

//           // Google / GA / Ads
//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://*.googleusercontent.com",
//           "https://www.googletagmanager.com",
//           "https://www.google-analytics.com",
//           "https://stats.g.doubleclick.net",
//           "https://googleads.g.doubleclick.net",
//           "https://www.googleadservices.com",

//           // ✅ Tag Assistant static assets
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           // Calendly
//           "https://assets.calendly.com",

//           // Microsoft Clarity
//           "https://www.clarity.ms",
//           "https://c.clarity.ms",

//           // LinkedIn Insight Tag
//           "https://px.ads.linkedin.com",
//           "https://*.linkedin.com"
//         ],

//         connectSrc: [
//           "'self'",

//           // Cloudinary
//           "https://res.cloudinary.com",
//           "https://*.res.cloudinary.com",

//           // Google / GA / Ads
//           "https://*.google.com",
//           "https://*.googleapis.com",
//           "https://www.google-analytics.com",
//           "https://analytics.google.com",
//           "https://*.google-analytics.com",
//           "https://stats.g.doubleclick.net",
//           "https://*.doubleclick.net",
//           "https://region1.google-analytics.com",
//           "https://www.googleadservices.com",

//           "https://pagead2.googlesyndication.com",
//           "https://*.googlesyndication.com",

//           // GTM / Tag Assistant
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",
//           "https://*.googletagmanager.com",
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",
//           "https://*.googleusercontent.com",
//           "https://www.gstatic.com",
//           "https://*.gstatic.com",

//           // Microsoft Clarity
//           "https://www.clarity.ms",
//           "https://c.clarity.ms",
//           "https://k.clarity.ms",
//           "https://o.clarity.ms",
//           "https://s.clarity.ms",

//           // Calendly
//           "https://calendly.com",
//           "https://*.calendly.com",

//           // LinkedIn Insight Tag
//           "https://px.ads.linkedin.com",
//           "https://snap.licdn.com",
//           "https://*.linkedin.com",
//           "https://*.licdn.com"
//         ],


//         frameSrc: [
//           "'self'",

//           // Calendly embeds
//           "https://calendly.com",
//           "https://*.calendly.com",

//           // YouTube
//           "https://www.google.com",
//           "https://www.youtube.com",
//           "https://youtube.com",
//           "https://youtu.be",
//           "https://www.youtube-nocookie.com",

//           // ✅ Tag Assistant + GTM iframe (CRITICAL FIX)
//           "https://tagassistant.google.com",
//           "https://*.tagassistant.google.com",
//           "https://www.googletagmanager.com",
//           "https://googletagmanager.com",

//           // ✅ Tag Assistant sometimes uses googleusercontent for preview frames
//           "https://*.googleusercontent.com",

//           // ✅ Tag Assistant static assets (rare but safe)
//           "https://www.gstatic.com",
//           "https://*.gstatic.com"
//         ],

//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: []
//       }
//     },

//     // 🔐 Security headers
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true
//     },

//     frameguard: false,
//     noSniff: true,
//     xssFilter: true,

//     referrerPolicy: {
//       policy: "strict-origin-when-cross-origin"
//     }
//   });
// }

// // Rate limiting for general API endpoints
// export const apiRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     error: "Too many requests from this IP, please try again later.",
//     retryAfter: 15 * 60 // 15 minutes in seconds
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req: Request) => {
//     const publicEndpoints = [
//       "/api/blog",
//       "/api/blog/",
//       "/api/health",
//       "/api/environment"
//     ];

//     return publicEndpoints.some((endpoint) => req.path.startsWith(endpoint));
//   }
// });

// // Rate limiting for generic forms
// export const formRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20, // 20 form submissions per 15 minutes
//   message: {
//     error: "Too many form submissions from this IP, please try again later.",
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Contact form rate limiting (slightly stricter)
// export const contactRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10,
//   message: {
//     error: "Too many contact requests from this IP, please try again later.",
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Public content rate limiting (very generous)
// export const publicContentRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000,
//   message: {
//     error: "Too many requests from this IP, please try again later.",
//     retryAfter: 15 * 60
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Basic spam detection middleware
// export function spamDetection(req: Request, res: Response, next: NextFunction) {
//   const { body } = req;

//   // Check for common spam patterns
//   const spamPatterns = [
//     /viagra|cialis|pharmacy/i,
//     /\$\$\$|make money fast|get rich/i,
//     /click here|limited time|act now/i,
//     /\b[A-Z]{10,}\b/, // All caps words
//     /(.)\1{4,}/, // Repeated characters (5+ in a row)
//     /http[s]?:\/\/[^\s]+/i // URLs in form data
//   ];

//   // Honeypot field
//   if (body.website && body.website.trim() !== "") {
//     console.log("Spam detected: Honeypot field filled");
//     return res.status(429).json({
//       error: "Spam detected",
//       message: "Your submission appears to be spam. Please try again."
//     });
//   }

//   const textFields = [body.message, body.name, body.company, body.email].filter(Boolean);

//   for (const field of textFields) {
//     if (typeof field === "string") {
//       for (const pattern of spamPatterns) {
//         if (pattern.test(field)) {
//           console.log("Spam detected: Pattern match -", pattern.source);
//           return res.status(429).json({
//             error: "Spam detected",
//             message:
//               "Your submission contains content that appears to be spam. Please revise and try again."
//           });
//         }
//       }
//     }
//   }

//   // Length checks
//   if (body.message && body.message.length > 2000) {
//     return res.status(400).json({
//       error: "Content too long",
//       message: "Message is too long. Please keep it under 2000 characters."
//     });
//   }

//   if (body.message && body.message.length < 10) {
//     return res.status(400).json({
//       error: "Content too short",
//       message: "Message is too short. Please provide more details."
//     });
//   }

//   next();
// }

// // Input validation and sanitization
// export function validateContactForm(req: Request, res: Response, next: NextFunction) {
//   const { name, email, company, phone, service, message } = req.body;

//   const isEmptyString = (value: any) =>
//     !value || typeof value !== "string" || value.trim().length === 0;

//   const missingFields: string[] = [];
//   if (isEmptyString(name)) missingFields.push("name");
//   if (isEmptyString(email)) missingFields.push("email address");

//   const hasServiceDetails = service || company || phone;
//   if (!hasServiceDetails && isEmptyString(message)) {
//     missingFields.push("message or service selection");
//   }

//   if (missingFields.length > 0) {
//     const fieldList =
//       missingFields.length === 1
//         ? missingFields[0]
//         : missingFields.slice(0, -1).join(", ") +
//         " and " +
//         missingFields[missingFields.length - 1];

//     return res.status(400).json({
//       error: "Missing required fields",
//       message: `Please provide your ${fieldList}.`
//     });
//   }

//   // Email validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({
//       error: "Invalid email format",
//       message: "Please provide a valid email address."
//     });
//   }

//   // Disposable emails
//   const disposableDomains = [
//     "10minutemail.com",
//     "tempmail.org",
//     "guerrillamail.com",
//     "throwaway.email",
//     "temp-mail.org",
//     "mailinator.com"
//   ];

//   const emailDomain = email.split("@")[1]?.toLowerCase();
//   if (emailDomain && disposableDomains.includes(emailDomain)) {
//     return res.status(400).json({
//       error: "Invalid email domain",
//       message: "Disposable email addresses are not allowed. Please use a permanent email address."
//     });
//   }

//   // Phone validation
//   if (phone && typeof phone === "string") {
//     const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({
//         error: "Invalid phone format",
//         message: "Please provide a valid phone number."
//       });
//     }
//   }

//   // Sanitization
//   const sanitizeString = (value: any, maxLength: number) =>
//     typeof value === "string" ? value.trim().substring(0, maxLength) : "";

//   req.body = {
//     name: sanitizeString(name, 100),
//     email: sanitizeString(email, 100).toLowerCase(),
//     company: sanitizeString(company, 100),
//     phone: sanitizeString(phone, 20),
//     service: sanitizeString(service, 100),
//     message: sanitizeString(message, 2000),
//     region: req.body.region || "US",
//     // Preserve additional fields
//     ...Object.fromEntries(
//       Object.entries(req.body).filter(
//         ([key]) =>
//           !["name", "email", "company", "phone", "service", "message", "region"].includes(key)
//       )
//     )
//   };

//   next();
// }

// // CORS configuration
// export const corsOptions = {
//   origin: function (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) {
//     // Allow requests with no origin (like curl, mobile apps)
//     if (!origin) return callback(null, true);

//     const allowedOrigins = [
//       // Local dev / admin UI
//       "http://localhost:3000",
//       "https://localhost:3000",
//       "http://localhost:5173",
//       "http://localhost:8000",
//       "https://localhost:8000",

//       // Your production domains
//       "https://brandingbeez.com",
//       "https://www.brandingbeez.com",
//       "https://brandingbeez.co.uk",
//       "https://www.brandingbeez.co.uk",
//       "https://brandingbeez.replit.app",
//       "https://branding-beez-monarchteamai.replit.app",
//       "https://monarchteamai-brandingbeez.replit.app",
//       "https://brandingbeez-official.onrender.com"
//     ];

//     if (
//       allowedOrigins.includes(origin) ||
//       (origin && origin.endsWith(".replit.app"))
//     ) {
//       callback(null, true);
//     } else {
//       console.log(`[CORS] Blocked origin: ${origin}`);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
// };

// // Security logging middleware
// export function securityLogger(req: Request, res: Response, next: NextFunction) {
//   const startTime = Date.now();

//   const suspiciousPatterns = [
//     /\/admin/i,
//     /\/wp-admin/i,
//     /\/phpmyadmin/i,
//     /\.php$/i,
//     /\/api\/.*\/.*\/.*/
//   ];

//   if (suspiciousPatterns.some((pattern) => pattern.test(req.path))) {
//     console.log(`[SECURITY] Suspicious request: ${req.method} ${req.path} from ${req.ip}`);
//   }

//   res.on("finish", () => {
//     const duration = Date.now() - startTime;
//     if (duration > 1000) {
//       console.log(
//         `[PERFORMANCE] Slow request: ${req.method} ${req.path} took ${duration}ms`
//       );
//     }
//   });

//   next();
// }

// // Disable X-Powered-By header
// export function hidePoweredBy(req: Request, res: Response, next: NextFunction) {
//   res.removeHeader("X-Powered-By");
//   next();
// }
