import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { missingCloudinaryVars } from "../utils/cloudinary";

export function requireDb(_req: Request, res: Response, next: NextFunction) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ success: false, message: "Database is unavailable. Please try again later." });
    return;
  }
  next();
}

export function requireJwtConfig(_req: Request, res: Response, next: NextFunction) {
  if (!env.jwtSecret) {
    res.status(500).json({ success: false, message: "Server is not configured: JWT_SECRET is missing." });
    return;
  }
  next();
}

export function requireCloudinary(_req: Request, res: Response, next: NextFunction) {
  const missing = missingCloudinaryVars();
  if (missing.length > 0) {
    res.status(503).json({
      success: false,
      message: `Logo upload is not configured. Missing on the server: ${missing.join(", ")}. Add them to server/.env and restart the server.`,
    });
    return;
  }
  next();
}
