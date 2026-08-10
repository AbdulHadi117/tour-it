import { CheckCircle2, AlertTriangle, Info, ArrowLeft } from "lucide-react";
import type { Page } from "./App";

type VerifyState = "success" | "expired" | "already-verified";

function StateCard({
  state,
  onNavigate,
  onResend,
}: {
  state: VerifyState;
  onNavigate: (page: Page) => void;
  onResend?: () => void;
}) {
  const configs = {
    success: {
      iconBg: "#0E8C88",
      Icon: CheckCircle2,
      heading: "Email Verified Successfully!",
      subtitle:
        "Your account is now fully active. You can start creating and saving trip itineraries.",
      badge: { label: "Verified", bg: "#EBF7F6", text: "#0E8C88" },
      topAccent: "#0E8C88",
    },
    expired: {
      iconBg: "#E15B3F",
      Icon: AlertTriangle,
      heading: "Verification Link Expired",
      subtitle:
        "This verification link is invalid or has expired. Please request a new link to activate your account.",
      badge: { label: "Expired", bg: "#FBE7E1", text: "#E15B3F" },
      topAccent: "#E15B3F",
    },
    "already-verified": {
      iconBg: "#E8A33D",
      Icon: Info,
      heading: "Account Already Verified",
      subtitle:
        "Your email address has already been verified. You can sign in directly.",
      badge: { label: "Active", bg: "#FEF3E2", text: "#E8A33D" },
      topAccent: "#E8A33D",
    },
  };

  const c = configs[state];
  const Icon = c.Icon;

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-[20px] border border-[#DDD6C7] bg-white shadow-[0_12px_40px_rgba(18,35,58,0.08)]"
      style={{ width: 520, minWidth: 340, flexShrink: 0 }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: c.topAccent }} />

      <div className="flex flex-col items-center px-10 pt-10 pb-10 gap-5">
        {/* Status badge */}
        <span
          className="self-end rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: c.badge.bg, color: c.badge.text }}
        >
          {c.badge.label}
        </span>

        {/* Icon badge */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
          style={{
            background: c.iconBg,
            boxShadow: `0 12px 32px ${c.iconBg}44`,
          }}
        >
          <Icon size={36} className="text-white" strokeWidth={1.75} />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2
            className="text-[#12233A] leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {c.heading}
          </h2>
          <p className="text-[#6B7280] text-sm leading-6 max-w-[360px]">
            {c.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#DDD6C7]" />

        {/* Actions */}
        {state === "success" && (
          <button
            onClick={() => onNavigate("home")}
            className="w-full rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
          >
            Continue to Tour-It
          </button>
        )}

        {state === "expired" && (
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={onResend}
              className="w-full rounded-2xl bg-[#12233A] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1a3150]"
            >
              Resend Verification Email
            </button>
            <button
              onClick={() => onNavigate("auth")}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#12233A]"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </button>
          </div>
        )}

        {state === "already-verified" && (
          <button
            onClick={() => onNavigate("auth")}
            className="w-full rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
          >
            Sign In to Tour-It
          </button>
        )}

        {/* Footer hint */}
        <p className="text-[10px] text-[#6B7280]/60 uppercase tracking-widest font-semibold">
          Tour-It · Pakistan Travel Discovery
        </p>
      </div>
    </article>
  );
}

export default function EmailVerificationResultPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF8F3]">
      {/* Page header */}
      <div className="border-b border-[#DDD6C7] bg-[#FAF8F3] px-8 py-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0E8C88]">
          UI State Library
        </p>
        <h1
          className="mt-1 text-[#12233A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            fontWeight: 700,
          }}
        >
          Email Verification — Result States
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Three card variants displayed side-by-side · 32px horizontal gap · 520px each
        </p>
      </div>

      {/* Horizontal auto-layout — 3 cards × 32px gap */}
      <div className="flex min-h-[calc(100vh-80px-89px)] items-center justify-start px-10 py-16 overflow-x-auto">
        <div className="flex items-start" style={{ gap: 32 }}>
          {/* Labels above cards */}
          <div className="flex flex-col items-center" style={{ width: 520, flexShrink: 0 }}>
            <span className="mb-4 rounded-full bg-[#EBF7F6] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0E8C88]">
              State 1 — Success
            </span>
            <StateCard state="success" onNavigate={onNavigate} />
          </div>

          <div className="flex flex-col items-center" style={{ width: 520, flexShrink: 0 }}>
            <span className="mb-4 rounded-full bg-[#FBE7E1] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E15B3F]">
              State 2 — Expired / Invalid
            </span>
            <StateCard
              state="expired"
              onNavigate={onNavigate}
              onResend={() => onNavigate("email-verify")}
            />
          </div>

          <div className="flex flex-col items-center" style={{ width: 520, flexShrink: 0 }}>
            <span className="mb-4 rounded-full bg-[#FEF3E2] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E8A33D]">
              State 3 — Already Verified
            </span>
            <StateCard state="already-verified" onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </main>
  );
}
