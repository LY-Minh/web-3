import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as appSchema from "./schema/schema";
import * as authSchema from "./schema/auth-schema";
import "dotenv/config";

const schema = {
    ...appSchema,
    ...authSchema,
};

const rawDatabaseUrl = process.env.DATABASE_URL;

if (!rawDatabaseUrl) {
    throw new Error("DATABASE_URL is not defined.");
}

const normalizedDatabaseUrl = new URL(rawDatabaseUrl);
normalizedDatabaseUrl.searchParams.delete("sslmode");

const pool = new Pool({
    connectionString: normalizedDatabaseUrl.toString(),
  
    ssl: {
        rejectUnauthorized: false 
    }
});

export const db = drizzle(pool, { schema });
export { pool };