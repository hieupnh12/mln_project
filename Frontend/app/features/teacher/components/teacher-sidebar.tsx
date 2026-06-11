import { Link, NavLink } from "react-router";

import { useAuthUser } from "~/features/auth/hooks/use-auth-user";
import { BrandLogo } from "~/shared/components/brand-logo";
import {
  TEACHER_ROUTES,
  teacherNavItems,
} from "../constants/teacher-dashboard.constants";
import { TeacherAccountMenu } from "./teacher-account-menu";
import { MaterialIcon } from "./teacher-icons";
import { TeacherSidebarToggle } from "./teacher-sidebar-toggle";
import { getTeacherNavLinkClassName } from "../utils/teacher-nav-link-classes";

type TeacherSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  sidebarWidthClass: string;
};

export function TeacherSidebar({
  collapsed,
  onToggle,
  sidebarWidthClass,
}: TeacherSidebarProps) {
  const authUser = useAuthUser({ fallbackName: "giảng viên" });

  return (
    <aside
      className={`fixed left-0 top-0 z-50 hidden h-svh flex-col border-r border-outline-variant/20 bg-surface/85 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur transition-[width,padding] duration-200 ease-out lg:flex ${sidebarWidthClass} ${collapsed ? "px-2 py-md" : "p-md"}`}
    >
      <div
        className={
          collapsed
            ? "mb-md flex justify-center"
            : "mb-xl flex items-center justify-between gap-sm"
        }
      >
        {collapsed ? (
          <TeacherSidebarToggle collapsed={collapsed} onToggle={onToggle} />
        ) : (
          <>
            <Link className="flex min-w-0 flex-1 items-center gap-sm" to={TEACHER_ROUTES.dashboard}>
              <div className="min-w-0">
                <BrandLogo />
                <p className="text-label-sm font-semibold text-on-surface-variant/70">
                  Teacher Portal
                </p>
              </div>
            </Link>
            <TeacherSidebarToggle collapsed={collapsed} onToggle={onToggle} />
          </>
        )}
      </div>

      <nav
        className={`flex-1 overflow-y-auto pr-xs ${collapsed ? "space-y-1" : "space-y-base"}`}
      >
        {teacherNavItems.map((item) => (
          <NavLink
            className={(state) =>
              getTeacherNavLinkClassName(
                state,
                collapsed ? "sidebar-collapsed" : "sidebar",
              )
            }
            end={item.to === TEACHER_ROUTES.dashboard}
            key={item.label}
            title={item.label}
            to={item.to}
          >
            <MaterialIcon className={collapsed ? "text-[22px]" : undefined}>
              {item.icon}
            </MaterialIcon>
            {collapsed ? (
              <span className="line-clamp-2 w-full px-0.5 text-[10px] font-semibold leading-tight">
                {item.shortLabel}
              </span>
            ) : (
              <span className="text-label-md font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`mt-auto border-t border-outline-variant/20 ${collapsed ? "pt-sm" : "pt-md"}`}
      >
        <TeacherAccountMenu collapsed={collapsed} user={authUser} />
      </div>
    </aside>
  );
}
