import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  ShieldCheck,
  Store,
  Users,
  X,
  Zap,
  Activity,
  ArrowLeft,
  Server,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QrfolioLogo, { QrfolioIconMark } from "./QrfolioLogo";

const ITEMS = [
  { to: "/admin", label: "Platform Cockpit", Icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "User Directory", Icon: Users, end: false },
  { to: "/admin/businesses", label: "Business Registry", Icon: Store, end: false },
  { to: "/admin/analytics", label: "Global Telemetry", Icon: BarChart3, end: false },
  { to: "/admin/settings", label: "System Settings", Icon: SettingsIcon, end: false },
];

function AdminBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <QrfolioLogo size="sm" mode="dark" variant="full" />
      <span className="rounded-full bg-[#b8de20] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#0e1424]">
        Admin
      </span>
    </div>
  );
}

function SidebarBody({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800/80 px-6">
        <AdminBrand />
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* System Telemetry Status Pill */}
      <div className="mx-4 mt-4 rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-ping" />
            Core Status
          </span>
          <span className="text-[10px] font-bold text-emerald-400">99.99% UP</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span>Edge Scans Proxy</span>
          <span className="text-slate-400 font-mono">240ms</span>
        </div>
      </div>

      {/* Admin Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
          Management Cockpit
        </p>
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#d4f04d] text-slate-950 font-black shadow-md shadow-[#d4f04d]/20"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={`transition-transform duration-200 ${
                    isActive ? "text-slate-950 scale-110" : "text-slate-400 group-hover:scale-110 group-hover:text-white"
                  }`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Switch to Merchant Studio */}
      <div className="border-t border-slate-800 p-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors shadow-2xs"
        >
          <ArrowLeft size={14} className="text-[#d4f04d]" />
          <span>Switch to Merchant Studio</span>
        </Link>
      </div>
    </>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const menuItem = "flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2.5 rounded-2xl p-1.5 pr-3 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-[#d4f04d] shadow-2xs">
          {user?.name?.charAt(0).toUpperCase() ?? "A"}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[10rem] truncate text-xs font-bold text-slate-900">{user?.name}</span>
          <span className="block max-w-[10rem] truncate text-[10px] font-mono text-slate-400">Superadmin</span>
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div role="menu" className="animate-fade-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white py-1.5 shadow-2xl">
          <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
            <p className="truncate text-xs font-bold text-slate-950">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-500 font-mono">{user?.email}</p>
          </div>
          <Link to="/admin/settings" role="menuitem" className={menuItem}><SettingsIcon size={14} /> System Settings</Link>
          <Link to="/dashboard" role="menuitem" className={menuItem}><LayoutDashboard size={14} /> My Merchant Studio</Link>
          <div className="my-1 border-t border-slate-100" />
          <button role="menuitem" onClick={onLogout} className={`${menuItem} text-rose-600 hover:!bg-rose-50`}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawer(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <div className="min-h-screen bg-slate-100 md:flex font-sans text-slate-900 selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Desktop Command Center Sidebar (Obsidian Theme) */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-68 md:shrink-0 md:flex-col bg-slate-950 border-r border-slate-800 text-white shadow-2xl">
        <SidebarBody />
      </aside>

      {/* Mobile Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col bg-slate-950 text-white shadow-2xl">
            <SidebarBody onClose={() => setDrawer(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Cockpit Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#d4f04d]">
                Root Admin Cockpit
              </span>
              <span className="text-xs text-slate-400 font-mono">Platform Infrastructure</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors"
            >
              <span>Merchant Studio ↗</span>
            </Link>
            <ProfileMenu />
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
