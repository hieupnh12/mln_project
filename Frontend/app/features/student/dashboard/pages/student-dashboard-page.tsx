import { useAuthUser } from "~/features/auth/hooks/use-auth-user";

import { StudentCurriculumSection } from "../components/student-curriculum-section";
import { StudentDashboardHeader } from "../components/student-dashboard-header";
import { StudentMobileNavigation } from "../components/student-mobile-navigation";
import { useActiveDashboardSection } from "../hooks/use-active-dashboard-section";

export function StudentDashboardPage() {
  const authUser = useAuthUser();
  const activeSectionHref = useActiveDashboardSection();

  return (
    <div className="min-h-svh max-w-full overflow-x-clip bg-landing-gray pb-8 font-body-md text-landing-text md:pb-0">
      <StudentDashboardHeader
        activeSectionHref={activeSectionHref}
        user={authUser}
      />

      <main className="mx-auto w-full min-w-0 max-w-7xl space-y-xl px-margin-mobile py-6 md:px-margin-desktop md:py-8">
        <StudentCurriculumSection />
      </main>

      <StudentMobileNavigation activeSectionHref={activeSectionHref} />
    </div>
  );
}
