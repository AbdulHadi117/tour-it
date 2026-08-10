import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/AppError";
import * as authService from "./auth.service";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";

function requestMeta(req: Request) {
  return { userAgent: req.headers["user-agent"], ip: req.ip };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const user = await authService.registerUser(input);
  return sendSuccess(res, user, "Account created", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.loginUser(input, requestMeta(req));
  return sendSuccess(res, result, "Signed in");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const input = refreshSchema.parse(req.body);
  const tokens = await authService.refreshTokens(input.refreshToken, requestMeta(req));
  return sendSuccess(res, tokens, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const input = refreshSchema.parse(req.body);
  await authService.logoutUser(input.refreshToken);
  return sendSuccess(res, null, "Signed out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, user, "OK");
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const input = forgotPasswordSchema.parse(req.body);
  await authService.requestPasswordReset(input.email);
  return sendSuccess(res, null, "If that email is registered, a reset link has been sent");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const input = resetPasswordSchema.parse(req.body);
  await authService.resetPassword(input.token, input.newPassword);
  return sendSuccess(res, null, "Password updated — sign in with your new password");
});
