import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { brandBtn } from "../lib/ui";

export default function AccessDenied() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
        <ShieldAlert size={32} />
      </div>
      <h1 className="mt-5 text-2xl font-black text-slate-950 font-display">Access Denied</h1>
      <p className="mt-2 max-w-sm text-xs sm:text-sm text-slate-500">
        You don't have superadmin permissions to access the Platform Operations Cockpit.
      </p>
      <Link to="/dashboard" className={`${brandBtn} mt-6 text-xs`}>
        <ArrowLeft size={14} /> Back to Merchant Studio
      </Link>
    </main>
  );
}
