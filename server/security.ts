import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Security headers middleware
export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'", // Needed for some analytics
          "data:",
          "https://*.google.com",
          "https://*.googleapis.com",
          "https://*.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://assets.calendly.com",
          "https://calendly.com",
          "https://*.calendly.com",
          "https://www.clarity.ms",
          "https://c.clarity.ms",
          "https://scripts.clarity.ms",
          "https://cdn.jsdelivr.net",
          "https://replit.com",
          "https://*.replit.com"
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "data:",
          "https://*.google.com",
          "https://*.googleapis.com",
          "https://*.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://assets.calendly.com",
          "https://calendly.com",
          "https://*.calendly.com",
          "https://www.clarity.ms",
          "https://c.clarity.ms",
          "https://scripts.clarity.ms",
          "https://cdn.jsdelivr.net",
          "https://replit.com",
          "https://*.replit.com"
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://*.googleapis.com",
          "https://fonts.googleapis.com",
          "https://assets.calendly.com"
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://*.googleapis.com",
          "https://assets.calendly.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http:",
          "https://*.google.com",
          "https://*.googleapis.com",
          "https://*.googleusercontent.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://stats.g.doubleclick.net",
          "https://assets.calendly.com",
          "https://www.clarity.ms",
          "https://c.clarity.ms"
        ],
        connectSrc: [
          "'self'",
          "https://*.google.com",
          "https://*.googleapis.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://*.google-analytics.com",
          "https://stats.g.doubleclick.net",
          "https://*.doubleclick.net",
          "https://region1.google-analytics.com",
          "https://www.clarity.ms",
          "https://c.clarity.ms",
          "https://k.clarity.ms",
          "https://o.clarity.ms",
          "https://s.clarity.ms",
          "https://calendly.com",
          "https://*.calendly.com"
        ],
        frameSrc: [
          "https://calendly.com",
          "https://*.calendly.com",
          "https://www.google.com",
          "https://www.youtube.com",
          "https://*.youtube.com",
          "https://youtube.com",
          "https://www.youtube-nocookie.com",
          "https://*.youtube-nocookie.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: false, // Disable to allow YouTube embeds
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  });
}

// Rate limiting for API endpoints
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip in development
    if (process.env.NODE_ENV === 'development') return true;
    
    // Skip for public blog endpoints that should be freely accessible
    const publicEndpoints = [
      '/api/blog',
      '/api/blog/',
      '/api/health',
      '/api/environment'
    ];
    
    return publicEndpoints.some(endpoint => req.path.startsWith(endpoint));
  },
});

// More reasonable rate limiting for form submissions
export const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased to 20 form submissions per 15 minutes
  message: {
    error: 'Too many form submissions from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => process.env.NODE_ENV === 'development', // Skip in development
});

// Contact form rate limiting (more reasonable for legitimate use)
export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes instead of 1 hour
  max: 10, // Increased to 10 contact form submissions per 15 minutes
  message: {
    error: 'Too many contact requests from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => process.env.NODE_ENV === 'development', // Skip in development
});

// Public content rate limiting (very generous for blog and public pages)
export const publicContentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very generous limit for public content
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => process.env.NODE_ENV === 'development', // Skip in development
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
    /http[s]?:\/\/[^\s]+/i, // URLs in form data
  ];

  // Check honeypot field
  if (body.website && body.website.trim() !== '') {
    console.log('Spam detected: Honeypot field filled');
    return res.status(429).json({ 
      error: 'Spam detected',
      message: 'Your submission appears to be spam. Please try again.' 
    });
  }

  // Check all text fields for spam patterns
  const textFields = [body.message, body.name, body.company, body.email].filter(Boolean);
  
  for (const field of textFields) {
    if (typeof field === 'string') {
      for (const pattern of spamPatterns) {
        if (pattern.test(field)) {
          console.log('Spam detected: Pattern match -', pattern.source);
          return res.status(429).json({ 
            error: 'Spam detected',
            message: 'Your submission contains content that appears to be spam. Please revise and try again.' 
          });
        }
      }
    }
  }

  // Check for excessively long content
  if (body.message && body.message.length > 2000) {
    return res.status(400).json({ 
      error: 'Content too long',
      message: 'Message is too long. Please keep it under 2000 characters.' 
    });
  }

  // Check for very short messages that might be spam
  if (body.message && body.message.length < 10) {
    return res.status(400).json({ 
      error: 'Content too short',
      message: 'Message is too short. Please provide more details.' 
    });
  }

  next();
}

