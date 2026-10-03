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
import { formatDate, formatDateTime } from "../../lib/format";
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
    <div className="space-y-5">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#467359] hover:underline">
        <ArrowLeft size={15} /> All users
      </Link>

      <section className={cardClass}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-[#284737]">{u.name}</h1>
            <p className="truncate text-sm text-[#70a087]">{u.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <RoleBadge role={u.role} />
              <StatusBadge active={u.isActive} off="Deactivated" />
              {isMe && <span className="text-xs font-medium text-[#91b49e]">This is you</span>}
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-sm sm:text-right">
            {info.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[#91b49e]">{label}</dt>
                <dd className="mt-0.5 font-semibold text-[#284737]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="font-bold text-[#284737]">Account controls</h2>
        {isMe ? (
          <p className="mt-2 text-sm text-[#70a087]">You can't change your own role or status, or delete your own account.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-end gap-2">
              <div>
                <label htmlFor="role" className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#467359]">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} className={`${inputClass} !w-36`}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button disabled={role === u.role} onClick={() => setAction("role")} className={primaryBtn}>Update role</button>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button onClick={() => setAction("toggle")} className={secondaryBtn}>
                {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                {u.isActive ? "Deactivate" : "Activate"}
              </button>
              <button disabled={u.role === "admin"} onClick={() => setAction("delete")}
                title={u.role === "admin" ? "Remove the admin role before deleting" : undefined} className={dangerBtn}>
                <Trash2 size={16} /> Delete user
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-[#284737]">Business profile</h2>
        <TableCard>
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-[#e3f7e6] bg-[#f7faf7]">
              <tr>
                <th className={th}>Business</th>
                <th className={th}>Status</th>
                <th className={th}>Links</th>
                <th className={th}>Scans</th>
                <th className={`${th} hidden sm:table-cell`}>Created</th>
                <th className={`${th} text-right`}>Public page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3f7e6]">
              {data.businesses.length === 0 && <EmptyRow colSpan={6} text="This user hasn't created a business yet." />}
              {data.businesses.map((b) => (
                <tr key={b.id} className="hover:bg-[#f7faf7]">
                  <td className={td}>
                    <Link to={`/admin/businesses/${b.id}`} className="font-semibold text-[#284737] hover:underline">{b.businessName}</Link>
                    <p className="text-xs text-[#91b49e]">/p/{b.slug}</p>
                  </td>
                  <td className={td}><StatusBadge active={b.isActive} /></td>
                  <td className={`${td} tabular-nums`}>{b.linkCount}</td>
                  <td className={`${td} tabular-nums`}>{b.scanCount}</td>
                  <td className={`${td} hidden whitespace-nowrap sm:table-cell`}>{formatDate(b.createdAt)}</td>
                  <td className={`${td} text-right`}>
                    <a href={publicUrl(b.slug)} target="_blank" rel="noreferrer" aria-label={`Open ${b.businessName} public page`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#43745b] hover:bg-[#e3f7e6]">
                      <ExternalLink size={16} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </section>

      <ConfirmDialog
        open={action !== null}
        busy={busy}
        danger={action === "delete" || (action === "toggle" && u.isActive)}
        title={action === "delete" ? "Delete this user?" : action === "role" ? "Change role?" : u.isActive ? "Deactivate this account?" : "Activate this account?"}
        message={
          action === "delete" ? (
            <>{u.name} and all of their businesses, links and analytics will be permanently deleted. This cannot be undone.</>
          ) : action === "role" ? (
            <>
              {role === "admin"
                ? `${u.name} will be able to see and manage every user and business.`
                : `${u.name} will lose access to the admin panel.`}
            </>
          ) : u.isActive ? (
            <>{u.name} will be signed out and unable to log in. Their public pages stay online.</>
          ) : (
            <>{u.name} will be able to log in again.</>
          )
        }
        confirmLabel={action === "delete" ? "Delete user" : action === "role" ? "Change role" : u.isActive ? "Deactivate" : "Activate"}
        onConfirm={run}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
