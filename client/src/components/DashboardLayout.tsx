import {
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  Link2,
  LogOut,
  QrCode,
  Settings as SettingsIcon,
  ShieldCheck,
  Store,
  User,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../hooks/useBusiness";
import { publicUrl } from "../lib/config";

const ITEMS = [
  { to: "/dashboard", label: "Store Overview", Icon: LayoutDashboard, end: true },
  { to: "/dashboard/links", label: "Links & Menu Hub", Icon: Link2, end: false },
  { to: "/dashboard/qr", label: "QR Studio & Print", Icon: QrCode, end: false },
  { to: "/dashboard/analytics", label: "Scan Performance", Icon: BarChart3, end: false },
  { to: "/dashboard/business/edit", label: "Store Profile", Icon: Store, end: false },
  { to: "/dashboard/settings", label: "Account Settings", Icon: SettingsIcon, end: false },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const liveUrl = business ? publicUrl(business.slug) : null;

  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans text-slate-800 selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Desktop Merchant Sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-68 md:shrink-0 md:flex-col md:border-r md:border-slate-200/90 md:bg-white">
        {/* Brand header */}
        <div className="flex h-18 items-center border-b border-slate-100 px-6 justify-between">
          <Brand size="md" showBadge={false} />
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-700">
            Studio
          </span>
        </div>

        {/* Live Business Quick Card */}
        {business && (
          <div className="mx-4 mt-4 rounded-2xl border border-slate-200/90 bg-slate-50 p-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-slate-950">{business.businessName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${business.isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {business.isActive ? "Live on Counter" : "Draft Mode"}
                  </span>
                </div>
              </div>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open live customer page"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-950 hover:text-white transition-all cursor-pointer"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            Merchant Studio
          </p>
          {ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm font-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={`transition-transform duration-200 ${
                      isActive ? "text-[#d4f04d]" : "text-slate-400 group-hover:scale-110 group-hover:text-slate-900"
                    }`}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className="mx-4 mb-3 flex items-center gap-2.5 rounded-2xl border border-slate-900/10 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-900 transition-colors"
          >
            <ShieldCheck size={16} className="text-[#d4f04d]" />
            <span>Platform Admin Cockpit ↗</span>
          </NavLink>
        )}

        {/* User profile footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-[#d4f04d] shadow-2xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="truncate text-[10px] text-slate-400 font-medium">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              aria-label="Log out"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 backdrop-blur-md md:hidden">
          <Brand size="sm" />
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900 shadow-2xs"
              >
                <Smartphone size={12} className="text-slate-500" />
                <span>Live View</span>
              </a>
            )}
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Mobile navigation scroll pills */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200/80 bg-white px-4 py-2.5 no-scrollbar md:hidden">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={13} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Content body container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
