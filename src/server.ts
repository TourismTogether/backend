import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import cors from "cors";
import session from "express-session";

const app: Express = express();
const port = config.port;

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// CORS must be configured before other middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://tourism-together.vercel.app",
  "https://www.tourism-together.vercel.app", // Handle www variant
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log("CORS: Request with no origin, allowing");
        return callback(null, true);
      }

      // Normalize origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, "");

      console.log(`CORS: Checking origin: ${normalizedOrigin}`);
      console.log(`CORS: Allowed origins: ${allowedOrigins.join(", ")}`);

      // Check if origin matches any allowed origin
      const isAllowed = allowedOrigins.some((allowed) => {
        const normalizedAllowed = allowed.replace(/\/$/, "");
        return normalizedOrigin === normalizedAllowed;
      });

      if (isAllowed) {
        console.log(`CORS: Origin ${normalizedOrigin} is allowed`);
        callback(null, true);
      } else {
        console.log(`CORS: Origin ${normalizedOrigin} is NOT allowed`);
        callback(new Error(`Not allowed by CORS: ${normalizedOrigin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB connection (non-blocking for serverless)
// In serverless, connections are created lazily on first use
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
if (!isServerless) {
  // Only call initDB() in non-serverless environments
  initDB().catch((err) => {
    console.error("Failed to initialize DB:", err);
  });
}

app.use(function (req, res, next) {
  console.log(req.originalUrl);

  next();
});

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
