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
  verifyEmailSchema,
  resendVerificationEmailSchema,
  updatePasswordSchema,
  requestOtlSchema,
  otlLoginSchema,
  updateProfileSchema,
} from "./auth.validation";

function requestMeta(req: Request) {
  return { userAgent: req.headers["user-agent"], ip: req.ip };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const user = await authService.registerUser(input);
  return sendSuccess(res, user, "Account created — please check your email to verify your address", 201);
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

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const input = verifyEmailSchema.parse(req.body);
  await authService.verifyEmail(input.token);
  return sendSuccess(res, null, "Email verified successfully");
});

export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const input = resendVerificationEmailSchema.parse(req.body);
  await authService.resendVerificationEmail(input.email);
  return sendSuccess(res, null, "If that email is registered, a verification email has been sent");
});

export const resendVerificationForCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  await authService.resendVerificationForCurrentUser(req.user.id);
  return sendSuccess(res, null, "Verification email sent");
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const input = updatePasswordSchema.parse(req.body);
  await authService.updatePassword(req.user.id, input.currentPassword, input.newPassword);
  return sendSuccess(res, null, "Password updated — you have been signed out of all other devices");
});

export const requestOtl = asyncHandler(async (req: Request, res: Response) => {
  const input = requestOtlSchema.parse(req.body);
  await authService.requestOtl(input.email);
  return sendSuccess(res, null, "If that email is registered, a login link has been sent");
});

export const otlLogin = asyncHandler(async (req: Request, res: Response) => {
  const input = otlLoginSchema.parse(req.body);
  const result = await authService.loginWithOtl(input.token, requestMeta(req));
  return sendSuccess(res, result, "Signed in");
});
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const input = updateProfileSchema.parse(req.body);
  const user = await authService.updateProfile(req.user.id, input);
  return sendSuccess(res, user, "Profile updated successfully");
});
