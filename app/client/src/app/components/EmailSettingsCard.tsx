import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

type CardVariant = "verified" | "pending" | "error";

export default function EmailSettingsCard({ currentEmail }: { currentEmail: string }) {
  const [variant, setVariant]     = useState<CardVariant>("verified");
  const [newEmail, setNewEmail]   = useState("");
  const [pendingTo, setPendingTo] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = newEmail.includes("@") && newEmail.includes(".");
    if (!ok) { setInputError(true); return; }
    setPendingTo(newEmail);
    setNewEmail("");
    setInputError(false);
    setVariant("pending");
  };

  const handleCancel = () => {
    setPendingTo("");
    setVariant("verified");
  };

  return (
    <div
      className="w-full rounded-[16px] border border-[#DDD6C7] bg-white shadow-[0_4px_20px_rgba(18,35,58,0.06)]"
      style={{ maxWidth: 680 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#DDD6C7] px-6 py-5">
        <div>
          <h3 className="text-base font-bold text-[#12233A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Email Address
          </h3>
          <p className="mt-0.5 text-xs text-[#6B7280]">Manage your primary account email address.</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7F6]">
          <Mail size={16} className="text-[#0E8C88]" />
        </div>
      </div>

      <div className="flex flex-col px-6 py-5" style={{ gap: 16 }}>

        {/* Current email row — Default Verified variant */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#DDD6C7] bg-[#FAF8F3] px-4 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Mail size={14} className="shrink-0 text-[#0E8C88]" />
            <span className="truncate text-sm font-semibold text-[#12233A]">{currentEmail}</span>
          </div>
          <span
            className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "#EBF7F6", color: "#0E8C88" }}
          >
            <CheckCircle2 size={10} strokeWidth={3} /> Verified
          </span>
        </div>

        {/* Pending verification banner — Pending variant */}
        {variant === "pending" && (
          <div
            className="flex flex-col rounded-2xl px-4 py-4"
            style={{ background: "#FBF0DD", border: "1px solid #E8A33D33" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#E8A33D]" />
                <p className="text-xs leading-5 text-[#12233A]">
                  Verification email sent to{" "}
                  <span className="font-bold">{pendingTo}</span>. Please verify to finalize the change.
                </p>
              </div>
              <button onClick={handleCancel} className="shrink-0 text-[#6B7280] hover:text-[#E15B3F] transition-colors">
                <X size={13} />
              </button>
            </div>

            {/* Inline badges & actions row */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: "#E8A33D22", color: "#E8A33D", border: "1px solid #E8A33D44" }}
              >
                <AlertTriangle size={9} strokeWidth={3} /> Pending Verification
              </span>
              <button className="text-xs font-semibold text-[#0E8C88] hover:underline transition-colors">
                Resend Verification Email
              </button>
              <span className="text-[#DDD6C7] text-xs">·</span>
              <button onClick={handleCancel} className="text-xs font-semibold text-[#E15B3F] hover:underline transition-colors">
                Cancel Email Change
              </button>
            </div>
          </div>
        )}

        {/* Error / expired token banner */}
        {variant === "error" && (
          <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5" style={{ background: "#FBE7E1", border: "1px solid #E15B3F33" }}>
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#E15B3F]" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#E15B3F]">Verification link expired.</p>
              <p className="text-xs text-[#E15B3F]/75">Click resend to try again.</p>
            </div>
            <button className="text-xs font-bold text-[#0E8C88] hover:underline shrink-0">Resend</button>
            <button onClick={() => setVariant("verified")} className="shrink-0 text-[#E15B3F]/50 hover:text-[#E15B3F]">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Change email form */}
        {variant !== "pending" && (
          <form onSubmit={handleUpdate} className="flex flex-col" style={{ gap: 8 }}>
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">New Email Address</label>
            <div className="flex gap-3">
              <div
                className="flex flex-1 items-center gap-3 rounded-2xl bg-[#FAF8F3] px-4 py-3 transition-colors"
                style={{ border: inputError ? "1.5px solid #E15B3F" : "1.5px solid #DDD6C7" }}
              >
                <Mail size={14} className="shrink-0" style={{ color: inputError ? "#E15B3F" : "#0E8C88" }} />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => { setNewEmail(e.target.value); if (inputError) setInputError(false); }}
                  placeholder="new.email@example.com"
                  className="w-full bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-2xl bg-[#12233A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0E8C88]"
              >
                Update Email
              </button>
            </div>
            {inputError && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#E15B3F]">
                <AlertCircle size={11} /> Please enter a valid email address.
              </p>
            )}
          </form>
        )}

        {/* Demo toggles */}
        <div className="flex gap-2 border-t border-[#DDD6C7] pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#12233A]/30 mr-1">Preview:</span>
          {(["verified", "pending", "error"] as CardVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className="rounded-full px-3 py-1 text-[10px] font-bold capitalize transition-colors"
              style={
                variant === v
                  ? { background: "#12233A", color: "#fff" }
                  : { background: "#F0EDE6", color: "#6B7280" }
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
