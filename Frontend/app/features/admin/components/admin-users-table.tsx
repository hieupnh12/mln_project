import { ADMIN_USER_ROLE_OPTIONS } from "../constants/admin-user.constants";
import type { AdminUser } from "../types/admin-user.types";

type AdminUsersTableProps = {
  users: AdminUser[];
  deletingUserId: number | null;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

function getRoleLabel(role: AdminUser["role"]) {
  return (
    ADMIN_USER_ROLE_OPTIONS.find((roleOption) => roleOption.value === role)
      ?.label ?? role
  );
}

export function AdminUsersTable({
  users,
  deletingUserId,
  onEdit,
  onDelete,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant/20 text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium">Vai trò</th>
              <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium">Google ID</th>
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
                <td className="max-w-[240px] truncate px-4 py-3 text-on-surface-variant">
                  {user.googleId ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-lg border border-outline-variant/40 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-surface-container-low"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      disabled={deletingUserId === user.id}
                      className="rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-on-error transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingUserId === user.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
