import { Link, useLocation } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";
import { ADMIN_ROUTES } from "~/features/admin/constants/admin-dashboard.constants";
import { TEACHER_ROUTES } from "~/features/teacher/constants/teacher-dashboard.constants";

type WorkspaceSwitcherProps = {
  variant?: "button" | "nav" | "compact";
  className?: string;
};

export function WorkspaceSwitcher({
  variant = "button",
  className = "",
}: WorkspaceSwitcherProps) {
  const session = getAuthSession();
  const location = useLocation();

  if (session?.role !== "admin") {
    return null;
  }

  const onTeacherSide =
    location.pathname === "/teacher" || location.pathname.startsWith("/teacher/");
  const targetTo = onTeacherSide ? ADMIN_ROUTES.dashboard : TEACHER_ROUTES.dashboard;
  const label = onTeacherSide ? "Sang Quản trị Admin" : "Sang Quản lý Giảng viên";
  const shortLabel = onTeacherSide ? "Admin" : "Giảng viên";

  if (variant === "compact") {
    return (
      <Link
        className={`inline-flex items-center justify-center rounded-lg border border-outline-variant/40 bg-white px-2.5 py-1.5 text-label-sm font-semibold text-primary transition hover:bg-surface-container-low ${className}`}
        to={targetTo}
      >
        {shortLabel}
      </Link>
    );
  }

  if (variant === "nav") {
    return (
      <Link
        className={`flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-secondary-container/35 px-md py-sm text-label-md font-semibold text-primary transition hover:bg-secondary-container/55 ${className}`}
        to={targetTo}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-lg bg-secondary-container px-4 py-2 text-label-md font-semibold text-primary transition hover:opacity-90 ${className}`}
      to={targetTo}
    >
      {label}
    </Link>
  );
}
