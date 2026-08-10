import { useState } from "react";
import { Globe, Mail, Loader2, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import type { Page } from "./App";
import { requestPasswordReset } from "./auth";

type ButtonState = "default" | "loading" | "done";

export default function ForgotPasswordPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [btnState, setBtnState] = useState<ButtonState>("default");
  const [showSuccess, setShowSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const validate = (val: string) => {
    const ok = val.includes("@") && val.includes(".");
    setEmailError(!ok);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) return;
    setBtnState("loading");
    setShowSuccess(false);
    setErrorMsg("");
    try {
      await requestPasswordReset(email);
      setBtnState("done");
      setShowSuccess(true);
    } catch (err: any) {
      setBtnState("default");
      setErrorMsg(err.message || "Failed to send reset link");
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex">

      {/* ── Left Panel ────────────────────────────────────── */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-[#12233A]">
        <img
          src="https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=1440&h=1200&fit=crop&auto=format"
          alt="Karakoram Highway winding through dramatic mountain valleys in Northern Pakistan"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Dark navy gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,35,58,0.30) 0%, rgba(18,35,58,0.55) 55%, rgba(18,35,58,0.88) 100%)",
          }}
        />
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Glassmorphism recovery card at bottom */}
        <div className="relative h-full flex flex-col justify-end p-12 xl:p-16 pb-14">
          <div
            className="rounded-3xl border border-white/20 px-8 py-7"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E8C88]">
                <AlertCircle size={18} className="text-white" />
              </div>
              <div>
                <p
                  className="text-white font-bold leading-snug mb-1.5"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}
                >
                  Don't worry — we've got you covered.
                </p>
                <p className="text-white/70 text-sm leading-6">
                  We'll help you recover your password securely in a few easy steps. Your travel plans and saved itineraries remain exactly where you left them.
                </p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="mt-6 flex items-center gap-2">
              {["Enter email", "Check inbox", "Reset password"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E8C88] text-[10px] font-black text-white">
                      {i + 1}
                    </div>
                    <span className="text-[11px] font-semibold text-white/80">{step}</span>
                  </div>
                  {i < 2 && (
                    <div className="h-px w-6 bg-white/25" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat strip */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { v: "< 2 min", l: "Recovery time" },
              { v: "256-bit", l: "Encrypted link" },
              { v: "24 hrs", l: "Link validity" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <p className="text-base font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.v}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#FAF8F3] px-6 py-12">
        <div className="w-full" style={{ maxWidth: 480 }}>

          {/* Brand logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 mb-10 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0E8C88] flex items-center justify-center">
              <Globe size={20} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span
                className="text-[#12233A] font-bold tracking-tight group-hover:text-[#0E8C88] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}
              >
                TourIT
              </span>
              <span className="text-[10px] text-[#0E8C88] uppercase tracking-widest font-semibold">
                Tourism Discovery
              </span>
            </div>
          </button>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0E8C88] mb-2">
              Account Recovery
            </p>
            <h1
              className="text-[#12233A] leading-tight mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              Reset Your Password
            </h1>
            <p className="text-[#6B7280] text-sm leading-6">
              Enter the email associated with your account and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form — 16px vertical gap auto-layout */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col" style={{ gap: 16 }}>

            {/* Email input — floating label style */}
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label className="text-xs font-bold text-[#12233A] uppercase tracking-widest">
                Email Address
              </label>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors"
                style={{
                  border: emailError
                    ? "1.5px solid #E15B3F"
                    : "1.5px solid #DDD6C7",
                  background: "#ffffff",
                }}
              >
                <Mail
                  size={16}
                  className="shrink-0"
                  style={{ color: emailError ? "#E15B3F" : "#0E8C88" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  onBlur={() => email && validate(email)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                />
              </div>
              {/* Inline error helper */}
              {emailError && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#E15B3F]">
                  <AlertCircle size={12} />
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* CTA button — default / loading variant */}
            <button
              type="submit"
              disabled={btnState === "loading" || btnState === "done"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all"
              style={{
                background: "#0E8C88",
                opacity: btnState === "loading" ? 0.80 : 1,
              }}
            >
              {btnState === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : btnState === "done" ? (
                <>
                  <CheckCircle2 size={16} />
                  Link Sent
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {errorMsg && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#E15B3F]">
                <AlertCircle size={12} />
                {errorMsg}
              </p>
            )}

            {/* Success card — collapsible, appears after submit */}
            {showSuccess && (
              <div
                className="flex items-start gap-3 rounded-2xl border border-[#AADCBB] bg-[#EDF7F1] px-4 py-4"
                style={{ animation: "fadeSlideIn 0.25s ease" }}
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#22A75E]" />
                <div>
                  <p className="text-sm font-semibold text-[#166534]">
                    Reset link sent!
                  </p>
                  <p className="mt-0.5 text-xs text-[#166534]/75 leading-5">
                    Please check your inbox. If you don't see the email, check your spam folder. The link expires in 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Back to Sign In */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate("auth")}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#12233A] opacity-60 transition-opacity hover:opacity-100"
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center justify-center gap-6">
            {[
              "Secure 256-bit encryption",
              "Link valid for 24 hours",
              "No account sharing",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0E8C88]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/40">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
