import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react";

type CardVariant = "verified" | "coming-soon";

export default function EmailSettingsCard({
  currentEmail,
}: {
  currentEmail: string;
}) {
  const [variant, setVariant] = useState<CardVariant>("verified");
  const [newEmail, setNewEmail] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = newEmail.includes("@") && newEmail.includes(".");
    if (!ok) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setVariant("coming-soon");
  };

  const handleDismiss = () => {
    setNewEmail("");
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
          <h3
            className="text-base font-bold text-[#12233A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Email Address
          </h3>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            Manage your primary account email address.
          </p>
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
            <span className="truncate text-sm font-semibold text-[#12233A]">
              {currentEmail}
            </span>
          </div>
          <span
            className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "#EBF7F6", color: "#0E8C88" }}
          >
            <CheckCircle2 size={10} strokeWidth={3} /> Verified
          </span>
        </div>

        {/* Coming soon banner — real endpoint not built yet, see TODO(auth): /auth/change-email */}
        {variant === "coming-soon" && (
          <div
            className="flex items-start justify-between gap-3 rounded-2xl px-4 py-3.5"
            style={{ background: "#FBF0DD", border: "1px solid #E8A33D33" }}
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 text-[#E8A33D]"
              />
              <p className="text-xs leading-5 text-[#12233A]">
                Changing your email isn't available yet — this feature is still
                being built. Nothing was sent or saved.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 text-[#6B7280] hover:text-[#E15B3F] transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Change email form */}
        {variant !== "coming-soon" && (
          <form
            onSubmit={handleUpdate}
            className="flex flex-col"
            style={{ gap: 8 }}
          >
            <label className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
              New Email Address
            </label>
            <div className="flex gap-3">
              <div
                className="flex flex-1 items-center gap-3 rounded-2xl bg-[#FAF8F3] px-4 py-3 transition-colors"
                style={{
                  border: inputError
                    ? "1.5px solid #E15B3F"
                    : "1.5px solid #DDD6C7",
                }}
              >
                <Mail
                  size={14}
                  className="shrink-0"
                  style={{ color: inputError ? "#E15B3F" : "#0E8C88" }}
                />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    if (inputError) setInputError(false);
                  }}
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
      </div>
    </div>
  );
}
