import "dotenv/config";

interface Config {
    port: number,
    saltRounds: number,
    databaseHost: string,
    databasePort: number,
    databaseUser: string,
    databasePassword: string,
    databaseName: string
}

const config: Config = {
    port: Number(process.env.PORT) || 8080,
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    databaseHost: process.env.DATABASE_HOST || "localhost",
    databasePort: Number(process.env.DATABASE_PORT) || 5432,
    databaseUser: process.env.DATABASE_USER || "",
    databasePassword: process.env.DATABASE_PASSWORD || "",
    databaseName: process.env.DATABASE_NAME || "postgre"
}

export default config;