import { CheckCircle2, AlertTriangle, Info, ArrowLeft, Loader2 } from "lucide-react";
import type { Page } from "./App";
import { useEffect, useState } from "react";
import { verifyEmail } from "./auth";

type VerifyState = "loading" | "success" | "expired" | "already-verified" | "error";

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
    error: {
      iconBg: "#E15B3F",
      Icon: AlertTriangle,
      heading: "Verification Error",
      subtitle:
        "There was a problem verifying your email. Please try again or request a new link.",
      badge: { label: "Error", bg: "#FBE7E1", text: "#E15B3F" },
      topAccent: "#E15B3F",
    },
  };

  const c = configs[state as Exclude<VerifyState, "loading">];
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

        {state === "error" && (
          <div className="flex w-full flex-col gap-3">
             <button
              onClick={() => onNavigate("email-verify")}
              className="w-full rounded-2xl bg-[#12233A] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1a3150]"
            >
              Request New Link
            </button>
            <button
              onClick={() => onNavigate("auth")}
              className="w-full rounded-2xl border border-[rgba(18,35,58,0.2)] bg-transparent px-5 py-3.5 text-sm font-bold text-[#12233A] transition-colors hover:bg-[#FAF8F3]"
            >
              Sign In to Tour-It
            </button>
          </div>
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
  const [state, setState] = useState<VerifyState>("loading");

  useEffect(() => {
    const processVerification = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        setState("error");
        return;
      }

      try {
        await verifyEmail(token);
        setState("success");
      } catch (err: any) {
        if (err.message && err.message.toLowerCase().includes("expired")) {
          setState("expired");
        } else if (err.message && err.message.toLowerCase().includes("already")) {
          setState("already-verified");
        } else {
          setState("error");
        }
      }
    };
    
    processVerification();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF8F3] flex items-center justify-center p-8">
      {state === "loading" ? (
        <div className="flex flex-col items-center gap-4 text-[#0E8C88]">
          <Loader2 size={48} className="animate-spin" />
          <p className="text-sm font-bold tracking-widest uppercase text-[#12233A]">Verifying your email...</p>
        </div>
      ) : (
        <StateCard 
          state={state} 
          onNavigate={onNavigate} 
          onResend={() => onNavigate("email-verify")} 
        />
      )}
    </main>
  );
}
