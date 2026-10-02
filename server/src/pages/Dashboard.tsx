import { LogOut, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="flex items-center gap-2 font-semibold">
            <span className="rounded-lg bg-slate-900 p-1.5 text-white">
              <QrCode size={18} />
            </span>
            LinkQR
          </span>
          <button onClick={onLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Hi, {user?.name}</h1>
        <p className="mt-1 text-slate-600">{user?.email}</p>
        <div className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          You're logged in. Business profile, links and QR code come in the next phases.
        </div>
      </main>
    </div>
  );
}
