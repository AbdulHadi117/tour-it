import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

// Wraps an async route handler so a thrown/rejected error reaches this
// middleware instead of needing a try/catch in every controller.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `No route: ${req.method} ${req.path}`, data: null });
}

// Express only recognizes this as error-handling middleware because it has 4 params —
// req and next are unused but must stay in the signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return res.status(422).json({ success: false, message, data: null });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, data: null });
  }

  // Unexpected error — log the real thing server-side, never leak internals to the client.
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Something went wrong" : String(err),
    data: null,
  });
}
