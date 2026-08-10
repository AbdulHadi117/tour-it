import { useState, useEffect } from "react";
import {
  Loader2, AlertCircle, WifiOff, Clock, Unlink,
  CheckCircle2, Eye, EyeOff, Mail, ShieldCheck,
  ChevronRight, Globe, RefreshCw,
} from "lucide-react";
import type { Page } from "./App";

// ── Shared field chrome ────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest text-[#12233A]">
      {children}
    </span>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function KitCard({
  index,
  label,
  accent,
  children,
}: {
  index: number;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[16px] border border-[#DDD6C7] bg-white shadow-[0_8px_32px_rgba(18,35,58,0.07)]" style={{ minWidth: 320, width: 360, flexShrink: 0 }}>
      {/* Accent bar */}
      <div className="h-1 w-full" style={{ background: accent }} />
      {/* Card header */}
      <div className="flex items-center gap-3 border-b border-[#DDD6C7] px-5 py-4">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
          style={{ background: accent }}
        >
          {index}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#12233A]">{label}</p>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-4 p-5">{children}</div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 1 — Submitting / Loading
// ─────────────────────────────────────────────────────────────────────────────
function SubmittingVariant() {
  return (
    <div className="flex flex-col gap-3">
      {/* Disabled email field */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Email Address</FieldLabel>
        <div className="flex items-center gap-2.5 rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3 opacity-50">
          <Mail size={14} className="shrink-0 text-[#DDD6C7]" />
          <span className="text-sm text-[#12233A]/40">you@example.com</span>
        </div>
      </div>
      {/* Disabled password field */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Password</FieldLabel>
        <div className="flex items-center gap-2.5 rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3 opacity-50">
          <ShieldCheck size={14} className="shrink-0 text-[#DDD6C7]" />
          <span className="text-sm text-[#12233A]/40">••••••••</span>
          <EyeOff size={13} className="ml-auto shrink-0 text-[#DDD6C7]" />
        </div>
      </div>
      {/* Loading CTA */}
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
        style={{ background: "#0E8C88", opacity: 0.80 }}
      >
        <Loader2 size={15} className="animate-spin" />
        Signing in…
      </button>
      {/* Microcopy */}
      <p className="text-center text-[10px] text-[#12233A]/35 uppercase tracking-widest">
        Verifying credentials securely…
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 2 — Invalid Credentials / Field Error
// ─────────────────────────────────────────────────────────────────────────────
function InvalidCredentialsVariant() {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      {/* Email field — error state */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Email Address</FieldLabel>
        <div
          className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3"
          style={{ border: "1.5px solid #E15B3F" }}
        >
          <Mail size={14} className="shrink-0 text-[#E15B3F]" />
          <input
            defaultValue="zara@@gmail.com"
            className="w-full bg-transparent text-sm text-[#12233A] outline-none"
            readOnly
          />
          <AlertCircle size={14} className="shrink-0 text-[#E15B3F]" />
        </div>
      </div>
      {/* Password field — error state */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Password</FieldLabel>
        <div
          className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3"
          style={{ border: "1.5px solid #E15B3F" }}
        >
          <ShieldCheck size={14} className="shrink-0 text-[#E15B3F]" />
          <input
            type={showPw ? "text" : "password"}
            defaultValue="wrongpass"
            className="w-full bg-transparent text-sm text-[#12233A] outline-none"
            readOnly
          />
          <button onClick={() => setShowPw(!showPw)} className="shrink-0 text-[#9CA3AF]">
            {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
      </div>
      {/* Inline error message */}
      <div
        className="flex items-start gap-2.5 rounded-xl px-4 py-3"
        style={{ background: "#FBE7E1", border: "1px solid #E15B3F33" }}
      >
        <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#E15B3F]" />
        <p className="text-xs leading-5 text-[#E15B3F]">
          Invalid email or password. Please try again.
        </p>
      </div>
      <button
        className="w-full rounded-xl py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
        style={{ background: "#0E8C88" }}
      >
        Try Again
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 3 — Network Failure / Server Error 500
// ─────────────────────────────────────────────────────────────────────────────
function NetworkErrorVariant() {
  const [visible, setVisible] = useState(true);
  const [animOut, setAnimOut] = useState(false);

  const dismiss = () => {
    setAnimOut(true);
    setTimeout(() => { setVisible(false); setAnimOut(false); }, 250);
  };
  const show = () => setVisible(true);

  return (
    <div className="flex flex-col gap-3">
      {/* Toast — floats at top center */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 64 }}>
        {visible ? (
          <div
            className="flex w-full items-start gap-3 rounded-xl px-4 py-3.5 shadow-[0_8px_24px_rgba(225,91,63,0.18)]"
            style={{
              background: "#FBE7E1",
              border: "1px solid #E15B3F",
              opacity: animOut ? 0 : 1,
              transform: animOut ? "translateY(-6px)" : "translateY(0)",
              transition: "all 0.22s ease",
            }}
          >
            <WifiOff size={15} className="mt-0.5 shrink-0 text-[#E15B3F]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#E15B3F]">Network error — 500</p>
              <p className="text-[11px] leading-4 text-[#E15B3F]/80 mt-0.5">
                Unable to reach Tour-It servers. Please check your connection.
              </p>
            </div>
            <button onClick={dismiss} className="shrink-0 text-[#E15B3F]/50 hover:text-[#E15B3F] text-xs font-bold">✕</button>
          </div>
        ) : (
          <button onClick={show} className="text-xs font-semibold text-[#0E8C88] hover:underline">
            Show toast again
          </button>
        )}
      </div>
      {/* Form beneath — dimmed */}
      <div className="opacity-40 flex flex-col gap-2 pointer-events-none">
        <div className="rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3">
          <p className="text-sm text-[#12233A]/40">you@example.com</p>
        </div>
        <div className="rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3">
          <p className="text-sm text-[#12233A]/40">••••••••</p>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDD6C7] py-3 text-sm font-bold text-[#12233A] transition-colors hover:border-[#0E8C88] hover:text-[#0E8C88]">
        <RefreshCw size={13} /> Retry Connection
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 4 — Rate-Limit Warning (429)
// ─────────────────────────────────────────────────────────────────────────────
function RateLimitVariant() {
  const TOTAL = 59;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-3">
      {/* Rate limit banner */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5 w-full"
        style={{ background: "#FBF0DD", border: "1px solid #E8A33D" }}
      >
        <Clock size={15} className="mt-0.5 shrink-0 text-[#E8A33D]" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#12233A]">Too many attempts — 429</p>
          <p className="text-[11px] leading-5 text-[#12233A]/65 mt-0.5">
            Please wait{" "}
            <span className="font-black text-[#E8A33D] tabular-nums">
              {mm}:{ss}
            </span>{" "}
            before trying again.
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: "#E8A33D22", color: "#E8A33D", border: "1px solid #E8A33D55" }}
        >
          Locked
        </span>
      </div>
      {/* Disabled fields */}
      <div className="flex flex-col gap-2 opacity-40 pointer-events-none">
        <div className="rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3">
          <p className="text-sm text-[#12233A]/40">you@example.com</p>
        </div>
        <div className="rounded-xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3">
          <p className="text-sm text-[#12233A]/40">••••••••</p>
        </div>
      </div>
      <button
        disabled={seconds > 0 && running}
        onClick={() => { setSeconds(TOTAL); setRunning(true); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
        style={{ background: "#0E8C88", opacity: running && seconds > 0 ? 0.45 : 1 }}
      >
        {running && seconds > 0 ? `Wait ${mm}:${ss}` : "▶ Start countdown demo"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 5 — Expired / Invalid Token
// ─────────────────────────────────────────────────────────────────────────────
function ExpiredTokenVariant() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon badge */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "#E15B3F", boxShadow: "0 10px 28px rgba(225,91,63,0.35)" }}
      >
        <Unlink size={28} className="text-white" strokeWidth={1.75} />
      </div>
      {/* Text */}
      <div className="text-center flex flex-col gap-1.5">
        <span
          className="self-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "#FBE7E1", color: "#E15B3F" }}
        >
          Expired
        </span>
        <h3
          className="text-lg font-bold text-[#12233A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Link Expired
        </h3>
        <p className="text-xs leading-5 text-[#6B7280] max-w-[260px]">
          This verification or reset link is invalid or has expired. Links are valid for 24 hours and can only be used once.
        </p>
      </div>
      <div className="w-full border-t border-[#DDD6C7]" />
      {/* Actions */}
      <div className="flex w-full flex-col gap-2.5">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-colors hover:bg-[#FBE7E1]"
          style={{ borderColor: "#E15B3F", color: "#E15B3F" }}
        >
          <RefreshCw size={13} /> Request New Link
        </button>
        <button className="text-xs font-semibold text-[#6B7280] hover:text-[#12233A] transition-colors">
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 6 — Successful Action
// ─────────────────────────────────────────────────────────────────────────────
function SuccessVariant() {
  const [visible, setVisible] = useState(true);
  const [animOut, setAnimOut] = useState(false);

  const dismiss = () => {
    setAnimOut(true);
    setTimeout(() => { setVisible(false); setAnimOut(false); }, 250);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Success toast */}
      <div className="relative" style={{ minHeight: 56 }}>
        {visible ? (
          <div
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 shadow-[0_8px_24px_rgba(14,140,136,0.15)]"
            style={{
              background: "#E4F3F1",
              border: "1px solid #0E8C88",
              opacity: animOut ? 0 : 1,
              transform: animOut ? "translateY(-6px)" : "translateY(0)",
              transition: "all 0.22s ease",
            }}
          >
            <CheckCircle2 size={16} className="shrink-0 text-[#0E8C88]" />
            <p className="flex-1 text-sm font-semibold text-[#0E8C88]">
              Action completed successfully!
            </p>
            <button onClick={dismiss} className="shrink-0 text-[#0E8C88]/50 hover:text-[#0E8C88] text-xs font-bold">✕</button>
          </div>
        ) : (
          <button onClick={() => setVisible(true)} className="text-xs font-semibold text-[#0E8C88] hover:underline">
            Show toast again
          </button>
        )}
      </div>

      {/* Success state card below toast */}
      <div
        className="flex flex-col items-center gap-3 rounded-xl px-4 py-5"
        style={{ background: "#F0FDF9", border: "1px solid #A8D8D7" }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "#0E8C88", boxShadow: "0 8px 20px rgba(14,140,136,0.30)" }}
        >
          <CheckCircle2 size={22} className="text-white" strokeWidth={1.75} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-[#12233A]">All done!</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">You can now continue to your account.</p>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white"
          style={{ background: "#0E8C88" }}
        >
          Continue <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper
// ─────────────────────────────────────────────────────────────────────────────
const VARIANTS = [
  { index: 1, label: "Submitting / Loading",       accent: "#0E8C88", Component: SubmittingVariant },
  { index: 2, label: "Invalid Credentials",         accent: "#E15B3F", Component: InvalidCredentialsVariant },
  { index: 3, label: "Network Error — 500",         accent: "#E15B3F", Component: NetworkErrorVariant },
  { index: 4, label: "Rate-Limit Warning — 429",    accent: "#E8A33D", Component: RateLimitVariant },
  { index: 5, label: "Expired / Invalid Token",     accent: "#E15B3F", Component: ExpiredTokenVariant },
  { index: 6, label: "Successful Action",           accent: "#0E8C88", Component: SuccessVariant },
];

export default function AuthStateKitPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF8F3]">

      {/* Page header */}
      <div className="border-b border-[#DDD6C7] bg-white px-8 py-6">
        <div className="max-w-[1440px] mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0E8C88]">
                <Globe size={14} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E8C88]">
                Component Library
              </span>
            </div>
            <h1
              className="text-[#12233A] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Authentication State UI Kit
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              6 reusable component variants · 1440px canvas · Paper #FAF8F3
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 self-end">
            {[
              { color: "#0E8C88", label: "Teal — Success / Primary" },
              { color: "#E8A33D", label: "Amber — Warning" },
              { color: "#E15B3F", label: "Coral — Error / Expired" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] font-semibold text-[#12233A]/50">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix grid — 2 rows × 3 cols on wide screens, scrollable otherwise */}
      <div className="px-8 py-10 overflow-x-auto">
        <div
          className="mx-auto grid gap-6"
          style={{
            maxWidth: 1160,
            gridTemplateColumns: "repeat(3, minmax(320px, 360px))",
          }}
        >
          {VARIANTS.map(({ index, label, accent, Component }) => (
            <KitCard key={index} index={index} label={label} accent={accent}>
              <Component />
            </KitCard>
          ))}
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-[#DDD6C7] bg-white px-8 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/30">
            Tour-It · Auth State Kit · 6 variants
          </p>
          <div className="flex gap-4">
            {[
              { label: "← Auth", page: "auth" as Page },
              { label: "Email Verify", page: "email-verify" as Page },
              { label: "Forgot Password", page: "forgot-password" as Page },
            ].map(({ label, page }) => (
              <button
                key={label}
                onClick={() => onNavigate(page)}
                className="text-xs font-semibold text-[#0E8C88] hover:underline"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
