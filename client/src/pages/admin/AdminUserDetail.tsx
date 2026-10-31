import { ArrowLeft, ExternalLink, Trash2, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ConfirmDialog, EmptyRow, RoleBadge, StatusBadge, TableCard, td, th,
} from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { useAdminQuery } from "../../hooks/useAdmin";
import { api, getErrorMessage } from "../../lib/api";
import { publicUrl } from "../../lib/config";
import { formatDate, formatDateTime, formatNumber } from "../../lib/format";
import type { AdminUserDetailData } from "../../lib/types";
import { cardClass, dangerBtn, inputClass, primaryBtn, secondaryBtn } from "../../lib/ui";

type Action = "role" | "toggle" | "delete" | null;

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useAdminQuery<AdminUserDetailData>(`/users/${id ?? ""}`);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [action, setAction] = useState<Action>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setRole(data.user.role);
  }, [data]);

  if (error) return <PageError message={error} onRetry={reload} />;
  if (loading && !data) return <PageLoading />;
  if (!data) return null;

  const u = data.user;
  const isMe = u.id === me?.id;

  async function run() {
    setBusy(true);
    try {
      if (action === "delete") {
        await api.delete(`/admin/users/${u.id}`);
        toast.show("User deleted");
        navigate("/admin/users", { replace: true });
        return;
      }
      if (action === "role") {
        await api.patch(`/admin/users/${u.id}`, { role });
        toast.show(`Role changed to ${role}`);
      } else {
        await api.patch(`/admin/users/${u.id}`, { isActive: !u.isActive });
        toast.show(u.isActive ? "Account deactivated" : "Account activated");
      }
      setAction(null);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  const info: [string, string][] = [
    ["Registered", formatDate(u.createdAt)],
    ["Last login", formatDateTime(u.lastLoginAt)],
    ["Businesses", String(data.businesses.length)],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors">
        <ArrowLeft size={14} /> Back to User Directory
      </Link>

      <section className={cardClass}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl sm:text-3xl font-black text-slate-950">{u.name}</h1>
            <p className="truncate text-xs font-mono text-slate-400 mt-0.5">{u.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoleBadge role={u.role} />
              <StatusBadge active={u.isActive} off="Deactivated" />
              {isMe && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">This is you</span>}
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-xs sm:text-right">
            {info.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="mt-1 font-bold text-slate-950">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Account controls */}
      <section className={cardClass}>
        <h2 className="font-display font-black text-slate-950 text-base">Account Security & Roles</h2>
        {isMe ? (
          <p className="mt-2 text-xs text-slate-500">You cannot modify your own administrative role or status while logged in.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-end gap-2.5">
              <div>
                <label htmlFor="role" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Assign Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} className={`${inputClass} !w-36 text-xs`}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button disabled={role === u.role} onClick={() => setAction("role")} className={primaryBtn}>Update Role</button>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:ml-auto">
              <button onClick={() => setAction("toggle")} className={secondaryBtn}>
                {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                {u.isActive ? "Deactivate" : "Activate"}
              </button>
              <button disabled={u.role === "admin"} onClick={() => setAction("delete")}
                title={u.role === "admin" ? "Remove admin role before deleting" : undefined} className={dangerBtn}>
                <Trash2 size={15} /> Delete Account
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Business profiles */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-slate-950 text-base">Store Hubs ({data.businesses.length})</h2>
        <TableCard>
          <table className="w-full min-w-[560px]">
            <thead>
              <tr>
                <th className={th}>Business Name</th>
                <th className={th}>Status</th>
                <th className={th}>Links</th>
                <th className={th}>Scans</th>
                <th className={`${th} hidden sm:table-cell`}>Created</th>
                <th className={`${th} text-right`}>Public Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.businesses.length === 0 && <EmptyRow colSpan={6} text="This user has not created any business hubs yet." />}
              {data.businesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className={td}>
                    <Link to={`/admin/businesses/${b.id}`} className="font-bold text-slate-950 hover:underline">{b.businessName}</Link>
                    <p className="text-xs font-mono text-slate-400">/p/{b.slug}</p>
                  </td>
                  <td className={td}><StatusBadge active={b.isActive} /></td>
                  <td className={`${td} font-bold text-slate-800`}>{b.linkCount}</td>
                  <td className={`${td} font-bold text-slate-950 tabular-nums`}>{formatNumber(b.scanCount)}</td>
                  <td className={`${td} hidden font-mono text-slate-500 sm:table-cell`}>{formatDate(b.createdAt)}</td>
                  <td className={`${td} text-right`}>
                    <a href={publicUrl(b.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 hover:underline">
                      View <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </section>

      <ConfirmDialog
        open={Boolean(action)}
        title={action === "delete" ? "Delete User?" : action === "role" ? "Update Role?" : u.isActive ? "Deactivate Account?" : "Activate Account?"}
        message={
          action === "delete"
            ? `Delete ${u.name}? All their businesses and QR codes will be permanently destroyed.`
            : action === "role"
            ? `Change ${u.name}'s role to ${role}?`
            : u.isActive
            ? `Deactivating ${u.name} immediately suspends their dashboard access.`
            : `Reactivate ${u.name}'s account?`
        }
        confirmLabel={action === "delete" ? "Delete" : action === "role" ? "Change Role" : u.isActive ? "Deactivate" : "Activate"}
        danger={action === "delete" || (action === "toggle" && u.isActive)}
        busy={busy}
        onConfirm={run}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
