import { Router } from "express";
import * as controller from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
} from "../../middleware/rateLimiter";

const router = Router();

router.post("/register", registerRateLimiter, controller.register);
router.post("/login", loginRateLimiter, controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", requireAuth, controller.me);
router.post("/forgot-password", passwordResetRateLimiter, controller.forgotPassword);
router.post("/reset-password", passwordResetRateLimiter, controller.resetPassword);

export default router;
