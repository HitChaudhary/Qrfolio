import { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}

// Centralized error handler: never leak stack traces to clients.
export function errorHandler(
  err: Error & { type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ success: false, message: "Invalid JSON body" });
    return;
  }
  console.error("[error]", err.message);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
