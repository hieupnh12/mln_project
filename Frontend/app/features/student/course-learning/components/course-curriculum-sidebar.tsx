import { ListTree, PanelRightOpen } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { getChapterVisualStateFromProgress } from "../../student-progress/utils/chapter-progress-visual-state.util";
import { COURSE_LEARNING_QUERY_KEYS } from "../constants/course-learning-api.constants";
import { useCourseChaptersQuery } from "../hooks/use-course-learning-queries";
import { getLessonsByChapterId } from "../services/course-learning.service";
import type { CourseMaterialSummary } from "../types/course-learning.types";
import { CourseCurriculumPanel } from "./course-curriculum-panel";
import { CourseCurriculumQuickRail } from "./course-curriculum-quick-rail";

const curriculumSidebarExpandedClass =
  "hidden w-[min(340px,30vw)] shrink-0 flex-col overflow-hidden border-l border-outline-variant/35 bg-landing-white xl:fixed xl:right-0 xl:top-16 xl:z-30 xl:flex xl:h-[calc(100vh-4rem)] xl:max-h-[calc(100vh-4rem)]";

const curriculumSidebarCollapsedClass =
  "hidden w-[4.5rem] shrink-0 flex-col overflow-hidden border-l border-outline-variant/35 bg-landing-white xl:fixed xl:right-0 xl:top-16 xl:z-30 xl:flex xl:h-[calc(100vh-4rem)] xl:max-h-[calc(100vh-4rem)]";

const curriculumSidebarMobileClass =
  "flex max-h-[75vh] w-full flex-col overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white p-4 shadow-xl shadow-landing-text/5 xl:hidden";

type CourseCurriculumSidebarProps = {
  collapsed: boolean;
  hideMobilePanel?: boolean;
  subjectId: number;
  expandedChapterId: number | null;
  expandedLessonId: number | null;
  selectedMaterialId: number | null;
  onToggleChapter: (chapterId: number) => void;
  onToggleCollapsed: () => void;
  onToggleLesson: (chapterId: number, lessonId: number) => void;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
};

export function CourseCurriculumSidebar({
  collapsed,
  hideMobilePanel = false,
  subjectId,
  expandedChapterId,
  expandedLessonId,
  selectedMaterialId,
  onToggleChapter,
  onToggleCollapsed,
  onToggleLesson,
  onSelectMaterial,
}: CourseCurriculumSidebarProps) {
  const chaptersQuery = useCourseChaptersQuery(subjectId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const chapters = chaptersQuery.data ?? [];
  const subjectProgress = progressQuery.data ?? [];
  const chapterStates = useMemo(
    () =>
      new Map(
        chapters.map((chapter) => [
          chapter.id,
          getChapterVisualStateFromProgress(chapter, subjectProgress, chapters),
        ]),
      ),
    [chapters, subjectProgress],
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    chapters.forEach((chapter) => {
      void queryClient.prefetchQuery({
        queryKey: COURSE_LEARNING_QUERY_KEYS.lessons(chapter.id),
        queryFn: () => getLessonsByChapterId(chapter.id),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [chapters, queryClient]);

  const panelProps = {
    expandedChapterId,
    expandedLessonId,
    onSelectMaterial,
    onToggleChapter,
    onToggleLesson,
    selectedMaterialId,
    subjectId,
  };

  const mobilePanel = hideMobilePanel ? null : (
    <aside aria-label="Lộ trình môn học" className={curriculumSidebarMobileClass}>
      <CourseCurriculumPanel {...panelProps} />
    </aside>
  );

  if (collapsed) {
    return (
      <>
        <aside
          aria-label="Lộ trình môn học"
          className={curriculumSidebarCollapsedClass}
        >
          <div className="flex shrink-0 flex-col items-center gap-1 border-b border-outline-variant/25 p-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-container/40 text-secondary"
              title="Lộ trình môn học"
            >
              <ListTree aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="text-label-sm font-semibold text-secondary">{chapters.length}</span>
          </div>

          {chaptersQuery.isLoading ? (
            <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2 py-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="h-9 w-9 animate-pulse rounded-lg bg-landing-gray" key={index} />
              ))}
            </div>
          ) : (
            <CourseCurriculumQuickRail
              chapterStates={chapterStates}
              chapters={chapters}
              expandedChapterId={expandedChapterId}
              onSelectMaterial={onSelectMaterial}
              onToggleChapter={onToggleChapter}
            />
          )}

          <div className="mt-auto shrink-0 border-t border-outline-variant/25 bg-landing-white p-2">
            <button
              aria-label="Mở rộng lộ trình môn học"
              className="flex h-10 w-full items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
              onClick={onToggleCollapsed}
              type="button"
            >
              <PanelRightOpen aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {mobilePanel}
      </>
    );
  }

  return (
    <>
      <aside
        aria-label="Lộ trình môn học"
        className={`${curriculumSidebarExpandedClass} flex flex-col p-4`}
      >
        <CourseCurriculumPanel {...panelProps} onToggleCollapsed={onToggleCollapsed} />
      </aside>

      {mobilePanel}
    </>
  );
}
