export type AuthMode = "signin" | "register";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  travelStyle: string;
  languages: string[];
  newsletter: boolean;
  safetyAlerts: boolean;
  memberSince: string;
  tripsPlanned: number;
  wishlistCount: number;
  avatarSeed: string;
  themeColor: string;
};

const PROFILE_KEY = "tourit.user.profile";
const TOKEN_KEY = "tourit.access_token";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensures protocol is present and removes trailing slashes
const API_URL = RAW_API_URL.replace(/[\/]+$/, "");

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function deriveAvatarSeed(name: string) {
  return getInitials(name);
}

export function createDefaultUserProfile({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}): UserProfile {
  const safeName = fullName.trim() || email.split("@")[0] || "Traveler";
  return {
    id: crypto.randomUUID(),
    fullName: safeName,
    email,
    phone: "+92 300 0000000",
    location: "Lahore, Pakistan",
    bio: "Planning Pakistan trips, saving routes, and keeping travel notes organized.",
    travelStyle: "Balanced explorer",
    languages: ["English", "Urdu"],
    newsletter: true,
    safetyAlerts: true,
    memberSince: formatMemberSince(new Date()),
    tripsPlanned: 4,
    wishlistCount: 12,
    avatarSeed: getInitials(safeName),
    themeColor: "#0E8C88",
  };
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function loadStoredUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveStoredUserProfile(user: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
}

export function clearStoredUserProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAuthData() {
  clearStoredUserProfile();
}

// --- Backend API Operations ---

export async function registerUser(data: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Registration failed");
  }
  return json.data;
}

export async function loginUser(data: { email: string; password: string }): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Invalid email or password");
  }

  const { accessToken, user } = json.data;

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }

  const profile: UserProfile = {
    id: user.id,
    fullName: user.name || user.email.split("@")[0],
    email: user.email,
    phone: "+92 300 0000000",
    location: "Lahore, Pakistan",
    bio: "Planning Pakistan trips, saving routes, and keeping travel notes organized.",
    travelStyle: "Balanced explorer",
    languages: ["English", "Urdu"],
    newsletter: true,
    safetyAlerts: true,
    memberSince: formatMemberSince(new Date()),
    tripsPlanned: 0,
    wishlistCount: 0,
    avatarSeed: getInitials(user.name || user.email),
    themeColor: "#0E8C88",
  };

  saveStoredUserProfile(profile);
  return profile;
}