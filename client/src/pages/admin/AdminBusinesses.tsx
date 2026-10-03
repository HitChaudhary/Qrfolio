import { ExternalLink, Eye, ImagePlus, Power, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ConfirmDialog, EmptyRow, PageHeader, Pagination, StatusBadge, TableCard, iconBtn, td, th,
} from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import { useToast } from "../../components/Toast";
import { useAdminQuery, useDebounced } from "../../hooks/useAdmin";
import { api, getErrorMessage } from "../../lib/api";
import { publicUrl } from "../../lib/config";
import { formatDate, formatNumber } from "../../lib/format";
import type { AdminBusinessSummary, Paginated } from "../../lib/types";
import { inputClass } from "../../lib/ui";

type Pending = { kind: "toggle" | "delete"; biz: AdminBusinessSummary } | null;

export default function AdminBusinesses() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 300);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const { data, loading, error, reload } = useAdminQuery<Paginated<AdminBusinessSummary>>("/businesses", {
    search,
    status,
    page,
  });

  async function confirmPending() {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.kind === "delete") {
        await api.delete(`/admin/businesses/${pending.biz.id}`);
        toast.show("Business deleted");
        if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      } else {
        await api.patch(`/admin/businesses/${pending.biz.id}`, { isActive: !pending.biz.isActive });
        toast.show(pending.biz.isActive ? "Business deactivated" : "Business activated");
      }
      setPending(null);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  const target = pending?.biz;

  return (
    <div className="space-y-5">
      <PageHeader title="Businesses" subtitle="Every business profile on the platform." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#91b49e]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, slug, category or owner"
            aria-label="Search businesses"
            className={`${inputClass} !pl-10`}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={`${inputClass} sm:!w-44`}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
                  <th className={th}>Business</th>
                  <th className={`${th} hidden md:table-cell`}>Owner</th>
                  <th className={`${th} hidden lg:table-cell`}>Category</th>
                  <th className={th}>Status</th>
                  <th className={th}>Scans</th>
                  <th className={`${th} hidden lg:table-cell`}>Created</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3f7e6]">
                {data.items.length === 0 && <EmptyRow colSpan={7} text="No businesses match your filters." />}
                {data.items.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f7faf7]">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e3f7e6] text-[#467359]">
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImagePlus size={15} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#284737]">{b.businessName}</p>
                          <p className="truncate text-xs text-[#91b49e]">/p/{b.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} hidden md:table-cell`}>
                      {b.owner ? (
                        <Link to={`/admin/users/${b.owner.id}`} className="hover:underline">
                          <p className="font-medium text-[#284737]">{b.owner.name}</p>
                          <p className="text-xs text-[#91b49e]">{b.owner.email}</p>
                        </Link>
                      ) : (
                        <span className="text-[#91b49e]">Unknown</span>
                      )}
                    </td>
                    <td className={`${td} hidden lg:table-cell`}>{b.category || "—"}</td>
                    <td className={td}><StatusBadge active={b.isActive} /></td>
                    <td className={`${td} tabular-nums`}>{formatNumber(b.scanCount)}</td>
                    <td className={`${td} hidden whitespace-nowrap lg:table-cell`}>{formatDate(b.createdAt)}</td>
                    <td className={`${td} whitespace-nowrap text-right`}>
                      <Link to={`/admin/businesses/${b.id}`} title="View details" aria-label={`View ${b.businessName}`} className={iconBtn}>
                        <Eye size={16} />
                      </Link>
                      <a href={publicUrl(b.slug)} target="_blank" rel="noreferrer" title="Open public profile"
                        aria-label={`Open ${b.businessName} public profile`} className={iconBtn}>
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => setPending({ kind: "toggle", biz: b })}
                        title={b.isActive ? "Deactivate business" : "Activate business"}
                        aria-label={b.isActive ? `Deactivate ${b.businessName}` : `Activate ${b.businessName}`} className={iconBtn}>
                        <Power size={16} />
                      </button>
                      <button onClick={() => setPending({ kind: "delete", biz: b })} title="Delete business"
                        aria-label={`Delete ${b.businessName}`} className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
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
        title={pending?.kind === "delete" ? "Delete this business?" : target?.isActive ? "Deactivate this business?" : "Activate this business?"}
        message={
          pending?.kind === "delete" ? (
            <>
              <strong>{target?.businessName}</strong>, its links, logo and analytics will be permanently deleted, and its
              QR code will stop working. This cannot be undone.
            </>
          ) : target?.isActive ? (
            <>
              The public page for <strong>{target?.businessName}</strong> will show "page not available" and scans of its QR
              code will stop working until it is activated again.
            </>
          ) : (
            <>
              The public page for <strong>{target?.businessName}</strong> will go live again.
            </>
          )
        }
        confirmLabel={pending?.kind === "delete" ? "Delete business" : target?.isActive ? "Deactivate" : "Activate"}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
