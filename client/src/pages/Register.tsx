import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthShell, { buttonClass, inputClass } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Launch your dynamic QrFolio page in less than 2 minutes."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-bold text-[#467359] hover:text-[#284737] underline transition-colors">
            Sign in here
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#467359]">
            <User size={13} /> Full Name or Business Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Elena Vance"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#467359]">
            <Mail size={13} /> Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="elena@studio.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#467359]">
            <Lock size={13} /> Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#70a087]">
            <CheckCircle2 size={12} className={password.length >= 8 ? "text-[#69bd92]" : "text-[#a5afa9]"} />
            <span>Must contain at least 8 characters</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating your QrFolio...
            </>
          ) : (
            <>
              Get Started Free <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
