import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { queryOne } from "../config/db";

export interface AuthenticatedUser {
  id: string;
  roles: string[];
}

// Augment Express's Request type so req.user is typed everywhere it's used,
// instead of every route re-casting `req as any`.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(
      AppError.unauthorized("Missing or malformed Authorization header"),
    );
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, roles: payload.roles };
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Access token expired", 401));
    }
    return next(AppError.unauthorized("Invalid access token"));
  }
}

// Like requireAuth, but doesn't fail the request if there's no token —
// useful for endpoints that behave differently for logged-in vs anonymous
// users (e.g. search history) without requiring a session.
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();

  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    req.user = { id: payload.sub, roles: payload.roles };
  } catch {
    // Invalid/expired token on an optional route — proceed as anonymous.
  }
  return next();
}

// Requires that the authenticated user has a verified email address.
// Must always be stacked AFTER requireAuth — it reads req.user.
// Exceptions: GET /auth/me and POST /auth/verify-email (users need these
// to check their status and submit a verification token while still unverified).
export async function requireVerified(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) return next(AppError.unauthorized());

  try {
    const row = await queryOne<{
      email_verified_at: Date | null;
      status: string;
    }>(
      `SELECT email_verified_at, status FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [req.user.id],
    );

    if (!row || row.status !== "active") {
      return next(new AppError("This account is not active", 403));
    }

    if (!row.email_verified_at) {
      return next(
        new AppError(
          "Please verify your email address before accessing this resource",
          403,
        ),
      );
    }

    return next();
  } catch (err) {
    return next(err);
  }
}
