import { useAuthUser } from "~/features/auth/hooks/use-auth-user";

import {
  getStudentCoursePath,
  getStudentCourseResumePath,
} from "../../constants/student-routes.constants";
import { useStudentResumeQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { StudentCurriculumSection } from "../components/student-curriculum-section";
import { StudentDashboardHeader } from "../components/student-dashboard-header";
import { StudentDashboardOverview } from "../components/student-dashboard-overview";
import { StudentMobileNavigation } from "../components/student-mobile-navigation";
import { StudentPdfDocumentsSection } from "../components/student-pdf-documents-section";
import { StudentWelcomePanel } from "../components/student-welcome-panel";
import { useSubjects } from "../hooks/dashboard.hooks";
import { useActiveDashboardSection } from "../hooks/use-active-dashboard-section";

export function StudentDashboardPage() {
  const { data: subjects } = useSubjects();
  const authUser = useAuthUser();
  const resumeQuery = useStudentResumeQuery();
  const activeSectionHref = useActiveDashboardSection();

  const featuredCoursePath = resumeQuery.data
    ? getStudentCourseResumePath(String(resumeQuery.data.subjectId), {
        chapterId: resumeQuery.data.chapterId || undefined,
        lessonId: resumeQuery.data.lessonId || undefined,
        materialId: resumeQuery.data.materialId ?? undefined,
      })
    : subjects?.[0]
      ? getStudentCoursePath(String(subjects[0].id))
      : "#curriculum";

  return (
    <div className="min-h-svh max-w-full overflow-x-clip bg-landing-gray pb-24 font-body-md text-landing-text md:pb-0">
      <StudentDashboardHeader
        activeSectionHref={activeSectionHref}
        user={authUser}
      />

      <main className="mx-auto w-full min-w-0 max-w-7xl space-y-xl px-margin-mobile py-6 md:px-margin-desktop md:py-8">
        <StudentWelcomePanel
          featuredCoursePath={featuredCoursePath}
          hasResumePoint={Boolean(resumeQuery.data)}
          userName={authUser.name}
        />
        <div className="min-w-0 space-y-xl">
          <StudentCurriculumSection />
          <StudentPdfDocumentsSection />
          <StudentDashboardOverview />
        </div>
      </main>

      <StudentMobileNavigation activeSectionHref={activeSectionHref} />
    </div>
  );
}
