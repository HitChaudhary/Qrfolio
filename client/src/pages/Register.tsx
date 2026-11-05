import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, MapPin, Phone, Store, User } from "lucide-react";
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
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
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
      await register(name, email, password, phone, location);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Claim your Smart QR"
      subtitle="One stand on your counter, your entire business on their phone. Live in 2 minutes."
      footer={
        <>
          Already have a QrFolio stand?{" "}
          <Link to="/login" className="font-bold text-slate-950 hover:underline transition-colors">
            Sign in here
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Store size={13} className="text-slate-400" /> Business or Shop Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Nilkanth Cafe or Elena Salon"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Mail size={13} className="text-slate-400" /> Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. contact@nilkanthcafe.in"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Lock size={13} className="text-slate-400" /> Password
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
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <CheckCircle2 size={12} className={password.length >= 8 ? "text-emerald-600" : "text-slate-400"} />
            <span>Must contain at least 8 characters</span>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Phone size={13} className="text-slate-400" /> Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <MapPin size={13} className="text-slate-400" /> Business Location / Address
          </label>
          <input
            id="location"
            type="text"
            autoComplete="street-address"
            placeholder="e.g. Shop 4, Market Road, Mumbai"
            className={inputClass}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
              <Loader2 size={16} className="animate-spin" /> Setting up your studio...
            </>
          ) : (
            <>
              Claim Free QR Stand ↗
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
