import { NavLink } from "react-router";

import {
  TEACHER_ROUTES,
  teacherNavItems,
} from "../constants/teacher-dashboard.constants";
import { MaterialIcon } from "./teacher-icons";
import { getTeacherNavLinkClassName } from "../utils/teacher-nav-link-classes";

export function TeacherMobileNav() {
  return (
    <nav
      aria-label="Điều hướng giáo viên"
      className="fixed bottom-0 left-0 z-50 flex w-full items-stretch justify-between gap-0.5 border-t border-outline-variant/20 bg-surface-container-lowest px-1 py-2 shadow-[0_-4px_20px_rgba(35,39,51,0.06)] lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {teacherNavItems.map((item) => (
        <NavLink
          className={(state) => getTeacherNavLinkClassName(state, "mobile-bottom")}
          end={item.to === TEACHER_ROUTES.dashboard}
          key={item.to}
          title={item.label}
          to={item.to}
        >
          {({ isActive, isPending }) => (
            <>
              <MaterialIcon className="text-[20px]" filled={isActive || isPending}>
                {item.icon}
              </MaterialIcon>
              <span className="line-clamp-2 w-full text-center text-[10px] font-semibold leading-tight">
                {item.shortLabel}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
