import { useQueryClient } from "@tanstack/react-query";

import type { StudentChapterState } from "../../types/student.types";
import { COURSE_LEARNING_QUERY_KEYS } from "../constants/course-learning-api.constants";
import { getLessonsByChapterId } from "../services/course-learning.service";
import type {
  CourseChapterItem,
  CourseMaterialSummary,
} from "../types/course-learning.types";

type CourseCurriculumQuickRailProps = {
  chapters: CourseChapterItem[];
  expandedChapterId: number | null;
  chapterStates: Map<number, StudentChapterState>;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
  onToggleChapter: (chapterId: number) => void;
};

function getQuickButtonClassName(state: StudentChapterState, isActive: boolean) {
  if (state === "locked") {
    return "cursor-not-allowed border-outline-variant/30 bg-landing-gray/70 text-landing-text-soft/60";
  }
  if (isActive) {
    return "border-secondary bg-secondary text-on-secondary shadow-sm";
  }
  if (state === "done") {
    return "border-secondary/25 bg-secondary-container/35 text-secondary hover:bg-secondary-container/55";
  }
  if (state === "active") {
    return "border-landing-gold/35 bg-landing-gold/10 text-landing-text hover:bg-landing-gold/20";
  }
  return "border-outline-variant/35 bg-landing-white text-landing-text-soft hover:border-secondary/25 hover:bg-landing-gray hover:text-landing-text";
}

export function CourseCurriculumQuickRail({
  chapters,
  expandedChapterId,
  chapterStates,
  onSelectMaterial,
  onToggleChapter,
}: CourseCurriculumQuickRailProps) {
  const queryClient = useQueryClient();

  const handleQuickSelect = async (chapter: CourseChapterItem) => {
    const state = chapterStates.get(chapter.id) ?? "open";
    if (state === "locked") {
      return;
    }

    try {
      const lessons = await queryClient.ensureQueryData({
        queryKey: COURSE_LEARNING_QUERY_KEYS.lessons(chapter.id),
        queryFn: () => getLessonsByChapterId(chapter.id),
        staleTime: 5 * 60 * 1000,
      });

      const firstMaterial = lessons.flatMap((lesson) => lesson.materials).at(0);

      if (firstMaterial) {
        onSelectMaterial(firstMaterial, chapter.id);
        return;
      }
    } catch {
      // Fall back to expanding chapter only.
    }

    onToggleChapter(chapter.id);
  };

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2 py-2">
      {chapters.map((chapter) => {
        const state = chapterStates.get(chapter.id) ?? "open";
        const isActive = expandedChapterId === chapter.id;
        const isLocked = state === "locked";

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            aria-label={`Chương ${chapter.orderIndex}: ${chapter.title}`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-label-sm font-bold transition ${getQuickButtonClassName(
              state,
              isActive,
            )}`}
            disabled={isLocked}
            key={chapter.id}
            onClick={() => void handleQuickSelect(chapter)}
            title={chapter.title}
            type="button"
          >
            {chapter.orderIndex}
          </button>
        );
      })}
    </div>
  );
}
