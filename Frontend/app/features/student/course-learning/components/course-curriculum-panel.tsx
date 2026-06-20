import { ListTree, PanelRightClose, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { getChapterVisualStateFromProgress } from "../../student-progress/utils/chapter-progress-visual-state.util";
import { buildLessonProgressMap } from "../../student-progress/utils/student-progress-resume.util";
import { COURSE_LEARNING_QUERY_KEYS } from "../constants/course-learning-api.constants";
import { useCourseChaptersQuery } from "../hooks/use-course-learning-queries";
import { getLessonsByChapterId } from "../services/course-learning.service";
import type { CourseMaterialSummary } from "../types/course-learning.types";
import { CourseCurriculumChapter } from "./course-curriculum-chapter";
import { CourseMaterialDownloadButton } from "./course-material-download-button";

type CourseCurriculumPanelProps = {
  expandedChapterId: number | null;
  expandedLessonId: number | null;
  onClose?: () => void;
  onToggleCollapsed?: () => void;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
  onToggleChapter: (chapterId: number) => void;
  onToggleLesson: (chapterId: number, lessonId: number) => void;
  selectedMaterialId: number | null;
  showCloseButton?: boolean;
  subjectId: number;
};

export function CourseCurriculumPanel({
  expandedChapterId,
  expandedLessonId,
  onClose,
  onToggleCollapsed,
  onSelectMaterial,
  onToggleChapter,
  onToggleLesson,
  selectedMaterialId,
  showCloseButton = false,
  subjectId,
}: CourseCurriculumPanelProps) {
  const chaptersQuery = useCourseChaptersQuery(subjectId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const chapters = chaptersQuery.data ?? [];
  const subjectProgress = progressQuery.data ?? [];
  const lessonProgressMap = useMemo(
    () => buildLessonProgressMap(subjectProgress),
    [subjectProgress],
  );
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

  function handleSelectMaterial(material: CourseMaterialSummary, chapterId: number) {
    onSelectMaterial(material, chapterId);
    onClose?.();
  }

  return (
    <>
      <div className="mb-md flex shrink-0 items-start justify-between gap-3 border-b border-outline-variant/25 pb-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-label-md font-semibold text-secondary">
            <ListTree aria-hidden="true" className="h-5 w-5 shrink-0" />
            Lộ trình môn học
          </p>
          <p className="mt-1 text-label-sm text-landing-text-soft">
            Chọn bài học và tài liệu
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-secondary-container/55 px-3 py-1 text-label-sm font-semibold text-secondary">
            {chapters.length} chương
          </span>
          {showCloseButton && onClose ? (
            <button
              aria-label="Đóng lộ trình môn học"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
          {onToggleCollapsed ? (
            <button
              aria-label="Thu gọn lộ trình môn học"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text xl:inline-flex"
              onClick={onToggleCollapsed}
              type="button"
            >
              <PanelRightClose aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {chaptersQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="h-20 animate-pulse rounded-xl bg-landing-gray" key={index} />
            ))
          : null}

        {chaptersQuery.isError ? (
          <div className="rounded-xl border border-error/30 bg-error-container/30 p-3">
            <p className="text-label-md text-error">Không tải được danh sách chương.</p>
            <button
              className="mt-2 inline-flex items-center gap-2 text-label-sm font-semibold text-error underline"
              onClick={() => chaptersQuery.refetch()}
              type="button"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : null}

        {!chaptersQuery.isLoading && !chaptersQuery.isError
          ? chapters.map((chapter) => (
              <CourseCurriculumChapter
                chapter={chapter}
                expandedLessonId={expandedLessonId}
                isExpanded={expandedChapterId === chapter.id}
                key={chapter.id}
                lessonProgressMap={lessonProgressMap}
                onSelectMaterial={handleSelectMaterial}
                onToggleChapter={() => onToggleChapter(chapter.id)}
                onToggleLesson={onToggleLesson}
                selectedMaterialId={selectedMaterialId}
                state={chapterStates.get(chapter.id) ?? "open"}
              />
            ))
          : null}

        {!chaptersQuery.isLoading && !chaptersQuery.isError && chapters.length === 0 ? (
          <p className="rounded-xl bg-landing-gray p-4 text-label-md text-landing-text-soft">
            Chưa có chương nào cho môn học này.
          </p>
        ) : null}
      </div>

      <div className="mt-md shrink-0">
        <CourseMaterialDownloadButton selectedMaterialId={selectedMaterialId} />
      </div>
    </>
  );
}
