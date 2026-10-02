import app from "./app";
import { connectDB } from "./config/db";
import { env, envFileFound, envPath } from "./config/env";
import { missingCloudinaryVars } from "./utils/cloudinary";

async function start() {
  if (!env.jwtSecret) {
    console.warn("[config] JWT_SECRET is not set. Register/login will return an error until it is.");
  }
  console.log(`[config] .env file: ${envFileFound ? "found" : "NOT FOUND"} at ${envPath}`);
  const missing = missingCloudinaryVars();
  console.log(`[config] Cloudinary: ${missing.length ? "missing " + missing.join(", ") : "configured"}`);
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] http://localhost:${env.port}`);
  });
}

start();
