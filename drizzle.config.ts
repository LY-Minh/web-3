// // drizzle.config.ts
// import "dotenv/config";
// import { defineConfig } from "drizzle-kit";


// export default defineConfig({
//   dialect: "postgresql",
//   schema: ["./src/db/schema/schema.ts"
//     , "./src/db/schema/auth-schema.ts"],
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },    
// });
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;