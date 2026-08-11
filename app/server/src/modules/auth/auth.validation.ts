import { z } from "zod";

// Matches what AuthPage.tsx sends during registration.
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  phone: z.string().optional(),
  location: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(128),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "token is required"),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const resendVerificationEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});
export type ResendVerificationEmailInput = z.infer<typeof resendVerificationEmailSchema>;

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "currentPassword is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(128),
});
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const requestOtlSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});
export type RequestOtlInput = z.infer<typeof requestOtlSchema>;

export const otlLoginSchema = z.object({
  token: z.string().min(1, "token is required"),
});
export type OtlLoginInput = z.infer<typeof otlLoginSchema>;
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  travelStyle: z.string().optional(),
  languages: z.array(z.string()).optional(),
  newsletter: z.boolean().optional(),
  safetyAlerts: z.boolean().optional(),
  themeColor: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
