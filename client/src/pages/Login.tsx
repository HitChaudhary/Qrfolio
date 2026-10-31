import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthShell, { buttonClass, inputClass } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const signedIn = await login(email, password);
      navigate(signedIn.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your QR code, live food menu, and WhatsApp links."
      footer={
        <>
          New to QrFolio?{" "}
          <Link to="/register" className="font-bold text-slate-950 hover:underline transition-colors">
            Claim your free dynamic QR ↗
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Mail size={13} className="text-slate-400" /> Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. shopowner@nilkanthcafe.in"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <Lock size={13} className="text-slate-400" /> Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs text-rose-700 font-medium">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
