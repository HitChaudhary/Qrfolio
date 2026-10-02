import { BarChart3, LayoutDashboard, Link2, LogOut, QrCode, Settings as SettingsIcon, Store } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ITEMS = [
  { to: "/dashboard", label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/dashboard/links", label: "Links", Icon: Link2, end: false },
  { to: "/dashboard/qr", label: "QR Code", Icon: QrCode, end: false },
  { to: "/dashboard/analytics", label: "Analytics", Icon: BarChart3, end: false },
  { to: "/dashboard/business/edit", label: "Profile", Icon: Store, end: false },
  { to: "/dashboard/settings", label: "Settings", Icon: SettingsIcon, end: false },
];

function Brand() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="rounded-lg bg-slate-900 p-1.5 text-white">
        <QrCode size={18} />
      </span>
      LinkQR
    </span>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-56 md:shrink-0 md:flex-col md:border-r md:border-slate-200 md:bg-white">
        <div className="p-5"><Brand /></div>
        <nav className="flex-1 space-y-1 px-3">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <button onClick={onLogout}
            className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <Brand />
          <button onClick={onLogout} aria-label="Log out" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <LogOut size={18} />
          </button>
        </header>
        <main className="mx-auto max-w-4xl p-4 pb-24 sm:p-6 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[10px] ${isActive ? "text-slate-900" : "text-slate-500"}`
            }>
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
