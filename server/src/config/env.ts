import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Always load server/.env, no matter which folder the server is started from.
export const envPath = path.resolve(__dirname, "../../.env");
export const envFileFound = fs.existsSync(envPath);
dotenv.config({ path: envPath });

const get = (name: string) => (process.env[name] || "").trim();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: get("MONGODB_URI"),
  clientUrl: get("CLIENT_URL") || "http://localhost:5173",
  jwtSecret: get("JWT_SECRET"),
  analyticsTz: get("ANALYTICS_TIMEZONE") || "UTC",
  cloudinary: {
    cloudName: get("CLOUDINARY_CLOUD_NAME"),
    apiKey: get("CLOUDINARY_API_KEY"),
    apiSecret: get("CLOUDINARY_API_SECRET"),
  },
};
