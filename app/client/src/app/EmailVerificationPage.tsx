import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Globe, Loader2, Mail, RefreshCw } from "lucide-react";
import type { Page } from "./App";
import { resendVerificationEmail } from "./auth";
import { useResendCooldown } from "./hooks/useResendCooldown";

const RESEND_COOLDOWN_SECONDS = 30;

export default function EmailVerificationPage({
  email,
  onNavigate,
  onEditEmail,
}: {
  email: string;
  onNavigate: (page: Page) => void;
  onEditEmail: () => void;
}) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const { isCoolingDown, formattedRemaining, startCooldown } = useResendCooldown(RESEND_COOLDOWN_SECONDS);

  const hasEmail = useMemo(() => email.trim().length > 0, [email]);

  const handleResend = async () => {
    if (!hasEmail || isCoolingDown || isResending) return;
    setIsResending(true);
    setResendSuccess(null);
    setResendError(null);

    try {
      await resendVerificationEmail(email.trim());
      setResendSuccess(`Verification email sent to ${email.trim()}.`);
      startCooldown();
    } catch (err: any) {
      setResendError(err.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex">
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-[#12233A]">
        <img
          src="https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=1440&h=1200&fit=crop&auto=format"
          alt="Tourist reading travel email while planning a trip in Pakistan"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#12233A]/85" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#FAF8F3] px-6 py-12">
        <div className="w-full max-w-[520px]">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 mb-10 group">
            <div className="w-9 h-9 rounded-lg bg-[#0E8C88] flex items-center justify-center">
              <Globe size={20} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[#12233A] font-bold tracking-tight group-hover:text-[#0E8C88] transition-colors" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}>TourIT</span>
              <span className="text-[10px] text-[#0E8C88] uppercase tracking-widest font-semibold">Tourism Discovery</span>
            </div>
          </button>

          <div className="rounded-3xl border border-[rgba(18,35,58,0.1)] bg-white p-7 shadow-[0_20px_50px_rgba(18,35,58,0.08)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EBF7F6] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0E8C88]">
              <Mail size={12} /> Email verification
            </span>

            <h1 className="mt-4 text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}>
              Verify your email address
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              We sent a verification link to:
            </p>
            <p className="mt-1 rounded-xl bg-[#F8F7F3] px-3 py-2 text-sm font-semibold text-[#12233A] break-all">
              {hasEmail ? email.trim() : "No email found. Please go back and register again."}
            </p>

            <p className="mt-4 text-sm leading-6 text-[#6B7280]">
              The link is valid for 24 hours. Open your inbox and click the link to activate your account.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={!hasEmail || isResending || isCoolingDown}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874] disabled:opacity-60"
              >
                {isResending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    {isCoolingDown ? `Resend in ${formattedRemaining}` : "Resend link"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onEditEmail}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(18,35,58,0.14)] bg-white px-5 py-3.5 text-sm font-semibold text-[#12233A] transition-colors hover:border-[#0E8C88] hover:bg-[#EBF7F6]/30"
              >
                <ArrowLeft size={16} />
                Edit email
              </button>
            </div>

            {resendSuccess && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#AADCBB] bg-[#EDF7F1] px-4 py-3 text-sm text-[#166534]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{resendSuccess}</span>
              </div>
            )}

            {resendError && (
              <p className="mt-4 rounded-2xl border border-[#E15B3F]/20 bg-[#FBE7E1] px-4 py-3 text-sm text-[#E15B3F]">
                {resendError}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
