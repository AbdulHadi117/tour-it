import { query, queryOne } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { hashPassword, verifyPassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  newTokenId,
  randomOpaqueToken,
} from "../../utils/jwt";
import { env } from "../../config/env";
import { sendEmail } from "../../utils/mailer";
import { UserRow, SafeUser, toSafeUser } from "./auth.types";
import { RegisterInput, LoginInput } from "./auth.validation";

interface RequestMeta {
  userAgent?: string;
  ip?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

async function getRolesForUser(userId: string): Promise<string[]> {
  const rows = await query<{ name: string }>(
    `SELECT r.name FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId],
  );
  return rows.map((r) => r.name);
}

async function issueTokenPair(userId: string, roles: string[], meta: RequestMeta): Promise<TokenPair> {
  const accessToken = signAccessToken({ sub: userId, roles });
  const jti = newTokenId();
  const refreshToken = signRefreshToken({ sub: userId, jti });
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [jti, userId, hashToken(refreshToken), meta.userAgent ?? null, meta.ip ?? null, expiresAt],
  );

  return { accessToken, refreshToken };
}

// ---------------------------------------------------------------------------
// Email verification
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(userId: string, email: string): Promise<void> {
  const token = randomOpaqueToken();
  const expiresAt = new Date(Date.now() + env.EMAIL_VERIFICATION_TTL_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expiresAt],
  );

  const link = `${env.APP_BASE_URL}/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify your email address",
    `<p>Welcome! Please verify your email address by clicking the link below.</p>
     <p><a href="${link}">Verify Email</a></p>
     <p>This link expires in ${env.EMAIL_VERIFICATION_TTL_MINUTES / 60} hours. If you did not create an account, you can safely ignore this email.</p>`,
  );
}

export async function verifyEmail(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const row = await queryOne<{ id: string; user_id: string; expires_at: Date; used_at: Date | null }>(
    `SELECT * FROM email_verification_tokens WHERE token_hash = $1`,
    [tokenHash],
  );

  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    throw AppError.badRequest("This verification link is invalid or has expired");
  }

  await query(`UPDATE users SET email_verified_at = now(), updated_at = now() WHERE id = $1`, [row.user_id]);
  await query(`UPDATE email_verification_tokens SET used_at = now() WHERE id = $1`, [row.id]);
}

// ---------------------------------------------------------------------------
// Register & Login
// ---------------------------------------------------------------------------

export async function registerUser(input: RegisterInput): Promise<SafeUser> {
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [input.email],
  );
  if (existing) {
    throw AppError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await queryOne<UserRow>(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [input.name, input.email, passwordHash],
  );
  if (!user) throw new AppError("Could not create account", 500);

  await query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, id FROM roles WHERE name = 'user'
     ON CONFLICT DO NOTHING`,
    [user.id],
  );

  // Fire-and-forget: don't let a mailer failure block the registration response.
  sendVerificationEmail(user.id, user.email).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[auth] Failed to send verification email after register:", err);
  });

  return toSafeUser(user, ["user"]);
}

export async function loginUser(
  input: LoginInput,
  meta: RequestMeta,
): Promise<{ user: SafeUser } & TokenPair> {
  const user = await queryOne<UserRow>(
    `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [input.email],
  );
  // Same generic message whether the email doesn't exist or the password is wrong —
  // this endpoint should never reveal which emails are registered.
  if (!user) throw AppError.unauthorized("Invalid email or password");
  if (user.status !== "active") throw AppError.forbidden("This account is not active");

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  // Unverified users can log in but the access token payload signals the
  // unverified state. All routes that need a verified user use requireVerified.
  const roles = await getRolesForUser(user.id);
  const tokens = await issueTokenPair(user.id, roles, meta);

  return { user: toSafeUser(user, roles), ...tokens };
}

export async function refreshTokens(refreshToken: string, meta: RequestMeta): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const row = await queryOne<{
    id: string;
    user_id: string;
    token_hash: string;
    revoked_at: Date | null;
    expires_at: Date;
  }>(`SELECT * FROM refresh_tokens WHERE id = $1`, [payload.jti]);

  const isValid =
    row &&
    !row.revoked_at &&
    row.token_hash === hashToken(refreshToken) &&
    new Date(row.expires_at) > new Date();

  if (!row || !isValid) {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  // Rotate on every use: revoke the presented token, issue a fresh pair.
  // If a revoked token is ever presented again, that's a strong signal of theft/replay.
  await query(`UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1`, [row.id]);

  const roles = await getRolesForUser(row.user_id);
  return issueTokenPair(row.user_id, roles, meta);
}

