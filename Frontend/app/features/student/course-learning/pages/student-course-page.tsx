import { RefreshCw } from "lucide-react";
import { Link } from "react-router";

import { CourseExamCatalogPanel } from "../../exams/components/course-exam-catalog-panel";
import { CourseCurriculumSidebar } from "../components/course-curriculum-sidebar";
import { CourseFlashcardCatalog } from "../components/course-flashcard-catalog";
import { CourseLearningHeader } from "../components/course-learning-header";
import { CourseMaterialViewer } from "../components/course-material-viewer";
import { CourseMobileNavigation } from "../components/course-mobile-navigation";
import { CoursePracticePanel } from "../components/course-practice-panel";
import { CourseSubjectHeading } from "../components/course-subject-heading";
import { CourseTabs } from "../components/course-tabs";
import { useStudentCoursePage } from "../hooks/use-student-course-page";
import { STUDENT_ROUTES } from "../../constants/student-routes.constants";

export function StudentCoursePage() {
  const coursePage = useStudentCoursePage();

  if (coursePage.subjectId == null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-landing-cream p-gutter">
        <div className="max-w-md rounded-xl border border-error/30 bg-error-container/30 p-gutter text-center">
          <p className="text-body-md font-medium text-error">Khóa học không hợp lệ.</p>
          <Link
            className="mt-4 inline-flex rounded-lg bg-landing-red px-5 py-2 text-label-md font-medium text-on-primary"
            to={STUDENT_ROUTES.dashboard}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const {
    activeTab,
    chapters,
    chaptersQuery,
    expandedChapterId,
    expandedLessonId,
    flashcardSetsQuery,
    handleGoToNextLesson,
    handleSelectMaterial,
    handleTabChange,
    handleToggleChapter,
    handleToggleLesson,
    selectedMaterialId,
    subject,
    subjectId,
    subjectQuery,
  } = coursePage;

  const isWideContent = activeTab === "practice" || activeTab === "exams";

  return (
    <div className="min-h-svh bg-landing-cream pb-24 font-body-md text-landing-text md:pb-0">
      <CourseLearningHeader />

      <main className="mx-auto w-full max-w-[1600px] px-margin-mobile py-md md:px-margin-desktop">
        <div className="mb-md">
          {subjectQuery.isLoading ? (
            <div className="h-36 animate-pulse rounded-xl bg-landing-white" />
          ) : subjectQuery.isError ? (
            <div className="rounded-xl border border-error/30 bg-error-container/30 p-gutter">
              <h1 className="text-headline-md font-semibold text-error">
                Không tải được thông tin môn học
              </h1>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-4 py-2 text-label-md font-semibold text-on-primary"
                onClick={() => subjectQuery.refetch()}
                type="button"
              >
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                Thử lại
              </button>
            </div>
          ) : subject ? (
            <CourseSubjectHeading code={subject.code} title={subject.title} />
          ) : null}
        </div>

        <CourseTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div
          className={
            isWideContent
              ? "min-w-0"
              : "grid grid-cols-1 gap-gutter xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start"
          }
        >
          <div className="min-w-0 space-y-md">
            {activeTab === "lectures" ? (
              <CourseMaterialViewer
                expandedChapterId={expandedChapterId}
                onGoToNextLesson={handleGoToNextLesson}
                selectedMaterialId={selectedMaterialId}
                subject={subject}
                subjectId={subjectId}
              />
            ) : null}

            {activeTab === "flashcards" ? (
              <CourseFlashcardCatalog
                chapters={chapters}
                flashcardSets={flashcardSetsQuery.data}
                isLoading={chaptersQuery.isLoading || flashcardSetsQuery.isLoading}
              />
            ) : null}

            {activeTab === "practice" ? (
              <CoursePracticePanel active subjectId={subjectId} />
            ) : null}

            {activeTab === "exams" ? (
              <CourseExamCatalogPanel
                active
                courseTitle={subject?.title}
                subjectId={subjectId}
              />
            ) : null}
          </div>

          {activeTab === "lectures" ? (
            <div className="min-w-0 xl:sticky xl:top-36 xl:h-[calc(100vh-10rem)] xl:self-start">
              <CourseCurriculumSidebar
                expandedChapterId={expandedChapterId}
                expandedLessonId={expandedLessonId}
                onSelectMaterial={handleSelectMaterial}
                onToggleChapter={handleToggleChapter}
                onToggleLesson={handleToggleLesson}
                selectedMaterialId={selectedMaterialId}
                subjectId={subjectId}
              />
            </div>
          ) : null}
        </div>
      </main>

      <CourseMobileNavigation />
    </div>
  );
}
