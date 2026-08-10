export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  travel_style: string | null;
  languages: string[];
  newsletter: boolean;
  safety_alerts: boolean;
  theme_color: string;
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
  location: string | null;
  bio: string | null;
  travelStyle: string | null;
  languages: string[];
  newsletter: boolean;
  safetyAlerts: boolean;
  themeColor: string;
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
    location: row.location,
    bio: row.bio,
    travelStyle: row.travel_style,
    languages: row.languages,
    newsletter: row.newsletter,
    safetyAlerts: row.safety_alerts,
    themeColor: row.theme_color,
    emailVerifiedAt: row.email_verified_at,
    roles,
    createdAt: row.created_at,
  };
}

