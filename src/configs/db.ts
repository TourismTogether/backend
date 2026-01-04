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
  // Reduced pool size to avoid Supabase connection limits
  max: isServerless ? 1 : 5, // Smaller pool to avoid max clients error
  min: 0, // Don't maintain minimum connections
  idleTimeoutMillis: 10000, // Close idle connections after 10 seconds (faster cleanup)
  connectionTimeoutMillis: 5000, // Timeout after 5 seconds
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
  const maxRetries = 5;
  const initialDelay = 3000; // Start with 3 seconds delay
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = await db.connect();
      await client.query("SELECT 1");
      client.release(); // Release the connection back to the pool
      console.log("PostgreSQL connected");
      return; // Success, exit function
    } catch (err: any) {
      const isMaxClientsError = 
        err?.code === "XX000" || 
        err?.message?.includes("max clients") ||
        err?.message?.includes("MaxClientsInSessionMode");
      
      if (isMaxClientsError && attempt < maxRetries - 1) {
        const delay = initialDelay * (attempt + 1); // Increasing delay: 3s, 6s, 9s, 12s, 15s
        console.warn(`DB connection pool full, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      
      // If not max clients error or exhausted retries, log and continue
      // Don't exit process - let connections be created lazily on first use
      console.warn("DB connection failed, will retry on first query:", err?.message || err);
      return; // Exit function but don't crash server
    }
  }
  
  console.warn("DB initialization failed after retries, connections will be created on demand");
}
