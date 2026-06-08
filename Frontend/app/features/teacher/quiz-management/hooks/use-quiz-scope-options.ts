import { useMemo } from "react";

import type { LessonOptionDto } from "../../question-library/types/question-library-api.types";

export function useQuizScopeOptions(
  lessonOptions: LessonOptionDto[],
  course: string,
  chapter: string,
) {
  const chapterOptions = useMemo(() => {
    if (!course) return [];
    const titles = new Set(
      lessonOptions
        .filter((item) => item.subjectTitle === course)
        .map((item) => item.chapterTitle)
        .filter(Boolean),
    );
    return [...titles];
  }, [course, lessonOptions]);

  const lessonTitles = useMemo(() => {
    if (!course) return [];
    return lessonOptions
      .filter((item) => item.subjectTitle === course)
      .filter((item) => chapter === "all" || item.chapterTitle === chapter)
      .map((item) => item.title)
      .filter(Boolean);
  }, [chapter, course, lessonOptions]);

  return { chapterOptions, lessonTitles };
}
