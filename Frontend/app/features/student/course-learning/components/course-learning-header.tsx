import { ArrowLeft, Bell, Landmark } from "lucide-react";
import { Link } from "react-router";

import { useAuthUser } from "~/features/auth/hooks/use-auth-user";

import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import { StudentAccountMenu } from "../../dashboard/components/student-account-menu";

export function CourseLearningHeader() {
  const authUser = useAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/35 bg-landing-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-4 px-margin-mobile md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link
            aria-label="Trở về trang học viên"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white text-landing-text-soft transition hover:border-landing-red/25 hover:bg-landing-red/5 hover:text-landing-red"
            to={STUDENT_ROUTES.dashboard}
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>

          <Link
            className="inline-flex min-w-0 items-center gap-3 text-landing-text"
            to={STUDENT_ROUTES.dashboard}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-landing-red to-landing-red-dark text-on-primary shadow-lg shadow-landing-red/15">
              <Landmark aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 truncate font-serif text-lg font-bold sm:text-xl">
              Mác - Lê Nin
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Thông báo"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white text-landing-text-soft transition hover:border-landing-red/25 hover:text-landing-red"
            type="button"
          >
            <Bell aria-hidden="true" className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-landing-red" />
          </button>
          <StudentAccountMenu user={authUser} />
        </div>
      </div>
    </header>
  );
}
