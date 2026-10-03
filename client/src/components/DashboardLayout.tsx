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
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../hooks/useBusiness";
import { publicUrl } from "../lib/config";

const ITEMS = [
  { to: "/dashboard", label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/dashboard/links", label: "Links", Icon: Link2, end: false },
  { to: "/dashboard/qr", label: "QR Studio", Icon: QrCode, end: false },
  { to: "/dashboard/analytics", label: "Analytics", Icon: BarChart3, end: false },
  { to: "/dashboard/business/edit", label: "Profile", Icon: Store, end: false },
  { to: "/dashboard/settings", label: "Settings", Icon: SettingsIcon, end: false },
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
    <div className="min-h-screen bg-[#f4f4f4] md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-[#b7dbc4]/60 md:bg-white/95 md:backdrop-blur-md">
        {/* Brand header */}
        <div className="flex h-18 items-center border-b border-[#e3f7e6] px-6">
          <Brand size="md" showBadge />
        </div>

        {/* Live Business Quick Card */}
        {business && (
          <div className="mx-4 mt-4 rounded-xl border border-[#b7dbc4]/70 bg-[#e3f7e6]/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#284737]">{business.businessName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${business.isActive ? "bg-[#69bd92] animate-pulse" : "bg-amber-400"}`} />
                  <span className="text-[11px] text-[#43745b]">{business.isActive ? "Live" : "Draft"}</span>
                </div>
              </div>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open live public profile"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#43745b] shadow-2xs ring-1 ring-[#b7dbc4] hover:bg-[#dff6e2] hover:text-[#284737] transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-4 py-4">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#91b49e]">Navigation</p>
          {ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#467359] to-[#69bd92] text-white shadow-sm shadow-[#69bd92]/20 font-semibold"
                    : "text-[#43745b] hover:bg-[#e3f7e6] hover:text-[#284737]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`transition-transform duration-200 ${
                      isActive ? "text-[#dff6e2]" : "text-[#70a087] group-hover:scale-110 group-hover:text-[#467359]"
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
            className="mx-4 mb-3 flex items-center gap-3 rounded-xl border border-[#b7dbc4] bg-[#e3f7e6]/60 px-3.5 py-2.5 text-sm font-semibold text-[#284737] hover:bg-[#e3f7e6]"
          >
            <ShieldCheck size={18} className="text-[#467359]" /> Admin panel
          </NavLink>
        )}

        {/* User profile footer */}
        <div className="border-t border-[#e3f7e6] p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#f0f3f0]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#467359] to-[#69bd92] text-xs font-bold text-white shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#284737]">{user?.name}</p>
              <p className="truncate text-[11px] text-[#91b49e]">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              aria-label="Log out"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#a5afa9] hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#b7dbc4]/60 bg-white/90 px-4 backdrop-blur-md md:hidden">
          <Brand size="sm" />
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-[#b7dbc4] bg-[#e3f7e6] px-2.5 py-1 text-xs font-medium text-[#284737] shadow-2xs"
              >
                <ExternalLink size={12} /> View Page
              </a>
            )}
            <button
              onClick={onLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-[#43745b] hover:bg-[#e3f7e6] active:scale-95"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 pb-28 md:pb-12 animate-fade-in text-[#43745b]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#b7dbc4]/60 bg-white/95 px-2 py-1.5 backdrop-blur-lg pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden shadow-lg">
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition-all ${
                isActive ? "text-[#467359] font-bold" : "text-[#70a087] hover:text-[#284737]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive ? "bg-[#e3f7e6] text-[#467359]" : "text-[#70a087]"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
