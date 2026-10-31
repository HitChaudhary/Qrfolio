import { Eye, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ConfirmDialog, EmptyRow, PageHeader, Pagination, RoleBadge, StatusBadge, TableCard, iconBtn, td, th,
} from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { useAdminQuery, useDebounced } from "../../hooks/useAdmin";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate, formatDateTime } from "../../lib/format";
import type { AdminUser, Paginated } from "../../lib/types";
import { inputClass } from "../../lib/ui";

type Pending = { kind: "toggle" | "delete"; user: AdminUser } | null;

export default function AdminUsers() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 300);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  const { data, loading, error, reload } = useAdminQuery<Paginated<AdminUser>>("/users", { search, role, status, page });

  async function confirmPending() {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.kind === "delete") {
        await api.delete(`/admin/users/${pending.user.id}`);
        toast.show("User account deleted");
        if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      } else {
        await api.patch(`/admin/users/${pending.user.id}`, { isActive: !pending.user.isActive });
        toast.show(pending.user.isActive ? "Account deactivated" : "Account activated");
      }
      setPending(null);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  const target = pending?.user;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Accounts Directory"
        subtitle="Search, audit permissions, and moderate user accounts across the platform."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email address"
            aria-label="Search users"
            className={`${inputClass} !pl-10 text-xs sm:text-sm`}
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Filter by role"
          className={`${inputClass} sm:!w-40 text-xs`}
        >
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className={`${inputClass} sm:!w-40 text-xs`}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Deactivated</option>
        </select>
      </div>

      {error && <PageError message={error} onRetry={reload} />}
      {!error && !data && <PageLoading />}

      {data && (
        <>
          <TableCard dim={loading}>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={th}>Account User</th>
                  <th className={`${th} hidden md:table-cell`}>Role</th>
                  <th className={th}>Status</th>
                  <th className={`${th} hidden sm:table-cell`}>Stores</th>
                  <th className={`${th} hidden lg:table-cell`}>Registered</th>
                  <th className={`${th} hidden xl:table-cell`}>Last Login</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length === 0 && <EmptyRow colSpan={7} text="No users match your filters." />}
                {data.items.map((u) => {
                  const isMe = u.id === me?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className={td}>
                        <p className="font-bold text-slate-950">
                          {u.name}
                          {isMe && <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">(you)</span>}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                        <span className="mt-1 inline-block md:hidden"><RoleBadge role={u.role} /></span>
                      </td>
                      <td className={`${td} hidden md:table-cell`}><RoleBadge role={u.role} /></td>
                      <td className={td}><StatusBadge active={u.isActive} off="Deactivated" /></td>
                      <td className={`${td} hidden tabular-nums sm:table-cell font-bold text-slate-800`}>{u.businessCount ?? 0}</td>
                      <td className={`${td} hidden whitespace-nowrap lg:table-cell font-mono text-slate-500`}>{formatDate(u.createdAt)}</td>
                      <td className={`${td} hidden whitespace-nowrap xl:table-cell font-mono text-slate-500`}>{formatDateTime(u.lastLoginAt)}</td>
                      <td className={`${td} whitespace-nowrap text-right`}>
                        <Link to={`/admin/users/${u.id}`} title="View details" aria-label={`View ${u.name}`} className={iconBtn}>
                          <Eye size={16} />
                        </Link>
                        <button
                          disabled={isMe}
                          onClick={() => setPending({ kind: "toggle", user: u })}
                          title={u.isActive ? "Deactivate account" : "Activate account"}
                          aria-label={u.isActive ? `Deactivate ${u.name}` : `Activate ${u.name}`}
                          className={iconBtn}
                        >
                          {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          disabled={isMe || u.role === "admin"}
                          onClick={() => setPending({ kind: "delete", user: u })}
                          title={u.role === "admin" ? "Remove admin role before deleting" : "Delete user"}
                          aria-label={`Delete ${u.name}`}
                          className={`${iconBtn} hover:!bg-rose-50 hover:!text-rose-600`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableCard>

          <Pagination page={data.page} pages={data.pages} total={data.total} onPage={setPage} />

          <ConfirmDialog
            open={Boolean(pending)}
            title={pending?.kind === "delete" ? "Delete User Account?" : pending?.user.isActive ? "Deactivate Account?" : "Activate Account?"}
            message={
              pending?.kind === "delete" ? (
                <>
                  Are you sure you want to permanently delete <strong>{target?.name}</strong>? All associated businesses, dynamic links, and QR codes will be permanently removed.
                </>
              ) : (
                <>
                  {target?.isActive
                    ? `Deactivating ${target?.name} will immediately prevent them from logging in or modifying their business pages.`
                    : `Reactivating ${target?.name} will restore their login access.`}
                </>
              )
            }
            confirmLabel={pending?.kind === "delete" ? "Delete Account" : pending?.user.isActive ? "Deactivate" : "Activate"}
            danger={pending?.kind === "delete" || pending?.user.isActive}
            busy={busy}
            onConfirm={confirmPending}
            onCancel={() => setPending(null)}
          />
        </>
      )}
    </div>
  );
}
