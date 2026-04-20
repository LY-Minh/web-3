import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; 
import { admin } from "better-auth/plugins";
import * as schema from "@/db/schema/auth-schema"; 


 export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
         schema: {
      user: schema.userTable,
      session: schema.sessionTable,
      account: schema.accountTable,
      verification: schema.verification,
    },
    }),
    user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false,
        returned: true,
      },
    },
  },
    plugins: [
        admin({
            defaultRole: "student", 
        adminRoles: ["admin"],
        })
    ],
    session: {
        expiresIn: 604800 // 7 days in seconds
    },
    emailAndPassword: { 
    enabled: true, 
    minPasswordLength: 8,
    }, 
});