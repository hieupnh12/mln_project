import { Bell, Landmark } from "lucide-react";
import { Link } from "react-router";

import type { AuthUserViewModel } from "~/features/auth/hooks/use-auth-user";

import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import { studentDashboardNavItems } from "../constants/student-dashboard.constants";
import { StudentAccountMenu } from "./student-account-menu";

type StudentDashboardHeaderProps = {
  user: AuthUserViewModel;
};

export function StudentDashboardHeader({ user }: StudentDashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/35 bg-landing-white/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-margin-mobile md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            className="inline-flex min-w-0 items-center gap-3 text-landing-text"
            to={STUDENT_ROUTES.dashboard}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-landing-red to-landing-red-dark text-on-primary shadow-lg shadow-landing-red/15">
              <Landmark aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 truncate font-serif text-xl font-bold">
              Mác - Lê Nin
            </span>
          </Link>

          <nav aria-label="Điều hướng học viên" className="hidden items-center gap-1 lg:flex">
            {studentDashboardNavItems.map((item, index) => (
              <a
                className={
                  index === 0
                    ? "rounded-lg bg-landing-red/10 px-4 py-2 text-label-md font-semibold text-landing-red"
                    : "rounded-lg px-4 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
                }
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Thông báo"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white text-landing-text-soft transition hover:border-landing-red/25 hover:bg-landing-red/5 hover:text-landing-red active:scale-95"
            type="button"
          >
            <Bell aria-hidden="true" className="h-5 w-5" />
          </button>
          <StudentAccountMenu user={user} />
        </div>
      </div>
    </header>
  );
}
