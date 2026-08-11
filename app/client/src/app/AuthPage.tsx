import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Mail, MapPin, Phone, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import type { AuthMode, UserProfile } from "./auth";
import { registerUser, loginUser } from "./auth";
import type { Page } from "./App";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-[#12233A] uppercase tracking-widest">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AuthPage({
  mode,
  onModeChange,
  onNavigate,
  onAuthSuccess,
  onRegistrationPending,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onNavigate: (page: Page) => void;
  onAuthSuccess: (user: UserProfile) => void;
  onRegistrationPending: (email: string) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Lahore, Pakistan");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isRegister && fullName.trim().length < 2) {
      setError("Enter your full name to continue.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      if (isRegister) {
        await registerUser({
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim() || undefined,
          location: location.trim() || undefined,
        });

        onRegistrationPending(email.trim());
        return;
      } else {
        const userProfile = await loginUser({
          email: email.trim(),
          password: password.trim(),
        });

        onAuthSuccess(userProfile);
        onNavigate("profile");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF8F3]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 xl:gap-12 items-stretch">
          <section className="relative overflow-hidden rounded-[32px] bg-[#12233A] text-white p-8 lg:p-12 min-h-[620px]">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="relative h-full flex flex-col justify-between gap-8">
              <div className="space-y-6 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-white/85">
                  <Sparkles size={14} /> Account access
                </span>
                <div>
                  <h1 className="leading-[1.02] text-4xl lg:text-5xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
                    Manage your travel identity in one place.
                  </h1>
                  <p className="mt-5 max-w-lg text-sm lg:text-base leading-7 text-white/75">
                    Sign in to resume your trips, or create a profile to save destinations, track your planning history, and keep your travel preferences ready for every journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Saved trips", value: "4" },
                    { label: "Wishlist items", value: "12" },
                    { label: "Profile sync", value: "On" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                      <p className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.value}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Save traveler details once",
                  "Resume planning on any device",
                  "Keep preferences and alerts together",
                  "Switch between travel and profile views",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80">
                    <CheckCircle2 size={16} className="shrink-0 text-[#E8A33D]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[rgba(18,35,58,0.08)] bg-white p-6 lg:p-8 shadow-[0_20px_60px_rgba(18,35,58,0.08)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#0E8C88]">{isRegister ? "Create account" : "Welcome back"}</p>
                <h2 className="mt-2 text-2xl font-bold text-[#12233A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {isRegister ? "Start your profile" : "Sign in to your account"}
                </h2>
              </div>
              <div className="rounded-full bg-[#EBF7F6] p-1 flex items-center gap-1">
                {(["signin", "register"] as AuthMode[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => onModeChange(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${mode === item ? "bg-[#0E8C88] text-white" : "text-[#12233A]/60 hover:text-[#12233A]"}`}
                  >
                    {item === "signin" ? "Sign in" : "Register"}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <Field label="Full name">
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm text-[#12233A] outline-none transition-colors focus:border-[#0E8C88]"
                    placeholder="Zara Ahmed"
                  />
                </Field>
              )}

              <Field label="Email address">
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88]">
                  <Mail size={16} className="text-[#0E8C88] shrink-0" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88]">
                  <ShieldCheck size={16} className="text-[#0E8C88] shrink-0" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-[#6B7280] transition-colors hover:text-[#12233A]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {isRegister && (
                <>
                  <Field label="Phone number">
                    <div className="flex items-center gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88]">
                      <Phone size={16} className="text-[#0E8C88] shrink-0" />
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                        placeholder="+92 3xx xxxxxxx"
                        type="tel"
                      />
                    </div>
                  </Field>
                  <Field label="Home base">
                    <div className="flex items-center gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88]">
                      <MapPin size={16} className="text-[#0E8C88] shrink-0" />
                      <input
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                        placeholder="Lahore, Pakistan"
                      />
                    </div>
                  </Field>
                </>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                  <input
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    type="checkbox"
                    className="h-4 w-4 rounded border-[rgba(18,35,58,0.2)] text-[#0E8C88] focus:ring-[#0E8C88]"
                  />
                  {isRegister ? "Keep my profile synced" : "Keep me signed in"}
                </label>
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => onNavigate("forgot-password" as any)}
                    className="text-xs font-semibold text-[#0E8C88] hover:underline"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("magic-link" as any)}
                    className="text-xs font-semibold text-[#0E8C88] hover:underline"
                  >
                    Sign in with magic link
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-2xl border border-[#E15B3F]/20 bg-[#FBE7E1] px-4 py-3 text-sm text-[#E15B3F]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874] disabled:opacity-60"
              >
                {submitting ? "Processing…" : isRegister ? "Create account" : "Sign in"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onModeChange("signin")}
                className="rounded-2xl border border-[rgba(18,35,58,0.12)] px-4 py-3 text-left text-sm font-semibold text-[#12233A] transition-colors hover:border-[#0E8C88] hover:bg-[#EBF7F6]/30"
              >
                Already have an account
                <span className="mt-1 block text-xs font-normal text-[#6B7280]">Use your email to access saved trips and profile settings.</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange("register")}
                className="rounded-2xl border border-[rgba(18,35,58,0.12)] px-4 py-3 text-left text-sm font-semibold text-[#12233A] transition-colors hover:border-[#0E8C88] hover:bg-[#EBF7F6]/30"
              >
                New here
                <span className="mt-1 block text-xs font-normal text-[#6B7280]">Create a profile to save travel preferences and manage your account.</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
