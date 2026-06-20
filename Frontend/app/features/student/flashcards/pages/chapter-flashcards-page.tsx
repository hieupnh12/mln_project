import { useCallback } from "react";
import { Link, useNavigate } from "react-router";

import { CourseLearningHeader } from "~/features/student/course-learning/components/course-learning-header";
import { CourseLearningSidebar } from "~/features/student/course-learning/components/course-learning-sidebar";
import { CourseMobileNavigation } from "~/features/student/course-learning/components/course-mobile-navigation";
import { useCourseSidebarCollapsed } from "~/features/student/course-learning/hooks/use-course-sidebar-collapsed";
import { getCourseMainLeftPaddingClass } from "~/features/student/course-learning/utils/course-layout-offset.util";
import {
  getStudentCourseFlashcardsTabPath,
  getStudentCourseResumePath,
  STUDENT_ROUTES,
} from "~/features/student/constants/student-routes.constants";
import type { LearningTab } from "~/features/student/types/student.types";

import { FlashcardChapterHeader } from "../components/flashcard-chapter-header";
import { FlashcardEmptyState } from "../components/flashcard-empty-state";
import { FlashcardFlipCard } from "../components/flashcard-flip-card";
import { FlashcardStudyControls } from "../components/flashcard-study-controls";
import { FlashcardStudyProgressBar } from "../components/flashcard-study-progress-bar";
import { FlashcardStudyStatsPanel } from "../components/flashcard-study-stats-panel";
import { FlashcardVocabularyCatalog } from "../components/flashcard-vocabulary-catalog";
import { useChapterFlashcardsSession } from "../hooks/use-chapter-flashcards-session";

type ChapterFlashcardsPageProps = {
  chapterId: number;
};

export function ChapterFlashcardsPage({ chapterId }: ChapterFlashcardsPageProps) {
  const navigate = useNavigate();
  const { collapsed, toggleCollapsed } = useCourseSidebarCollapsed();
  const session = useChapterFlashcardsSession(chapterId);

  const {
    cards,
    completionPercentage,
    currentCard,
    currentIndex,
    estimatedMinutes,
    handleNext,
    handlePrev,
    handleResetProgress,
    handleSpeak,
    handleToggleMaster,
    handleToggleShuffle,
    isFlipped,
    isLoading,
    isShuffled,
    masteredCardIds,
    masteredCount,
    masteryLevel,
    originalCards,
    subjectId,
    toggleFlip,
  } = session;

  const handleTabChange = useCallback(
    (tab: LearningTab) => {
      if (subjectId == null) {
        return;
      }

      navigate(getStudentCourseResumePath(String(subjectId), { tab }));
    },
    [navigate, subjectId],
  );

  if (Number.isNaN(chapterId)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-landing-gray p-gutter">
        <div className="max-w-md rounded-xl border border-error/30 bg-error-container/30 p-gutter text-center">
          <p className="text-body-md font-medium text-error">Chương học không hợp lệ.</p>
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

  const backHref =
    subjectId != null
      ? getStudentCourseFlashcardsTabPath(String(subjectId))
      : STUDENT_ROUTES.dashboard;

  const mainLeftPaddingClass = getCourseMainLeftPaddingClass(collapsed);

  if (isLoading) {
    return (
      <div className="min-h-svh bg-landing-gray font-body-md text-landing-text">
        <CourseLearningHeader />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-gutter">
          <div
            aria-hidden="true"
            className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-outline-variant/35 border-t-secondary"
          />
          <p className="text-body-md font-medium text-landing-text-soft">Đang tải thẻ ghi nhớ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-landing-gray pb-24 font-body-md text-landing-text md:pb-0">
      <CourseLearningHeader />

      <div className="flex w-full items-stretch">
        <CourseLearningSidebar
          activeTab="flashcards"
          collapsed={collapsed}
          onTabChange={handleTabChange}
          onToggleCollapsed={toggleCollapsed}
        />

        <main className={`min-w-0 flex-1 ${mainLeftPaddingClass}`}>
          <div className="mx-auto w-full max-w-[1600px] px-margin-mobile py-md md:pl-gutter md:pr-margin-desktop">
            <FlashcardChapterHeader backHref={backHref} />

            {cards.length === 0 || currentCard == null ? (
              <FlashcardEmptyState backHref={backHref} />
            ) : (
              <div className="space-y-xl">
                <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
                  <div className="flex flex-col items-center">
                    <div className="mb-sm flex w-full max-w-4xl justify-end">
                      <span className="rounded-full bg-secondary-container/45 px-3 py-1 text-label-sm font-bold text-secondary">
                        Thẻ {currentIndex + 1} / {cards.length}
                      </span>
                    </div>

                    <FlashcardStudyProgressBar
                      currentIndex={currentIndex}
                      totalCards={cards.length}
                    />

                    <FlashcardFlipCard
                      card={currentCard}
                      isFlipped={isFlipped}
                      isMastered={masteredCardIds.has(currentCard.id)}
                      onSpeak={handleSpeak}
                      onToggleFlip={toggleFlip}
                      onToggleMaster={handleToggleMaster}
                    />

                    <FlashcardStudyControls
                      currentIndex={currentIndex}
                      isShuffled={isShuffled}
                      onNext={handleNext}
                      onPrev={handlePrev}
                      onReset={handleResetProgress}
                      onToggleShuffle={handleToggleShuffle}
                      totalCards={cards.length}
                    />
                  </div>

                  <FlashcardStudyStatsPanel
                    completionPercentage={completionPercentage}
                    estimatedMinutes={estimatedMinutes}
                    masteredCount={masteredCount}
                    masteryLevel={masteryLevel}
                    totalCards={originalCards.length}
                  />
                </div>

                <FlashcardVocabularyCatalog
                  cards={originalCards}
                  masteredCardIds={masteredCardIds}
                  masteredCount={masteredCount}
                  onSpeak={handleSpeak}
                  onToggleMaster={handleToggleMaster}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <CourseMobileNavigation />
    </div>
  );
}
