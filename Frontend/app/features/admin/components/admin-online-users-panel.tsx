import { ADMIN_USER_ROLE_OPTIONS } from "../constants/admin-user.constants";
import type { OnlineUserActivity } from "~/features/analytics/types/analytics.types";
import { formatAdminDateTime } from "../utils/format-admin-datetime";
import { AdminOnlineBadge } from "./admin-online-badge";

type AdminOnlineUsersPanelProps = {
  users: OnlineUserActivity[];
  isLoading: boolean;
};

function getRoleLabel(role: string) {
  return (
    ADMIN_USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role
  );
}

export function AdminOnlineUsersPanel({ users, isLoading }: AdminOnlineUsersPanelProps) {
  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-headline-md font-semibold text-primary">
            Người dùng đang online
          </h2>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Heartbeat mỗi 60 giây · online nếu hoạt động trong 5 phút gần nhất
          </p>
        </div>
        <span className="rounded-full bg-secondary-container/50 px-3 py-1 text-label-sm font-semibold text-primary">
          {users.length} online
        </span>
      </div>

      {isLoading ? (
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-surface-container-low" />
      ) : null}

      {!isLoading && users.length === 0 ? (
        <p className="mt-4 rounded-lg bg-surface-container-low px-4 py-3 text-label-md text-on-surface-variant">
          Hiện không có người dùng nào đang online.
        </p>
      ) : null}

      {!isLoading && users.length > 0 ? (
        <>
          <div className="mt-4 space-y-3 md:hidden">
            {users.map((user) => (
              <article
                className="rounded-xl border border-outline-variant/25 bg-white p-3"
                key={user.id}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-primary">{user.fullName}</p>
                    <p className="truncate text-label-sm text-on-surface-variant">
                      {user.email}
                    </p>
                  </div>
                  <AdminOnlineBadge lastSeenAt={user.lastSeenAt} online />
                </div>
                <p className="mt-2 text-label-sm text-on-surface-variant">
                  {getRoleLabel(user.role)} · {formatAdminDateTime(user.lastSeenAt)}
                </p>
                <p className="mt-1 truncate text-label-sm font-medium text-secondary">
                  {user.lastPath ?? "Chưa ghi nhận trang gần nhất"}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-outline-variant/20 text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="px-3 py-2.5 text-left font-medium">Người dùng</th>
                  <th className="px-3 py-2.5 text-left font-medium">Vai trò</th>
                  <th className="px-3 py-2.5 text-left font-medium">Trạng thái</th>
                  <th className="px-3 py-2.5 text-left font-medium">Lần cuối</th>
                  <th className="px-3 py-2.5 text-left font-medium">Đang xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-primary">{user.fullName}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </td>
                    <td className="px-3 py-2.5">{getRoleLabel(user.role)}</td>
                    <td className="px-3 py-2.5">
                      <AdminOnlineBadge lastSeenAt={user.lastSeenAt} online />
                    </td>
                    <td className="px-3 py-2.5 text-on-surface-variant">
                      {formatAdminDateTime(user.lastSeenAt)}
                    </td>
                    <td className="max-w-[280px] truncate px-3 py-2.5 font-medium text-secondary">
                      {user.lastPath ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  );
}
