import rateLimit from "express-rate-limit";

// Blunts credential-stuffing / brute-force attempts without punishing normal use.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again in a few minutes.", data: null },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many accounts created from this network. Try again later.", data: null },
});

// --- Password reset: /forgot-password and /reset-password ------------------
// These used to share one limiter. Requesting a reset email and submitting the
// resulting token are different actions — a user retrying a few reset emails
// shouldn't burn the budget they need to actually complete the reset.

export const passwordResetRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many reset requests. Try again in a few minutes.", data: null },
});

export const passwordResetSubmitRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again in a few minutes.", data: null },
});

// --- OTL (magic link): /otl/request and /otl/login --------------------------
// Same reasoning — requesting a link and clicking/submitting it are different
// actions with different abuse profiles (request = email spam vector, login =
// token-guessing vector).

export const otlRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login link requests. Try again in a few minutes.", data: null },
});

export const otlLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again in a few minutes.", data: null },
});

// --- Email verification: /verify-email, /verify-email/resend, /resend-verification ---
// Three genuinely different actions were sharing one limiter: submitting a
// token, an unauthenticated resend-by-email, and an authenticated resend.
// A user who requests two resend emails shouldn't get locked out of
// submitting the code itself.

export const emailVerificationSubmitRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification attempts. Try again later.", data: null },
});

export const emailVerificationResendRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification emails requested. Try again later.", data: null },
});

export const emailVerificationResendAuthedRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification emails requested. Try again later.", data: null },
});