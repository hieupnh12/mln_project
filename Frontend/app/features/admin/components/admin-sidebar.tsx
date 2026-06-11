import { Link, NavLink } from "react-router";

import { BrandLogo } from "~/shared/components/brand-logo";
import { useLogout } from "../../auth/hooks/use-logout";
import {
  ADMIN_ROUTES,
  adminNavItems,
  adminProfile,
} from "../constants/admin-dashboard.constants";
import { MaterialIcon } from "./admin-icons";

export function AdminSidebar() {
  const logout = useLogout();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-svh w-64 flex-col border-r border-outline-variant/20 bg-surface/85 p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur lg:flex">
      <Link className="mb-xl flex items-center gap-sm" to={ADMIN_ROUTES.dashboard}>
        <div className="min-w-0">
          <BrandLogo />
          <p className="text-label-sm font-semibold text-on-surface-variant/70">
            Admin Portal
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-base overflow-y-auto pr-xs">
        {adminNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center gap-md rounded-xl bg-secondary-container px-md py-sm text-left font-semibold text-on-secondary-container transition"
                : "flex w-full items-center gap-md rounded-xl px-md py-sm text-left text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
            }
            key={item.label}
            end={item.to === ADMIN_ROUTES.dashboard}
            to={item.to}
          >
            <MaterialIcon>{item.icon}</MaterialIcon>
            <span className="text-label-md font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 pt-md">
        <div className="flex items-center gap-sm px-sm py-xs">
          <img
            alt="Ảnh đại diện quản trị viên"
            className="h-10 w-10 rounded-full object-cover shadow-sm"
            src={adminProfile.avatarUrl}
          />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-label-md font-bold text-primary">
              {adminProfile.name}
            </span>
            <span className="text-label-sm font-semibold text-on-surface-variant/70">
              {adminProfile.plan}
            </span>
          </div>
          <button
            onClick={logout}
            title="Đăng xuất"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-error transition hover:bg-error-container/50"
          >
            <MaterialIcon>logout</MaterialIcon>
          </button>
        </div>
      </div>
    </aside>
  );
}
