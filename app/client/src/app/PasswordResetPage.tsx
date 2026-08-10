import { useState } from "react";
import {
  Globe,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import type { Page } from "./App";

type FormState = "default" | "loading" | "success" | "expired";

interface Rule {
  label: string;
  test: (pw: string, confirm: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One number or symbol", test: (pw) => /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) },
  { label: "Passwords match", test: (pw, c) => pw.length > 0 && pw === c },
];

function RuleItem({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors"
        style={{ background: valid ? "#0E8C88" : "#F0EDE6", border: valid ? "none" : "1.5px solid #DDD6C7" }}
      >
        {valid
          ? <Check size={11} className="text-white" strokeWidth={3} />
          : <X size={10} className="text-[#DDD6C7]" strokeWidth={2.5} />}
      </div>
      <span className="text-xs font-medium" style={{ color: valid ? "#0E8C88" : "#9CA3AF" }}>
        {label}
      </span>
    </div>
  );
}

function SuccessCard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-[#DDD6C7] bg-white px-8 py-10 shadow-[0_12px_40px_rgba(18,35,58,0.08)]" style={{ width: 420 }}>
      <div className="h-1 w-full rounded-t-[20px] bg-[#0E8C88] -mt-10 mb-8 self-stretch" style={{ marginLeft: -32, marginRight: -32, width: "calc(100% + 64px)" }} />
      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#0E8C88] shadow-[0_8px_24px_rgba(14,140,136,0.35)] mb-6" style={{ width: 72, height: 72 }}>
        <CheckCircle2 size={32} className="text-white" strokeWidth={1.75} />
      </div>
      <h3 className="text-[#12233A] text-xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Password Updated!
      </h3>
      <p className="text-[#6B7280] text-sm text-center leading-6 mb-6">
        Your password has been changed successfully. You can now sign in with your new password.
      </p>
      <div className="w-full border-t border-[#DDD6C7] mb-6" />
      <button
        onClick={() => onNavigate("auth")}
        className="w-full rounded-2xl bg-[#12233A] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1a3150]"
      >
        Sign In Now
      </button>
    </div>
  );
}

function ExpiredCard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-[#DDD6C7] bg-white px-8 py-10 shadow-[0_12px_40px_rgba(18,35,58,0.08)]" style={{ width: 420 }}>
      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#E15B3F] shadow-[0_8px_24px_rgba(225,91,63,0.35)] mb-6" style={{ width: 72, height: 72 }}>
        <AlertTriangle size={32} className="text-white" strokeWidth={1.75} />
      </div>
      <h3 className="text-[#12233A] text-xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Reset Link Expired
      </h3>
      <p className="text-[#6B7280] text-sm text-center leading-6 mb-6">
        This password reset link is invalid or has expired. Reset links are valid for 24 hours — please request a new one.
      </p>
      <div className="w-full border-t border-[#DDD6C7] mb-6" />
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={() => onNavigate("forgot-password")}
          className="w-full rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
        >
          Request New Reset Link
        </button>
        <button
          onClick={() => onNavigate("auth")}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#12233A]"
        >
          <ArrowLeft size={13} /> Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default function PasswordResetPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formState, setFormState] = useState<FormState>("default");

  const allValid = RULES.every((r) => r.test(pw, confirm));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setFormState("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setFormState("success");
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex">

      {/* ── Left Panel ────────────────────────────────────── */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-[#12233A]">
        <img
          src="https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=1440&h=1200&fit=crop&auto=format"
          alt="Karakoram Highway cutting through dramatic mountain valleys of Northern Pakistan"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(18,35,58,0.80)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative h-full flex flex-col justify-between p-12 xl:p-16">
          <div />

          <div className="max-w-md">
            {/* Security card */}
            <div
              className="rounded-3xl border border-white/20 px-8 py-7 mb-8"
              style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E8C88]">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold leading-snug mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}>
                    Secure your account.
                  </p>
                  <p className="text-white/70 text-sm leading-6">
                    Keep planning your travel itineraries safely. A strong password keeps your saved trips, wishlist, and personal data protected.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700 }}>
              Almost back to exploring Pakistan.
            </h2>
            <p className="text-white/60 text-sm leading-7">
              Set a new password and you'll be back planning your next adventure in seconds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[{ v: "256-bit", l: "Encryption" }, { v: "24 hrs", l: "Link validity" }, { v: "100%", l: "Data secure" }].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <p className="text-lg font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{s.v}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center bg-[#FAF8F3] px-6 py-12 overflow-y-auto">
        <div className="w-full mx-auto" style={{ maxWidth: 480 }}>

          {/* Brand logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 mb-10 group">
            <div className="w-9 h-9 rounded-lg bg-[#0E8C88] flex items-center justify-center">
              <Globe size={20} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[#12233A] font-bold tracking-tight group-hover:text-[#0E8C88] transition-colors" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}>TourIT</span>
              <span className="text-[10px] text-[#0E8C88] uppercase tracking-widest font-semibold">Tourism Discovery</span>
            </div>
          </button>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0E8C88] mb-2">Account Security</p>
            <h1 className="text-[#12233A] leading-tight mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}>
              Set New Password
            </h1>
            <p className="text-[#6B7280] text-sm leading-6">
              Choose a strong password to protect your Tour-It account.
            </p>
          </div>

          {/* Form — 12px auto-layout */}
          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 12 }}>

            {/* New password */}
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label className="text-xs font-bold text-[#12233A] uppercase tracking-widest">New Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#DDD6C7] bg-white px-4 py-3.5 focus-within:border-[#0E8C88] transition-colors">
                <ShieldCheck size={15} className="shrink-0 text-[#0E8C88]" />
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-[#9CA3AF] hover:text-[#12233A] transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label className="text-xs font-bold text-[#12233A] uppercase tracking-widest">Confirm New Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#DDD6C7] bg-white px-4 py-3.5 focus-within:border-[#0E8C88] transition-colors">
                <ShieldCheck size={15} className="shrink-0 text-[#0E8C88]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#9CA3AF] hover:text-[#12233A] transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Password requirements widget — 12px gap */}
            <div className="rounded-2xl border border-[#DDD6C7] bg-white px-5 py-4 flex flex-col" style={{ gap: 10 }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#12233A]/50 mb-1">Password Requirements</p>
              {RULES.map((r) => (
                <RuleItem key={r.label} label={r.label} valid={r.test(pw, confirm)} />
              ))}
            </div>

            {/* CTA button */}
            <button
              type="submit"
              disabled={!allValid || formState === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all mt-2"
              style={{ background: "#0E8C88", opacity: formState === "loading" ? 0.80 : !allValid ? 0.50 : 1 }}
            >
              {formState === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /> Resetting…</>
              ) : "Reset Password"}
            </button>

            <div className="flex justify-center pt-1">
              <button type="button" onClick={() => onNavigate("auth")} className="flex items-center gap-1.5 text-sm font-semibold text-[#12233A] opacity-50 hover:opacity-90 transition-opacity">
                <ArrowLeft size={13} /> Back to Sign In
              </button>
            </div>
          </form>

          {/* State cards below form — shown when form submits */}
          {(formState === "success" || formState === "expired") && (
            <div className="mt-10 flex justify-center" style={{ animation: "fadeSlideIn 0.3s ease" }}>
              {formState === "success"
                ? <SuccessCard onNavigate={onNavigate} />
                : <ExpiredCard onNavigate={onNavigate} />}
            </div>
          )}

          {/* Demo toggle — show expired card for preview */}
          {formState === "default" && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setFormState("expired")}
                className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/30 hover:text-[#E15B3F] transition-colors"
              >
                Preview: Expired Token State →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
