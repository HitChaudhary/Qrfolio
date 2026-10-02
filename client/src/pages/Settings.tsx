import { Loader2, LogOut } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { api, getErrorMessage } from "../lib/api";
import { cardClass, dangerBtn, inputClass, primaryBtn } from "../lib/ui";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
      toast.show("Password updated");
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
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <div className={cardClass}>
        <h2 className="font-semibold">Account</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd>{user?.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="truncate">{user?.email}</dd></div>
        </dl>
      </div>

      <form onSubmit={onSubmit} className={`${cardClass} space-y-4`}>
        <h2 className="font-semibold">Change password</h2>
        <div>
          <label htmlFor="current" className="mb-1 block text-sm font-medium">Current password</label>
          <input id="current" type="password" required autoComplete="current-password" className={inputClass}
            value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <label htmlFor="next" className="mb-1 block text-sm font-medium">New password</label>
          <input id="next" type="password" required minLength={8} autoComplete="new-password" className={inputClass}
            value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium">Confirm new password</label>
          <input id="confirm" type="password" required autoComplete="new-password" className={inputClass}
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          Update password
        </button>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold">Session</h2>
        <button onClick={onLogout} className={`${dangerBtn} mt-3`}><LogOut size={16} /> Log out</button>
      </div>
    </div>
  );
}
