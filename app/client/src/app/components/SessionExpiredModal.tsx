import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SessionExpiredModal({
  user,
  onReAuth,
  onSwitchUser,
  onClose,
}: {
  user: { fullName: string; email: string; avatarSeed: string };
  onReAuth: (password: string) => Promise<void>;
  onSwitchUser: () => void;
  onClose?: () => void;
}) {
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    setError(null);
    try {
      await onReAuth(password);
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(18,35,58,0.70)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
    >
      {/* Modal card — 460px, 16px auto-layout stack */}
      <div
        className="flex w-full flex-col bg-white shadow-[0_32px_80px_rgba(18,35,58,0.22)]"
        style={{ maxWidth: 460, borderRadius: 8, border: "1px solid #DDD6C7" }}
      >
        {/* Amber top accent */}
        <div className="h-1 w-full rounded-t-[8px]" style={{ background: "#E8A33D" }} />

        <div className="flex flex-col px-8 pt-8 pb-8" style={{ gap: 16 }}>

          {/* Lock icon badge */}
          <div className="flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "#E8A33D", boxShadow: "0 10px 28px rgba(232,163,61,0.38)" }}
            >
              <Lock size={28} className="text-white" strokeWidth={1.75} />
            </div>
          </div>

          {/* Title + subtitle */}
          <div className="text-center" style={{ gap: 8 }}>
            <h2
              className="text-[#12233A] font-bold"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
            >
              Session Expired
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Your session has expired due to inactivity. Please enter your password to continue where you left off without losing your saved trip changes.
            </p>
          </div>

          {/* User avatar pill */}
          <div className="flex items-center gap-3 rounded-full border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: "#0E8C88" }}
            >
              {user.avatarSeed}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#12233A] truncate">{user.fullName}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">Password</label>
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 12 }}>
              <div
                className="flex items-center gap-3 rounded-2xl border bg-[#FAF8F3] px-4 py-3.5 focus-within:border-[#0E8C88] transition-colors"
                style={{ borderColor: error ? "#E15B3F" : "#DDD6C7" }}
              >
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="shrink-0 text-[#9CA3AF] hover:text-[#12233A] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && (
                <p className="rounded-xl bg-[#FBE7E1] px-3 py-2 text-xs font-medium text-[#E15B3F]">
                  {error}
                </p>
              )}

              {/* Sign in again button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all"
                style={{ background: "#0E8C88", opacity: loading ? 0.80 : 1 }}
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                ) : "Sign In Again"}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-[#DDD6C7]" />

          {/* Switch user link */}
          <div className="text-center">
            <button
              onClick={onSwitchUser}
              className="text-sm font-semibold text-[#12233A] opacity-55 transition-opacity hover:opacity-100"
            >
              Sign in as a different user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
