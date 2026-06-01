import { ADMIN_USER_ROLE_OPTIONS } from "../constants/admin-user.constants";
import type { AdminUserRole } from "../types/admin-user.types";

type AdminUsersToolbarProps = {
  keyword: string;
  roleFilter: AdminUserRole | "all";
  onKeywordChange: (value: string) => void;
  onRoleFilterChange: (value: AdminUserRole | "all") => void;
  onCreateClick: () => void;
};

export function AdminUsersToolbar({
  keyword,
  roleFilter,
  onKeywordChange,
  onRoleFilterChange,
  onCreateClick,
}: AdminUsersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
          Tìm kiếm theo tên hoặc email
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Nhập từ khóa..."
            className="rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
          Lọc theo vai trò
          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as AdminUserRole | "all")
            }
            className="rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
          >
            <option value="all">Tất cả vai trò</option>
            {ADMIN_USER_ROLE_OPTIONS.map((roleOption) => (
              <option key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={onCreateClick}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:opacity-90"
      >
        Tạo người dùng
      </button>
    </div>
  );
}
