import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as JwtPayload;
    if (!payload.sub) throw new Error("Missing subject");
    req.userId = payload.sub;
    next();
  } catch (err) {
    const expired = err instanceof jwt.TokenExpiredError;
    res.status(401).json({
      success: false,
      message: expired ? "Session expired. Please log in again." : "Invalid token. Please log in again.",
    });
  }
}
