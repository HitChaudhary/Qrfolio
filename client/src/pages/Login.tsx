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
      subtitle="Log in to manage your QrFolio page and track live scans."
      footer={
        <>
          New to QrFolio?{" "}
          <Link to="/register" className="font-bold text-[#467359] hover:text-[#284737] underline transition-colors">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#467359]">
            <Mail size={13} /> Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#467359]">
              <Lock size={13} /> Password
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
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
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
              Sign In <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
