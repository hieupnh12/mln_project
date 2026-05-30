import { Link, NavLink } from "react-router";

import {
  TEACHER_ROUTES,
  teacherNavItems,
  teacherProfile,
} from "../constants/teacher-dashboard.constants";
import { MaterialIcon } from "./teacher-icons";

export function TeacherSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-svh w-64 flex-col border-r border-outline-variant/20 bg-surface/85 p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur lg:flex">
      <Link className="mb-xl flex items-center gap-sm" to={TEACHER_ROUTES.dashboard}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-white">
          <MaterialIcon filled>school</MaterialIcon>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-headline-md font-bold text-primary">
            M-L Master
          </h1>
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
            key={item.label}
            end={item.to === TEACHER_ROUTES.dashboard}
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
            alt="Ảnh đại diện giảng viên"
            className="h-10 w-10 rounded-full object-cover shadow-sm"
            src={teacherProfile.avatarUrl}
          />
          <div className="min-w-0">
            <span className="block truncate text-label-md font-bold text-primary">
              {teacherProfile.name}
            </span>
            <span className="text-label-sm font-semibold text-on-surface-variant/70">
              {teacherProfile.plan}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
