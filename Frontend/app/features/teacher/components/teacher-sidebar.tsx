import { Link, NavLink } from "react-router";

import { useAuthUser } from "~/features/auth/hooks/use-auth-user";
import { BrandLogo } from "~/shared/components/brand-logo";
import {
  TEACHER_ROUTES,
  teacherNavItems,
} from "../constants/teacher-dashboard.constants";
import { TeacherAccountMenu } from "./teacher-account-menu";
import { MaterialIcon } from "./teacher-icons";

export function TeacherSidebar() {
  const authUser = useAuthUser({ fallbackName: "giảng viên" });

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-svh w-64 flex-col border-r border-outline-variant/20 bg-surface/85 p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur lg:flex">
      <Link className="mb-xl flex items-center gap-sm" to={TEACHER_ROUTES.dashboard}>
        <div className="min-w-0">
          <BrandLogo />
          <p className="text-label-sm font-semibold text-on-surface-variant/70">
            Teacher Portal
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-base overflow-y-auto pr-xs">
        {teacherNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center gap-md rounded-xl bg-secondary-container px-md py-sm text-left font-semibold text-on-secondary-container transition"
                : "flex w-full items-center gap-md rounded-xl px-md py-sm text-left text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
            }
            end={item.to === TEACHER_ROUTES.dashboard}
            key={item.label}
            to={item.to}
          >
            <MaterialIcon>{item.icon}</MaterialIcon>
            <span className="text-label-md font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 pt-md">
        <TeacherAccountMenu user={authUser} />
      </div>
    </aside>
  );
}
