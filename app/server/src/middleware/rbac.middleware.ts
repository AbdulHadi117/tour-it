import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

// Usage: router.get("/admin/places", requireAuth, requireRole("admin"), handler)
// Always chain after requireAuth — this only checks roles on an already-verified user.
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(AppError.forbidden());
    }
    return next();
  };
}
