import { Router } from "express";
import * as controller from "./auth.controller";
import { requireAuth, requireVerified } from "../../middleware/auth.middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
  otlRateLimiter,
  emailVerificationRateLimiter,
} from "../../middleware/rateLimiter";

const router = Router();

// Public
router.post("/register", registerRateLimiter, controller.register);
router.post("/login", loginRateLimiter, controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

// Requires a valid session but NOT a verified email —
// users need these two routes to check their state and complete verification.
router.get("/me", requireAuth, controller.me);
router.post("/verify-email", emailVerificationRateLimiter, controller.verifyEmail);

// Requires a valid session AND a verified email.
router.patch("/update-password", requireAuth, requireVerified, controller.updatePassword);

// Profile update (requires session, but not necessarily verified email yet depending on rules, let's just require auth)
router.patch("/profile", requireAuth, controller.updateProfile);

// Password reset (public — user may be locked out)
router.post("/forgot-password", passwordResetRateLimiter, controller.forgotPassword);
router.post("/reset-password", passwordResetRateLimiter, controller.resetPassword);

// One-time login (magic link)
router.post("/otl/request", otlRateLimiter, controller.requestOtl);
router.post("/otl/login", otlRateLimiter, controller.otlLogin);

export default router;
