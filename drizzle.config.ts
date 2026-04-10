// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/db/schema/schema.ts"
    , "./src/db/schema/auth-schema.ts"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      rejectUnauthorized: false,
    },
  },    
});
