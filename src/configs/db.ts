import { Pool } from "pg";
import config from "./config";

// Configure pool for serverless environments
// In serverless, we need smaller pools and shorter timeouts
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

export const db = new Pool({
  host: config.databaseHost,
  port: config.databasePort,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.databaseName,
  ssl: config.databaseSSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
  // Connection pool settings for serverless
  max: isServerless ? 1 : 10, // Max 1 connection per serverless function instance
  min: 0, // Don't maintain minimum connections in serverless
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout after 10 seconds
});

// Handle pool errors without crashing
db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function initDB() {
  console.log("Connecting....");
  try {
    const client = await db.connect();
    await client.query("SELECT 1");
    client.release(); // Release the connection back to the pool
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    // Don't exit in serverless - let the function handle it gracefully
    if (!isServerless) {
      process.exit(1);
    }
  }
}
