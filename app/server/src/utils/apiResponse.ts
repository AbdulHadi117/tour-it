import type { Response } from "express";

// Matches the shape the frontend already expects from /auth/register and
// /auth/login — { success, message, data } — so every future endpoint stays
// consistent with what auth.ts already parses.
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "OK",
  statusCode = 200,
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendError(res: Response, message: string, statusCode = 400) {
  return res.status(statusCode).json({ success: false, message, data: null });
}
