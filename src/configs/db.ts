import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
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
  // Connection pool settings
  max: isServerless ? 1 : 20, // Increased pool size for better concurrency
  min: 0, // Don't maintain minimum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout after 10 seconds
  allowExitOnIdle: true, // Allow process to exit when pool is idle
});

// Handle pool errors without crashing
db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Retry wrapper for queries with exponential backoff
async function retryQuery<T extends QueryResultRow = any>(
  queryFn: () => Promise<QueryResult<T>>,
  maxRetries: number = 2,
  initialDelay: number = 500
): Promise<QueryResult<T>> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a connection error that we should retry
      const isConnectionError =
        error?.code === "08006" || // Connection failure
        error?.code === "XX000" || // MaxClientsInSessionMode
        error?.message?.includes("max clients") ||
        error?.message?.includes("MaxClientsInSessionMode") ||
        error?.message?.includes("connection");

      if (isConnectionError && attempt < maxRetries - 1) {
        // Longer delay for max clients error to allow pool to free up
        const baseDelay = error?.message?.includes("max clients") || error?.code === "XX000" 
          ? 2000 
          : initialDelay;
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If it's not a connection error or we've exhausted retries, throw
      throw error;
    }
  }

  throw lastError || new Error("Query failed after retries");
}

// Wrapper for db.query with retry logic
export const queryWithRetry = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return retryQuery(() => db.query<T>(text, params));
};

// Override the pool's query method to include retry logic for connection errors
const originalQuery = db.query.bind(db);
(db as any).query = function <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return retryQuery(() => originalQuery<T>(text, params));
};

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
