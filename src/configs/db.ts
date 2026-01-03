import { Pool } from "pg";
import config from "./config";

export const db = new Pool({
    host: config.databaseHost,
    port: config.databasePort,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
});

export async function initDB() {
    try {
        await db.query("SELECT 1");
    } catch (err) {
        console.error("DB connection failed:", err);
        process.exit(1);
    }
}