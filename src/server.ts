import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { setupSecurityMiddleware, generalLimiter, readLimiter } from "./middlewares/security.middleware";
import { requestLogger, errorLogger } from "./middlewares/logger.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = config.port;

app.set("trust proxy", 1); // trust first proxy

// CORS: merge default origins with env (e.g. VERCEL: set ALLOWED_ORIGINS in dashboard)
const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.56.1:3000",
  "https://tourism-together.vercel.app",
  "https://www.tourism-together.vercel.app",
];
const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// Normalize for comparison (no trailing slash, lowercase)
function normalizeOrigin(o: string): string {
  return o.replace(/\/$/, "").toLowerCase();
}

// Preflight: respond to OPTIONS with 204 + CORS so browser always gets valid preflight
app.use((req: Request, res: Response, next) => {
  const origin = req.get("Origin");
  if (req.method === "OPTIONS" && origin) {
    const normalized = normalizeOrigin(origin);
    const allowed = allowedOrigins.some((a) => normalizeOrigin(a) === normalized);
    if (allowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.setHeader("Access-Control-Max-Age", "86400");
      return res.status(204).end();
    }
  }
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. same-origin, Postman, mobile)
      if (!origin) {
        return callback(null, true);
      }
      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = allowedOrigins.some((a) => normalizeOrigin(a) === normalizedOrigin);

      if (isAllowed) {
        // Return the actual origin so the header is set correctly (required for credentials)
        return callback(null, origin);
      }
      console.warn(`CORS: Blocked origin: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Setup security middleware (helmet)
setupSecurityMiddleware(app);

app.use(cookieParser());

// Request size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply lenient rate limiting for GET requests (read operations)
app.use(readLimiter);

// Apply general rate limiting to all routes (for non-GET requests)
app.use(generalLimiter);


// Initialize DB connection (non-blocking for serverless)
// In serverless, connections are created lazily on first use
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
if (!isServerless) {
  // Only call initDB() in non-serverless environments
  initDB().catch((err) => {
    console.error("Failed to initialize DB:", err);
  });
}

// Request logging middleware
app.use(requestLogger);

route(app);

// Error logging middleware (before error handler)
app.use(errorLogger);

// Error handlers (must be last)
app.use(errorHandler);
app.use(notFoundHandler);

app
  .listen(port, () => {
    console.log(`App listening on port ${port}`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ ERROR: Port ${port} is already in use!\n`);
      console.error("Giải pháp:");
      console.error(
        `  1. Tắt process đang dùng port: netstat -ano | findstr :${port}`
      );
      console.error(`  2. Hoặc đổi port trong file .env: PORT=8081\n`);
    } else {
      console.error("Error starting server:", err);
    }
    process.exit(1);
  });
