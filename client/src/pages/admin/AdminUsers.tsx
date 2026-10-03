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
        toast.show("User deleted");
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
    <div className="space-y-5">
      <PageHeader title="Users" subtitle="Search, review and manage every account." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#91b49e]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            className={`${inputClass} !pl-10`}
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role" className={`${inputClass} sm:!w-40`}>
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={`${inputClass} sm:!w-40`}>
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
              <thead className="border-b border-[#e3f7e6] bg-[#f7faf7]">
                <tr>
                  <th className={th}>User</th>
                  <th className={`${th} hidden md:table-cell`}>Role</th>
                  <th className={th}>Status</th>
                  <th className={`${th} hidden sm:table-cell`}>Businesses</th>
                  <th className={`${th} hidden lg:table-cell`}>Registered</th>
                  <th className={`${th} hidden xl:table-cell`}>Last login</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3f7e6]">
                {data.items.length === 0 && <EmptyRow colSpan={7} text="No users match your filters." />}
                {data.items.map((u) => {
                  const isMe = u.id === me?.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#f7faf7]">
                      <td className={td}>
                        <p className="font-semibold text-[#284737]">{u.name}{isMe && <span className="ml-1.5 text-xs font-medium text-[#91b49e]">(you)</span>}</p>
                        <p className="text-xs text-[#91b49e]">{u.email}</p>
                        <span className="mt-1 inline-block md:hidden"><RoleBadge role={u.role} /></span>
                      </td>
                      <td className={`${td} hidden md:table-cell`}><RoleBadge role={u.role} /></td>
                      <td className={td}><StatusBadge active={u.isActive} off="Deactivated" /></td>
                      <td className={`${td} hidden tabular-nums sm:table-cell`}>{u.businessCount ?? 0}</td>
                      <td className={`${td} hidden whitespace-nowrap lg:table-cell`}>{formatDate(u.createdAt)}</td>
                      <td className={`${td} hidden whitespace-nowrap xl:table-cell`}>{formatDateTime(u.lastLoginAt)}</td>
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
                          title={u.role === "admin" ? "Remove the admin role before deleting" : "Delete user"}
                          aria-label={`Delete ${u.name}`}
                          className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}
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
        </>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        busy={busy}
        danger={pending?.kind === "delete" || target?.isActive === true}
        title={
          pending?.kind === "delete" ? "Delete this user?" : target?.isActive ? "Deactivate this account?" : "Activate this account?"
        }
        message={
          pending?.kind === "delete" ? (
            <>
              <strong>{target?.name}</strong> ({target?.email}) and all of their businesses, links and analytics will be
              permanently deleted. This cannot be undone.
            </>
          ) : target?.isActive ? (
            <>
              <strong>{target?.name}</strong> will be signed out and unable to log in. Their public pages stay online.
            </>
          ) : (
            <>
              <strong>{target?.name}</strong> will be able to log in again.
            </>
          )
        }
        confirmLabel={pending?.kind === "delete" ? "Delete user" : target?.isActive ? "Deactivate" : "Activate"}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
