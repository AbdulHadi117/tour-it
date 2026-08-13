import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Check,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { updatePassword } from "../auth";

interface Rule {
  label: string;
  test: (pw: string, confirm: string) => boolean;
}

const RULES: Rule[] = [
  { label: "8+ chars", test: (pw) => pw.length >= 8 },
  { label: "Uppercase", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Number/Symbol", test: (pw) => /[0-9!@#$%^&*]/.test(pw) },
  { label: "Passwords match", test: (pw, c) => pw.length > 0 && pw === c },
];

type ModalState = "idle" | "loading" | "success";

export default function ChangePasswordModal({
  onClose,
  onSignOut,
}: {
  onClose: () => void;
  onSignOut: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<ModalState>("idle");

  const [errorMsg, setErrorMsg] = useState("");

  const allValid =
    RULES.every((r) => r.test(newPw, confirm)) && current.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setState("loading");
    setErrorMsg("");
    try {
      await updatePassword({ currentPassword: current, newPassword: newPw });
      setState("success");
      setTimeout(() => {
        onSignOut();
      }, 2000); // Sign out the user after password change
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password");
      setState("idle");
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(18,35,58,0.60)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal card */}
      <div
        className="relative w-full bg-white shadow-[0_32px_80px_rgba(18,35,58,0.22)]"
        style={{ maxWidth: 520, borderRadius: 8 }}
      >
        {/* Success banner — toggleable variant */}
        {state === "success" && (
          <div
            className="flex items-center gap-3 rounded-t-[8px] px-6 py-3.5"
            style={{ background: "#E4F3F1", borderBottom: "1px solid #A8D8D7" }}
          >
            <CheckCircle2 size={16} className="shrink-0 text-[#0E8C88]" />
            <p className="text-sm font-semibold text-[#0E8C88]">
              Password changed successfully!
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF7F6]">
              <ShieldCheck size={17} className="text-[#0E8C88]" />
            </div>
            <h2
              className="text-lg font-bold text-[#12233A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F0EDE6] hover:text-[#12233A]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form — 16px auto-layout stack */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-6 pb-6 pt-4"
          style={{ gap: 16 }}
        >
          {/* Current password */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
              Current Password
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88] transition-colors">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="shrink-0 text-[#9CA3AF] hover:text-[#12233A] transition-colors"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
              New Password
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88] transition-colors">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="shrink-0 text-[#9CA3AF] hover:text-[#12233A] transition-colors"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
              Confirm New Password
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3 focus-within:border-[#0E8C88] transition-colors">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="shrink-0 text-[#9CA3AF] hover:text-[#12233A] transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Password checklist — horizontal row */}
          <div className="flex flex-wrap gap-2">
            {RULES.map((r) => {
              const valid = r.test(newPw, confirm);
              return (
                <div
                  key={r.label}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    border: `1.5px solid ${valid ? "#0E8C88" : "#DDD6C7"}`,
                    background: valid ? "#EBF7F6" : "#FAF8F3",
                    color: valid ? "#0E8C88" : "#9CA3AF",
                  }}
                >
                  <div
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: valid ? "#0E8C88" : "transparent",
                      border: valid ? "none" : "1.5px solid #DDD6C7",
                    }}
                  >
                    {valid && (
                      <Check size={9} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  {r.label}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-[#DDD6C7]" />

          {errorMsg && (
            <p className="rounded-2xl border border-[#E15B3F]/20 bg-[#FBE7E1] px-4 py-3 text-sm text-[#E15B3F]">
              {errorMsg}
            </p>
          )}

          {/* Action buttons row */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[#DDD6C7] px-5 py-3 text-sm font-bold text-[#12233A] transition-colors hover:bg-[#F0EDE6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allValid || state === "loading" || state === "success"}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all"
              style={{
                background: "#0E8C88",
                opacity: state === "loading" ? 0.8 : !allValid ? 0.5 : 1,
              }}
            >
              {state === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Updating…
                </>
              ) : state === "success" ? (
                <>
                  <CheckCircle2 size={15} /> Updated!
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
