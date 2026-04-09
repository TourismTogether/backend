import "dotenv/config";

interface Config {
    port: number,
    saltRounds: number,
    secretKey: string,
    databaseHost: string,
    databasePort: number,
    databaseUser: string,
    databasePassword: string,
    databaseName: string,
    databaseSSL: boolean,
    openAiApiKey: string,
    nodeEnv: string
}

const rawNodeEnv = process.env.NODE_ENV || "production";
const normalizedNodeEnv = rawNodeEnv.trim().replace(/^["']|["']$/g, "").toLowerCase();
const isProduction = normalizedNodeEnv === "production";
const rawSecret = process.env.SECRET_KEY || "";
if (isProduction && (!rawSecret || rawSecret.length < 32)) {
    throw new Error(
        "SECRET_KEY must be set and at least 32 characters in production. " +
        "On Vercel: Project → Settings → Environment Variables → add SECRET_KEY with a long random string (e.g. 32+ chars)."
    );
}

const config: Config = {
    port: Number(process.env.PORT) || 8080,
    saltRounds: Math.min(Math.max(Number(process.env.SALT_ROUNDS) || 10, 10), 12),
    secretKey: rawSecret || "dev-secret-key-change-in-production",
    databaseHost: process.env.DATABASE_HOST || "localhost",
    databasePort: Number(process.env.DATABASE_PORT) || 5432,
    databaseUser: process.env.DATABASE_USER || "",
    databasePassword: process.env.DATABASE_PASSWORD || "",
    databaseName: process.env.DATABASE_NAME || "postgre",
    databaseSSL: process.env.DATABASE_SSL === "true" || isProduction,
    openAiApiKey: process.env.OPENROUTER_API_KEY || "",
    nodeEnv: normalizedNodeEnv === "development" ? "Development" : "Production"
}

export default config;