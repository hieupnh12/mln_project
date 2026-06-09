import { ListTree, RefreshCw } from "lucide-react";
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

type CourseCurriculumSidebarProps = {
  subjectId: number;
  expandedChapterId: number | null;
  expandedLessonId: number | null;
  selectedMaterialId: number | null;
  onToggleChapter: (chapterId: number) => void;
  onToggleLesson: (chapterId: number, lessonId: number) => void;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
};

export function CourseCurriculumSidebar({
  subjectId,
  expandedChapterId,
  expandedLessonId,
  selectedMaterialId,
  onToggleChapter,
  onToggleLesson,
  onSelectMaterial,
}: CourseCurriculumSidebarProps) {
  const chaptersQuery = useCourseChaptersQuery(subjectId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const chapters = chaptersQuery.data ?? [];
  const subjectProgress = progressQuery.data ?? [];
  const lessonProgressMap = useMemo(
    () => buildLessonProgressMap(subjectProgress),
    [subjectProgress],
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

  return (
    <aside className="flex max-h-[75vh] flex-col rounded-xl border border-outline-variant/35 bg-landing-white p-4 shadow-xl shadow-landing-text/5 xl:h-full xl:max-h-[calc(100vh-10rem)]">
      <div className="mb-md flex items-start justify-between gap-3 border-b border-outline-variant/25 pb-4">
        <div>
          <p className="flex items-center gap-2 text-label-md font-semibold text-landing-red">
            <ListTree aria-hidden="true" className="h-5 w-5" />
            Lộ trình môn học
          </p>
          <p className="mt-1 text-label-sm text-landing-text-soft">
            Chọn bài học và tài liệu
          </p>
        </div>
        <span className="rounded-full bg-landing-red/10 px-3 py-1 text-label-sm font-semibold text-landing-red">
          {chapters.length} chương
        </span>
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
        {chaptersQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                className="h-20 animate-pulse rounded-xl bg-landing-gray"
                key={index}
              />
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
                onSelectMaterial={onSelectMaterial}
                onToggleChapter={() => onToggleChapter(chapter.id)}
                onToggleLesson={onToggleLesson}
                selectedMaterialId={selectedMaterialId}
                state={getChapterVisualStateFromProgress(
                  chapter,
                  subjectProgress,
                  chapters,
                )}
              />
            ))
          : null}

        {!chaptersQuery.isLoading &&
        !chaptersQuery.isError &&
        chapters.length === 0 ? (
          <p className="rounded-xl bg-landing-gray p-4 text-label-md text-landing-text-soft">
            Chưa có chương nào cho môn học này.
          </p>
        ) : null}
      </div>

      <CourseMaterialDownloadButton selectedMaterialId={selectedMaterialId} />
    </aside>
  );
}
