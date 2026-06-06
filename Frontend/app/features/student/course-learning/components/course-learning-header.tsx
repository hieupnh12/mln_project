import { Link } from "react-router";

import { useAuthUser } from "~/features/auth/hooks/use-auth-user";
import { useLogout } from "~/features/auth/hooks/use-logout";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { STUDENT_ROUTES } from "../../constants/student-routes.constants";

function getUserInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.charAt(0) ?? ""}${parts[parts.length - 1]?.charAt(0) ?? ""}`.toUpperCase();
  }

  return (parts[0]?.slice(0, 2) ?? "HV").toUpperCase();
}

export function CourseLearningHeader() {
  const logout = useLogout();
  const authUser = useAuthUser();
  const initials = getUserInitials(authUser.name);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/50 bg-surface/95 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-6 sm:gap-8">
          <Link
            className="flex min-w-0 items-center gap-2 text-on-surface-variant transition hover:text-primary"
            to={STUDENT_ROUTES.dashboard}
          >
            <MaterialIcon>arrow_back</MaterialIcon>
            <span className="truncate text-label-md font-medium">Trở về Trang chủ</span>
          </Link>

          <h1 className="min-w-0 truncate text-headline-md">
            <span className="font-bold text-primary">ML</span>
            <span className="font-normal text-on-surface-variant"> Learning</span>
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            aria-label="Thông báo"
            className="relative rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50 active:scale-95"
            type="button"
          >
            <MaterialIcon>notifications</MaterialIcon>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
          </button>

          <div aria-hidden className="hidden h-6 w-px bg-outline-variant sm:block" />

          {authUser.avatarUrl ? (
            <img
              alt="Ảnh đại diện học sinh"
              className="h-9 w-9 rounded-full object-cover"
              referrerPolicy="no-referrer"
              src={authUser.avatarUrl}
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-label-sm font-bold text-on-primary">
              {initials}
            </span>
          )}

          <button
            aria-label="Đăng xuất"
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50 active:scale-95"
            onClick={logout}
            title="Đăng xuất"
            type="button"
          >
            <MaterialIcon>logout</MaterialIcon>
          </button>
        </div>
      </div>
    </header>
  );
}
