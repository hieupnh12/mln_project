import { NavLink } from "react-router";

import {
  ADMIN_ROUTES,
  adminNavItems,
} from "../constants/admin-dashboard.constants";
import { MaterialIcon } from "./admin-icons";

export function AdminMobileNav() {
  return (
    <nav className="mb-md flex gap-sm overflow-x-auto scroll-hide lg:hidden">
      {adminNavItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "flex shrink-0 items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-label-md font-semibold text-on-secondary-container"
              : "flex shrink-0 items-center gap-2 rounded-full border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-on-surface-variant"
          }
          end={item.to === ADMIN_ROUTES.dashboard}
          key={item.to}
          to={item.to}
        >
          <MaterialIcon className="h-5 w-5 text-[20px]">{item.icon}</MaterialIcon>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
