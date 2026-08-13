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
  avatarSeed: string;
  themeColor: string;
  emailVerifiedAt: string | null;
  createdAt: string;
};

const PROFILE_KEY = "tourit.user.profile";
const TOKEN_KEY = "tourit.access_token";
const REFRESH_TOKEN_KEY = "tourit.refresh_token";

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

function toUserProfile(user: any): UserProfile {
  return {
    id: user.id,
    fullName: user.name || user.email.split("@")[0],
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || "",
    travelStyle: user.travelStyle || "Balanced explorer",
    languages: user.languages || [],
    newsletter: user.newsletter ?? true,
    safetyAlerts: user.safetyAlerts ?? true,
    memberSince: formatMemberSince(new Date(user.createdAt)),
    avatarSeed: getInitials(user.name || user.email),
    themeColor: user.themeColor || "#0E8C88",
    emailVerifiedAt: user.emailVerifiedAt || null,
    createdAt: user.createdAt,
  };
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

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearAuthData() {
  clearStoredUserProfile();
}

// --- Backend API Operations ---

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: getRefreshToken() }),
        });
        
        const json = await refreshResponse.json();
        
        if (refreshResponse.ok && json.success) {
          const { accessToken, refreshToken: newRefreshToken } = json.data;
          localStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          onRefreshed(accessToken);
        } else {
          clearAuthData();
          window.location.href = "/";
          return response;
        }
      } catch (err) {
        clearAuthData();
        window.location.href = "/";
        return response;
      } finally {
        isRefreshing = false;
      }
    }

    // Wait for the token refresh to complete
    const newAccessToken = await new Promise<string>((resolve) => {
      subscribeTokenRefresh(resolve);
    });

    headers.set("Authorization", `Bearer ${newAccessToken}`);
    response = await fetch(url, { ...options, headers });
  }

  return response;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}) {
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

export async function resendVerificationEmail(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/verify-email/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to resend verification email");
  }
}

export async function resendVerificationEmailForCurrentUser(): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to resend verification email");
  }
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

  const { accessToken, refreshToken, user } = json.data;

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  const profile = toUserProfile(user);

  saveStoredUserProfile(profile);
  return profile;
}

export async function getMe(): Promise<UserProfile> {
  const response = await fetchWithAuth(`${API_URL}/auth/me`);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to restore session");
  }

  const profile = toUserProfile(json.data);
  saveStoredUserProfile(profile);
  return profile;
}

export async function verifyEmail(token: string) {
  const response = await fetchWithAuth(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Email verification failed");
  }
  return json.data;
}

export async function updatePassword(data: any) {
  const response = await fetchWithAuth(`${API_URL}/auth/update-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to update password");
  }
  clearAuthData();
  return json.data;
}

export async function requestOtl(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/otl/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send magic link");
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send password reset link");
  }
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword: password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reset password");
  }
}

export async function otlLogin(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/otl/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Invalid or expired magic link");
  }

  const { accessToken, refreshToken, user } = json.data;

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  const profile = toUserProfile(user);

  saveStoredUserProfile(profile);
  return profile;
}

export async function updateProfile(data: any): Promise<UserProfile> {
  const response = await fetchWithAuth(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to update profile");
  }
  
  const profile = toUserProfile(json.data);

  saveStoredUserProfile(profile);
  return profile;
}

export async function logoutUser() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      // Ignore errors on logout
    }
  }
  clearAuthData();
}