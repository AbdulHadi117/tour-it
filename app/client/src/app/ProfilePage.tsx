import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Globe,
  LogOut,
  MapPin,
  Save,
  ShieldCheck,
  Star,
  UserRound,
  KeyRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import type { Page } from "./App";
import type { UserProfile } from "./auth";
import { deriveAvatarSeed } from "./auth";
import ChangePasswordModal from "./components/ChangePasswordModal";
import EmailSettingsCard from "./components/EmailSettingsCard";
import UnverifiedBanner from "./components/UnverifiedBanner";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(18,35,58,0.08)] bg-white p-6 shadow-[0_16px_40px_rgba(18,35,58,0.05)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3
          className="text-lg font-bold text-[#12233A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export default function ProfilePage({
  user,
  onNavigate,
  onUpdateUser,
  onSignOut,
}: {
  user: UserProfile;
  onNavigate: (page: Page) => void;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut: () => void;
}) {
  const [draft, setDraft] = useState(user);
  const [saved, setSaved] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const initials = useMemo(
    () => draft.avatarSeed || deriveAvatarSeed(draft.fullName),
    [draft.avatarSeed, draft.fullName],
  );

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      const updatedUser = await onUpdateUser({
        ...draft,
        avatarSeed: deriveAvatarSeed(draft.fullName),
        languages: draft.languages.filter(Boolean),
      });
      setDraft(updatedUser);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Unverified account banner — sits directly below nav */}
      {!user.emailVerifiedAt && <UnverifiedBanner email={user.email} />}

      {/* Modals */}
      {showChangePw && (
        <ChangePasswordModal
          onClose={() => setShowChangePw(false)}
          onSignOut={onSignOut}
        />
      )}

      <main className="bg-[#FAF8F3] min-h-[calc(100vh-80px)] pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 lg:py-12 space-y-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
            <button
              onClick={() => onNavigate("home")}
              className="hover:text-[#0E8C88] transition-colors"
            >
              Home
            </button>
            <span>·</span>
            <span className="text-[#12233A] font-semibold">Profile</span>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-[rgba(18,35,58,0.08)] bg-[#12233A] text-white shadow-[0_24px_60px_rgba(18,35,58,0.16)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 lg:p-10 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-18 w-18 border-4 border-white/10 bg-white/10">
                      <AvatarFallback className="bg-[#0E8C88] text-xl font-black text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/55">
                        Account profile
                      </p>
                      <h1
                        className="mt-2 text-3xl lg:text-4xl font-black"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {draft.fullName}
                      </h1>
                      <p className="mt-1 text-sm text-white/70 flex items-center gap-2">
                        <MapPin size={14} className="text-[#E8A33D]" />
                        {draft.location}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-2xl text-sm lg:text-base leading-7 text-white/75">
                    Keep your travel identity, account details, and notification
                    preferences in one place. Changes here sync with your saved
                    profile on this device.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Member since", value: draft.memberSince },
                      {
                        label: "Languages",
                        value:
                          draft.languages.length > 0
                            ? draft.languages.join(" / ")
                            : "None specified",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm"
                      >
                        <p className="text-xs uppercase tracking-widest text-white/45">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-bold text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {[
                    {
                      icon: <ShieldCheck size={16} />,
                      label: "Profile synced",
                      value: "On",
                    },
                    {
                      icon: <Bell size={16} />,
                      label: "Safety alerts",
                      value: draft.safetyAlerts ? "Enabled" : "Off",
                    },
                    {
                      icon: <Bookmark size={16} />,
                      label: "Newsletter",
                      value: draft.newsletter ? "Subscribed" : "Off",
                    },
                    {
                      icon: <Star size={16} />,
                      label: "Travel style",
                      value: draft.travelStyle,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4"
                    >
                      <div className="flex items-center gap-2 text-white/70">
                        {item.icon}
                        <span className="text-xs uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate("planner")}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0E8C88] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0B7874]"
                >
                  Open trip planner
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
            <SectionCard title="Edit profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                    Full name
                  </span>
                  <input
                    value={draft.fullName}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        fullName: event.target.value,
                        avatarSeed: deriveAvatarSeed(event.target.value),
                      })
                    }
                    className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                    Email
                  </span>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3">
                    <span className="text-sm text-[#12233A]">
                      {draft.email}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                      Manage below
                    </span>
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                    Phone
                  </span>
                  <input
                    value={draft.phone}
                    onChange={(event) =>
                      setDraft({ ...draft, phone: event.target.value })
                    }
                    className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                    Home base
                  </span>
                  <input
                    value={draft.location}
                    onChange={(event) =>
                      setDraft({ ...draft, location: event.target.value })
                    }
                    className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                    Bio
                  </span>
                  <textarea
                    value={draft.bio}
                    onChange={(event) =>
                      setDraft({ ...draft, bio: event.target.value })
                    }
                    rows={4}
                    className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                  />
                </label>
              </div>
            </SectionCard>

            <div className="space-y-8">
              <SectionCard title="Preferences">
                <div className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                      Travel style
                    </span>
                    <select
                      value={draft.travelStyle}
                      onChange={(event) =>
                        setDraft({ ...draft, travelStyle: event.target.value })
                      }
                      className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                    >
                      <option>Balanced explorer</option>
                      <option>Budget traveler</option>
                      <option>Adventure seeker</option>
                      <option>Family planner</option>
                      <option>Cultural explorer</option>
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#12233A]">
                      Languages
                    </span>
                    <input
                      value={draft.languages.join(", ")}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          languages: event.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full rounded-2xl border border-[rgba(18,35,58,0.12)] bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-[#12233A]">
                        Newsletter
                      </span>
                      <span className="block text-xs text-[#6B7280]">
                        Product updates and destination drops.
                      </span>
                    </span>
                    <input
                      checked={draft.newsletter}
                      onChange={(event) =>
                        setDraft({ ...draft, newsletter: event.target.checked })
                      }
                      type="checkbox"
                      className="h-4 w-4 rounded border-[rgba(18,35,58,0.2)] text-[#0E8C88] focus:ring-[#0E8C88]"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(18,35,58,0.12)] px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-[#12233A]">
                        Safety alerts
                      </span>
                      <span className="block text-xs text-[#6B7280]">
                        Road conditions and trip interruption notices.
                      </span>
                    </span>
                    <input
                      checked={draft.safetyAlerts}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          safetyAlerts: event.target.checked,
                        })
                      }
                      type="checkbox"
                      className="h-4 w-4 rounded border-[rgba(18,35,58,0.2)] text-[#0E8C88] focus:ring-[#0E8C88]"
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Account security">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#FAF8F3] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#12233A]">
                      <UserRound size={15} className="text-[#0E8C88]" />{" "}
                      {draft.email}
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Primary login email
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAF8F3] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#12233A]">
                      <Globe size={15} className="text-[#0E8C88]" />{" "}
                      {draft.memberSince}
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">Member since</p>
                  </div>

                  {/* Change password trigger */}
                  <button
                    onClick={() => setShowChangePw(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DDD6C7] bg-white px-5 py-3 text-sm font-bold text-[#12233A] transition-colors hover:border-[#0E8C88] hover:text-[#0E8C88]"
                  >
                    <KeyRound size={15} /> Change Password
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#12233A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0E8C88] disabled:opacity-50"
                    >
                      <Save size={16} />{" "}
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      onClick={onSignOut}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[rgba(225,91,63,0.2)] bg-[#FBE7E1] px-5 py-3 text-sm font-bold text-[#E15B3F] transition-colors hover:bg-[#f8d9d0]"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                  {saveError && (
                    <p className="rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {saveError}
                    </p>
                  )}
                  {saved && (
                    <p className="rounded-2xl border border-[#0E8C88]/20 bg-[#EBF7F6] px-4 py-3 text-sm font-medium text-[#0E8C88]">
                      Profile updated successfully.
                    </p>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Email Settings & Verification card */}
          <section>
            <h3
              className="mb-4 text-lg font-bold text-[#12233A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Email Settings &amp; Verification
            </h3>
            <EmailSettingsCard currentEmail={draft.email} />
          </section>
        </div>
      </main>
    </>
  );
}
