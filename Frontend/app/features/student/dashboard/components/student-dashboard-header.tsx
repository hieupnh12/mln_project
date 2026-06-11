import { Bell } from "lucide-react";
import { Link } from "react-router";

import type { AuthUserViewModel } from "~/features/auth/hooks/use-auth-user";
import { BrandLogo } from "~/shared/components/brand-logo";

import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import { studentDashboardNavItems } from "../constants/student-dashboard.constants";
import { StudentAccountMenu } from "./student-account-menu";

type StudentDashboardHeaderProps = {
  activeSectionHref: string;
  user: AuthUserViewModel;
};

export function StudentDashboardHeader({
  activeSectionHref,
  user,
}: StudentDashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/35 bg-landing-white/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-2 px-margin-mobile sm:gap-4 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            className="inline-flex min-w-0 items-center gap-3 text-landing-text"
            to={STUDENT_ROUTES.dashboard}
          >
            <BrandLogo
              className="[&>span]:hidden min-[360px]:[&>span]:block"
              size="compact"
            />
          </Link>

          <nav aria-label="Điều hướng học viên" className="hidden items-center gap-1 lg:flex">
            {studentDashboardNavItems.map((item) => {
              const isActive = activeSectionHref === item.href;

              return (
              <a
                aria-current={isActive ? "location" : undefined}
                className={
                  isActive
                    ? "rounded-lg bg-landing-red px-3 py-2 text-label-md font-semibold text-on-primary shadow-sm shadow-landing-red/15"
                    : "rounded-lg px-3 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-white hover:text-landing-text"
                }
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
              );
            })}
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
