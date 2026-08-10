export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  avatar_url: string | null;
  email_verified_at: Date | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// The shape returned to the client — password_hash never leaves this module.
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: Date | null;
  roles: string[];
  createdAt: Date;
}

export function toSafeUser(row: UserRow, roles: string[]): SafeUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    emailVerifiedAt: row.email_verified_at,
    roles,
    createdAt: row.created_at,
  };
}

