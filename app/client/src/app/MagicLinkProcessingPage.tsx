import { Globe, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import type { Page } from "./App";
import { useEffect, useState } from "react";
import { otlLogin, UserProfile } from "./auth";

type ProcessState = "verifying" | "success" | "expired";

function StateCard({
  state,
  onNavigate,
}: {
  state: ProcessState;
  onNavigate: (p: Page) => void;
}) {
  const configs = {
    verifying: {
      topAccent: "#0E8C88",
      badge: null,
      label: { text: "Processing", bg: "#EBF7F6", color: "#0E8C88" },
    },
    success: {
      topAccent: "#0E8C88",
      badge: { bg: "#0E8C88", glow: "rgba(14,140,136,0.35)", Icon: CheckCircle2 },
      label: { text: "Authenticated", bg: "#EBF7F6", color: "#0E8C88" },
    },
    expired: {
      topAccent: "#E15B3F",
      badge: { bg: "#E15B3F", glow: "rgba(225,91,63,0.35)", Icon: AlertTriangle },
      label: { text: "Link Invalid", bg: "#FBE7E1", color: "#E15B3F" },
    },
  };

  const c = configs[state];

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-[20px] border border-[#DDD6C7] bg-white shadow-[0_16px_48px_rgba(18,35,58,0.10)]"
      style={{ width: 520, minWidth: 340, flexShrink: 0 }}
    >
      {/* Top accent */}
      <div className="h-1 w-full" style={{ background: c.topAccent }} />

      <div className="flex flex-col items-center px-10 pt-8 pb-10 gap-6">
        {/* Status badge */}
        <span
          className="self-end rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: c.label.bg, color: c.label.color }}
        >
          {c.label.text}
        </span>

        {/* Icon / spinner */}
        {state === "verifying" ? (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "#EBF7F6", border: "3px solid #0E8C88" }}
          >
            <Loader2 size={36} className="animate-spin text-[#0E8C88]" strokeWidth={2} />
          </div>
        ) : (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: c.badge ? c.badge.bg : "#0E8C88",
              boxShadow: `0 12px 32px ${c.badge ? c.badge.glow : "transparent"}`,
            }}
          >
            {c.badge && <c.badge.Icon size={36} className="text-white" strokeWidth={1.75} />}
          </div>
        )}

        {/* Text */}
        <div className="text-center space-y-2">
          {state === "verifying" && (
            <>
              <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                Verifying Sign-In Link...
              </h2>
              <p className="text-[#6B7280] text-sm leading-6 max-w-[360px]">
                Please wait a moment while we log you into Tour-It safely.
              </p>
              {/* Animated progress bar */}
              <div className="mt-3 h-1 w-48 mx-auto rounded-full bg-[#DDD6C7] overflow-hidden">
                <div className="h-full rounded-full bg-[#0E8C88]" style={{ animation: "progressBar 2s ease-in-out infinite" }} />
              </div>
            </>
          )}

          {state === "success" && (
            <>
              <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                Signed In Successfully!
              </h2>
              <p className="text-[#6B7280] text-sm leading-6 max-w-[360px]">
                You are being redirected to your dashboard...
              </p>
            </>
          )}

          {state === "expired" && (
            <>
              <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                Magic Link Expired or Invalid
              </h2>
              <p className="text-[#6B7280] text-sm leading-6 max-w-[360px]">
                This sign-in link has already been used or has expired. Magic links are valid for 15 minutes and can only be used once.
              </p>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#DDD6C7]" />

        {/* Actions */}
        {state === "verifying" && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/30">
            Securing your session — just a moment
          </p>
        )}

        {state === "success" && (
          <button
            onClick={() => onNavigate("profile")}
            className="w-full rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
          >
            Continue to Dashboard
          </button>
        )}

        {state === "expired" && (
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={() => onNavigate("magic-link")}
              className="w-full rounded-2xl bg-[#12233A] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1a3150]"
            >
              Request New Magic Link
            </button>
            <button
              onClick={() => onNavigate("auth")}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#12233A]"
            >
              <ArrowLeft size={13} /> Return to Sign In
            </button>
          </div>
        )}

        <p className="text-[10px] text-[#6B7280]/50 uppercase tracking-widest font-semibold">
          Tour-It · Pakistan Travel Discovery
        </p>
      </div>
    </article>
  );
}

export default function MagicLinkProcessingPage({ 
  onNavigate,
  onAuthSuccess 
}: { 
  onNavigate: (p: Page) => void,
  onAuthSuccess: (user: UserProfile) => void 
}) {
  const [activeState, setActiveState] = useState<ProcessState>("verifying");

  useEffect(() => {
    const processMagicLink = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        setActiveState("expired");
        return;
      }

      try {
        const user = await otlLogin(token);
        onAuthSuccess(user);
        setActiveState("success");
      } catch (err: any) {
        setActiveState("expired");
      }
    };
    
    processMagicLink();
  }, [onAuthSuccess]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF8F3] flex items-center justify-center p-8">
      {activeState === "verifying" ? (
        <div className="flex flex-col items-center gap-4 text-[#0E8C88]">
          <Loader2 size={48} className="animate-spin" />
          <p className="text-sm font-bold tracking-widest uppercase text-[#12233A]">Verifying your session...</p>
        </div>
      ) : (
        <StateCard 
          state={activeState} 
          onNavigate={onNavigate} 
        />
      )}
    </main>
  );
}
