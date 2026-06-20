import { RefreshCw } from "lucide-react";
import { Link } from "react-router";

import { CourseExamCatalogPanel } from "../../exams/components/course-exam-catalog-panel";
import { CourseCurriculumSidebar } from "../components/course-curriculum-sidebar";
import { CourseFlashcardCatalog } from "../components/course-flashcard-catalog";
import { CourseLearningHeader } from "../components/course-learning-header";
import { CourseLearningSidebar } from "../components/course-learning-sidebar";
import { CourseMaterialViewer } from "../components/course-material-viewer";
import { CourseMobileCurriculumSheet } from "../components/course-mobile-curriculum-sheet";
import { CourseMobileNavigation } from "../components/course-mobile-navigation";
import { CoursePracticePanel } from "../components/course-practice-panel";
import { CourseTabs } from "../components/course-tabs";
import { COURSE_MOBILE_BOTTOM_NAV_OFFSET_CLASS } from "../constants/course-mobile-layout.constants";
import { useCourseCurriculumSidebarCollapsed } from "../hooks/use-course-curriculum-sidebar-collapsed";
import { useCourseLessonKeyboard } from "../hooks/use-course-lesson-keyboard";
import { useCourseLessonNavigation } from "../hooks/use-course-lesson-navigation";
import { useCourseMobileCurriculumSheet } from "../hooks/use-course-mobile-curriculum-sheet";
import { useCourseSidebarCollapsed } from "../hooks/use-course-sidebar-collapsed";
import { useStudentCoursePage } from "../hooks/use-student-course-page";
import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import { getCourseMainLeftPaddingClass, getCourseMainRightPaddingClass } from "../utils/course-layout-offset.util";

export function StudentCoursePage() {
  const coursePage = useStudentCoursePage();
  const { collapsed, toggleCollapsed } = useCourseSidebarCollapsed();
  const { collapsed: curriculumCollapsed, toggleCollapsed: toggleCurriculumCollapsed } =
    useCourseCurriculumSidebarCollapsed();
  const {
    closeCurriculum,
    isOpen: isCurriculumSheetOpen,
    openCurriculum,
  } = useCourseMobileCurriculumSheet();

  const {
    activeTab,
    chapters,
    chaptersQuery,
    expandedChapterId,
    expandedLessonId,
    flashcardSetsQuery,
    handleGoToLesson,
    handleSelectMaterial,
    handleTabChange,
    handleToggleChapter,
    handleToggleLesson,
    selectedMaterialId,
    subject,
    subjectId,
    subjectQuery,
  } = coursePage;

  const showCurriculumSidebar = activeTab === "lectures" && subjectId != null;
  const isLecturesLayout = activeTab === "lectures" && subjectId != null;
  const isViewingMaterial = isLecturesLayout && selectedMaterialId != null;

  const lessonNavigation = useCourseLessonNavigation({
    chapters: subjectId != null ? chapters : [],
    expandedChapterId,
    expandedLessonId,
    onGoToLesson: handleGoToLesson,
    subjectId: subjectId ?? 0,
  });

  useCourseLessonKeyboard({
    canGoNext: lessonNavigation.canGoNext,
    canGoPrevious: lessonNavigation.canGoPrevious,
    enabled: subjectId != null && lessonNavigation.isVisible,
    onGoToNextLesson: lessonNavigation.goToNextLesson,
    onGoToPreviousLesson: lessonNavigation.goToPreviousLesson,
  });

  if (subjectId == null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-landing-gray p-gutter">
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

  const mainLeftPaddingClass = getCourseMainLeftPaddingClass(collapsed);
  const mainRightPaddingClass = getCourseMainRightPaddingClass(
    curriculumCollapsed,
    showCurriculumSidebar,
  );

  const lecturesRootClassName = isViewingMaterial
    ? "flex h-svh flex-col overflow-hidden bg-landing-gray font-body-md text-landing-text"
    : "flex min-h-svh flex-col bg-landing-gray font-body-md text-landing-text xl:h-svh xl:overflow-hidden";

  return (
    <div className={isLecturesLayout ? lecturesRootClassName : "min-h-svh bg-landing-gray pb-24 font-body-md text-landing-text md:pb-0"}>
      <CourseLearningHeader />

      <div
        className={
          isLecturesLayout
            ? "flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row"
            : "flex w-full items-stretch"
        }
      >
        <CourseLearningSidebar
          activeTab={activeTab}
          collapsed={collapsed}
          onTabChange={handleTabChange}
          onToggleCollapsed={toggleCollapsed}
        />

        <main
          className={`min-w-0 flex-1 ${mainLeftPaddingClass} ${mainRightPaddingClass} ${
            isLecturesLayout ? "flex min-h-0 flex-col overflow-hidden" : ""
          }`}
        >
          <div
            className={
              isLecturesLayout
                ? `mx-auto flex h-full w-full min-h-0 flex-col overflow-hidden px-margin-mobile md:pl-gutter md:pr-margin-desktop ${
                    isViewingMaterial
                      ? `pt-2 xl:max-w-none xl:pr-gutter ${COURSE_MOBILE_BOTTOM_NAV_OFFSET_CLASS} md:pb-0`
                      : "py-md max-w-[1600px]"
                  }`
                : "mx-auto w-full max-w-[1600px] px-margin-mobile py-md md:pl-gutter md:pr-margin-desktop"
            }
          >
            {subjectQuery.isError ? (
              <div className="mb-md rounded-xl border border-error/30 bg-error-container/30 p-gutter">
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
            ) : null}

            <CourseTabs
              activeTab={activeTab}
              className={isViewingMaterial ? "mb-2 shrink-0" : undefined}
              onTabChange={handleTabChange}
            />

            <div
              className={
                isLecturesLayout
                  ? isViewingMaterial
                    ? "min-h-0 flex-1 overflow-hidden"
                    : "min-h-0 flex-1 overflow-y-auto pb-24 md:pb-0"
                  : "min-w-0"
              }
            >
              {activeTab === "lectures" ? (
                <CourseMaterialViewer
                  expandedChapterId={expandedChapterId}
                  fitToViewport={isViewingMaterial}
                  onOpenCurriculum={openCurriculum}
                  selectedMaterialId={selectedMaterialId}
                  showMobileToolbar={isViewingMaterial}
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
          </div>
        </main>

        {showCurriculumSidebar ? (
          <CourseCurriculumSidebar
            collapsed={curriculumCollapsed}
            expandedChapterId={expandedChapterId}
            expandedLessonId={expandedLessonId}
            hideMobilePanel={isViewingMaterial}
            onSelectMaterial={handleSelectMaterial}
            onToggleChapter={handleToggleChapter}
            onToggleCollapsed={toggleCurriculumCollapsed}
            onToggleLesson={handleToggleLesson}
            selectedMaterialId={selectedMaterialId}
            subjectId={subjectId}
          />
        ) : null}
      </div>

      <CourseMobileNavigation />

      {isViewingMaterial ? (
        <CourseMobileCurriculumSheet
          expandedChapterId={expandedChapterId}
          expandedLessonId={expandedLessonId}
          isOpen={isCurriculumSheetOpen}
          onClose={closeCurriculum}
          onSelectMaterial={handleSelectMaterial}
          onToggleChapter={handleToggleChapter}
          onToggleLesson={handleToggleLesson}
          selectedMaterialId={selectedMaterialId}
          subjectId={subjectId}
        />
      ) : null}
    </div>
  );
}