export async function logoutUser(refreshToken: string): Promise<void> {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await query(`UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1`, [payload.jti]);
  } catch {
    // Already invalid/expired — logging out is a no-op here, not an error.
  }
}

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await queryOne<UserRow>(`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, [userId]);
  if (!user) throw AppError.notFound("User not found");
  const roles = await getRolesForUser(user.id);
  return toSafeUser(user, roles);
}

// ---------------------------------------------------------------------------
// Password management
// ---------------------------------------------------------------------------

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await queryOne<UserRow>(`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`, [email]);
  // Resolve the same way whether or not the email exists — this endpoint must not
  // be usable to enumerate registered accounts.
  if (!user) return;

  const token = randomOpaqueToken();
  const expiresAt = new Date(Date.now() + env.RESET_TOKEN_TTL_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, hashToken(token), expiresAt],
  );

  const link = `${env.APP_BASE_URL}/reset-password?token=${token}`;

  await sendEmail(
    email,
    "Reset your password",
    `<p>You requested a password reset. Click the link below to set a new password.</p>
     <p><a href="${link}">Reset Password</a></p>
     <p>This link expires in ${env.RESET_TOKEN_TTL_MINUTES} minutes. If you did not request this, you can safely ignore this email.</p>`,
  );
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashToken(token);
  const row = await queryOne<{ id: string; user_id: string; expires_at: Date; used_at: Date | null }>(
    `SELECT * FROM password_reset_tokens WHERE token_hash = $1`,
    [tokenHash],
  );

  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    throw AppError.badRequest("This reset link is invalid or has expired");
  }

  const passwordHash = await hashPassword(newPassword);

  await query(`UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`, [
    passwordHash,
    row.user_id,
  ]);
  await query(`UPDATE password_reset_tokens SET used_at = now() WHERE id = $1`, [row.id]);
  // Resetting the password logs the user out everywhere else — the expected security behavior.
  await query(`UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, [
    row.user_id,
  ]);
}

export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await queryOne<UserRow>(`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, [userId]);
  if (!user) throw AppError.notFound("User not found");

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) throw AppError.unauthorized("Current password is incorrect");

  const passwordHash = await hashPassword(newPassword);
  await query(`UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`, [passwordHash, userId]);

  // Invalidate all existing sessions so other devices are logged out after a password change.
  await query(`UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
}

// ---------------------------------------------------------------------------
// One-Time Login (magic link via email)
// ---------------------------------------------------------------------------

export async function requestOtl(email: string): Promise<void> {
  const user = await queryOne<UserRow>(
    `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL AND status = 'active'`,
    [email],
  );
  // Resolve silently if not found — must not enumerate registered emails.
  if (!user) return;

  const token = randomOpaqueToken();
  const expiresAt = new Date(Date.now() + env.OTL_TOKEN_TTL_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO otl_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, hashToken(token), expiresAt],
  );

  const link = `${env.APP_BASE_URL}/otl?token=${token}`;

  await sendEmail(
    email,
    "Your one-time login link",
    `<p>Use the link below to sign in instantly. It expires in ${env.OTL_TOKEN_TTL_MINUTES} minutes and can only be used once.</p>
     <p><a href="${link}">Sign In</a></p>
     <p>If you did not request this, you can safely ignore this email.</p>`,
  );
}

export async function loginWithOtl(
  token: string,
  meta: RequestMeta,
): Promise<{ user: SafeUser } & TokenPair> {
  const tokenHash = hashToken(token);
  const row = await queryOne<{ id: string; user_id: string; expires_at: Date; used_at: Date | null }>(
    `SELECT * FROM otl_tokens WHERE token_hash = $1`,
    [tokenHash],
  );

  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    throw AppError.unauthorized("This login link is invalid or has expired");
  }

  // Mark token as used before issuing the session — prevents replay even if the
  // response is intercepted mid-flight.
  await query(`UPDATE otl_tokens SET used_at = now() WHERE id = $1`, [row.id]);

  const user = await queryOne<UserRow>(
    `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL AND status = 'active'`,
    [row.user_id],
  );
  if (!user) throw AppError.forbidden("This account is not active");

  // OTL login is a strong proof of email ownership — verify the email if not already done.
  if (!user.email_verified_at) {
    await query(`UPDATE users SET email_verified_at = now(), updated_at = now() WHERE id = $1`, [user.id]);
    // Invalidate any pending verification tokens since the email is now confirmed.
    await query(
      `UPDATE email_verification_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL`,
      [user.id],
    );
  }

  const roles = await getRolesForUser(user.id);
  const tokens = await issueTokenPair(user.id, roles, meta);

  return { user: toSafeUser(user, roles), ...tokens };
}
