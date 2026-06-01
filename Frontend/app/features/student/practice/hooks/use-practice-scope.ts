import { useMemo } from "react";

import {
  useChapterLessonsQuery,
  useCourseChaptersQuery,
} from "../../course-learning/hooks/use-course-learning-queries";
import type { PracticeScope } from "../types/practice.types";

export function usePracticeScope(subjectId: number | null, scope: PracticeScope) {
  const chaptersQuery = useCourseChaptersQuery(subjectId);
  const lessonsQuery = useChapterLessonsQuery(scope.chapterId);

  const chapterTitle = useMemo(() => {
    if (scope.chapterId == null) {
      return null;
    }
    return chaptersQuery.data?.find((c) => c.id === scope.chapterId)?.title ?? null;
  }, [chaptersQuery.data, scope.chapterId]);

  const lessonTitle = useMemo(() => {
    if (scope.lessonId == null) {
      return null;
    }
    return lessonsQuery.data?.find((l) => l.id === scope.lessonId)?.title ?? null;
  }, [lessonsQuery.data, scope.lessonId]);

  return {
    chaptersQuery,
    lessonsQuery,
    chapterTitle,
    lessonTitle,
  };
}
