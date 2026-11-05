import { Loader2, Lock, LogOut, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { api, getErrorMessage } from "../lib/api";
import { cardClass, dangerBtn, inputClass, primaryBtn } from "../lib/ui";

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileLocation, setProfileLocation] = useState(user?.location || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
      setProfileLocation(user.location || "");
    }
  }, [user]);

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        location: profileLocation,
      });
      toast.show("Profile updated successfully");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (next.length < 8) return setError("New password must be at least 8 characters");
    if (next !== confirm) return setError("New passwords do not match");
    setSaving(true);
    try {
      await api.put("/auth/password", { currentPassword: current, newPassword: next });
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.show("Password updated successfully");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          Account & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your login credentials, role access, and merchant sessions.
        </p>
      </div>

      <form onSubmit={onSaveProfile} className={`${cardClass} space-y-4`}>
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
          <User size={18} className="text-slate-900" />
          <h2 className="font-display font-black text-slate-950 text-base">Account Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profileName" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Your Name / Business Name
            </label>
            <input
              id="profileName"
              type="text"
              required
              className={inputClass}
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="profileEmail" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              id="profileEmail"
              type="email"
              disabled
              className={`${inputClass} bg-slate-100/70 text-slate-500 cursor-not-allowed`}
              value={user?.email || ""}
            />
          </div>
          <div>
            <label htmlFor="profilePhone" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <Phone size={13} className="text-slate-400" /> Phone Number
            </label>
            <input
              id="profilePhone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              className={inputClass}
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="profileLocation" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <MapPin size={13} className="text-slate-400" /> Business Location / Address
            </label>
            <input
              id="profileLocation"
              type="text"
              placeholder="e.g. Shop 4, Market Road, Mumbai"
              className={inputClass}
              value={profileLocation}
              onChange={(e) => setProfileLocation(e.target.value)}
            />
          </div>
        </div>
        {profileError && <p role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">{profileError}</p>}
        <div className="pt-2">
          <button type="submit" disabled={savingProfile} className={primaryBtn}>
            {savingProfile && <Loader2 size={15} className="animate-spin mr-1" />}
            Save Changes
          </button>
        </div>
      </form>

      <form onSubmit={onSubmit} className={`${cardClass} space-y-4`}>
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
          <Lock size={18} className="text-slate-900" />
          <h2 className="font-display font-black text-slate-950 text-base">Change Password</h2>
        </div>
        <div>
          <label htmlFor="current" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Current Password
          </label>
          <input
            id="current"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="next" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              New Password
            </label>
            <input
              id="next"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Min 8 characters"
              className={inputClass}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Confirm New Password
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repeat new password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        {error && <p role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">{error}</p>}
        <div className="pt-2">
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={15} className="animate-spin mr-1" />}
            Update Password
          </button>
        </div>
      </form>

      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-slate-950 text-base">Active Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">Log out of your QrFolio account on this device.</p>
          </div>
          <button onClick={onLogout} className={dangerBtn}>
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
