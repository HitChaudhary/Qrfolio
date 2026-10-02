import mongoose from "mongoose";
import { env } from "./env";

// Never crash the API if MongoDB is unavailable; log and keep serving.
export async function connectDB(): Promise<void> {
  if (!env.mongoUri) {
    console.warn("[db] MONGODB_URI is not set. Running without a database.");
    return;
  }
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", (err as Error).message);
  }
}
