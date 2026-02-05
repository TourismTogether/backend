import { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

/**
 * Security middleware setup
 */
export function setupSecurityMiddleware(app: Express) {
  // Helmet - Set security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow embedding if needed
    })
  );

  // Request size limits are handled in server.ts after this middleware
}

/**
 * General API rate limiter
 * More lenient in development, stricter in production
 */
const isDevelopment = process.env.NODE_ENV === "development" || process.env.NODE_ENV !== "production";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 200, // Higher limit in development, reasonable limit in production
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
    error: true,
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks and OPTIONS requests
    return req.method === "OPTIONS" || req.path === "/health";
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 20 : 5, // More lenient in development
  message: {
    status: 429,
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
    error: true,
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for creation endpoints (POST)
 */
export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 20, // More lenient in development
  message: {
    status: 429,
    message: "Too many creation requests, please try again later.",
    error: true,
    code: "CREATE_RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Lenient rate limiter for read-only GET requests
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 2000 : 500, // Very high limit for read operations
  message: {
    status: 429,
    message: "Too many read requests, please try again later.",
    error: true,
    code: "READ_RATE_LIMIT_EXCEEDED",
  },
  skip: (req) => {
    // Only apply to GET requests
    return req.method !== "GET";
  },
});
