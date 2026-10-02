import { CheckCircle2, Loader2, QrCode, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

type Status = "loading" | "ok" | "error";

export default function Home() {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Checking API...");

  useEffect(() => {
    api
      .get<{ success: boolean; message: string }>("/health")
      .then((res) => {
        setStatus("ok");
        setMessage(res.data.message);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Cannot reach the API. Is the server running on port 5000?");
      });
  }, []);

  const btn = "rounded-lg px-4 py-2 text-sm font-medium";

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 p-2 text-white">
            <QrCode size={22} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">LinkQR</h1>
        </div>
        <p className="mt-4 text-slate-600">One QR. Everything your business offers.</p>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          {status === "loading" && <Loader2 size={18} className="animate-spin text-slate-500" />}
          {status === "ok" && <CheckCircle2 size={18} className="text-emerald-600" />}
          {status === "error" && <XCircle size={18} className="text-red-600" />}
          <span>{message}</span>
        </div>

        <div className="mt-6 flex gap-3">
          {user ? (
            <Link to="/dashboard" className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className={`${btn} bg-slate-900 text-white hover:bg-slate-800`}>
                Create account
              </Link>
              <Link to="/login" className={`${btn} text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50`}>
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
