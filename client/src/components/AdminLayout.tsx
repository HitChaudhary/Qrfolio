import {
  BarChart3, ChevronDown, LayoutDashboard, LogOut, Menu, Settings as SettingsIcon,
  ShieldCheck, Store, Users, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ITEMS = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", Icon: Users, end: false },
  { to: "/admin/businesses", label: "Businesses", Icon: Store, end: false },
  { to: "/admin/analytics", label: "Analytics", Icon: BarChart3, end: false },
  { to: "/admin/settings", label: "Settings", Icon: SettingsIcon, end: false },
];

function AdminBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-xl bg-white/10 p-2 ring-1 ring-white/20">
        <i className="rounded-[2px] bg-[#69bd92]" />
        <i className="rounded-[2px] bg-white" />
        <i className="rounded-[2px] bg-white" />
        <i className="rounded-[2px] bg-[#dff6e2]" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-extrabold tracking-tight text-white">QRFolio</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69bd92]">Admin</p>
      </div>
    </div>
  );
}

function SidebarBody({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <AdminBrand />
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 text-[#b7dbc4] hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-[#69bd92] font-semibold text-[#17291f]" : "text-[#dff6e2] hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link to="/dashboard" className="text-xs font-medium text-[#b7dbc4] hover:text-white">
          ← Back to my dashboard
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

  const menuItem = "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#43745b] hover:bg-[#e3f7e6]";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl p-1.5 pr-2 hover:bg-[#f0f3f0]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#467359] to-[#69bd92] text-sm font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? "A"}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[10rem] truncate text-xs font-semibold text-[#284737]">{user?.name}</span>
          <span className="block max-w-[10rem] truncate text-[11px] text-[#91b49e]">{user?.email}</span>
        </span>
        <ChevronDown size={15} className="text-[#91b49e]" />
      </button>

      {open && (
        <div role="menu" className="animate-fade-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#b7dbc4]/70 bg-white py-1 shadow-xl">
          <div className="border-b border-[#e3f7e6] px-4 py-2.5 sm:hidden">
            <p className="truncate text-xs font-semibold text-[#284737]">{user?.name}</p>
            <p className="truncate text-[11px] text-[#91b49e]">{user?.email}</p>
          </div>
          <Link to="/admin/settings" role="menuitem" className={menuItem}><SettingsIcon size={15} /> Settings</Link>
          <Link to="/dashboard" role="menuitem" className={menuItem}><LayoutDashboard size={15} /> My dashboard</Link>
          <button role="menuitem" onClick={onLogout} className={`${menuItem} text-red-600 hover:!bg-red-50`}>
            <LogOut size={15} /> Log out
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
    <div className="min-h-screen bg-[#f4f4f4] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden bg-[#284737] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <SidebarBody />
      </aside>

      {/* Mobile / tablet drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside className="animate-fade-in absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-[#284737] shadow-2xl">
            <SidebarBody onClose={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#b7dbc4]/60 bg-white/90 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="cursor-pointer rounded-lg p-2 text-[#43745b] hover:bg-[#e3f7e6] lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f7e6] px-2.5 py-1 text-xs font-bold text-[#355d48]">
              <ShieldCheck size={13} /> Administrator
            </span>
          </div>
          <ProfileMenu />
        </header>

        <main className="mx-auto max-w-6xl p-4 pb-12 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