// Input validation and sanitization
export function validateContactForm(req: Request, res: Response, next: NextFunction) {
  const { name, email, company, phone, service, message } = req.body;

  // Helper function to safely check strings
  const isEmptyString = (value: any) => !value || typeof value !== 'string' || value.trim().length === 0;

  // Required fields validation
  const missingFields = [];
  if (isEmptyString(name)) missingFields.push('name');
  if (isEmptyString(email)) missingFields.push('email address');
  
  // Message is optional if service details are provided
  const hasServiceDetails = service || company || phone;
  if (!hasServiceDetails && isEmptyString(message)) {
    missingFields.push('message or service selection');
  }
  
  if (missingFields.length > 0) {
    const fieldList = missingFields.length === 1 
      ? missingFields[0]
      : missingFields.slice(0, -1).join(', ') + ' and ' + missingFields[missingFields.length - 1];
    
    return res.status(400).json({
      error: 'Missing required fields',
      message: `Please provide your ${fieldList}.`
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
      message: 'Please provide a valid email address.'
    });
  }

  // Check for disposable email domains
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'throwaway.email',
    'temp-mail.org',
    'mailinator.com'
  ];
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(emailDomain)) {
    return res.status(400).json({
      error: 'Invalid email domain',
      message: 'Disposable email addresses are not allowed. Please use a permanent email address.'
    });
  }

  // Phone validation (if provided)
  if (phone && typeof phone === 'string') {
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: 'Invalid phone format',
        message: 'Please provide a valid phone number.'
      });
    }
  }

  // Sanitize input data safely
  const sanitizeString = (value: any, maxLength: number) => {
    return typeof value === 'string' ? value.trim().substring(0, maxLength) : '';
  };

  req.body = {
    name: sanitizeString(name, 100),
    email: sanitizeString(email, 100).toLowerCase(),
    company: sanitizeString(company, 100),
    phone: sanitizeString(phone, 20),
    service: sanitizeString(service, 100),
    message: sanitizeString(message, 2000),
    region: req.body.region || 'US',
    // Preserve any additional fields
    ...Object.fromEntries(
      Object.entries(req.body).filter(([key]) => 
        !['name', 'email', 'company', 'phone', 'service', 'message', 'region'].includes(key)
      )
    )
  };

  next();
}

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, only allow specific domains
    const allowedOrigins = [
      'https://brandingbeez.com',
      'https://www.brandingbeez.com',
      'https://brandingbeez.co.uk',
      'https://www.brandingbeez.co.uk',
      'https://brandingbeez.replit.app',
      'https://branding-beez-monarchteamai.replit.app',
      'https://monarchteamai-brandingbeez.replit.app',
      'https://brandingbeez-official.onrender.com'
      // Add other production domains here
    ];
    
    // Allow specific domains or any replit.app subdomain
    if (allowedOrigins.indexOf(origin) !== -1 || (origin && origin.endsWith('.replit.app'))) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Security logging middleware
export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Log suspicious patterns
  const suspiciousPatterns = [
    /\/admin/i,
    /\/wp-admin/i,
    /\/phpmyadmin/i,
    /\.php$/i,
    /\/api\/.*\/.*\/.*/, // Deep API paths that might indicate probing
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(req.path))) {
    console.log(`[SECURITY] Suspicious request: ${req.method} ${req.path} from ${req.ip}`);
  }

  // Log slow requests
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 1000) { // Log requests taking more than 1 second
      console.log(`[PERFORMANCE] Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
}

// Disable X-Powered-By header
export function hidePoweredBy(req: Request, res: Response, next: NextFunction) {
  res.removeHeader('X-Powered-By');
  next();
}
