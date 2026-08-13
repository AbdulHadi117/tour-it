import { Lock, AlertTriangle } from "lucide-react";

export default function SessionExpiredModal({
  user,
  onSignInAgain,
}: {
  user: { fullName: string; email: string; avatarSeed: string };
  onSignInAgain: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(18,35,58,0.70)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
    >
      <div
        className="flex w-full flex-col bg-white shadow-[0_32px_80px_rgba(18,35,58,0.22)]"
        style={{ maxWidth: 460, borderRadius: 8, border: "1px solid #DDD6C7" }}
      >
        <div className="h-1 w-full rounded-t-[8px]" style={{ background: "#E8A33D" }} />

        <div className="flex flex-col px-8 pt-8 pb-8" style={{ gap: 16 }}>
          <div className="flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "#E8A33D", boxShadow: "0 10px 28px rgba(232,163,61,0.38)" }}
            >
              <Lock size={28} className="text-white" strokeWidth={1.75} />
            </div>
          </div>

          <div className="text-center" style={{ gap: 8 }}>
            <h2
              className="text-[#12233A] font-bold"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
            >
              Session Expired
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Your session has expired. Please sign in again to continue.
            </p>
          </div>

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

          {/* TODO(auth): build seamless in-place re-auth so the user resumes without losing state */}
          <div
            className="flex items-start gap-2.5 rounded-2xl px-4 py-3.5"
            style={{ background: "#FBF0DD", border: "1px solid #E8A33D33" }}
          >
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#E8A33D]" />
            <p className="text-xs leading-5 text-[#12233A]">
              Resuming right where you left off isn't built yet — you'll need to sign in again from the start.
            </p>
          </div>

          <button
            onClick={onSignInAgain}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all"
            style={{ background: "#0E8C88" }}
          >
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
}