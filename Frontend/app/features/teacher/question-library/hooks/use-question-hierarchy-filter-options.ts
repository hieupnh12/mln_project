import { useMemo } from "react";

import type { LessonOptionDto } from "../types/question-library-api.types";
import type { QuestionFilters } from "../types/question-library.types";

type UseQuestionHierarchyFilterOptionsParams = {
  filters: QuestionFilters;
  metadataCourses: string[];
  lessonOptions: LessonOptionDto[];
};

function uniqueNonEmpty(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function normalizeQuestionHierarchyFilters(
  currentFilters: QuestionFilters,
  nextFilters: QuestionFilters,
) {
  if (nextFilters.course === "all") {
    return {
      ...nextFilters,
      chapter: "all",
      lesson: "all",
    };
  }

  if (nextFilters.course !== currentFilters.course) {
    return {
      ...nextFilters,
      chapter: "all",
      lesson: "all",
    };
  }

  if (nextFilters.chapter === "all") {
    return {
      ...nextFilters,
      lesson: "all",
    };
  }

  if (nextFilters.chapter !== currentFilters.chapter) {
    return {
      ...nextFilters,
      lesson: "all",
    };
  }

  return nextFilters;
}

export function useQuestionHierarchyFilterOptions({
  filters,
  metadataCourses,
  lessonOptions,
}: UseQuestionHierarchyFilterOptionsParams) {
  return useMemo(() => {
    const courseOptions = uniqueNonEmpty([
      ...metadataCourses,
      ...lessonOptions.map((lesson) => lesson.subjectTitle),
    ]);

    const courseLessons =
      filters.course === "all"
        ? []
        : lessonOptions.filter((lesson) => lesson.subjectTitle === filters.course);

    const chapterOptions = uniqueNonEmpty(
      courseLessons.map((lesson) => lesson.chapterTitle),
    );

    const chapterLessons =
      filters.chapter === "all"
        ? []
        : courseLessons.filter((lesson) => lesson.chapterTitle === filters.chapter);

    const filteredLessonOptions = uniqueNonEmpty(
      chapterLessons.map((lesson) => lesson.title),
    );

    return {
      canSelectChapter: filters.course !== "all",
      canSelectLesson: filters.course !== "all" && filters.chapter !== "all",
      chapterOptions,
      courseOptions,
      lessonOptions: filteredLessonOptions,
    };
  }, [filters.chapter, filters.course, lessonOptions, metadataCourses]);
}
