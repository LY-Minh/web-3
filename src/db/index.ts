import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as appSchema from "./schema/schema";
import * as authSchema from "./schema/auth-schema";
import "dotenv/config";

const schema = {
    ...appSchema,
    ...authSchema,
};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  
    ssl: {
        rejectUnauthorized: false 
    }
});

export const db = drizzle(pool, { schema });
export { pool };