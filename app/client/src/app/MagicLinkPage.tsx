import { useState } from "react";
import { Globe, Mail, Loader2, CheckCircle2, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import type { Page } from "./App";
import { requestOtl } from "./auth";

type SendState = "idle" | "loading" | "sent";

export default function MagicLinkPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");

  const [sendError, setSendError] = useState("");

  const validate = (val: string) => {
    const ok = val.includes("@") && val.includes(".");
    setEmailError(!ok);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) return;
    setSendState("loading");
    setSendError("");
    try {
      await requestOtl(email);
      setSendState("sent");
    } catch (err: any) {
      setSendError(err.message || "Failed to send magic link");
      setSendState("idle");
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex">

      {/* ── Left Panel ────────────────────────────────────── */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-[#12233A]">
        <img
          src="https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=1440&h=1200&fit=crop&auto=format"
          alt="Hunza Valley with apricot orchards, Rakaposhi peak in the background, Northern Pakistan"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(18,35,58,0.85)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative h-full flex flex-col justify-between p-12 xl:p-16">
          <div />

          <div className="max-w-md">
            {/* Magic link card */}
            <div
              className="rounded-3xl border border-white/20 px-8 py-7 mb-8"
              style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E8C88]">
                  <Sparkles size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold leading-snug mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}>
                    Sign in instantly — no password needed.
                  </p>
                  <p className="text-white/70 text-sm leading-6">
                    We'll send a secure, one-time sign-in link directly to your inbox. Click it and you're in — no password to remember, ever.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {["Enter email", "Check inbox", "Click link"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E8C88] text-[10px] font-black text-white">{i + 1}</div>
                    <span className="text-[11px] font-semibold text-white/80">{step}</span>
                    {i < 2 && <div className="h-px w-5 bg-white/25" />}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700 }}>
              Explore Pakistan — no friction, no password.
            </h2>
            <p className="text-white/55 text-sm leading-7">
              From Hunza Valley to Fairy Meadows, your next adventure is one click away.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[{ v: "Instant", l: "One-click sign-in" }, { v: "15 min", l: "Link validity" }, { v: "Zero", l: "Passwords stored" }].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <p className="text-lg font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{s.v}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#FAF8F3] px-6 py-12">
        <div className="w-full" style={{ maxWidth: 480 }}>

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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F6] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0E8C88] mb-3">
              <Sparkles size={10} /> Passwordless
            </span>
            <h1 className="text-[#12233A] leading-tight mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}>
              Passwordless Sign In
            </h1>
            <p className="text-[#6B7280] text-sm leading-6">
              Enter your email address and we'll send you an instant sign-in link — no password required.
            </p>
          </div>

          {/* Form — 20px auto-layout stack */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col" style={{ gap: 20 }}>

            {/* Email input */}
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label className="text-xs font-bold text-[#12233A] uppercase tracking-widest">Email Address</label>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 bg-white transition-colors"
                style={{ border: emailError ? "1.5px solid #E15B3F" : "1.5px solid #DDD6C7" }}
              >
                <Mail size={15} className="shrink-0" style={{ color: emailError ? "#E15B3F" : "#0E8C88" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                  onBlur={() => email && validate(email)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                />
              </div>
              {emailError && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#E15B3F]">
                  <AlertCircle size={11} /> Please enter a valid email address.
                </p>
              )}
            </div>

            {/* CTA button */}
            <button
              type="submit"
              disabled={sendState === "loading" || sendState === "sent"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all"
              style={{ background: "#0E8C88", opacity: sendState === "loading" ? 0.80 : 1 }}
            >
              {sendState === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /> Sending…</>
              ) : sendState === "sent" ? (
                <><CheckCircle2 size={16} /> Link Sent!</>
              ) : (
                <><Mail size={15} /> Email Me a Sign-In Link</>
              )}
            </button>

            {sendError && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#E15B3F]">
                <AlertCircle size={11} /> {sendError}
              </p>
            )}

            {/* Success toast — collapsible */}
            {sendState === "sent" && (
              <div
                className="flex items-start gap-3 rounded-2xl px-5 py-4 border"
                style={{ background: "#EBF7F6", borderColor: "#A8D8D7", animation: "fadeSlideIn 0.25s ease" }}
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0E8C88]" />
                <div>
                  <p className="text-sm font-bold text-[#0E8C88]">Magic link sent!</p>
                  <p className="mt-0.5 text-xs leading-5 text-[#0E8C88]/75">
                    Check your inbox to sign in instantly. The link expires in 15 minutes.
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-[#DDD6C7]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/30">or</span>
              <div className="flex-1 border-t border-[#DDD6C7]" />
            </div>

            {/* Fallback */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate("auth")}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#12233A] opacity-60 hover:opacity-100 transition-opacity"
              >
                <ArrowLeft size={13} /> Return to Password Sign In
              </button>
            </div>
          </form>

          {/* Trust row */}
          <div className="mt-10 flex items-center justify-center gap-5 flex-wrap">
            {["No password stored", "One-time use link", "15-minute expiry"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0E8C88]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/35">{item}</span>
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
