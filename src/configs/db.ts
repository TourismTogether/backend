import { Pool } from "pg";
import config from "./config";

export const db = new Pool({
    host: config.databaseHost,
    port: config.databasePort,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    ssl: config.databaseSSL ? {
        rejectUnauthorized: false
    } : false
});

export async function initDB() {
    console.log("Connecting....");
    try {
        await db.query("SELECT 1");
        console.log("PostgreSQL connected");
    } catch (err) {
        console.error("DB connection failed:", err);
        process.exit(1);
    }
}