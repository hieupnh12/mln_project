import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { findAdjacentLessons } from "../../student-progress/utils/student-progress-resume.util";
import type { CourseChapterItem } from "../types/course-learning.types";

type UseCourseLessonNavigationOptions = {
  chapters: CourseChapterItem[];
  expandedChapterId: number | null;
  expandedLessonId: number | null;
  onGoToLesson: (chapterId: number, lessonId: number) => void;
  subjectId: number;
};

export function useCourseLessonNavigation({
  chapters,
  expandedChapterId,
  expandedLessonId,
  onGoToLesson,
  subjectId,
}: UseCourseLessonNavigationOptions) {
  const progressQuery = useSubjectLessonProgressQuery(subjectId > 0 ? subjectId : null);
  const progressItems = progressQuery.data ?? [];

  const adjacentLessons = useMemo(() => {
    if (expandedLessonId == null) {
      return { previous: null, next: null };
    }
    return findAdjacentLessons(progressItems, expandedLessonId);
  }, [expandedLessonId, progressItems]);

  const currentChapter = chapters.find((chapter) => chapter.id === expandedChapterId);

  const goToNextLesson = useCallback(() => {
    if (adjacentLessons.next) {
      onGoToLesson(adjacentLessons.next.chapterId, adjacentLessons.next.lessonId);
    }
  }, [adjacentLessons.next, onGoToLesson]);

  const goToPreviousLesson = useCallback(() => {
    if (adjacentLessons.previous) {
      onGoToLesson(adjacentLessons.previous.chapterId, adjacentLessons.previous.lessonId);
    }
  }, [adjacentLessons.previous, onGoToLesson]);

  return {
    canGoNext: adjacentLessons.next != null,
    canGoPrevious: adjacentLessons.previous != null,
    chapterTitle: currentChapter?.title ?? "",
    goToNextLesson,
    goToPreviousLesson,
    isVisible: expandedLessonId != null,
    nextLessonTitle: adjacentLessons.next?.lessonTitle ?? "",
    previousLessonTitle: adjacentLessons.previous?.lessonTitle ?? "",
  };
}
