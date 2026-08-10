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

  // TODO: send this via a real email provider (SendGrid/SES/Resend) once one is chosen.
  // Logged for now so the reset flow is fully testable without email infra in place.
  // eslint-disable-next-line no-console
  console.log(`[password reset] token for ${email}: ${token} (expires in ${env.RESET_TOKEN_TTL_MINUTES}m)`);
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
