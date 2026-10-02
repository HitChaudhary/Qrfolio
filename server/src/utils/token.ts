import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(userId: string): string {
  return jwt.sign({}, env.jwtSecret, { subject: userId, expiresIn: "7d" });
}
