import { ADMIN_USER_ROLE_OPTIONS } from "../constants/admin-user.constants";
import type { AdminUser } from "../types/admin-user.types";
import { formatAdminDate, formatAdminDateTime } from "../utils/format-admin-datetime";
import { AdminOnlineBadge } from "./admin-online-badge";
import { AdminUsersPagination } from "./admin-users-pagination";

type AdminUsersTableProps = {
  users: AdminUser[];
  deletingUserId: number | null;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getRoleLabel(role: AdminUser["role"]) {
  return (
    ADMIN_USER_ROLE_OPTIONS.find((roleOption) => roleOption.value === role)
      ?.label ?? role
  );
}

function ActionButtons({
  user,
  deletingUserId,
  onEdit,
  onDelete,
}: {
  user: AdminUser;
  deletingUserId: number | null;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        className="rounded-lg border border-outline-variant/40 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-surface-container-low"
        onClick={() => onEdit(user)}
        type="button"
      >
        Sửa
      </button>
      <button
        className="rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-on-error transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={deletingUserId === user.id}
        onClick={() => onDelete(user)}
        type="button"
      >
        {deletingUserId === user.id ? "Đang xóa..." : "Xóa"}
      </button>
    </div>
  );
}

export function AdminUsersTable({
  users,
  deletingUserId,
  onEdit,
  onDelete,
  totalItems,
  rangeStart,
  rangeEnd,
  page,
  totalPages,
  onPageChange,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <div className="space-y-3 p-3 md:hidden">
        {users.map((user) => (
          <article
            className="rounded-xl border border-outline-variant/25 bg-white p-4"
            key={user.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-primary">{user.fullName}</p>
                <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
              </div>
              <AdminOnlineBadge lastSeenAt={user.lastSeenAt} online={user.online} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-label-sm text-on-surface-variant">
              <div>
                <dt className="text-[11px] uppercase tracking-wide">Vai trò</dt>
                <dd className="font-medium text-on-surface">{getRoleLabel(user.role)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide">Tài khoản</dt>
                <dd className="font-medium text-on-surface">
                  {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-wide">Ngày đăng ký</dt>
                <dd className="font-medium text-on-surface">
                  {formatAdminDateTime(user.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 border-t border-outline-variant/20 pt-3">
              <ActionButtons
                deletingUserId={deletingUserId}
                onDelete={onDelete}
                onEdit={onEdit}
                user={user}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-outline-variant/20 text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium">Vai trò</th>
              <th className="px-4 py-3 text-left font-medium">Tài khoản</th>
              <th className="px-4 py-3 text-left font-medium">Online</th>
              <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
              <th className="px-4 py-3 text-right font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 bg-white/80 text-on-surface">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-primary">{user.fullName}</div>
                  <div className="text-xs text-on-surface-variant">{user.email}</div>
                </td>
                <td className="px-4 py-3">{getRoleLabel(user.role)}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                      user.isActive
                        ? "bg-secondary-container text-primary"
                        : "bg-surface-container-high text-on-surface-variant",
                    ].join(" ")}
                  >
                    {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminOnlineBadge lastSeenAt={user.lastSeenAt} online={user.online} />
                  {!user.online && user.lastSeenAt ? (
                    <p className="mt-1 text-[11px] text-on-surface-variant">
                      {formatAdminDate(user.lastSeenAt)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {formatAdminDateTime(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <ActionButtons
                    deletingUserId={deletingUserId}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    user={user}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminUsersPagination
        onPageChange={onPageChange}
        page={page}
        rangeEnd={rangeEnd}
        rangeStart={rangeStart}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </div>
  );
}
