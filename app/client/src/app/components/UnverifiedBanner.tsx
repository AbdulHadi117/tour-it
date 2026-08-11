import { useState } from "react";
import { AlertTriangle, CheckCircle2, X, Mail, Loader2 } from "lucide-react";
import { resendVerificationEmailForCurrentUser } from "../auth";
import { useResendCooldown } from "../hooks/useResendCooldown";

type BannerVariant = "unverified" | "success";

export default function UnverifiedBanner({
  email = "user@example.com",
  initialVariant = "unverified",
}: {
  email?: string;
  initialVariant?: BannerVariant;
}) {
  const [variant, setVariant]   = useState<BannerVariant>(initialVariant);
  const [dismissed, setDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isCoolingDown, formattedRemaining, startCooldown } = useResendCooldown(60);

  if (dismissed) return null;

  const isUnverified = variant === "unverified";

  const handleResend = async () => {
    if (isResending || isCoolingDown) return;
    setIsResending(true);
    setError(null);
    try {
      await resendVerificationEmailForCurrentUser();
      setVariant("success");
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full" style={{ background: isUnverified ? "#FBF0DD" : "#E4F3F1", borderBottom: `1px solid ${isUnverified ? "#E8A33D" : "#0E8C88"}` }}>
      {/* Space-between horizontal flex */}
      <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-center justify-between px-8 py-1.5 gap-4">

        {/* Left spacer (mirrors dismiss button width for true centering) */}
        <div className="w-8 shrink-0" />

        {/* Center content */}
        <div className="flex flex-1 items-center justify-center gap-3 min-w-0">
          {isUnverified ? (
            <AlertTriangle size={14} className="shrink-0 text-[#E8A33D]" />
          ) : (
            <CheckCircle2 size={14} className="shrink-0 text-[#0E8C88]" />
          )}

          <p className="text-xs font-medium text-[#12233A] truncate">
            {isUnverified ? (
              <>
                Your email{" "}
                <span className="font-bold">({email})</span>{" "}
                is unverified. Please verify your email to unlock full trip planning features.
              </>
            ) : (
              "Your email has been verified successfully! Welcome to Tour-It."
            )}
          </p>

          {isUnverified && (
            <button
              onClick={handleResend}
              disabled={isResending || isCoolingDown}
              className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold text-white transition-colors hover:bg-[#0B7874] disabled:opacity-60"
              style={{ background: "#0E8C88" }}
            >
              {isResending ? (
                <>
                  <Loader2 size={10} className="animate-spin" /> Sending...
                </>
              ) : isCoolingDown ? (
                <>
                  <Mail size={10} /> Resend in {formattedRemaining}
                </>
              ) : (
                <>
                  <Mail size={10} /> Resend link
                </>
              )}
            </button>
          )}
        </div>

        {/* Dismiss — far right */}
        <button
          onClick={() => setDismissed(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#12233A]/40 transition-colors hover:bg-black/5 hover:text-[#12233A]"
        >
          <X size={14} />
        </button>
      </div>
      {error && (
        <p className="mx-auto max-w-[1440px] px-8 pb-1 text-[10px] font-medium text-[#E15B3F]">
          {error}
        </p>
      )}
    </div>
  );
}
