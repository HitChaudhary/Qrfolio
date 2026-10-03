import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { User, UserRole } from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

// Verifies the JWT, then loads the account from the database. Role and active
// status always come from the database (never from the token), so a demoted or
// deactivated account loses access immediately.
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  let userId: string;
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as JwtPayload;
    if (!payload.sub) throw new Error("Missing subject");
    userId = payload.sub;
  } catch (err) {
    const expired = err instanceof jwt.TokenExpiredError;
    res.status(401).json({
      success: false,
      message: expired ? "Session expired. Please log in again." : "Invalid token. Please log in again.",
    });
    return;
  }

  try {
    const user = await User.findById(userId).select("role isActive");
    if (!user) {
      res.status(401).json({ success: false, message: "Account no longer exists. Please log in again." });
      return;
    }
    if (user.isActive === false) {
      res.status(403).json({ success: false, message: "This account has been deactivated." });
      return;
    }
    req.userId = userId;
    req.userRole = user.role === "admin" ? "admin" : "user";
    next();
  } catch (err) {
    next(err);
  }
}

// Same middleware under the name used by the admin spec
export const authenticateUser = requireAuth;

// Must run after authenticateUser
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
}
